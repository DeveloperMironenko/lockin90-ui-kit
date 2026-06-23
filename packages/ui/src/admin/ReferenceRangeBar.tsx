import { type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../cn';
import { RangeBar } from '../components/RangeBar';

/* ReferenceRangeBar — a compact lab-test reference-range bar for the operator
   console's catalogs / lab-tests panel. Composes the root `RangeBar` for the
   load-bearing visual (low→normal→high gradient track + highlighted normal band
   + optional value marker dot) and layers on the min/max tick labels and a mono
   range readout (`30 – 300 unit`) that the bare RangeBar header does not show.
   Pure render. Web-only. Matches the `.refrange` block from
   lockin90-design/admin/catalogs.html.

   Reuse rationale: RangeBar already expresses every track/band/marker behavior
   this needs (gradient zones, normal [low,high] band, auto-toned value marker),
   so this is a THIN wrapper — it adds only the tick + range labels, never a
   parallel track. When `value` is omitted, the marker is suppressed via a
   modifier class so the bar reads as a pure reference range. */

export interface ReferenceRangeBarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Lower bound of the normal range (start of the green band). */
  low: number;
  /** Upper bound of the normal range (end of the green band). */
  high: number;
  /** Left edge of the displayed track (the axis floor). */
  displayMin: number;
  /** Right edge of the displayed track (the axis ceiling). */
  displayMax: number;
  /** Unit appended to the range / value readouts (e.g. `'ng/mL'`). */
  unit?: string;
  /** A measured value to mark on the track + read out. Omit for a pure range. */
  value?: number;
}

/** Trim a trailing `.0` so `4.0` reads `4.0` only when meaningful (keep as-is
 *  otherwise) — we format with the caller's own precision via String(). */
const fmt = (n: number) => String(n);

export function ReferenceRangeBar({
  low,
  high,
  displayMin,
  displayMax,
  unit,
  value,
  className,
  style,
  ...rest
}: ReferenceRangeBarProps) {
  const hasValue = value != null;
  const unitSuffix = unit != null ? ` ${unit}` : '';

  return (
    <div
      className={cn(
        'lk-refrangebar',
        !hasValue && 'lk-refrangebar-novalue',
        className,
      )}
      style={style as CSSProperties}
      {...rest}
    >
      <div className="lk-refrangebar-track">
        <RangeBar
          // RangeBar always renders a marker; when there's no value we anchor it
          // at the band center and hide it via the -novalue modifier's CSS.
          value={hasValue ? value : (low + high) / 2}
          min={displayMin}
          max={displayMax}
          low={low}
          high={high}
          unit={unit}
        />
      </div>

      <div className="lk-refrangebar-ticks">
        <span className="lk-refrangebar-tick">{fmt(displayMin)}</span>
        <span className="lk-refrangebar-range">
          {fmt(low)} – {fmt(high)}
          {unitSuffix}
        </span>
        <span className="lk-refrangebar-tick">{fmt(displayMax)}</span>
      </div>

      {hasValue && (
        <div className="lk-refrangebar-readout lk-tnum">
          {fmt(value)}
          {unit != null && (
            <span className="lk-refrangebar-readout-unit">{unit}</span>
          )}
        </div>
      )}
    </div>
  );
}
