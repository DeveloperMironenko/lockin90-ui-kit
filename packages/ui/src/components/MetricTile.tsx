import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';

/* ── MetricTile ──────────────────────────────────────────────────────────── */

export type MetricDeltaTone = 'up' | 'down' | 'flat';

export interface MetricTileProps extends HTMLAttributes<HTMLDivElement> {
  /** mono uppercase caption above the value */
  label?: string;
  /** big display number */
  value?: ReactNode;
  /** small suffix after the value (e.g. '%', 'pts') */
  unit?: string;
  /** signed delta shown as a tone-colored pill (e.g. '+3') */
  delta?: string;
  /** colors the delta pill: up=mint, down=red, flat=faint */
  deltaTone?: MetricDeltaTone;
  /** faint icon in the top-right corner */
  icon?: ReactNode;
  /** placeholder mode: renders an em-dash `—` in place of the value, suppresses
   *  the unit + delta pill, and shows the optional `hint` instead. */
  empty?: boolean;
  /** small helper line shown in empty mode (e.g. "No data yet — connect a wearable"). */
  hint?: string;
}

/** A small KPI tile — glass card with a mono label, big display value + unit,
 *  and an optional tone-colored delta pill. In `empty` mode it shows an em-dash
 *  placeholder + an optional `hint`. */
export function MetricTile({
  label = 'Followers',
  value = '1.2k',
  unit,
  delta,
  deltaTone = 'flat',
  icon,
  empty,
  hint,
  className,
  ...rest
}: MetricTileProps) {
  if (empty) {
    return (
      <div className={cn('lk-metric lk-metric-empty', className)} {...rest}>
        <div className="lk-metric-top">
          <span className="lk-metric-label">{label}</span>
          {icon != null && <span className="lk-metric-icon">{icon}</span>}
        </div>
        <div className="lk-metric-body">
          <span className="lk-metric-value lk-tnum lk-metric-value-empty">—</span>
        </div>
        {hint != null && <span className="lk-metric-hint">{hint}</span>}
      </div>
    );
  }
  return (
    <div className={cn('lk-metric', className)} {...rest}>
      <div className="lk-metric-top">
        <span className="lk-metric-label">{label}</span>
        {icon != null && <span className="lk-metric-icon">{icon}</span>}
      </div>
      <div className="lk-metric-body">
        <span className="lk-metric-value lk-tnum">{value}</span>
        {unit != null && <span className="lk-metric-unit">{unit}</span>}
      </div>
      {delta != null && (
        <span className={cn('lk-metric-delta', `lk-metric-delta-${deltaTone}`)}>{delta}</span>
      )}
    </div>
  );
}

/* ── ProgressDots ────────────────────────────────────────────────────────── */

export interface ProgressDotsProps extends HTMLAttributes<HTMLDivElement> {
  /** number of segment dots */
  total?: number;
  /** how many dots are filled (clamped to 0…total) */
  filled?: number;
  /** color of the filled dots (any CSS color / token) */
  color?: string;
}

/** A row of segment dots showing progress (e.g. calibration day 5 of 14).
 *  Filled dots glow in `color`; the current dot reads slightly larger. */
export function ProgressDots({
  total = 14,
  filled = 5,
  color = 'var(--accent)',
  className,
  style,
  ...rest
}: ProgressDotsProps) {
  const count = Math.max(0, Math.floor(total));
  const done = Math.max(0, Math.min(count, Math.floor(filled)));
  const currentIndex = done - 1;

  return (
    <div
      className={cn('lk-dots', className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={count}
      aria-valuenow={done}
      style={{ ['--lk-dot-color' as string]: color, ...style }}
      {...rest}
    >
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={cn(
            'lk-pdot',
            i < done && 'lk-pdot-on',
            i === currentIndex && 'lk-pdot-now',
          )}
        />
      ))}
    </div>
  );
}
