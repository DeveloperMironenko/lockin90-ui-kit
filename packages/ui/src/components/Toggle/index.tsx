'use client';

import type { ToggleProps } from './types';

export default function Toggle({ checked, onChange, disabled, label, className }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${checked ? 'bg-accent' : 'bg-elevated border border-border-strong'} ${className ?? ''}`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}
