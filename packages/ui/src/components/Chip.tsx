import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../cn';

export type ChipTone = 'default' | 'neutral' | 'high' | 'mid' | 'low' | 'accent';
export type ChipSize = 'sm' | 'md';

export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: ChipTone;
  /** leading glowing dot in the current color */
  dot?: boolean;
  /** `md` (default) is the standard status pill; `sm` is the compact count/status
   *  badge — tighter box, 10px tabular mono, filled-gradient accent (the retired
   *  `Badge`). With `dot`, `sm` collapses to a bare glowing circle. */
  size?: ChipSize;
}

const TONE: Record<ChipTone, string> = {
  default: '',
  neutral: 'lk-neutral',
  high: 'lk-high',
  mid: 'lk-mid',
  low: 'lk-low',
  accent: 'lk-accent',
};

/** Status pill — mono label, signal-colored tones. `size="sm"` is the compact badge. */
export const Chip = forwardRef<HTMLSpanElement, ChipProps>(function Chip(
  { tone = 'default', dot, size = 'md', className, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn('lk-chip', size === 'sm' && 'lk-chip-sm', TONE[tone], dot && 'lk-dot', className)}
      {...rest}
    />
  );
});
