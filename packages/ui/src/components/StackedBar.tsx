import { type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../cn';

/** One contiguous segment of the stacked bar, sized by its `value` share. */
export interface StackedSegment {
  /** the segment's value — sizes its slice relative to `total` (or the sum) */
  value: number;
  /** the slice color — a token var() or hex (e.g. 'var(--mint)') */
  color: string;
  /** optional label (legend + accessibility) */
  label?: string;
}

export interface StackedBarProps extends HTMLAttributes<HTMLDivElement> {
  /** the segments laid out left→right, sized by their share of the total */
  segments: StackedSegment[];
  /** bar thickness in px */
  height?: number;
  /** pill-rounded ends + clipped corners */
  rounded?: boolean;
  /** px gap between adjacent segments */
  gap?: number;
  /** render a legend grid (dot + label + value/%) below the bar */
  showLegend?: boolean;
  /** denominator for the shares; if omitted, the summed segment values */
  total?: number;
}

/** 100%-stacked horizontal bar — one linear track split into colored proportion
 *  segments sized by each segment's share of the total, with an optional legend
 *  of dot + label + value/% rows below. Distinct from BarChart (separate
 *  vertical bars) and DonutChart (radial). Tokens-driven, no Tailwind. */
export function StackedBar({
  segments,
  height = 10,
  rounded = true,
  gap = 2,
  showLegend = false,
  total,
  className,
  style,
  ...rest
}: StackedBarProps) {
  const sum = segments.reduce((acc, s) => acc + (s.value > 0 ? s.value : 0), 0);
  const denom = total != null && total > 0 ? total : sum || 1;
  const drawn = segments.filter((s) => s.value > 0).length;
  const g = Math.max(0, gap);

  const ariaLabel = `Stacked bar: ${segments
    .map((s) => `${s.label ?? 'segment'} ${Math.round(((s.value > 0 ? s.value : 0) / denom) * 100)}%`)
    .join(', ')}.`;

  return (
    <div className={cn('lk-stackbar', className)} {...rest}>
      <div
        className={cn('lk-stackbar-track', rounded && 'is-rounded')}
        style={
          {
            height,
            gap: drawn > 1 ? g : 0,
            ['--lk-stackbar-r']: rounded ? `${height}px` : '0px',
          } as CSSProperties
        }
        role="img"
        aria-label={ariaLabel}
      >
        {segments.map((s, i) => {
          const v = s.value > 0 ? s.value : 0;
          if (v <= 0) return null;
          const pct = (v / denom) * 100;
          return (
            <span
              key={`${s.label ?? 'seg'}-${i}`}
              className="lk-stackbar-seg"
              style={{ flexGrow: pct, flexBasis: 0, background: s.color }}
              title={s.label}
            />
          );
        })}
      </div>

      {showLegend && (
        <div className="lk-stackbar-legend">
          {segments.map((s, i) => {
            const v = s.value > 0 ? s.value : 0;
            const pct = Math.round((v / denom) * 100);
            return (
              <div className="lk-stackbar-li" key={`li-${s.label ?? 'seg'}-${i}`}>
                <span className="lk-stackbar-dot" style={{ background: s.color }} />
                <span className="lk-stackbar-name">{s.label ?? `Segment ${i + 1}`}</span>
                <span className="lk-stackbar-val lk-tnum">{s.value}</span>
                <span className="lk-stackbar-pct lk-tnum">{pct}%</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
