'use client';

import { energyColor, energyGlow } from '../EnergyRing/helpers';
import type { MiniEnergyRingProps } from './types';

export default function MiniEnergyRing({ score, size = 56 }: MiniEnergyRingProps) {
  const color = energyColor(score);
  const glow = energyGlow(score);
  const r = (size - 4) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, score / 100));

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#1A1A1A" strokeWidth={4} fill="none"/>
        <circle
          cx={size / 2} cy={size / 2} r={r}
          stroke={color} strokeWidth={4} fill="none"
          strokeLinecap="butt"
          strokeDasharray={c} strokeDashoffset={c * (1 - pct)}
          style={{ filter: `drop-shadow(0 0 4px ${glow})` }}
        />
      </svg>
      <div
        className="absolute bg-accent opacity-80 pointer-events-none origin-left"
        style={{
          top: '52%', left: '-6%',
          width: size * 1.12, height: 1.5,
          transform: 'rotate(-12deg)',
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="font-display italic font-black text-white tabular-nums leading-none"
          style={{ fontSize: size * 0.34 }}
        >
          {score}
        </span>
      </div>
    </div>
  );
}
