import type { CSSProperties, HTMLAttributes } from 'react';
import { cn } from '../cn';

/* StatCard — a KPI cell: uppercase label, big display value, a delta line, and a bottom
   "spark" fill bar. Used in the operator overview stat row. Mirrors `.stat` / `.stat-cell`
   / `.barfill` from lockin90-design/admin/overview.html. Web-only. `lk-statcard*` classes. */

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
  return (
    <div className={cn('lk-statcard', className)} {...rest}>
      <span className="lk-statcard-label">{label}</span>
      <span
        className={cn(
          'lk-statcard-value',
          !valueColor && valueTone === 'gradient' && 'lk-statcard-value--gradient',
          !valueColor && valueTone === 'mint' && 'lk-statcard-value--mint',
        )}
        style={valueColor ? ({ color: valueColor } as CSSProperties) : undefined}
      >
        {value}
      </span>
      {delta != null && (
        <span className={cn('lk-statcard-delta', `lk-statcard-delta--${deltaDir}`)}>
          {ARROW[deltaDir] && <span aria-hidden>{ARROW[deltaDir]} </span>}
          {delta}
        </span>
      )}
      {spark != null && (
        <div className="lk-statcard-spark">
          <i
            style={{
              ['--v']: Math.max(0, Math.min(1, spark)),
              ...(sparkColor ? { background: sparkColor } : {}),
            } as CSSProperties}
          />
        </div>
      )}
    </div>
  );
}
