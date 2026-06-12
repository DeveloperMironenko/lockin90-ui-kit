'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { energyColor } from '@lockin90/tokens';
import { useInView, useReducedMotion } from '../motion';
import { cn } from '../../cn';

export interface EnergyCurveProps {
  /** Energy values 0–100 across the day (or any window). */
  data: number[];
  /** X-axis tick labels (rendered below; spaced evenly). */
  labels?: string[];
  /** Index of the "now" marker (vertical dashed line + dot). */
  nowIndex?: number;
  /** Drawing height in px (the chart is full-width). */
  height?: number;
  /** Show the HIGH/MODERATE/LOW/now legend (default true). */
  legend?: boolean;
  animate?: boolean;
  className?: string;
  'aria-label'?: string;
}

const VB_W = 620;

/**
 * The hero energy curve — a gradient area + a zone-colored line (mint/amber/red
 * by value) with an optional "now" marker, x-axis labels and legend. The line
 * draws on scroll-in. Reduced-motion safe.
 */
export default function EnergyCurve({
  data,
  labels,
  nowIndex,
  height = 170,
  legend = true,
  animate = true,
  className,
  ...rest
}: EnergyCurveProps) {
  const uid = useId().replace(/:/g, '');
  const strokeId = `lk-ec-s-${uid}`;
  const fillId = `lk-ec-f-${uid}`;
  const H = 200;

  const pathRef = useRef<SVGPathElement | null>(null);
  const [len, setLen] = useState(0);
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.25 });
  const reduced = useReducedMotion();

  const pts = toPoints(data, VB_W, H);
  const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ');
  const area = pts.length ? `${line} L${VB_W},${H} L0,${H} Z` : '';

  useEffect(() => {
    if (pathRef.current) setLen(pathRef.current.getTotalLength());
  }, [line]);

  const drawn = !animate || reduced || inView;
  const nowPt = nowIndex != null ? pts[nowIndex] : null;

  return (
    <div ref={ref} className={cn(className)}>
      <svg
        viewBox={`0 0 ${VB_W} ${H}`}
        width="100%"
        height={height}
        preserveAspectRatio="none"
        role="img"
        {...rest}
      >
        <defs>
          <linearGradient id={strokeId} x1="0" y1="0" x2={VB_W} y2="0" gradientUnits="userSpaceOnUse">
            {data.map((v, i) => (
              <stop key={i} offset={`${(i / Math.max(1, data.length - 1)) * 100}%`} stopColor={energyColor(v)} />
            ))}
          </linearGradient>
          <linearGradient id={fillId} x1="0" y1="0" x2="0" y2={H} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="rgba(124,92,255,.30)" />
            <stop offset="1" stopColor="rgba(124,92,255,0)" />
          </linearGradient>
        </defs>

        {/* gridlines */}
        <g stroke="rgba(255,255,255,.05)" strokeWidth="1">
          <line x1="0" y1={H * 0.25} x2={VB_W} y2={H * 0.25} />
          <line x1="0" y1={H * 0.5} x2={VB_W} y2={H * 0.5} />
          <line x1="0" y1={H * 0.75} x2={VB_W} y2={H * 0.75} />
        </g>

        {area && <path d={area} fill={`url(#${fillId})`} opacity={0.9} />}
        <path
          ref={pathRef}
          d={line}
          fill="none"
          stroke={`url(#${strokeId})`}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter: 'drop-shadow(0 0 8px rgba(52,245,197,.4))',
            ...(len
              ? {
                  strokeDasharray: len,
                  strokeDashoffset: drawn ? 0 : len,
                  transition: animate ? 'stroke-dashoffset 1.8s var(--ease)' : undefined,
                }
              : {}),
          }}
        />

        {nowPt && (
          <>
            <line x1={nowPt[0]} y1="14" x2={nowPt[0]} y2={H - 14} stroke="rgba(124,92,255,.5)" strokeWidth="1.5" strokeDasharray="3 4" />
            <circle cx={nowPt[0]} cy={nowPt[1]} r="4.5" fill="var(--accent)" stroke="var(--bg-1)" strokeWidth="2" />
          </>
        )}
      </svg>

      {labels && labels.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          {labels.map((l, i) => (
            <span key={i} className="lk-mono" style={{ fontSize: 10, color: 'var(--text-faint)' }}>
              {l}
            </span>
          ))}
        </div>
      )}

      {legend && (
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 6 }}>
          <LegendKey color="var(--zone-high)" label="HIGH" />
          <LegendKey color="var(--zone-mid)" label="MODERATE" />
          <LegendKey color="var(--zone-low)" label="LOW" />
          {nowIndex != null && <LegendKey color="var(--accent)" label="now" />}
        </div>
      )}
    </div>
  );
}

function LegendKey({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--text-dim)' }}>
      <i style={{ width: 9, height: 9, borderRadius: 3, background: color }} />
      {label}
    </span>
  );
}

function toPoints(data: number[], width: number, height: number): Array<[number, number]> {
  if (data.length < 2) return [];
  const pad = 14;
  const h = height - pad * 2;
  return data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = pad + h - (Math.max(0, Math.min(100, v)) / 100) * h;
    return [Math.round(x), Math.round(y)];
  });
}
