'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { cn } from '../../cn';
import type { KebabMenuItem, KebabMenuProps } from './types';

export type { KebabMenuItem, KebabMenuProps } from './types';

function itemStyle(item: KebabMenuItem): CSSProperties {
  return {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    padding: '8px 12px',
    fontSize: 12,
    background: 'transparent',
    border: 'none',
    cursor: item.disabled ? 'not-allowed' : 'pointer',
    color: item.disabled
      ? 'var(--text-faint)'
      : item.destructive
        ? 'var(--bad)'
        : 'var(--text-dim)',
    transition: 'background 0.18s var(--ease), color 0.18s var(--ease)',
  };
}

/** ⋮ overflow menu — opens a glass dropdown of actions, closes on outside click. */
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
    <div
      ref={ref}
      className={cn(className)}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="More actions"
        aria-haspopup="menu"
        aria-expanded={open}
        style={{
          width: 28,
          height: 28,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 'var(--r-sm)',
          border: '1px solid transparent',
          background: 'transparent',
          color: 'var(--text-dim)',
          cursor: 'pointer',
          transition: 'color 0.18s var(--ease), background 0.18s var(--ease)',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <circle cx="8" cy="3" r="1.4" fill="currentColor" />
          <circle cx="8" cy="8" r="1.4" fill="currentColor" />
          <circle cx="8" cy="13" r="1.4" fill="currentColor" />
        </svg>
      </button>
      {open && (
        <div
          role="menu"
          style={{
            position: 'absolute',
            top: '100%',
            marginTop: 4,
            zIndex: 30,
            minWidth: 200,
            [align]: 0,
            padding: '4px 0',
            background: 'var(--bg-2)',
            border: '1px solid var(--border-2)',
            borderRadius: 'var(--r-sm)',
            boxShadow: 'var(--elev-2)',
            backdropFilter: 'blur(16px) saturate(120%)',
            WebkitBackdropFilter: 'blur(16px) saturate(120%)',
          }}
        >
          {items.map((item, i) => (
            <button
              key={i}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              onClick={() => {
                if (item.disabled) return;
                item.onClick();
                setOpen(false);
              }}
              style={itemStyle(item)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
