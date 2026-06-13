import type { CSSProperties, ReactNode } from 'react';
import { cn } from '../../cn';

export type StatusTone = 'ok' | 'warn' | 'bad' | 'neutral' | 'info';

// Back-compat tone aliases from the pre-Aurora kit — the admin app still passes
// 'green'/'amber'/'red'/'neutral'/'info'. Accepted and normalized to the Aurora tones.
export type StatusToneCompat = StatusTone | 'green' | 'amber' | 'red';

export interface StatusBadgeProps {
  children: ReactNode;
  /** Status tone — drives both the pulse dot and the label color. */
  tone?: StatusToneCompat;
  /**
   * Back-compat (pre-Aurora): show the leading pulse dot. Defaults to `true`
   * to preserve current behavior; pass `false` to render label-only.
   */
  dot?: boolean;
  className?: string;
}

const NORMALIZE: Record<StatusToneCompat, StatusTone> = {
  ok: 'ok',
  warn: 'warn',
  bad: 'bad',
  neutral: 'neutral',
  info: 'info',
  green: 'ok',
  amber: 'warn',
  red: 'bad',
};

const LABEL_COLOR: Record<StatusTone, string> = {
  ok: 'var(--zone-high)',
  warn: 'var(--zone-mid)',
  bad: 'var(--zone-low)',
  neutral: 'var(--text-dim)',
  info: 'var(--info)',
};

/** A breathing pulse dot paired with a mono status label, for live statuses. */
export default function StatusBadge({ children, tone = 'ok', dot = true, className }: StatusBadgeProps) {
  const t = NORMALIZE[tone] ?? 'ok';
  const rowStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 7,
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: LABEL_COLOR[t],
  };
  return (
    <span className={className} style={rowStyle} role="status">
      {dot && (
        <span
          className={cn('lk-pulse', t === 'warn' && 'lk-warn', t === 'bad' && 'lk-bad')}
          style={{ width: 7, height: 7 }}
          aria-hidden
        />
      )}
      {children}
    </span>
  );
}
