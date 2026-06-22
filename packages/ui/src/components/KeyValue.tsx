import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';

/** A single label↔value row in a {@link KeyValue} list. */
export interface KeyValueRow {
  key: string;
  value: ReactNode;
}

export interface KeyValueProps extends HTMLAttributes<HTMLDListElement> {
  /** The rows to render. Defaults to a few sample rows. */
  rows?: KeyValueRow[];
  /** 'spread' = key left / value right (default); 'inline' = key then value with a small gap. */
  align?: 'spread' | 'inline';
}

const DEFAULT_ROWS: KeyValueRow[] = [
  { key: 'Plan', value: 'Pro' },
  { key: 'MRR', value: '$29.00' },
  { key: 'Member since', value: 'Jan 2026' },
];

/** Definition list of key↔value rows — used in admin detail panels & settings. */
export const KeyValue = forwardRef<HTMLDListElement, KeyValueProps>(function KeyValue(
  { rows = DEFAULT_ROWS, align = 'spread', className, ...rest },
  ref,
) {
  return (
    <dl ref={ref} className={cn('lk-kv', `lk-kv-${align}`, className)} {...rest}>
      {rows.map((row, i) => (
        <div className="lk-kv-row" key={`${row.key}-${i}`}>
          <dt className="lk-kv-key">{row.key}</dt>
          <dd className="lk-kv-val">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
});

export type StatusDotTone = 'high' | 'mid' | 'low' | 'accent' | 'neutral';

export interface StatusDotProps extends HTMLAttributes<HTMLSpanElement> {
  /** Color of the dot. Defaults to 'high'. */
  tone?: StatusDotTone;
  /** Optional text rendered after the dot. */
  label?: string;
  /** Animated pulse glow. */
  pulse?: boolean;
}

const STATUSDOT_TONE: Record<StatusDotTone, string> = {
  high: 'lk-statusdot-high',
  mid: 'lk-statusdot-mid',
  low: 'lk-statusdot-low',
  accent: 'lk-statusdot-accent',
  neutral: 'lk-statusdot-neutral',
};

/** Tiny colored status indicator dot with optional label and pulse glow. */
export const StatusDot = forwardRef<HTMLSpanElement, StatusDotProps>(function StatusDot(
  { tone = 'high', label, pulse, className, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn('lk-statusdot', STATUSDOT_TONE[tone], pulse && 'lk-statusdot-pulse', className)}
      {...rest}
    >
      <span className="lk-statusdot-dot" aria-hidden="true" />
      {label != null && <span className="lk-statusdot-label">{label}</span>}
    </span>
  );
});
