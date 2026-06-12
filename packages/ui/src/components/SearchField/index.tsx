'use client';

import type { ChangeEvent } from 'react';
import { cn } from '../../cn';

export interface SearchFieldProps {
  placeholder?: string;
  /** Current value (controlled). */
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  /** Optional keyboard hint shown in a `<kbd>` pill, e.g. `'⌘K'`. */
  shortcut?: string;
  className?: string;
}

/** Aurora search / command pill: icon, input, optional keyboard hint. */
export default function SearchField({
  placeholder = 'Search…',
  value,
  onChange,
  shortcut,
  className,
}: SearchFieldProps) {
  return (
    <div className={cn('lk-search', className)}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
        <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <input placeholder={placeholder} value={value} onChange={onChange} />
      {shortcut && <span className="lk-kbd">{shortcut}</span>}
    </div>
  );
}
