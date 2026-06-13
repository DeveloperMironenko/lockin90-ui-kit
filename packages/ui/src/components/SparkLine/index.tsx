'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from '../motion';
import { cn } from '../../cn';

export interface SparkLineProps {
  /** Series of y-values; evenly spaced on the x-axis. */
  data?: number[];
  /** Back-compat (pre-Aurora) alias for `data`. Resolved as `values ?? data`. */
  values?: number[];
  width?: number;
  height?: number;
  /** Stroke color (CSS color or var). Default mint. */
  color?: string;
  strokeWidth?: number;
  /** Soft gradient area fill under the line. */
  fill?: boolean;
  /** Draw the line on scroll-in (default true; reduced-motion safe). */
  animate?: boolean;
  /** Dot on the last point. */
  endDot?: boolean;
  className?: string;
  'aria-label'?: string;
}

/** A compact, self-drawing trend sparkline. */
export default function SparkLine({
  data,
  values,
  width = 120,
  height = 32,
  color = 'var(--mint)',
  strokeWidth = 2,
  fill = false,
  animate = true,
  endDot = false,
  className,
  ...rest
}: SparkLineProps) {
  const series = values ?? data ?? [];
  const pad = strokeWidth + 1;
  const pathRef = useRef<SVGPathElement | null>(null);
  const [len, setLen] = useState(0);
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.3 });
  const reduced = useReducedMotion();

  const { line, area, last } = buildPaths(series, width, height, pad);

  useEffect(() => {
    if (pathRef.current) setLen(pathRef.current.getTotalLength());
  }, [line]);

  const drawn = !animate || reduced || inView;

  return (
    <span ref={ref} className={cn(className)} style={{ display: 'inline-block', lineHeight: 0 }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" {...rest}>
        {fill && <path d={area} fill={color} opacity={0.12} />}
        <path
          ref={pathRef}
          d={line}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={
            len
              ? {
                  strokeDasharray: len,
                  strokeDashoffset: drawn ? 0 : len,
                  transition: animate ? 'stroke-dashoffset 1.6s var(--ease)' : undefined,
                }
              : undefined
          }
        />
        {endDot && last && <circle cx={last[0]} cy={last[1]} r={strokeWidth + 1.5} fill={color} />}
      </svg>
    </span>
  );
}

function buildPaths(data: number[], width: number, height: number, pad: number) {
  if (data.length < 2) return { line: '', area: '', last: null as [number, number] | null };
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const h = height - pad * 2;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = pad + h - ((v - min) / span) * h;
    return [x, y] as [number, number];
  });
  const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = `${line} L${width},${height} L0,${height} Z`;
  return { line, area, last: pts[pts.length - 1] };
}
