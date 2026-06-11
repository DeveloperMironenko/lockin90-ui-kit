'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';

export type BarFillTone = 'cta' | 'mint' | 'warm' | 'violet';

export interface BarFillProps {
  /** Fill fraction, 0..1. */
  value: number;
  /** Spectrum gradient used for the fill. */
  tone?: BarFillTone;
  /** Track height in px. */
  height?: number;
  /** Fill immediately instead of animating in on scroll. */
  immediate?: boolean;
  className?: string;
}

const GRAD: Record<BarFillTone, string> = {
  cta: 'var(--grad-cta)',
  mint: 'var(--grad-mint)',
  warm: 'var(--grad-warm)',
  violet: 'var(--grad-violet)',
};

/** Spectrum progress bar that fills (width tween) when it scrolls into view. */
export default function BarFill({
  value,
  tone = 'cta',
  height = 8,
  immediate = false,
  className = '',
}: BarFillProps) {
  const [filled, setFilled] = useState(immediate);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (immediate) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setFilled(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFilled(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [immediate]);

  const v = Math.max(0, Math.min(1, value));

  return (
    <span
      ref={ref}
      className={`ea-barfill ${className}`.trim()}
      style={{ height }}
      data-filled={filled}
      role="progressbar"
      aria-valuenow={Math.round(v * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <i style={{ '--v': v, background: GRAD[tone] } as CSSProperties} />
    </span>
  );
}
