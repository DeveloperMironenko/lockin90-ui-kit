import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../cn';

export type ChipTone = 'default' | 'neutral' | 'high' | 'mid' | 'low' | 'accent';

export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: ChipTone;
  /** leading glowing dot in the current color */
  dot?: boolean;
}

const TONE: Record<ChipTone, string> = {
  default: '',
  neutral: 'lk-neutral',
  high: 'lk-high',
  mid: 'lk-mid',
  low: 'lk-low',
  accent: 'lk-accent',
};

/** Status pill — mono label, signal-colored tones. */
export const Chip = forwardRef<HTMLSpanElement, ChipProps>(function Chip(
  { tone = 'default', dot, className, ...rest },
  ref,
) {
  return <span ref={ref} className={cn('lk-chip', TONE[tone], dot && 'lk-dot', className)} {...rest} />;
});
