'use client';

import type { CSSProperties } from 'react';
import { cn } from '../../cn';
import type { FilterChip, FilterChipsProps } from './types';

export type { FilterChip, FilterChipsProps } from './types';

/** A single-select row of filter chips. The active chip lights up; clicking emits `onChange`. */
export default function FilterChips({ chips, active, onChange, className }: FilterChipsProps) {
  return (
    <div
      className={cn(className)}
      style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6 }}
    >
      {chips.map((chip) => {
        const isActive = chip.id === active;
        const style: CSSProperties = {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 7,
          padding: '5px 11px',
          borderRadius: 'var(--r-pill)',
          border: '1px solid',
          borderColor: isActive ? 'var(--accent)' : 'var(--border)',
          background: isActive ? 'rgba(124,92,255,.14)' : 'var(--glass)',
          color: isActive ? 'var(--text)' : 'var(--text-dim)',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: '0.04em',
          whiteSpace: 'nowrap',
          cursor: 'pointer',
          transition: 'border-color 0.2s var(--ease), background 0.2s var(--ease), color 0.2s var(--ease)',
        };
        return (
          <button
            key={chip.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(chip.id)}
            style={style}
          >
            {chip.label}
            {typeof chip.count === 'number' && (
              <span
                style={{
                  fontSize: 10,
                  letterSpacing: '0.04em',
                  color: isActive ? 'var(--text)' : 'var(--text-faint)',
                }}
              >
                {chip.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
