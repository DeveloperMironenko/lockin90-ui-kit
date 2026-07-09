import type { CSSProperties, ReactNode } from 'react';
import { cn } from '../cn';

/* MetricRow — a label/value line for dense operator readouts (DB pool, jobs today, uptime,
   etc). Label sits left, value right in mono. Optional `valueColor` for a signal tint. Stack
   several inside a Panel body. Web-only. `lk-mrow*` classes (namespaced away from the root
   `MetricTile`, which owns `lk-metric*`). */

export interface MetricRowProps {
  /** Left-hand descriptor, e.g. "DB connections". */
  label: string;
  /** Right-hand value (mono). Accepts nodes for composite values. */
  value: ReactNode;
  /** Optional explicit colour for the value (signal tint). */
  valueColor?: string;
  className?: string;
}

/** One operator metric readout: label · value (mono, right-aligned). */
export function MetricRow({ label, value, valueColor, className }: MetricRowProps) {
  return (
    <div className={cn('lk-mrow', className)}>
      <span className="lk-mrow-label">{label}</span>
      <span className="lk-mrow-value" style={valueColor ? ({ color: valueColor } as CSSProperties) : undefined}>
        {value}
      </span>
    </div>
  );
}
