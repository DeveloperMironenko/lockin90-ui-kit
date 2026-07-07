import type { HTMLAttributes } from 'react';
import { cn } from '../cn';

/* StatusChip — small mono signal chip. Tone maps to the zone palette; `dot` adds a glowing
   leading dot. Used for audit outcomes (ok/audit/deploy/danger), user status, etc. Mirrors
   `.chip` and its variants from the shared design tokens. Web-only. `lk-schip*` classes. */

export type StatusChipTone = 'neutral' | 'high' | 'mid' | 'low' | 'accent';

export interface StatusChipProps extends HTMLAttributes<HTMLSpanElement> {
  /** Colour tone. high=mint/ok, mid=amber/warn, low=red/danger, accent=indigo, neutral=grey. */
  tone?: StatusChipTone;
  /** Show a glowing leading dot in the current colour. */
  dot?: boolean;
}

const TONE_CLASS: Record<StatusChipTone, string> = {
  neutral: '',
  high: 'lk-schip--high',
  mid: 'lk-schip--mid',
  low: 'lk-schip--low',
  accent: 'lk-schip--accent',
};

/** Mono status chip. `tone` colours it; `dot` prepends a glowing dot. */
export function StatusChip({ tone = 'neutral', dot = false, className, children, ...rest }: StatusChipProps) {
  return (
    <span className={cn('lk-schip', TONE_CLASS[tone], dot && 'lk-schip--dot', className)} {...rest}>
      {children}
    </span>
  );
}
