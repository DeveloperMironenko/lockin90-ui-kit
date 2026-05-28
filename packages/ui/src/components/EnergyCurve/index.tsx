'use client';

import { useState, useEffect, useMemo } from 'react';
import { ZONE_COLORS, HOUR_LABELS, getZone, buildCurvePath } from './helpers';
import type { EnergyCurveProps } from './types';

export default function EnergyCurve({
  curve,
  width = 600,
  height = 160,
  currentSlot,
  animate = true,
}: EnergyCurveProps) {
  // Render only when the backend returns the canonical 34-slot curve. No fake fallback —
  // missing data shows an empty axis-only chart so the user never sees fabricated numbers.
  const data = curve && curve.length === 34 ? curve : null;

  const now = new Date();
  const derivedSlot = currentSlot ?? Math.min(33, Math.max(0,
    Math.floor((now.getHours() * 2 + Math.floor(now.getMinutes() / 30)) - 12)
  ));

  const padX = 0;
  const padY = 12;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;

  const points = useMemo(() =>
    data === null
      ? []
      : data.map((v, i) => ({
          x: padX + (i / (data.length - 1)) * innerW,
          y: padY + (1 - v / 100) * innerH,
          v, zone: getZone(v, i),
        })),
  [data, innerW, innerH]);

  const path = useMemo(() => (points.length ? buildCurvePath(points) : ''), [points]);

  const segments = useMemo(() =>
    points.slice(1).map((b, i) => ({
      d: `M ${points[i].x} ${points[i].y} L ${b.x} ${b.y}`,
      color: ZONE_COLORS[b.zone],
    })),
  [points]);

  const [drawn, setDrawn] = useState(animate ? 0 : 1);

  useEffect(() => {
    if (!animate || points.length === 0) return;
    let raf: number;
    let start: number | null = null;
    const step = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / 1500);
      setDrawn(1 - Math.pow(1 - p, 3));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [animate, points.length]);

  const clipW = innerW * drawn + padX;
  const cur = points.length ? points[Math.min(derivedSlot, points.length - 1)] : null;

  return (
    <svg width={width} height={height} className="block overflow-visible">
      <defs>
        <clipPath id="ec-reveal">
          <rect x={0} y={0} width={clipW + 4} height={height}/>
        </clipPath>
        <linearGradient id="ec-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#22C55E" stopOpacity="0.10"/>
          <stop offset="100%" stopColor="#22C55E" stopOpacity="0"/>
        </linearGradient>
      </defs>

      {[0.25, 0.5, 0.75].map((t) => (
        <line key={t}
          x1={padX} x2={width - padX}
          y1={padY + innerH * t} y2={padY + innerH * t}
          stroke="#222" strokeWidth="1" strokeDasharray="2 4"
        />
      ))}

      {HOUR_LABELS.map((h, i) => {
        const x = padX + (i / (HOUR_LABELS.length - 1)) * innerW;
        return (
          <text key={h} x={x} y={height - 1} fill="#555"
            fontSize="9" fontFamily="var(--font-mono)"
            textAnchor="middle" letterSpacing="0.05em">
            {h}
          </text>
        );
      })}

      {points.length > 0 && (
        <>
          <g clipPath="url(#ec-reveal)">
            <path
              d={`${path} L ${points[points.length - 1].x} ${height - padY} L ${points[0].x} ${height - padY} Z`}
              fill="url(#ec-fill)"
            />
          </g>

          <g clipPath="url(#ec-reveal)">
            {segments.map((s, i) => (
              <path key={i} d={s.d} stroke={s.color} strokeWidth="2"
                fill="none" strokeLinecap="round"/>
            ))}
          </g>

          {drawn > 0.95 && cur && (
            <>
              <line x1={cur.x} x2={cur.x} y1={padY} y2={height - padY}
                stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="3 3"/>
              <circle cx={cur.x} cy={cur.y} r="5" fill="rgba(255,255,255,0.12)"/>
              <circle cx={cur.x} cy={cur.y} r="3" fill="#fff"
                style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.8))' }}/>
            </>
          )}
        </>
      )}
    </svg>
  );
}
