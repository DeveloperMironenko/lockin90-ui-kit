import type { ReactNode } from 'react';
import BarFill from '../BarFill';
import { cn } from '../../cn';

export interface ProgressBarProps {
  /** Fill fraction, 0..1. */
  value: number;
  /** Optional eyebrow label on the left of the top row. */
  label?: ReactNode;
  /** Optional mono value on the right of the top row (e.g. "72%"). */
  valueLabel?: ReactNode;
  /** Forwarded to the BarFill — `accent` (default), `pos`, or `neg`. */
  tone?: 'accent' | 'pos' | 'neg';
  className?: string;
}

/**
 * A labelled BarFill row: an optional top row (label / value) above the bar.
 * Animation is delegated to BarFill (the client component), so this stays pure.
 */
export default function ProgressBar({ value, label, valueLabel, tone = 'accent', className }: ProgressBarProps) {
  const hasTop = label != null || valueLabel != null;
  return (
    <div className={cn('lk-progress', className)}>
      {hasTop && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
          {label != null ? <span className="lk-eyebrow">{label}</span> : <span />}
          {valueLabel != null && <span className="lk-mono lk-tnum">{valueLabel}</span>}
        </div>
      )}
      <BarFill value={value} tone={tone} />
    </div>
  );
}
