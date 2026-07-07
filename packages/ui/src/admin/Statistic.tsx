import type { CSSProperties } from 'react';
import { cn } from '../cn';

/* Statistic — a borderless big-number block for use INSIDE a Panel (hero metric + supporting
   stats), distinct from StatCard which is a bordered card. Label (mono, faint) over a large
   display value, optional sub caption. Web-only. `lk-statistic*` classes. */

export type StatisticSize = 'md' | 'lg';
export type StatisticTone = 'default' | 'gradient' | 'mint';

export interface StatisticProps {
  /** Uppercase mono label, e.g. "MRR". */
  label: string;
  /** Pre-formatted value, e.g. "$48.2k" or "94%". */
  value: string;
  /** `lg` = hero (28px), `md` = supporting (20px). */
  size?: StatisticSize;
  /** Gradient (flux) or mint tint for the value; ignored when `valueColor` is set. */
  tone?: StatisticTone;
  /** Explicit value colour (overrides tone) — for computed/graded colours. */
  valueColor?: string;
  /** Optional caption under the value (mono, faint). */
  sub?: string;
  className?: string;
}

export function Statistic({ label, value, size = 'md', tone = 'default', valueColor, sub, className }: StatisticProps) {
  return (
    <div className={cn('lk-statistic', className)}>
      <span className="lk-statistic-label">{label}</span>
      <span
        className={cn(
          'lk-statistic-value',
          size === 'lg' && 'lk-statistic-value--lg',
          !valueColor && tone === 'gradient' && 'lk-statistic-value--gradient',
          !valueColor && tone === 'mint' && 'lk-statistic-value--mint',
        )}
        style={valueColor ? ({ color: valueColor } as CSSProperties) : undefined}
      >
        {value}
      </span>
      {sub != null && <span className="lk-statistic-sub">{sub}</span>}
    </div>
  );
}
