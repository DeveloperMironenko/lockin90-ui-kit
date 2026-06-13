import type { ReactNode } from 'react';
import Card from '../Card';
import SparkLine from '../SparkLine';
import { cn } from '../../cn';

/** Back-compat object form of `delta`: a value plus its own direction tint. */
export interface KpiDelta {
  value: ReactNode;
  direction?: 'up' | 'down';
}

export interface KpiCardProps {
  /** Small label in the top row. */
  label: ReactNode;
  /** The big tabular-number value. */
  value: ReactNode;
  /**
   * Optional change indicator below the value. May be a node, or (back-compat)
   * an object `{ value, direction }` whose `direction` overrides `deltaDir`.
   */
  delta?: ReactNode | KpiDelta;
  /** Tint the delta green (up) or warm (down). */
  deltaDir?: 'up' | 'down';
  /** Optional icon shown on the right of the top row. */
  icon?: ReactNode;
  /** Optional footer area — pass a <SparkLine/> or <BarFill/> here. */
  footer?: ReactNode;
  /** Back-compat: series rendered as a <SparkLine/> footer viz. */
  spark?: number[];
  /** Lift + glow on hover (forwarded to Card). */
  hover?: boolean;
  /** Gradient hairline along the top edge (forwarded to Card's `lit`). */
  lit?: boolean;
  className?: string;
}

function isDeltaObject(d: ReactNode | KpiDelta): d is KpiDelta {
  return typeof d === 'object' && d !== null && 'value' in (d as object);
}

/** A metric tile: glass Card wrapping label + big value + delta + optional footer viz. */
export default function KpiCard({
  label,
  value,
  delta,
  deltaDir,
  icon,
  footer,
  spark,
  hover = false,
  lit = false,
  className,
}: KpiCardProps) {
  const deltaObj = delta != null && isDeltaObject(delta);
  const deltaNode: ReactNode = deltaObj ? (delta as KpiDelta).value : (delta as ReactNode);
  const dir = deltaObj ? (delta as KpiDelta).direction ?? deltaDir : deltaDir;

  return (
    <Card hover={hover} lit={lit} className={cn('lk-stat', className)}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="lk-stat-label">{label}</span>
        {icon}
      </div>
      <div className="lk-stat-value lk-tnum" style={{ marginTop: 8 }}>
        {value}
      </div>
      {deltaNode != null && (
        <div className={cn('lk-stat-delta', dir === 'up' && 'lk-up', dir === 'down' && 'lk-down')}>
          {deltaNode}
        </div>
      )}
      {spark && spark.length > 0 && <SparkLine data={spark} />}
      {footer}
    </Card>
  );
}
