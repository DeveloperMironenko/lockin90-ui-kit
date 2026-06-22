import { type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../cn';

/** Length status — drives the fill + count color. */
export type CharCounterStatus = 'ok' | 'warn' | 'over';

export interface CharCounterProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** current input length */
  value: number;
  /** the length limit */
  max: number;
  /** fraction (0..1) of max at which to flip to the warn state (default 0.85) */
  warnAt?: number;
  /** render the thin fill bar (default true) */
  showBar?: boolean;
  /** render the "value / max" mono readout (default true) */
  showCount?: boolean;
  /** override the readout text (default `${value} / ${max}`) */
  format?: (value: number, max: number) => string;
}

/** Clamp x into [lo, hi]. */
const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x));

/** Resolve the length status from value/max and the warn threshold. */
const statusOf = (value: number, max: number, warnAt: number): CharCounterStatus => {
  if (value > max) return 'over';
  if (value >= warnAt * max) return 'warn';
  return 'ok';
};

const defaultFormat = (value: number, max: number) => `${value} / ${max}`;

/**
 * CharCounter — an input-aware character-count feedback row.
 *
 * A thin fill bar (fraction = value/max) + a "value / max" mono readout that
 * turns warn (approaching max) then over (exceeds max). For SEO meta fields,
 * post titles, bio fields — any length-limited input.
 *
 * Distinct from Meter (generic value-in-range) and BarFill (raw fraction): this
 * is specifically the count/limit form-field adornment with an over-limit state
 * and an "x / max" readout. Mirrors the .charbar from the CMS editors.
 * Per-instance var: --v (0..1 fraction).
 */
export function CharCounter({
  value,
  max,
  warnAt = 0.85,
  showBar = true,
  showCount = true,
  format = defaultFormat,
  className,
  style,
  ...rest
}: CharCounterProps) {
  const safeMax = max || 1;
  const frac = clamp(value / safeMax, 0, 1);
  const status = statusOf(value, max, warnAt);

  return (
    <div
      className={cn('lk-charcount', `lk-charcount-${status}`, className)}
      role="status"
      aria-live="polite"
      style={{ ['--v']: frac, ...style } as CSSProperties}
      {...rest}
    >
      {showBar && (
        <div className="lk-charcount-track" aria-hidden="true">
          <i className="lk-charcount-fill" />
        </div>
      )}
      {showCount && <span className="lk-charcount-ct lk-tnum">{format(value, max)}</span>}
    </div>
  );
}
