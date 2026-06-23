import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';

export interface StatProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  value: ReactNode;
  delta?: ReactNode;
  deltaDir?: 'up' | 'down';
  /** placeholder mode: renders an em-dash `—` in place of the value, suppresses
   *  the delta, and shows the optional `hint` instead. */
  empty?: boolean;
  /** small helper line shown in empty mode (e.g. "No data yet — connect a wearable"). */
  hint?: string;
}

/** Label + big display value + optional signed delta.
 *  In `empty` mode it shows an em-dash placeholder + an optional `hint`. */
export function Stat({ label, value, delta, deltaDir, empty, hint, className, ...rest }: StatProps) {
  if (empty) {
    return (
      <div className={cn('lk-stat lk-stat-empty', className)} {...rest}>
        <span className="lk-label">{label}</span>
        <span className="lk-value lk-display lk-tnum lk-stat-empty-value">—</span>
        {hint != null && <span className="lk-stat-hint">{hint}</span>}
      </div>
    );
  }
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
