'use client';

import type { CSSProperties } from 'react';
import { useInView } from '../motion';
import { cn } from '../../cn';

export interface BarFillProps {
  /** Fill fraction, 0..1. Clamped. */
  value: number;
  /** `accent` = default cta gradient, `pos` = mint, `neg` = warm. */
  tone?: 'accent' | 'pos' | 'neg';
  className?: string;
}

const clamp01 = (n: number): number => (n < 0 ? 0 : n > 1 ? 1 : n);

/**
 * Animated linear fill. Draws from 0 → `value` when it scrolls into view
 * (reduced-motion safe — `useInView` reports true immediately when unobservable).
 */
export default function BarFill({ value, tone = 'accent', className }: BarFillProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const v = inView ? clamp01(value) : 0;
  return (
    <div ref={ref} className={cn('lk-barfill', tone === 'pos' && 'lk-pos', tone === 'neg' && 'lk-neg', className)}>
      <i style={{ ['--v']: v } as CSSProperties} />
    </div>
  );
}
