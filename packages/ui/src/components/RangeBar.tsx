import { type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../cn';

/**
 * Marker tone — colors the value marker dot.
 * 'auto' = colored by which zone the value lands in (low→warn, optimal→ok, high→bad).
 */
export type RangeBarMarkerTone = 'auto' | 'ok' | 'warn' | 'bad';

export interface RangeBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** the current value, in [min, max] */
  value: number;
  /** range floor (default 0) */
  min?: number;
  /** range ceiling (default 100) */
  max?: number;
  /** lower optimal boundary — [min, low] is the low (amber) zone */
  low: number;
  /** upper optimal boundary — [high, max] is the high (red) zone */
  high: number;
  /** mono uppercase caption shown above the track */
  label?: string;
  /** suffix after the value readout (e.g. 'mg/dL', 'ng/dL') */
  unit?: string;
  /** show the numeric value (+ unit) on the label row */
  showValue?: boolean;
  /** marker color — 'auto' picks by zone (default), or force ok/warn/bad */
  markerTone?: RangeBarMarkerTone;
}

/** Clamp x into [lo, hi]. */
const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x));

/** Marker tone → its color var. */
const MARKER_COLOR: Record<Exclude<RangeBarMarkerTone, 'auto'>, string> = {
  ok: 'var(--zone-high)',
  warn: 'var(--zone-mid)',
  bad: 'var(--zone-low)',
};

/**
 * RangeBar — a reference-range bar for biomarkers / labs.
 *
 * A horizontal track split into low / optimal / high colored zones, with a
 * marker dot showing where the current value falls (e.g. fasting glucose vs its
 * healthy range). The three zones are [min,low] low (amber), [low,high] optimal
 * (green), [high,max] high (red); the marker auto-colors by the zone it lands in
 * unless `markerTone` forces it. Ports the signature .range / .range-track /
 * .range-band / .range-marker visual from the design's labs panel.
 *
 * Per-instance vars: --low / --high (zone boundary fractions), --pos (marker
 * fraction), --marker (marker color).
 */
export function RangeBar({
  value,
  min = 0,
  max = 100,
  low,
  high,
  label,
  unit,
  showValue = false,
  markerTone = 'auto',
  className,
  style,
  ...rest
}: RangeBarProps) {
  const span = max - min || 1;
  const lowFrac = clamp((low - min) / span, 0, 1);
  const highFrac = clamp((high - min) / span, 0, 1);
  const posFrac = clamp((value - min) / span, 0, 1);

  // auto tone reflects which zone the value lands in
  const autoTone: Exclude<RangeBarMarkerTone, 'auto'> =
    value < low ? 'warn' : value > high ? 'bad' : 'ok';
  const tone = markerTone === 'auto' ? autoTone : markerTone;

  const hasHeader = label != null || showValue;

  return (
    <div
      className={cn('lk-rangebar', `lk-rangebar-${tone}`, className)}
      role="img"
      aria-label={
        label != null
          ? `${label} ${value}${unit ?? ''} (optimal ${low}–${high})`
          : `${value}${unit ?? ''} (optimal ${low}–${high})`
      }
      style={
        {
          ['--low']: `${lowFrac * 100}%`,
          ['--high']: `${highFrac * 100}%`,
          ['--pos']: `${posFrac * 100}%`,
          ['--marker']: MARKER_COLOR[tone],
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      {hasHeader && (
        <div className="lk-rangebar-head">
          {label != null && <span className="lk-rangebar-label">{label}</span>}
          {showValue && (
            <span className="lk-rangebar-value lk-tnum">
              {value}
              {unit != null && <span className="lk-rangebar-unit">{unit}</span>}
            </span>
          )}
        </div>
      )}

      <div className="lk-rangebar-track">
        <i className="lk-rangebar-band" aria-hidden="true" />
        <span className="lk-rangebar-marker" aria-hidden="true" />
      </div>
    </div>
  );
}
