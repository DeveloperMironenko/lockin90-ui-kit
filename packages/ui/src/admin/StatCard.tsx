import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../cn';
import { MetricTile } from '../components/MetricTile';

/* StatCard — a KPI cell: uppercase label, big display value, a delta line, and a bottom
   "spark" fill bar. Now a thin wrapper over the canonical `MetricTile` (it owns the
   label / value / delta / spark skeleton; the `spark` accessory was added there). The
   KPI-cell chrome (opaque card, value tone, arrow line-delta) is re-applied via the
   `.lk-metric.lk-statcard` rules in statcard.css, so the wrapper is visually identical
   to the old StatCard. Export + types kept for back-compat. Web-only. */

export type StatDeltaDir = 'up' | 'down' | 'flat';
export type StatValueTone = 'default' | 'gradient' | 'mint';

export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Uppercase mono label, e.g. "Total users". */
  label: string;
  /** The big value — pre-formatted string, e.g. "12,480" or "$48,200" or "94%". */
  value: string;
  /** Tone for the value text: gradient (flux) or mint accent for signal, else plain. */
  valueTone?: StatValueTone;
  /** Explicit value colour (any CSS colour). Overrides `valueTone` — use for a computed,
   *  graded colour like an error-rate scale that shifts orange→red by magnitude. */
  valueColor?: string;
  /** Delta caption under the value, e.g. "312 7d" or "4.1% vs avg". */
  delta?: string;
  /** Direction — colours the delta (up=green, down=red, flat=faint) + prefixes ▲/▼. */
  deltaDir?: StatDeltaDir;
  /** Spark fill 0..1 — width of the bottom bar. Omit to hide the bar. */
  spark?: number;
  /** Override the spark bar fill (any CSS colour/gradient). Defaults to the flux gradient —
   *  set it to match a graded `valueColor` (e.g. the orange→red error-rate scale). */
  sparkColor?: string;
}

const ARROW: Record<StatDeltaDir, string> = { up: '▲', down: '▼', flat: '' };

/**
 * KPI stat cell. Renders label / value / delta / spark-bar inside a glass card. `valueTone`
 * highlights the number (gradient or mint); `spark` (0..1) fills the bottom bar.
 */
export function StatCard({
  label,
  value,
  valueTone = 'default',
  valueColor,
  delta,
  deltaDir = 'flat',
  spark,
  sparkColor,
  className,
  ...rest
}: StatCardProps) {
  // Value tone is applied via a nested span so MetricTile's plain value slot keeps
  // the flux gradient / mint / computed colour the old StatCard rendered.
  const valueNode: ReactNode = valueColor ? (
    <span style={{ color: valueColor } as CSSProperties}>{value}</span>
  ) : valueTone === 'gradient' ? (
    <span className="lk-statcard-value--gradient">{value}</span>
  ) : valueTone === 'mint' ? (
    <span className="lk-statcard-value--mint">{value}</span>
  ) : (
    value
  );

  const arrow = ARROW[deltaDir];
  const deltaStr = delta != null ? (arrow ? `${arrow} ${delta}` : delta) : undefined;

  return (
    <MetricTile
      className={cn('lk-statcard', className)}
      label={label}
      value={valueNode}
      delta={deltaStr}
      deltaTone={deltaDir}
      spark={spark != null ? [spark] : undefined}
      sparkColor={sparkColor}
      {...rest}
    />
  );
}
