'use client';

import { useInView, useCountUp } from '../motion';
import { cn } from '../../cn';

export interface CountUpProps {
  /** Target number to count up to. */
  value: number;
  decimals?: number;
  comma?: boolean;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
  /** Start immediately instead of when scrolled into view. */
  immediate?: boolean;
  className?: string;
}

/**
 * Tabular-number that animates 0 → `value` when it scrolls into view (or
 * immediately). Reduced-motion safe (renders the final value).
 */
export default function CountUp({
  value,
  decimals = 0,
  comma = false,
  prefix = '',
  suffix = '',
  durationMs = 1400,
  immediate = false,
  className,
}: CountUpProps) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const display = useCountUp(value, {
    decimals,
    comma,
    prefix,
    suffix,
    durationMs,
    start: immediate || inView,
  });
  return (
    <span ref={ref} className={cn('lk-tnum', className)}>
      {display}
    </span>
  );
}
