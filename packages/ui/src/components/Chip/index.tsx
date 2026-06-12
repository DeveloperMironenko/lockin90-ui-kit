import type { ReactNode } from 'react';
import { cn } from '../../cn';

export type ChipTone = 'neutral' | 'high' | 'mid' | 'low' | 'accent';

export interface ChipProps {
  children: ReactNode;
  /** Signal tone — maps to the energy-zone / accent colors. */
  tone?: ChipTone;
  /** Leading glowing dot in the current color. */
  dot?: boolean;
  className?: string;
}

const TONE_CLASS: Record<ChipTone, string> = {
  neutral: '',
  high: 'lk-high',
  mid: 'lk-mid',
  low: 'lk-low',
  accent: 'lk-accent',
};

/** Aurora glass pill chip with an energy-zone signal color. */
export default function Chip({ children, tone = 'neutral', dot = false, className }: ChipProps) {
  return (
    <span className={cn('lk-chip', TONE_CLASS[tone], dot && 'lk-dot', className)}>{children}</span>
  );
}
