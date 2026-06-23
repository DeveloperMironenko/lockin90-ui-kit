import { cn } from '../../cn';

export interface StatProps {
  /** The headline figure, e.g. "90", "2.4×", "12k". */
  value: string;
  /** The caption beneath it. */
  label: string;
  className?: string;
}

/** A figure block — a big Aurora display number over a mono eyebrow label. */
export function Stat({ value, label, className }: StatProps) {
  return (
    <div className={cn('lk-mkt-stat', className)}>
      <div className="lk-mkt-stat-value lk-gradient-text">{value}</div>
      <div className="lk-mkt-stat-label">{label}</div>
    </div>
  );
}
