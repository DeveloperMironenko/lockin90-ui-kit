'use client';

import { useId } from 'react';
import { gradientStops, energyColor, zoneGradient } from '@lockin90/tokens';
import { cn } from '../../cn';
import type { MiniEnergyRingProps } from './types';

export type { MiniEnergyRingProps };

const GLOW: Record<string, string> = {
  mint: 'rgba(52,245,197,0.5)',
  warm: 'rgba(255,77,109,0.45)',
};

/**
 * Compact energy ring — the small variant of {@link EnergyRing} for calendar
 * cells, list rows and headers. A gradient arc fills to `score`/100 with the
 * number centered. Recolors mint↔warm by zone. Static (no draw animation) so it
 * stays crisp at tiny sizes.
 */
export default function MiniEnergyRing({ score, size = 56 }: MiniEnergyRingProps) {
  const sw = Math.max(3, Math.round(size * 0.07));
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score)) / 100;

  const gradName = zoneGradient(score);
  const stops = gradientStops[gradName];
  const glow = GLOW[gradName] ?? GLOW.mint;
  const zoneCol = energyColor(score);

  const uid = useId().replace(/:/g, '');
  const gradId = `lk-mer-${uid}`;

  return (
    <div className={cn('lk-mini-ring')} style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            {stops.map((s, i) => (
              <stop key={i} offset={`${(i / (stops.length - 1)) * 100}%`} stopColor={s} />
            ))}
          </linearGradient>
        </defs>
        <circle className="lk-mini-ring-track" cx={size / 2} cy={size / 2} r={r} strokeWidth={sw} />
        <circle
          className="lk-mini-ring-arc"
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={sw}
          stroke={`url(#${gradId})`}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ filter: `drop-shadow(0 0 4px ${glow})` }}
        />
      </svg>
      <div className="lk-mini-ring-center">
        <span
          className="lk-mini-ring-num"
          style={{ fontSize: Math.round(size * 0.34), color: zoneCol }}
        >
          {score}
        </span>
      </div>
    </div>
  );
}
