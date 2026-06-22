'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type ReactNode,
} from 'react';
import { cn } from '../cn';
import { Toolbar, type ToolbarItem } from './Toolbar';

/* ============================================================================
   RichTextEditor — a dependency-free WYSIWYG editor: a `contentEditable`
   glass surface driven by the existing `Toolbar` button row. Formatting runs
   through `document.execCommand` (deprecated but universally supported and the
   only way to do this without a heavy editor engine — TipTap/ProseMirror/Slate
   are explicitly banned here). Pasted content is sanitized: inline styles,
   scripts, event-handler attributes and non-semantic tags are stripped, keeping
   only a small allowlist of semantic formatting tags. Emits `lk-rte*` classes.
   ========================================================================== */

/** The formatting actions a RichTextEditor toolbar can expose. */
export type RichTextAction =
  | 'bold'
  | 'italic'
  | 'link'
  | 'bulletList'
  | 'orderedList'
  | 'h2'
  | 'h3'
  | 'quote'
  | 'code'
  | 'clear';

export interface RichTextEditorProps {
  /** current value, as an HTML string */
  value: string;
  /** called with the next HTML string on every edit */
  onChange: (html: string) => void;
  /** placeholder shown while the editor is empty */
  placeholder?: string;
  /** which toolbar actions to show, in order */
  toolbar?: RichTextAction[];
  /** minimum height of the editing surface, in text rows (default 6) */
  minRows?: number;
  /** invalid state — red border + focus ring */
  invalid?: boolean;
  /** disable editing (surface becomes read-only, toolbar hidden) */
  disabled?: boolean;
  className?: string;
  /** stable id for the editing surface (a11y / labelling) */
  id?: string;
  /** accessible label for the editing region */
  'aria-label'?: string;
}

/** Default toolbar action set. */
const DEFAULT_TOOLBAR: RichTextAction[] = [
  'bold',
  'italic',
  'link',
  'bulletList',
  'orderedList',
  'h2',
  'h3',
  'quote',
  'code',
  'clear',
];

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

/* ---- glyphs (inline SVG — mirrors the Toolbar exemplar's own glyph style;
   does NOT depend on the shared Icon set, which is expanded by a separate task). */
const GLYPHS: Record<RichTextAction, ReactNode> = {
  bold: (
    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>B</span>
  ),
  italic: (
    <span style={{ fontStyle: 'italic', fontFamily: 'var(--font-display)', fontSize: 14 }}>I</span>
  ),
  link: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1" />
      <path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" />
    </svg>
  ),
  bulletList: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M8 6h12M8 12h12M8 18h12" />
      <circle cx="4" cy="6" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="4" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="4" cy="18" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  ),
  orderedList: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M10 6h10M10 12h10M10 18h10" />
      <path d="M4 5.5h1V9M3.6 9h1.8" />
      <path d="M3.6 13.4c.2-.6 1.6-.7 1.6.3 0 .7-1.6 1.3-1.6 2.3h1.8" />
    </svg>
  ),
  h2: (
    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12 }}>H2</span>
  ),
  h3: (
    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12 }}>H3</span>
  ),
  quote: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M9 7H6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2v1a2 2 0 0 1-2 2" />
      <path d="M19 7h-3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2v1a2 2 0 0 1-2 2" />
    </svg>
  ),
  code: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <polyline points="8 7 3 12 8 17" />
      <polyline points="16 7 21 12 16 17" />
    </svg>
  ),
  clear: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M5 7h14" />
      <path d="M14 7l-1 12M10 7l-1 12" />
      <path d="M7 7l1-2h8l1 2" />
    </svg>
  ),
};

const LABELS: Record<RichTextAction, string> = {
  bold: 'Bold',
  italic: 'Italic',
  link: 'Insert link',
  bulletList: 'Bulleted list',
  orderedList: 'Numbered list',
  h2: 'Heading 2',
  h3: 'Heading 3',
  quote: 'Block quote',
  code: 'Code block',
  clear: 'Clear formatting',
};

/* ============================================================================
   Paste sanitization. We never trust pasted HTML: parse it into a detached
   document, then walk it keeping only an allowlist of semantic tags and
   stripping every attribute except a vetted `href`. Inline styles, class hooks,
   `on*` event handlers, `<script>`/`<style>`, and `javascript:`/`data:` URLs
   are all removed.
   ========================================================================== */

const ALLOWED_TAGS = new Set([
  'p',
  'br',
  'b',
  'strong',
  'i',
  'em',
  'u',
  'a',
  'ul',
  'ol',
  'li',
  'h2',
  'h3',
  'blockquote',
  'pre',
  'code',
]);

/** Tags whose content we discard entirely (not just unwrap). */
const DROP_TAGS = new Set(['script', 'style', 'iframe', 'object', 'embed', 'svg', 'link', 'meta']);

