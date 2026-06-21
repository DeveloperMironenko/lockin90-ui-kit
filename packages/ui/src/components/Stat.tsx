import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';

export interface StatProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  value: ReactNode;
  delta?: ReactNode;
  deltaDir?: 'up' | 'down';
}

/** Label + big display value + optional signed delta. */
export function Stat({ label, value, delta, deltaDir, className, ...rest }: StatProps) {
  return (
    <div className={cn('lk-stat', className)} {...rest}>
      <span className="lk-label">{label}</span>
      <span className="lk-value lk-display lk-tnum">{value}</span>
      {delta != null && (
        <span className={cn('lk-delta lk-mono', deltaDir === 'up' && 'lk-up', deltaDir === 'down' && 'lk-down')}>{delta}</span>
      )}
    </div>
  );
}
