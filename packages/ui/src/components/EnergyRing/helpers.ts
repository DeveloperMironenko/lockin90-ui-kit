import { useState, useEffect } from 'react';

export function energyColor(score: number): string {
  if (score >= 67) return '#22C55E';
  if (score >= 34) return '#F59E0B';
  return '#FF1F1F';
}

export function energyGlow(score: number): string {
  if (score >= 67) return 'rgba(34,197,94,0.4)';
  if (score >= 34) return 'rgba(245,158,11,0.4)';
  return 'rgba(255,31,31,0.5)';
}

export function energyLabel(score: number): string {
  if (score >= 67) return 'HIGH';
  if (score >= 34) return 'MODERATE';
  return 'LOW';
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
