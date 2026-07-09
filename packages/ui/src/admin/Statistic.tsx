import { cn } from '../cn';
import { Stat, type StatTone } from '../components/Stat';

/* Statistic — a borderless big-number block for use INSIDE a Panel (hero metric +
   supporting stats). Now a thin wrapper over the canonical root `Stat`: its `md`/`lg`
   sizes map to Stat's `sm`/`lg` (20/28px), and `tone`/`valueColor`/`sub` pass straight
   through. Export + types kept for back-compat. Web-only. */

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
    <Stat
      className={cn('lk-statistic', className)}
      label={label}
      value={value}
      size={size === 'lg' ? 'lg' : 'sm'}
      tone={tone as StatTone}
      valueColor={valueColor}
      sub={sub}
    />
  );
}
