import { type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../cn';

/** Zone tone — colors the fill (and segments). 'accent' is the gradient default. */
export type MeterTone = 'high' | 'mid' | 'low' | 'accent';

export interface MeterProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** the scalar value to read out, in [min, max] */
  value: number;
  /** range floor (default 0) */
  min?: number;
  /** range ceiling (default 100) */
  max?: number;
  /** mono uppercase caption shown above the track */
  label?: string;
  /** show the numeric value (+ unit) on the label row */
  showValue?: boolean;
  /** suffix after the value readout (e.g. '%', 'pts') */
  unit?: string;
  /** zone color of the fill / filled segments (default 'accent' gradient) */
  tone?: MeterTone;
  /** target marker — renders a tick at this value on the track (continuous mode) */
  threshold?: number;
  /** segmented mode: render N discrete cells, filled by the value fraction */
  segments?: number;
}

/** Convert a tone to its fill background (accent → gradient, zones → solid). */
const TONE_FILL: Record<MeterTone, string> = {
  accent: 'var(--grad-cta)',
  high: 'var(--zone-high)',
  mid: 'var(--zone-mid)',
  low: 'var(--zone-low)',
};

/** Convert a tone to its glow color. */
const TONE_GLOW: Record<MeterTone, string> = {
  accent: 'var(--accent)',
  high: 'var(--zone-high)',
  mid: 'var(--zone-mid)',
  low: 'var(--zone-low)',
};

/** Clamp x into [lo, hi]. */
const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x));

/**
 * Meter — a labelled horizontal fill meter for a scalar value within a range.
 *
 * A semantic value-in-range readout (distinct from the raw BarFill fraction bar
 * and the loading ProgressBar): an optional mono label + value readout, an
 * optional target/threshold marker tick, a zone tone, and an optional SEGMENTED
 * mode (N discrete cells filled by the value fraction — e.g. password-strength
 * or confidence meters).
 */
export function Meter({
  value,
  min = 0,
  max = 100,
  label,
  showValue = false,
  unit,
  tone = 'accent',
  threshold,
  segments,
  className,
  style,
  ...rest
}: MeterProps) {
  const span = max - min || 1;
  const frac = clamp((value - min) / span, 0, 1);
  const segmented = typeof segments === 'number' && segments > 0;

  const fill = TONE_FILL[tone];
  const glow = TONE_GLOW[tone];

  const hasHeader = label != null || showValue;

  return (
    <div
      className={cn('lk-meter', segmented && 'lk-meter-segmented', `lk-meter-${tone}`, className)}
      role="meter"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-label={label}
      style={
        {
          ['--v']: frac,
          ['--fill']: fill,
          ['--glow']: glow,
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      {hasHeader && (
        <div className="lk-meter-head">
          {label != null && <span className="lk-meter-label">{label}</span>}
          {showValue && (
            <span className="lk-meter-value lk-tnum">
              {value}
              {unit != null && <span className="lk-meter-unit">{unit}</span>}
            </span>
          )}
        </div>
      )}

      {segmented ? (
        <div className="lk-meter-segs">
          {Array.from({ length: segments }, (_, i) => {
            // a cell lights when the value fraction reaches its slot
            const on = frac > 0 && frac >= (i + 1) / segments - 1e-9;
            return <i key={i} className={cn('lk-meter-seg', on && 'is-on')} />;
          })}
        </div>
      ) : (
        <div className="lk-meter-track">
          <i className="lk-meter-fill" />
          {typeof threshold === 'number' && (
            <span
              className="lk-meter-tick"
              aria-hidden="true"
              style={{ ['--t']: clamp((threshold - min) / span, 0, 1) } as CSSProperties}
            />
          )}
        </div>
      )}
    </div>
  );
}
