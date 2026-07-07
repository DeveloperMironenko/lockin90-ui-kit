import { useId } from 'react';
import { cn } from '../cn';

/* Sparkline — a titled 7-day area+line mini-chart card. Pure inline SVG, no chart lib.
   Used in the operator overview charts row. Mirrors `.chart-card` / `.chart-svg` /
   `.chart-line` / `.chart-area` from lockin90-design/admin/overview.html. Web-only.
   `lk-spark*` classes. */

export type SparkDeltaDir = 'up' | 'down' | 'flat';

export interface SparklineProps {
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
 * Titled mini area+line chart. Auto-scales `points` to the card; `color` drives the line and
 * the (low-opacity) area fill. Delta is optional and colour-coded by `deltaDir`.
 */
export function Sparkline({
  title,
  value,
  delta,
  deltaDir = 'flat',
  points,
  color,
  xLabels,
  ariaLabel,
  className,
}: SparklineProps) {
  const gradId = useId();
  const { line, area } = buildPaths(points);

  return (
    <div className={cn('lk-spark', className)}>
      <div className="lk-spark-head">
        <div className="lk-spark-t">{title}</div>
        <div className="lk-spark-v">
          {value}
          {delta != null && <small className={`lk-spark-delta lk-spark-delta--${deltaDir}`}>{delta}</small>}
        </div>
      </div>
      <svg
        className="lk-spark-svg"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={ariaLabel ?? `${title}: ${value}`}
      >
        <line className="lk-spark-grid" x1="0" y1="22" x2={W} y2="22" />
        <line className="lk-spark-grid" x1="0" y1="46" x2={W} y2="46" />
        <line className="lk-spark-grid" x1="0" y1="70" x2={W} y2="70" />
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={color} />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path className="lk-spark-area" fill={`url(#${gradId})`} d={area} />
        <path className="lk-spark-line" stroke={color} d={line} />
      </svg>
      {xLabels && xLabels.length > 0 && (
        <div className="lk-spark-axis">
          {xLabels.map((l, i) => <span key={i}>{l}</span>)}
        </div>
      )}
    </div>
  );
}
