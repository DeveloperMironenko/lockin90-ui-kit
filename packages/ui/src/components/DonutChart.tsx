import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';

/** One arc of the donut, sized by its `value` share of the total. */
export interface DonutSegment {
  /** the segment's value — sizes its arc relative to the sum of all values */
  value: number;
  /** the arc color — a token var() or hex */
  color: string;
  /** optional label (for accessibility / external legends) */
  label?: string;
}

export interface DonutChartProps extends HTMLAttributes<HTMLDivElement> {
  /** the donut segments, drawn clockwise from 12 o'clock */
  segments?: DonutSegment[];
  /** overall diameter in px */
  size?: number;
  /** ring stroke width in px */
  thickness?: number;
  /** gap between segments, in degrees */
  gap?: number;
  /** background (track) ring color */
  track?: string;
  /** center content — if omitted, the summed total is shown */
  children?: ReactNode;
}

/** Faithful reproduction of a macro-style breakdown. */
const DEFAULT_SEGMENTS: DonutSegment[] = [
  { value: 50, color: 'var(--cyan)', label: 'Carbs' },
  { value: 30, color: 'var(--lime)', label: 'Protein' },
  { value: 20, color: 'var(--accent)', label: 'Fat' },
];

/** Generic segmented-donut chart — an SVG ring split into colored arcs sized by
 *  each segment's share of the total, with a small gap between them, over a
 *  faint track ring. Center shows custom `children` or the summed total. */
export function DonutChart({
  segments = DEFAULT_SEGMENTS,
  size = 120,
  thickness = 14,
  gap = 2,
  track = 'rgba(255,255,255,0.07)',
  children,
  className,
  ...rest
}: DonutChartProps) {
  const c = size / 2;
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;

  const total = segments.reduce((sum, s) => sum + (s.value > 0 ? s.value : 0), 0) || 1;
  /** the visible-arc count: segments with a positive value get a leading gap */
  const drawn = segments.filter((s) => s.value > 0).length;
  /** px length of the angular gap, capped so it never exceeds a segment's share */
  const gapPx = (Math.max(0, gap) / 360) * circ;

  // running offset (negative) so arcs chain clockwise from 12 o'clock
  let cursor = 0;
  const arcs = segments.map((s) => {
    const share = (s.value > 0 ? s.value : 0) / total;
    const full = circ * share;
    // shave a gap off the head of each arc (only when there's room + >1 arc)
    const trim = drawn > 1 ? Math.min(gapPx, full) : 0;
    const len = Math.max(0, full - trim);
    const offset = -(cursor + trim);
    cursor += full;
    return { len, offset };
  });

  const ariaLabel = `Donut chart: ${segments
    .map((s) => `${s.label ?? 'segment'} ${Math.round(((s.value > 0 ? s.value : 0) / total) * 100)}%`)
    .join(', ')}.`;

  return (
    <div
      className={cn('lk-donut', className)}
      style={{ width: size, height: size }}
      {...rest}
    >
      <svg
        className="lk-donut-svg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={ariaLabel}
      >
        <g transform={`rotate(-90 ${c} ${c})`}>
          <circle
            className="lk-donut-track"
            cx={c}
            cy={c}
            r={r}
            fill="none"
            stroke={track}
            strokeWidth={thickness}
          />
          {segments.map((s, i) => {
            const a = arcs[i]!;
            if (a.len <= 0) return null;
            return (
              <circle
                key={`${s.label ?? 'seg'}-${i}`}
                className="lk-donut-seg"
                cx={c}
                cy={c}
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth={thickness}
                strokeLinecap="round"
                strokeDasharray={`${a.len.toFixed(2)} ${(circ - a.len).toFixed(2)}`}
                strokeDashoffset={a.offset.toFixed(2)}
              />
            );
          })}
        </g>
      </svg>
      <div className="lk-donut-center">
        {children ?? <span className="lk-donut-total lk-display lk-tnum">{total}</span>}
      </div>
    </div>
  );
}
