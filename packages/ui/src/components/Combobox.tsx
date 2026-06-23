'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '../cn';
import { SearchInput } from './FormField';
import { ListRow } from './ListRow';
import { DotsLoader } from './DotsLoader';

export interface ComboboxOption {
  /** Stable identifier passed back to `onSelect`. */
  value: string;
  /** Primary line shown in the result row. */
  label: string;
  /** Optional dimmer second line under the label. */
  sublabel?: string;
}

export interface ComboboxProps {
  /** Current results to show (the consumer fetches/filters these). */
  options: ComboboxOption[];
  /** Fired as the user types — the consumer debounces/fetches and feeds `options`. */
  onSearch: (query: string) => void;
  /** Fired when a result row is chosen; the panel then closes. */
  onSelect: (option: ComboboxOption) => void;
  /** Placeholder copy for the search field. */
  placeholder?: string;
  /** Show a loading row while results fetch. */
  loading?: boolean;
  /** Shown when the query is non-empty, there are no options, and not loading. */
  emptyText?: string;
  /** Optional controlled query text. */
  value?: string;
  /** Extra class on the root wrapper. */
  className?: string;
}

/**
 * Combobox — a search field (magnifier + clear) that opens an absolutely
 * positioned results dropdown below it. Each result is a `ListRow` (label +
 * optional sublabel); choosing one calls `onSelect` and closes the panel.
 * While `loading`, a `DotsLoader` row shows; a non-empty query with zero
 * options (and not loading) shows the `emptyText` row. Manages its own query
 * and open state, respecting a controlled `value` when provided. Closes on
 * outside-click or Escape. Mirrors the native `@lockin90/ui-native` Combobox.
 */
export function Combobox({
  options,
  onSearch,
  onSelect,
  placeholder = 'Search…',
  loading = false,
  emptyText = 'No results',
  value,
  className,
}: ComboboxProps) {
  const isControlled = value !== undefined;
  const [inner, setInner] = useState('');
  const query = isControlled ? value : inner;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // close on outside-click / Escape while open
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  function handleSearch(next: string) {
    if (!isControlled) setInner(next);
    setOpen(true);
    onSearch(next);
  }

  function choose(option: ComboboxOption) {
    onSelect(option);
    setOpen(false);
  }

  const trimmed = query.trim();
  const showEmpty = open && trimmed.length > 0 && !loading && options.length === 0;
  const showPanel = open && (loading || options.length > 0 || showEmpty);

  return (
    <div ref={rootRef} className={cn('lk-combobox', className)}>
      <SearchInput
        className="lk-combobox-input"
        value={query}
        placeholder={placeholder}
        onChange={handleSearch}
        onClear={() => setOpen(false)}
        onFocus={() => {
          if (loading || options.length > 0) setOpen(true);
        }}
        aria-expanded={showPanel}
        aria-haspopup="listbox"
        role="combobox"
      />

      {showPanel ? (
        <div className="lk-combobox-panel" role="listbox">
          {loading ? (
            <div className="lk-combobox-loading">
              <DotsLoader size={6} />
            </div>
          ) : showEmpty ? (
            <div className="lk-combobox-empty">{emptyText}</div>
          ) : (
            options.map((option) => (
              <ListRow
                key={option.value}
                className="lk-combobox-row"
                role="option"
                title={option.label}
                subtitle={option.sublabel}
                onClick={() => choose(option)}
              />
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
