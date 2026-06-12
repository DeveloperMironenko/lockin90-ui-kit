import type { ReactNode } from 'react';
import Card from '../Card';
import { cn } from '../../cn';

export interface KpiCardProps {
  /** Small label in the top row. */
  label: ReactNode;
  /** The big tabular-number value. */
  value: ReactNode;
  /** Optional change indicator below the value. */
  delta?: ReactNode;
  /** Tint the delta green (up) or warm (down). */
  deltaDir?: 'up' | 'down';
  /** Optional icon shown on the right of the top row. */
  icon?: ReactNode;
  /** Optional footer area — pass a <SparkLine/> or <BarFill/> here. */
  footer?: ReactNode;
  /** Lift + glow on hover (forwarded to Card). */
  hover?: boolean;
  className?: string;
}

/** A metric tile: glass Card wrapping label + big value + delta + optional footer viz. */
export default function KpiCard({
  label,
  value,
  delta,
  deltaDir,
  icon,
  footer,
  hover = false,
  className,
}: KpiCardProps) {
  return (
    <Card hover={hover} className={cn('lk-stat', className)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="lk-stat-label">{label}</span>
        {icon}
      </div>
      <div className="lk-stat-value lk-tnum" style={{ marginTop: 8 }}>
        {value}
      </div>
      {delta != null && (
        <div className={cn('lk-stat-delta', deltaDir === 'up' && 'lk-up', deltaDir === 'down' && 'lk-down')}>
          {delta}
        </div>
      )}
      {footer}
    </Card>
  );
}
