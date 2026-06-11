import { useState, useEffect } from 'react';
import { colors, type GradientName } from '@lockin90/tokens';

export function energyColor(score: number): string {
  if (score >= 67) return colors.zoneHigh;
  if (score >= 34) return colors.zoneMid;
  return colors.zoneLow;
}

export function energyGlow(score: number): string {
  if (score >= 67) return 'rgba(52,245,197,0.45)';
  if (score >= 34) return 'rgba(255,176,32,0.45)';
  return 'rgba(255,77,109,0.5)';
}

export function energyLabel(score: number): string {
  if (score >= 67) return 'HIGH';
  if (score >= 34) return 'MODERATE';
  return 'LOW';
}

/** Spectrum gradient to use when the ring is in `gradient="zone"` mode. */
export function zoneGradient(score: number): GradientName {
  if (score >= 67) return 'mint';
  return 'warm';
}

export function useCountUp(target: number, duration = 1200): number {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf: number;
    let start: number | null = null;
    const step = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / duration);
      setVal(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}
