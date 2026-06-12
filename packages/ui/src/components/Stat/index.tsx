import type { ReactNode } from 'react';
import { cn } from '../../cn';

export interface StatProps {
  /** Small label above the value. */
  label: ReactNode;
  /** The big tabular-number value. */
  value: ReactNode;
  /** Optional change indicator. */
  delta?: ReactNode;
  /** Tint the delta green (up) or warm (down). */
  deltaDir?: 'up' | 'down';
  className?: string;
}

/** The Aurora stat block — label / big value / delta. */
export default function Stat({ label, value, delta, deltaDir, className }: StatProps) {
  return (
    <div className={cn('lk-stat', className)}>
      <span className="lk-stat-label">{label}</span>
      <div className="lk-stat-value lk-tnum">{value}</div>
      {delta != null && (
        <div className={cn('lk-stat-delta', deltaDir === 'up' && 'lk-up', deltaDir === 'down' && 'lk-down')}>
          {delta}
        </div>
      )}
    </div>
  );
}
