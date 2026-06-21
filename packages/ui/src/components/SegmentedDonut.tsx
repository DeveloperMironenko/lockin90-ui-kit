import { type HTMLAttributes } from 'react';
import { cn } from '../cn';

/** One donut segment / legend row. */
export interface DonutSegment {
  /** display label, e.g. "Sleep" */
  label: string;
  /** the segment's value, shown in the legend (e.g. hours: "7.5h") and used to
   *  size the arc relative to the sum of all segment values */
  value: string;
  /** 0..100 share of the whole, shown in the legend and used for the arc width */
  pct: number;
  /** the segment color (dot, arc, % text) — a token var() or hex */
  color: string;
}

export interface SegmentedDonutProps extends HTMLAttributes<HTMLDivElement> {
  /** card title above the chart */
  title?: string;
  /** the donut segments, in draw order (clockwise from 12 o'clock) */
  segments?: DonutSegment[];
  /** big center readout (e.g. "24h") */
  centerValue?: string;
  /** small uppercase center label (e.g. "tracked") */
  centerLabel?: string;
}

/* ring geometry: 200×200 viewBox, stroke ring at r=82 */
const VB = 200;
const C = 100;
const R = 82;
const SW = 20;
const CIRC = 2 * Math.PI * R; // ≈ 515.22

/** Faithful reproduction of the design's "Where your day goes" example. */
const DEFAULT_SEGMENTS: DonutSegment[] = [
  { label: 'Sleep', value: '7.5h', pct: 31, color: 'var(--violet)' },
  { label: 'Work', value: '8h', pct: 33, color: 'var(--cyan)' },
  { label: 'Training', value: '1h', pct: 4, color: 'var(--magenta)' },
  { label: 'Meals', value: '1.5h', pct: 6, color: 'var(--warn)' },
  { label: 'Leisure / other', value: '6h', pct: 25, color: 'var(--mint)' },
];

/** Segmented donut + legend — a category breakdown drawn as a multi-segment
 *  SVG donut with a center total, beside a legend of rows (colored dot · label ·
 *  value · %). Arc lengths are derived from each segment's `pct`. */
export function SegmentedDonut({
  title = 'Where your day goes',
  segments = DEFAULT_SEGMENTS,
  centerValue = '24h',
  centerLabel = 'tracked',
  className,
  ...rest
}: SegmentedDonutProps) {
  const total = segments.reduce((sum, s) => sum + s.pct, 0) || 1;

  // running offset (negative) so segments chain clockwise from 12 o'clock
  let cursor = 0;
  const arcs = segments.map((s) => {
    const len = (CIRC * s.pct) / total;
    const offset = -cursor;
    cursor += len;
    return { len, offset };
  });

  const ariaLabel = `Donut: ${segments.map((s) => `${s.label} ${s.pct}%`).join(', ')}.`;

  return (
    <div className={cn('lk-donut', 'lk-card', className)} {...rest}>
      <div className="lk-donut-head">
        <h3 className="lk-donut-title">{title}</h3>
        <span className="lk-chip lk-mono">
          <span style={{ color: 'var(--text)' }}>{centerValue}</span> {centerLabel}
        </span>
      </div>

      <div className="lk-donut-grid">
        <div className="lk-donut-ring">
          <svg className="lk-donut-svg" width={VB} height={VB} viewBox={`0 0 ${VB} ${VB}`} role="img" aria-label={ariaLabel}>
            <g transform={`rotate(-90 ${C} ${C})`}>
              <circle cx={C} cy={C} r={R} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth={SW} />
              {segments.map((s, i) => {
                const a = arcs[i]!;
                return (
                  <circle
                    key={`${s.label}-${i}`}
                    className="lk-donut-seg"
                    cx={C}
                    cy={C}
                    r={R}
                    fill="none"
                    stroke={s.color}
                    strokeWidth={SW}
                    strokeDasharray={`${a.len.toFixed(1)} ${(CIRC - a.len).toFixed(1)}`}
                    strokeDashoffset={a.offset.toFixed(1)}
                  />
                );
              })}
            </g>
          </svg>
          <div className="lk-donut-center">
            <div className="lk-donut-big lk-display lk-tnum">{centerValue}</div>
            <div className="lk-donut-lbl">{centerLabel}</div>
          </div>
        </div>

        <div className="lk-donut-list">
          {segments.map((s, i) => (
            <div className="lk-donut-row" key={`${s.label}-${i}`}>
              <span className="lk-donut-sw" style={{ background: s.color }} />
              <span className="lk-donut-name">{s.label}</span>
              <span className="lk-donut-hrs lk-mono">{s.value}</span>
              <span className="lk-donut-pct lk-mono" style={{ color: s.color }}>
                {s.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export type { DonutSegment as SegmentedDonutSegment };
