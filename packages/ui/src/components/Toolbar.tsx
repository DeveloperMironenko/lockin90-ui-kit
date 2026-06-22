import {
  forwardRef,
  useRef,
  type DragEvent,
  type HTMLAttributes,
  type ChangeEvent,
  type ReactNode,
} from 'react';
import { cn } from '../cn';

/* ============================================================================
   Toolbar — a rich-text formatting bar: a horizontal group of ~30px icon
   buttons in a glass strip, with thin vertical dividers between groups.
   Mirrors `.toolbar`/`.tb-btn` from the CMS post-editor design.
   ========================================================================== */

export interface ToolbarItem {
  /** glyph rendered inside the button (inline SVG or shared Icon) */
  icon: ReactNode;
  /** accessible label / tooltip */
  label?: string;
  /** pressed/active state — accent tint */
  active?: boolean;
  onClick?: () => void;
  /** render a thin vertical separator instead of a button */
  divider?: boolean;
}

export interface ToolbarProps extends HTMLAttributes<HTMLDivElement> {
  /** the buttons (and dividers) to render; defaults to a sample formatting set */
  items?: ToolbarItem[];
}

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

/** Default sample set: bold, italic | list, link, image. */
const DEFAULT_ITEMS: ToolbarItem[] = [
  {
    label: 'Bold',
    active: true,
    icon: (
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>B</span>
    ),
  },
  {
    label: 'Italic',
    icon: (
      <span style={{ fontStyle: 'italic', fontFamily: 'var(--font-display)', fontSize: 14 }}>I</span>
    ),
  },
  { divider: true, icon: null },
  {
    label: 'Bulleted list',
    icon: (
      <svg viewBox="0 0 24 24" {...stroke}>
        <path d="M8 6h12M8 12h12M8 18h12" />
        <circle cx="4" cy="6" r="1.4" fill="currentColor" stroke="none" />
        <circle cx="4" cy="12" r="1.4" fill="currentColor" stroke="none" />
        <circle cx="4" cy="18" r="1.4" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'Link',
    icon: (
      <svg viewBox="0 0 24 24" {...stroke}>
        <path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1" />
        <path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" />
      </svg>
    ),
  },
  {
    label: 'Image',
    icon: (
      <svg viewBox="0 0 24 24" {...stroke}>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="8.5" cy="9.5" r="1.6" />
        <path d="m4 18 5-5 4 4 3-3 4 4" />
      </svg>
    ),
  },
];

/** Horizontal icon-button group for rich-text formatting. */
export const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(function Toolbar(
  { items = DEFAULT_ITEMS, className, ...rest },
  ref,
) {
  return (
    <div ref={ref} role="toolbar" className={cn('lk-toolbar', className)} {...rest}>
      {items.map((item, i) =>
        item.divider ? (
          <span key={i} className="lk-toolbar-divider" aria-hidden="true" />
        ) : (
          <button
            key={i}
            type="button"
            className={cn('lk-toolbar-btn', item.active && 'lk-toolbar-on')}
            aria-label={item.label}
            aria-pressed={item.active}
            title={item.label}
            onClick={item.onClick}
          >
            {item.icon}
          </button>
        ),
      )}
    </div>
  );
});

/* ============================================================================
   Dropzone — a large dashed-border file-drop area: centered icon + label +
   hint, with a hidden file input the box triggers on click. Hover/dragover
   highlights with an accent dashed border + tint.
   Mirrors `.dropzone` from the CMS media library design.
   ========================================================================== */

export interface DropzoneProps extends HTMLAttributes<HTMLDivElement> {
  /** primary prompt line */
  label?: string;
  /** secondary hint line (formats / size) */
  hint?: string;
  /** glyph rendered in the round badge; defaults to an upload icon */
  icon?: ReactNode;
  /** called with the picked / dropped files */
  onFiles?: (files: FileList) => void;
}

const DEFAULT_DZ_ICON: ReactNode = (
  <svg viewBox="0 0 24 24" {...stroke}>
    <path d="M12 16V4M8 8l4-4 4 4" />
    <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
  </svg>
);

/** Dashed-border drop area + hidden file input for uploads. */
export const Dropzone = forwardRef<HTMLDivElement, DropzoneProps>(function Dropzone(
  {
    label = 'Drop files here or click to upload',
    hint = 'PNG, JPG up to 10MB',
    icon = DEFAULT_DZ_ICON,
    onFiles,
    className,
    ...rest
  },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null);

  function open() {
    inputRef.current?.click();
  }
  function onChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length) onFiles?.(e.target.files);
  }
  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.currentTarget.classList.remove('lk-dropzone-over');
    if (e.dataTransfer.files && e.dataTransfer.files.length) onFiles?.(e.dataTransfer.files);
  }
  function onDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.currentTarget.classList.add('lk-dropzone-over');
  }
  function onDragLeave(e: DragEvent<HTMLDivElement>) {
    e.currentTarget.classList.remove('lk-dropzone-over');
  }

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      className={cn('lk-dropzone', className)}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      }}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      {...rest}
    >
      <span className="lk-dropzone-ico">{icon}</span>
      <div className="lk-dropzone-label">{label}</div>
      <div className="lk-dropzone-hint">{hint}</div>
      <input ref={inputRef} type="file" multiple className="lk-dropzone-input" onChange={onChange} />
    </div>
  );
});
