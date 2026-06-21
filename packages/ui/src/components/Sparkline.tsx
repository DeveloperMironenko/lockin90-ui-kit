import { type SVGProps, useId } from 'react';
import { cn } from '../cn';

export interface SparklineProps
  extends Omit<SVGProps<SVGSVGElement>, 'children' | 'fill' | 'color' | 'width' | 'height'> {
  /** The series, oldest → newest. Auto-scaled to fit the box. */
  data?: number[];
  /** Box width in px. */
  width?: number;
  /** Box height in px. */
  height?: number;
  /** Line color (CSS color or token, e.g. `var(--mint)`). */
  color?: string;
  /** Fill the area under the line with a faint gradient of `color`. */
  fill?: boolean;
  /** Draw a glowing dot at the last point. */
  dot?: boolean;
  /** Line stroke width in px. */
  strokeWidth?: number;
}

/** A gentle rising sample so `<Sparkline />` renders something on its own. */
const DEFAULT_DATA = [40, 44, 42, 50, 55, 53, 62, 68, 72];

/** A little vertical breathing room so the line/dot never touch the edges. */
const PAD = 3;

/**
 * Sparkline — a generic mini trend line. Normalizes `data` into a width×height
 * box (min → bottom, max → top, with a touch of vertical padding) and draws it
 * as a rounded polyline. Optionally fills the area beneath with a faint gradient
 * of `color`, and marks the last point with a glowing dot. preserveAspectRatio
 * is "none" so the line stretches to fill whatever box you give it.
 */
export function Sparkline({
  data = DEFAULT_DATA,
  width = 120,
  height = 32,
  color = 'var(--mint)',
  fill = false,
  dot = true,
  strokeWidth = 2,
  className,
  ...rest
}: SparklineProps) {
  const gradId = useId();
  const n = data.length;

  // Normalize each value into the box: x spreads evenly, y maps min→bottom / max→top.
  const min = n ? Math.min(...data) : 0;
  const max = n ? Math.max(...data) : 0;
  const span = max - min || 1;
  const innerH = height - PAD * 2;

  const pts = data.map((v, i) => {
    const x = n <= 1 ? 0 : (i / (n - 1)) * width;
    const frac = (v - min) / span;
    const y = PAD + (1 - frac) * innerH;
    return [+x.toFixed(2), +y.toFixed(2)] as const;
  });

  const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ');
  // Closed path for the area fill: line, then down to the baseline and back.
  const area =
    pts.length > 0 ? `${line} L${pts[pts.length - 1]![0]},${height} L${pts[0]![0]},${height} Z` : '';
  const last = pts[pts.length - 1];

  return (
    <svg
      className={cn('lk-spark', className)}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
      {...rest}
    >
      {fill && pts.length > 0 && (
        <>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.28} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <path className="lk-spark-area" d={area} fill={`url(#${gradId})`} />
        </>
      )}

      {pts.length > 0 && (
        <path
          className="lk-spark-line"
          d={line}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {dot && last && (
        <circle
          className="lk-spark-dot"
          cx={last[0]}
          cy={last[1]}
          r={strokeWidth + 1}
          fill={color}
          // `color` drives `currentColor`, so the drop-shadow glow matches the dot.
          style={{ color }}
        />
      )}
    </svg>
  );
}
