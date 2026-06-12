'use client';

import type { ReactNode } from 'react';
import { cn } from '../../cn';

export interface ToggleProps {
  /** On/off state (controlled). Drives the CSS thumb animation via `aria-pressed`. */
  checked: boolean;
  /** Called with the next state when the switch is clicked. */
  onChange?: (next: boolean) => void;
  /** Optional text shown after the track. */
  label?: ReactNode;
  disabled?: boolean;
  className?: string;
}

/** Aurora switch. The track/thumb animate off the button's `aria-pressed` attribute. */
export default function Toggle({ checked, onChange, label, disabled, className }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-pressed={checked}
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={cn('lk-toggle', className)}
    >
      <span className="lk-toggle-track">
        <i />
      </span>
      {label}
    </button>
  );
}