function safeHref(raw: string | null): string | null {
  if (!raw) return null;
  const href = raw.trim();
  // allow only http(s), mailto, tel, and protocol-relative/relative links
  if (/^(https?:|mailto:|tel:)/i.test(href)) return href;
  if (/^(\/|#|\.)/.test(href)) return href;
  return null;
}

function sanitizeNode(node: Node, doc: Document): Node[] {
  // text nodes pass through verbatim
  if (node.nodeType === Node.TEXT_NODE) {
    return [doc.createTextNode(node.textContent ?? '')];
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return [];

  const el = node as Element;
  const tag = el.tagName.toLowerCase();

  // entirely drop dangerous containers (and their children)
  if (DROP_TAGS.has(tag)) return [];

  const children: Node[] = [];
  el.childNodes.forEach((child) => {
    children.push(...sanitizeNode(child, doc));
  });

  // non-allowlisted tag → unwrap (keep sanitized children, drop the tag)
  if (!ALLOWED_TAGS.has(tag)) return children;

  const clean = doc.createElement(tag);
  if (tag === 'a') {
    const href = safeHref(el.getAttribute('href'));
    if (href) {
      clean.setAttribute('href', href);
      clean.setAttribute('rel', 'noopener noreferrer');
      clean.setAttribute('target', '_blank');
    }
  }
  children.forEach((c) => clean.appendChild(c));
  return [clean];
}

/** Strip pasted HTML down to a safe semantic subset. */
export function sanitizeRichTextHtml(html: string): string {
  if (typeof document === 'undefined') return '';
  const parsed = new DOMParser().parseFromString(html, 'text/html');
  const out = document.createElement('div');
  parsed.body.childNodes.forEach((child) => {
    sanitizeNode(child, document).forEach((n) => out.appendChild(n));
  });
  return out.innerHTML;
}

/* ========================================================================== */

function exec(command: string, value?: string) {
  // `execCommand` is deprecated but is the only dependency-free way to drive a
  // contentEditable surface (TipTap/ProseMirror/Slate are explicitly banned).
  document.execCommand(command, false, value);
}

/** Map a RichTextAction to its execCommand side effect. */
function applyAction(action: RichTextAction) {
  switch (action) {
    case 'bold':
      return exec('bold');
    case 'italic':
      return exec('italic');
    case 'bulletList':
      return exec('insertUnorderedList');
    case 'orderedList':
      return exec('insertOrderedList');
    case 'h2':
      return exec('formatBlock', 'h2');
    case 'h3':
      return exec('formatBlock', 'h3');
    case 'quote':
      return exec('formatBlock', 'blockquote');
    case 'code':
      return exec('formatBlock', 'pre');
    case 'clear':
      return exec('removeFormat');
    case 'link': {
      const url = typeof window !== 'undefined' ? window.prompt('Link URL') : null;
      const href = safeHref(url ?? null);
      if (href) exec('createLink', href);
      return;
    }
    default:
      return;
  }
}

/** Query whether a toggle-style action is currently active for the selection. */
function isActive(action: RichTextAction): boolean {
  if (typeof document === 'undefined') return false;
  try {
    switch (action) {
      case 'bold':
        return document.queryCommandState('bold');
      case 'italic':
        return document.queryCommandState('italic');
      case 'bulletList':
        return document.queryCommandState('insertUnorderedList');
      case 'orderedList':
        return document.queryCommandState('insertOrderedList');
      default:
        return false;
    }
  } catch {
    return false;
  }
}

/**
 * Dependency-free rich-text editor (web). A `contentEditable` surface plus the
 * shared `Toolbar` for formatting. `value` is an HTML string; `onChange` fires
 * with the next HTML on every edit. Pasted content is sanitized to a semantic
 * subset (see `sanitizeRichTextHtml`).
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write something…',
  toolbar = DEFAULT_TOOLBAR,
  minRows = 6,
  invalid = false,
  disabled = false,
  className,
  id,
  'aria-label': ariaLabel,
}: RichTextEditorProps) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  // re-render the toolbar's active states when the selection moves
  const [, forceTick] = useState(0);
  const refreshActive = useCallback(() => forceTick((n) => n + 1), []);

  // Keep the DOM in sync with `value` without clobbering the caret while typing:
  // only write into the surface when the incoming value differs from what the
  // surface already holds (i.e. an external/controlled change, not our own emit).
  useEffect(() => {
    const el = surfaceRef.current;
    if (!el) return;
    if (el.innerHTML !== value) el.innerHTML = value ?? '';
  }, [value]);

  const emit = useCallback(() => {
    const el = surfaceRef.current;
    if (el) onChange(el.innerHTML);
  }, [onChange]);

  const runAction = useCallback(
    (action: RichTextAction) => {
      if (disabled) return;
      surfaceRef.current?.focus();
      applyAction(action);
      emit();
      refreshActive();
    },
    [disabled, emit, refreshActive],
  );

  const onPaste = useCallback(
    (e: ClipboardEvent<HTMLDivElement>) => {
      e.preventDefault();
      const html = e.clipboardData.getData('text/html');
      const text = e.clipboardData.getData('text/plain');
      const clean = html
        ? sanitizeRichTextHtml(html)
        : text.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c] ?? c);
      exec('insertHTML', clean);
      emit();
    },
    [emit],
  );

  const items: ToolbarItem[] = toolbar.map((action) => ({
    icon: GLYPHS[action],
    label: LABELS[action],
    active: isActive(action),
    onClick: () => runAction(action),
  }));

  // empty = no text and no block-level markup (so an empty <p> still shows the
  // placeholder). Used to toggle the CSS-driven placeholder.
  const isEmpty = !value || value === '<br>' || value.replace(/<[^>]*>/g, '').trim() === '';

  return (
    <div className={cn('lk-rte', invalid && 'lk-rte-invalid', disabled && 'lk-rte-disabled', className)}>
      {!disabled && toolbar.length > 0 && <Toolbar className="lk-rte-toolbar" items={items} />}
      <div
        ref={surfaceRef}
        id={id}
        className="lk-rte-surface"
        contentEditable={!disabled}
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        data-empty={isEmpty || undefined}
        data-placeholder={placeholder}
        style={{ minHeight: `calc(${minRows} * 1.6em + 24px)` }}
        onInput={emit}
        onPaste={onPaste}
        onKeyUp={refreshActive}
        onMouseUp={refreshActive}
        onFocus={refreshActive}
      />
    </div>
  );
}
