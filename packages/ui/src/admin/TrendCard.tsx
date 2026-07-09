import { useId } from 'react';
import { cn } from '../cn';

/* TrendCard — a titled 7-day area+line mini-chart CARD (title + headline value +
   delta + area/line chart). Pure inline SVG, no chart lib. Used in the operator
   overview charts row. Mirrors `.chart-card` / `.chart-svg` / `.chart-line` /
   `.chart-area` from lockin90-design/admin/overview.html. Web-only. `lk-trend*`
   classes.

   Renamed from `Sparkline` — it is a full stat CARD, not a bare inline
   sparkline, and the name clashed with the root cross-platform `Sparkline`
   primitive. Its CSS classes are namespaced `lk-trend*` (they previously shared
   `lk-spark*` with the root `Sparkline`, which visually polluted both).
   `admin/index.ts` keeps a deprecated `Sparkline`/`SparklineProps` alias for
   back-compat. */

export type SparkDeltaDir = 'up' | 'down' | 'flat';

export interface TrendCardProps {
  /** Uppercase mono title, e.g. "Signups · 7d". */
  title: string;
  /** Big headline value, e.g. "312" or "41.2k" or "0.3%". */
  value: string;
  /** Optional small delta next to the value, e.g. "+18%". */
  delta?: string;
  /** Colours the delta: up=green, down=red, flat=faint. */
  deltaDir?: SparkDeltaDir;
  /** Series values (chronological). Rendered as an area + line, auto-scaled. */
  points: number[];
  /** Line/area stroke colour (hex). Area is the same colour at low opacity. */
  color: string;
  /** X-axis tick labels under the chart (e.g. ['Mon','Wed','Fri','Sun']). */
  xLabels?: string[];
  /** Accessible summary of the trend. */
  ariaLabel?: string;
  className?: string;
}

const W = 300;
const H = 92;

function scaleY(v: number, max: number): number {
  // leave 6px headroom top + bottom
  return H - (v / max) * (H - 12) - 6;
}

function buildPaths(points: number[]): { line: string; area: string } {
  if (points.length === 0) return { line: '', area: '' };
  const max = Math.max(...points, 1);
  const step = W / Math.max(1, points.length - 1);
  const line = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${(i * step).toFixed(1)} ${scaleY(p, max).toFixed(1)}`)
    .join(' ');
  const area = `${line} L${W} ${H} L0 ${H} Z`;
  return { line, area };
}

/**
 * Titled mini area+line stat card. Auto-scales `points` to the card; `color` drives the line and
 * the (low-opacity) area fill. Delta is optional and colour-coded by `deltaDir`.
 */
export function TrendCard({
  title,
  value,
  delta,
  deltaDir = 'flat',
  points,
  color,
  xLabels,
  ariaLabel,
  className,
}: TrendCardProps) {
  const gradId = useId();
  const { line, area } = buildPaths(points);

  return (
    <div className={cn('lk-trend', className)}>
      <div className="lk-trend-head">
        <div className="lk-trend-t">{title}</div>
        <div className="lk-trend-v">
          {value}
          {delta != null && <small className={`lk-trend-delta lk-trend-delta--${deltaDir}`}>{delta}</small>}
        </div>
      </div>
      <svg
        className="lk-trend-svg"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={ariaLabel ?? `${title}: ${value}`}
      >
        <line className="lk-trend-grid" x1="0" y1="22" x2={W} y2="22" />
        <line className="lk-trend-grid" x1="0" y1="46" x2={W} y2="46" />
        <line className="lk-trend-grid" x1="0" y1="70" x2={W} y2="70" />
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={color} />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path className="lk-trend-area" fill={`url(#${gradId})`} d={area} />
        <path className="lk-trend-line" stroke={color} d={line} />
      </svg>
      {xLabels && xLabels.length > 0 && (
        <div className="lk-trend-axis">
          {xLabels.map((l, i) => <span key={i}>{l}</span>)}
        </div>
      )}
    </div>
  );
}
