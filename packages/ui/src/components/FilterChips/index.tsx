'use client';

import type { FilterChipsProps } from './types';

export default function FilterChips({ chips, active, onChange, className }: FilterChipsProps) {
  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className ?? ''}`}>
      {chips.map(chip => {
        const isActive = chip.id === active;
        return (
          <button
            key={chip.id}
            onClick={() => onChange(chip.id)}
            className={`ea-chip ${isActive ? 'ea-chip-active text-white' : 'hover:border-secondary'}`}
          >
            {chip.label}
            {typeof chip.count === 'number' && (
              <span className={`font-mono text-[10px] tracking-[0.04em] ${isActive ? 'text-white' : 'text-secondary'}`}>
                {chip.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
