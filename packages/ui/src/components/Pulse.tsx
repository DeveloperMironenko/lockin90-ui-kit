import { type HTMLAttributes } from 'react';
import { cn } from '../cn';

export interface PulseProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: 'ok' | 'warn' | 'bad';
}

/** Live, breathing status dot. */
export function Pulse({ tone = 'ok', className, ...rest }: PulseProps) {
  return <span className={cn('lk-pulse', tone === 'warn' && 'lk-warn', tone === 'bad' && 'lk-bad', className)} {...rest} />;
}
