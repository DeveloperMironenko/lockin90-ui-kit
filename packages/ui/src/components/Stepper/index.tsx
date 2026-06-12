'use client';

import { cn } from '../../cn';

export interface StepperProps {
  /** Current value (controlled). */
  value: number;
  /** Called with the next, already-clamped value. */
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  /** Increment/decrement amount. Defaults to 1. */
  step?: number;
  /** Formats the displayed value (e.g. `(v) => `${v} mg``). */
  format?: (v: number) => string;
  className?: string;
}

function clamp(v: number, min?: number, max?: number): number {
  let next = v;
  if (typeof min === 'number' && next < min) next = min;
  if (typeof max === 'number' && next > max) next = max;
  return next;
}

/** Aurora amount stepper: `−` / value / `+`. Clamps to `min`/`max`. */
export default function Stepper({ value, onChange, min, max, step = 1, format, className }: StepperProps) {
  const decDisabled = typeof min === 'number' && value <= min;
  const incDisabled = typeof max === 'number' && value >= max;

  return (
    <div className={cn('lk-stepper', className)}>
      <button
        type="button"
        className="lk-stepper-btn"
        aria-label="decrease"
        disabled={decDisabled}
        onClick={() => onChange(clamp(value - step, min, max))}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
      <span className="lk-stepper-val lk-tnum">{format ? format(value) : value}</span>
      <button
        type="button"
        className="lk-stepper-btn"
        aria-label="increase"
        disabled={incDisabled}
        onClick={() => onChange(clamp(value + step, min, max))}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
