import { type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../cn';

export interface ProgressBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'role'> {
  /**
   * Progress fraction 0..1. When `undefined` the bar is **indeterminate** — a
   * gradient band sweeps continuously (use while a duration is unknown).
   */
  value?: number;
  /** Bar height in px (default 8). */
  height?: number;
  /** Fill paint — any CSS color OR gradient string (default the flux gradient). */
  gradient?: string;
  /** The unfilled track color (default a faint glass rail). */
  track?: string;
  /** Optional label rendered above the bar. */
  label?: string;
  /** Render the percentage (only meaningful when determinate). */
  showValue?: boolean;
  /** Fully-rounded ends (default true). */
  rounded?: boolean;
}

/**
 * Aurora-Flux linear progress bar with a gradient fill. Supports both a
 * **determinate** mode (a known `value` 0..1 → an inline-width fill) and an
 * **indeterminate** mode (omit `value` → a CSS-keyframe sweeping band).
 *
 * Distinct from `BarFill`, which is a static fraction fill only — `ProgressBar`
 * adds the indeterminate animation, an optional label / percentage, and tone.
 */
export function ProgressBar({
  value,
  height = 8,
  gradient = 'var(--grad-flux)',
  track = 'rgba(255,255,255,0.07)',
  label,
  showValue = false,
  rounded = true,
  className,
  style,
  ...rest
}: ProgressBarProps) {
  const indeterminate = value == null;
  const v = indeterminate ? 0 : Math.max(0, Math.min(1, value));
  const pct = Math.round(v * 100);

  const rootStyle = {
    '--lk-pb-h': `${height}px`,
    '--lk-pb-fill': gradient,
    '--lk-pb-track': track,
    '--lk-pb-radius': rounded ? 'var(--r-pill)' : '0px',
    '--lk-pb-v': `${pct}%`,
    ...style,
  } as CSSProperties;

  return (
    <div
      className={cn('lk-progressbar', indeterminate && 'is-indeterminate', className)}
      style={rootStyle}
      role="progressbar"
      aria-valuemin={indeterminate ? undefined : 0}
      aria-valuemax={indeterminate ? undefined : 100}
      aria-valuenow={indeterminate ? undefined : pct}
      aria-label={label ?? (indeterminate ? 'Loading' : undefined)}
      {...rest}
    >
      {(label || showValue) && (
        <div className="lk-progressbar-meta">
          {label && <span className="lk-progressbar-label">{label}</span>}
          {showValue && !indeterminate && (
            <span className="lk-progressbar-value">{pct}%</span>
          )}
        </div>
      )}
      <div className="lk-progressbar-track" aria-hidden="true">
        <i className="lk-progressbar-fill" />
      </div>
    </div>
  );
}
