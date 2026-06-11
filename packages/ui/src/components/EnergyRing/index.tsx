'use client';

import { useState, useEffect, useId } from 'react';
import { gradientStops } from '@lockin90/tokens';
import { energyColor, energyGlow, energyLabel, zoneGradient, useCountUp } from './helpers';
import type { EnergyRingProps } from './types';

export default function EnergyRing({
  score = 72,
  size = 260,
  animate = true,
  gradient = 'flux',
  label = 'ENERGY',
  showZone = true,
}: EnergyRingProps) {
  const stroke = Math.max(6, Math.round(size * 0.065));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, score / 100));

  const gradName = gradient === 'zone' ? zoneGradient(score) : gradient;
  const stops = gradientStops[gradName];
  const glow = energyGlow(score);
  const zoneCol = energyColor(score);
  const zoneText = energyLabel(score);

  const uid = useId().replace(/[:]/g, '');
  const gradId = `er-grad-${uid}`;

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
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            {stops.map((s, i) => (
              <stop key={i} offset={`${(i / (stops.length - 1)) * 100}%`} stopColor={s} />
            ))}
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          stroke={`url(#${gradId})`} strokeWidth={stroke} fill="none"
          strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - drawn)}
          style={{ filter: `drop-shadow(0 0 10px ${glow})` }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div
          className="font-display font-bold text-white tabular-nums leading-[0.9]"
          style={{ fontSize: size * 0.32, letterSpacing: '-0.03em' }}
        >
          {display}
        </div>
        {label !== '' && <div className="ea-eyebrow mt-2">{label}</div>}
        {showZone && (
          <div
            className="mt-1 text-[10px] font-mono font-medium tracking-[0.16em] uppercase"
            style={{ color: zoneCol }}
          >
            {zoneText}
          </div>
        )}
      </div>
    </div>
  );
}
