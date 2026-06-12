import type { CSSProperties, ReactNode } from 'react';
import { cn } from '../../cn';

export type StatusTone = 'ok' | 'warn' | 'bad';

export interface StatusBadgeProps {
  children: ReactNode;
  /** Status tone — drives both the pulse dot and the label color. */
  tone?: StatusTone;
  className?: string;
}

const LABEL_COLOR: Record<StatusTone, string> = {
  ok: 'var(--zone-high)',
  warn: 'var(--zone-mid)',
  bad: 'var(--zone-low)',
};

/** A breathing pulse dot paired with a mono status label, for live statuses. */
export default function StatusBadge({ children, tone = 'ok', className }: StatusBadgeProps) {
  const rowStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 7,
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: LABEL_COLOR[tone],
  };
  return (
    <span className={className} style={rowStyle} role="status">
      <span
        className={cn('lk-pulse', tone === 'warn' && 'lk-warn', tone === 'bad' && 'lk-bad')}
        style={{ width: 7, height: 7 }}
        aria-hidden
      />
      {children}
    </span>
  );
}
