'use client';

import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../cn';
import { Icon, type IconName } from '../components/Icon';

/* CommandPalette — a ⌘K overlay that fuzzy-filters a list of destinations and
   fires `onSelect` on click / ⏎. Presentation only: the caller owns open state,
   the item list, and what happens on select (usually `router.push(href)`). The
   input is auto-focused on open; ↑/↓ walk the filtered list; Esc closes.
   Portaled to <body> so no ancestor overflow clips the overlay. Web-only. */

/** A single row in the palette. */
export interface CommandPaletteItem {
  /** Stable key used for React reconciliation. */
  key: string;
  /** User-visible label — what the search query matches against. */
  label: string;
  /** Optional leading icon (rendered via the kit `Icon` component). */
  icon?: IconName;
  /** Free-form secondary line (path, hint, group). Rendered dim on the right. */
  hint?: string;
  /** Custom right-side content — overrides `hint` when provided. */
  right?: ReactNode;
}

export interface CommandPaletteProps {
  /** Whether the overlay is currently shown. */
  open: boolean;
  /** Called whenever the overlay wants to close (Esc, click-outside, select). */
  onOpenChange: (open: boolean) => void;
  /** The searchable rows. */
  items: CommandPaletteItem[];
  /** Fired on click or ⏎ — the caller decides how to route / act. Closing the
   *  palette is the caller's job (usually just `onOpenChange(false)`). */
  onSelect: (item: CommandPaletteItem) => void;
  /** Search-input placeholder copy. */
  placeholder?: string;
  /** Copy shown when the query matches no items. */
  emptyText?: string;
  /** aria-label for the dialog. Defaults to the placeholder. */
  ariaLabel?: string;
  className?: string;
}

/**
 * Full-screen command palette. The caller owns open state + item list + select
 * behaviour, so this component is reusable across surfaces (nav, actions, docs).
 * All keyboard nav + focus + click-outside are handled here.
 */
export function CommandPalette({
  open,
  onOpenChange,
  items,
  onSelect,
  placeholder = 'Search…',
  emptyText = 'No matches.',
  ariaLabel,
  className,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? items.filter((i) => i.label.toLowerCase().includes(q)) : items;
  }, [items, query]);

  // Reset + focus on each open. requestAnimationFrame prevents a race with the
  // input's initial mount, especially when opened from a keyboard shortcut.
  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActiveIdx(0);
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  // Reset active row whenever the query changes (top match becomes highlighted).
  useEffect(() => setActiveIdx(0), [query]);

  if (!open || typeof document === 'undefined') return null;

  const close = () => onOpenChange(false);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') return close();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => (filtered.length ? (i + 1) % filtered.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => (filtered.length ? (i - 1 + filtered.length) % filtered.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const it = filtered[activeIdx];
      if (it) onSelect(it);
    }
  };

  return createPortal(
    <div
      className={cn('lk-cmdk-overlay', className)}
      onClick={close}
      role="presentation"
    >
      <div
        ref={panelRef}
        className="lk-cmdk-panel"
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel ?? placeholder}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="lk-cmdk-input-row">
          <Icon name="search" size={17} />
          <input
            ref={inputRef}
            className="lk-cmdk-input"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={ariaLabel ?? placeholder}
          />
          <kbd className="lk-cmdk-kbd">ESC</kbd>
        </div>
        <ul className="lk-cmdk-list">
          {filtered.length === 0 ? (
            <li className="lk-cmdk-empty">{emptyText}</li>
          ) : (
            filtered.map((it, idx) => (
              <li key={it.key}>
                <button
                  type="button"
                  className={cn('lk-cmdk-item', idx === activeIdx && 'lk-cmdk-item--active')}
                  onMouseMove={() => setActiveIdx(idx)}
                  onClick={() => onSelect(it)}
                >
                  {it.icon && <Icon name={it.icon} size={16} />}
                  <span className="lk-cmdk-item-label">{it.label}</span>
                  {it.right ?? (it.hint && <span className="lk-cmdk-item-hint">{it.hint}</span>)}
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>,
    document.body,
  );
}
