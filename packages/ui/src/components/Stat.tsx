import { type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';

/** Value color treatment. `gradient` = flux gradient (static flux on the small/
 *  default sizes, animated full-spectrum on `hero`); `mint` = mint accent. */
export type StatTone = 'default' | 'gradient' | 'mint';
/** `md` (default, 30px) · `sm`/`lg` = compact/hero panel stats (20/28px, mirrors
 *  admin `Statistic`) · `hero` = oversized marketing figure with the label below. */
export type StatSize = 'sm' | 'md' | 'lg' | 'hero';

export interface StatProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  value: ReactNode;
  delta?: ReactNode;
  deltaDir?: 'up' | 'down';
  /** value color treatment (gradient / mint); ignored when `valueColor` is set. */
  tone?: StatTone;
  /** explicit value colour (overrides `tone`) — for computed/graded colours. */
  valueColor?: string;
  /** size scale (default `md`). */
  size?: StatSize;
  /** optional caption under the value (mono, faint). */
  sub?: ReactNode;
  /** placeholder mode: renders an em-dash `—` in place of the value, suppresses
   *  the delta, and shows the optional `hint` instead. */
  empty?: boolean;
  /** small helper line shown in empty mode (e.g. "No data yet — connect a wearable"). */
  hint?: string;
}

/** Label + big display value + optional signed delta.
 *  In `empty` mode it shows an em-dash placeholder + an optional `hint`. */
export function Stat({
  label,
  value,
  delta,
  deltaDir,
  tone = 'default',
  valueColor,
  size = 'md',
  sub,
  empty,
  hint,
  className,
  ...rest
}: StatProps) {
  const sizeClass = size !== 'md' && `lk-stat-${size}`;

  if (empty) {
    return (
      <div className={cn('lk-stat lk-stat-empty', sizeClass, className)} {...rest}>
        <span className="lk-label">{label}</span>
        <span className="lk-value lk-display lk-tnum lk-stat-empty-value">—</span>
        {hint != null && <span className="lk-stat-hint">{hint}</span>}
      </div>
    );
  }
  return (
    <div className={cn('lk-stat', sizeClass, className)} {...rest}>
      <span className="lk-label">{label}</span>
      <span
        className={cn(
          'lk-value lk-display lk-tnum',
          !valueColor && tone === 'gradient' && 'lk-stat-v-grad',
          !valueColor && tone === 'mint' && 'lk-stat-v-mint',
        )}
        style={valueColor ? ({ color: valueColor } as CSSProperties) : undefined}
      >
        {value}
      </span>
      {delta != null && (
        <span className={cn('lk-delta lk-mono', deltaDir === 'up' && 'lk-up', deltaDir === 'down' && 'lk-down')}>{delta}</span>
      )}
      {sub != null && <span className="lk-stat-sub">{sub}</span>}
    </div>
  );
}
