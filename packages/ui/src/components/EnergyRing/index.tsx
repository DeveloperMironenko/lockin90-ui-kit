'use client';

import { useState, useEffect } from 'react';
import { energyColor, energyGlow, energyLabel, useCountUp } from './helpers';
import type { EnergyRingProps } from './types';

export default function EnergyRing({ score = 72, size = 260, animate = true }: EnergyRingProps) {
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, score / 100));

  const color = energyColor(score);
  const glow = energyGlow(score);
  const label = energyLabel(score);

  const [drawn, setDrawn] = useState(animate ? 0 : pct);

  useEffect(() => {
    if (!animate) { setDrawn(pct); return; }
    let raf: number;
    let start: number | null = null;
    const step = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / 1200);
      setDrawn(pct * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [pct, animate]);

  const display = useCountUp(score, 1200);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#1A1A1A" strokeWidth={stroke} fill="none"/>
        <circle
          cx={size / 2} cy={size / 2} r={r}
          stroke={color} strokeWidth={stroke} fill="none"
          strokeLinecap="butt"
          strokeDasharray={c} strokeDashoffset={c * (1 - drawn)}
          style={{ filter: `drop-shadow(0 0 8px ${glow})` }}
        />
      </svg>

      <div
        className="absolute bg-accent pointer-events-none opacity-[0.85] origin-left shadow-[0_0_6px_rgba(255,31,31,0.5)]"
        style={{
          top: '52%', left: '-4%',
          width: size * 1.08, height: 2,
          transform: 'rotate(-12deg)',
        }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div
          className="font-display italic font-black text-white tabular-nums leading-[0.9]"
          style={{ fontSize: size * 0.34 }}
        >
          {display}
        </div>
        <div className="ea-eyebrow mt-2">ENERGY</div>
        <div
          className="mt-1 text-[10px] font-display italic font-bold tracking-[0.16em] uppercase"
          style={{ color }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}
