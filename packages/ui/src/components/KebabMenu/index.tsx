'use client';

import { useEffect, useRef, useState } from 'react';
import type { KebabMenuProps } from './types';

export default function KebabMenu({ items, align = 'right', className }: KebabMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  return (
    <div ref={ref} className={`relative inline-block ${className ?? ''}`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-7 h-7 rounded text-muted hover:text-white hover:bg-elevated flex items-center justify-center transition-colors"
        aria-label="More actions"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="3"  r="1.4" fill="currentColor" />
          <circle cx="8" cy="8"  r="1.4" fill="currentColor" />
          <circle cx="8" cy="13" r="1.4" fill="currentColor" />
        </svg>
      </button>
      {open && (
        <div
          className={`absolute top-full mt-1 z-30 min-w-[200px] bg-elevated-2 border border-border-strong rounded shadow-lg py-1 ea-fade-in ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {items.map((item, i) => (
            <button
              key={i}
              disabled={item.disabled}
              onClick={() => {
                if (item.disabled) return;
                item.onClick();
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-[12px] transition-colors ${
                item.disabled
                  ? 'text-faint cursor-not-allowed'
                  : item.destructive
                  ? 'text-accent hover:bg-accent/10'
                  : 'text-secondary hover:text-white hover:bg-elevated'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
