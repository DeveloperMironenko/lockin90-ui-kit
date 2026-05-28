'use client';

import { useState, useEffect } from 'react';
import type { HistoryChartProps } from './types';

export default function HistoryChart({ data, width = 560, height = 120 }: HistoryChartProps) {
  const [drawn, setDrawn] = useState(0);

  useEffect(() => {
    let raf: number;
    let start: number | null = null;
    const step = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / 1400);
      setDrawn(1 - Math.pow(1 - p, 3));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (data.length < 2) return null;

  const padX = 8, padY = 12;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;
  const points = data.map((d, i) => ({
    x: padX + (i / (data.length - 1)) * innerW,
    y: padY + (1 - d.v / 100) * innerH,
    v: d.v,
  }));

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const cur = points[i];
    const cx = (prev.x + cur.x) / 2;
    path += ` Q ${prev.x} ${prev.y}, ${cx} ${(prev.y + cur.y) / 2}`;
    path += ` T ${cur.x} ${cur.y}`;
  }

  const clipW = innerW * drawn + padX;
  const dotColor = (v: number) => v < 34 ? '#FF1F1F' : '#FFFFFF';

  return (
    <svg width={width} height={height} className="block w-full">
      <defs>
        <clipPath id="hist-reveal">
          <rect x={0} y={0} width={clipW + 4} height={height}/>
        </clipPath>
      </defs>
      {[0.33, 0.67].map((t) => (
        <line key={t}
          x1={padX} x2={width - padX}
          y1={padY + innerH * t} y2={padY + innerH * t}
          stroke="#222" strokeWidth="1" strokeDasharray="2 4"
        />
      ))}
      <g clipPath="url(#hist-reveal)">
        <path d={path} stroke="#FFFFFF" strokeOpacity="0.45" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill={dotColor(p.v)}
            style={{ filter: `drop-shadow(0 0 4px ${dotColor(p.v)}66)` }}/>
        ))}
      </g>
    </svg>
  );
}
