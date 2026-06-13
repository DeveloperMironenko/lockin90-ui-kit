'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { energyColor } from '@lockin90/tokens';
import { useInView, useReducedMotion } from '../motion';
import type { HistoryChartProps } from './types';

export type { HistoryChartProps };
export { formatEntryDate } from './helpers';

/**
 * A wide energy-history line chart — a smoothed Aurora line over a soft
 * gradient area, gridlines, and zone-colored dots, drawn left→right on
 * scroll-in (reduced-motion safe). Mirrors the {@link SparkLine} SVG approach
 * at a larger size for entry-history panels.
 */
export default function HistoryChart({ data, width = 560, height = 120 }: HistoryChartProps) {
  const pathRef = useRef<SVGPathElement | null>(null);
  const [len, setLen] = useState(0);
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.3 });
  const reduced = useReducedMotion();

  const uid = useId().replace(/:/g, '');
  const gradId = `lk-hist-fill-${uid}`;

  const padX = 8;
  const padY = 12;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;

  const points =
    data.length >= 1
      ? data.map((d, i) => ({
          x: data.length === 1 ? padX + innerW / 2 : padX + (i / (data.length - 1)) * innerW,
          y: padY + (1 - Math.max(0, Math.min(100, d.v)) / 100) * innerH,
          v: d.v,
        }))
      : [];

  // Smoothed line through the points (quadratic midpoints).
  let line = '';
  if (points.length >= 2) {
    line = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const cur = points[i];
      const cx = (prev.x + cur.x) / 2;
      line += ` Q ${prev.x} ${prev.y}, ${cx} ${(prev.y + cur.y) / 2}`;
      line += ` T ${cur.x} ${cur.y}`;
    }
  }
  const area = line ? `${line} L ${width - padX} ${height} L ${padX} ${height} Z` : '';

  useEffect(() => {
    if (pathRef.current) setLen(pathRef.current.getTotalLength());
  }, [line]);

  if (points.length < 2) return null;

  const drawn = reduced || inView;

  return (
    <span ref={ref} style={{ display: 'block', lineHeight: 0 }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        style={{ display: 'block', width: '100%' }}
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.22} />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
          </linearGradient>
        </defs>

        {[0.33, 0.67].map((t) => (
          <line
            key={t}
            x1={padX}
            x2={width - padX}
            y1={padY + innerH * t}
            y2={padY + innerH * t}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
            strokeDasharray="2 4"
          />
        ))}

        {area && <path d={area} fill={`url(#${gradId})`} />}

        <path
          ref={pathRef}
          className="lk-hist-line"
          d={line}
          fill="none"
          stroke="url(#lk-grad-flux-h)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={
            len
              ? {
                  strokeDasharray: len,
                  strokeDashoffset: drawn ? 0 : len,
                  transition: reduced ? undefined : 'stroke-dashoffset 1.4s var(--ease)',
                }
              : undefined
          }
        />

        {/* flux gradient for the line stroke */}
        <defs>
          <linearGradient id="lk-grad-flux-h" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#A8FF35" />
            <stop offset="33%" stopColor="#34F5C5" />
            <stop offset="66%" stopColor="#22D3EE" />
            <stop offset="100%" stopColor="#7C5CFF" />
          </linearGradient>
        </defs>

        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={3}
            fill={energyColor(p.v)}
            opacity={drawn ? 1 : 0}
            style={{
              filter: `drop-shadow(0 0 4px ${energyColor(p.v)}66)`,
              transition: reduced ? undefined : `opacity 0.4s var(--ease) ${0.2 + (i / points.length) * 1}s`,
            }}
          />
        ))}
      </svg>
    </span>
  );
}
