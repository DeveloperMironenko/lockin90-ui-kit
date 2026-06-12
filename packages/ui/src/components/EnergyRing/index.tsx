'use client';

import { useId } from 'react';
import { gradientStops, energyColor, energyLabel, zoneGradient } from '@lockin90/tokens';
import { useInView, useCountUp } from '../motion';
import { cn } from '../../cn';
import type { EnergyRingProps } from './types';

export type { EnergyRingProps };

const GLOW: Record<string, string> = {
  flux: 'rgba(124,92,255,0.5)',
  cta: 'rgba(124,92,255,0.5)',
  mint: 'rgba(52,245,197,0.5)',
  violet: 'rgba(110,123,255,0.5)',
  warm: 'rgba(255,77,109,0.45)',
};

/**
 * The signature energy ring — a gradient arc that draws to `score`/100 with the
 * number counting up, drawn when it scrolls into view. Reduced-motion safe.
 */
export default function EnergyRing({
  score = 72,
  size = 220,
  stroke,
  gradient = 'flux',
  sub = 'ENERGY',
  showZone = true,
  showValue = true,
  animate = true,
  className,
}: EnergyRingProps) {
  const sw = stroke ?? Math.max(6, Math.round(size * 0.07));
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score)) / 100;

  const gradName = gradient === 'zone' ? zoneGradient(score) : gradient;
  const stops = gradientStops[gradName];
  const glow = GLOW[gradName] ?? GLOW.flux;
  const zoneCol = energyColor(score);
  const zoneText = energyLabel(score);

  const uid = useId().replace(/:/g, '');
  const gradId = `lk-er-${uid}`;

  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 });
  const drawn = animate ? (inView ? pct : 0) : pct;
  const display = useCountUp(score, { start: !animate || inView, instant: !animate, durationMs: 1500 });

  return (
    <div ref={ref} className={cn('lk-ring', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            {stops.map((s, i) => (
              <stop key={i} offset={`${(i / (stops.length - 1)) * 100}%`} stopColor={s} />
            ))}
          </linearGradient>
        </defs>
        <circle className="lk-ring-track" cx={size / 2} cy={size / 2} r={r} strokeWidth={sw} />
        <circle
          className="lk-ring-arc"
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={sw}
          stroke={`url(#${gradId})`}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - drawn)}
          style={{
            filter: `drop-shadow(0 0 10px ${glow})`,
            transition: animate ? 'stroke-dashoffset 1.5s var(--ease)' : undefined,
          }}
        />
      </svg>

      {showValue && (
        <div className="lk-ring-center">
          <div className="lk-ring-num" style={{ fontSize: Math.round(size * 0.3) }}>
            {display}
          </div>
          {sub ? <div className="lk-eyebrow" style={{ marginTop: 6 }}>{sub}</div> : null}
          {showZone && (
            <div
              className="lk-mono"
              style={{
                marginTop: 3,
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: zoneCol,
              }}
            >
              {zoneText}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
