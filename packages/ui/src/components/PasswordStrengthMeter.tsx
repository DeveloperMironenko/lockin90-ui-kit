import { type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../cn';

export type PasswordStrengthScore = 0 | 1 | 2 | 3 | 4;

export interface PasswordStrengthMeterProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** 0 = empty/weakest .. 4 = strongest */
  score: PasswordStrengthScore;
  /** override the derived label (default: 0/1='Weak', 2='Fair', 3='Good', 4='Strong') */
  label?: string;
  /** optional helper line shown under the meter */
  hint?: string;
}

/** Number of equal segments rendered (the 4-segment model is shared web↔native). */
const SEGMENTS = 4;

/** Default label per score — 0 and 1 both read 'Weak'. */
const LABELS = ['Weak', 'Weak', 'Fair', 'Good', 'Strong'] as const;

/**
 * Color of the filled segments + label, keyed by score:
 * 1 = bad/red, 2 = warn/amber, 3 = cyan, 4 = mint/ok (score 0 falls back to bad).
 */
const SCORE_COLOR = ['var(--bad)', 'var(--bad)', 'var(--warn)', 'var(--cyan)', 'var(--ok)'] as const;

/**
 * PasswordStrengthMeter — a row of 4 equal segments that fill left→right up to
 * `score`, colored by strength (red → amber → cyan → mint), with a small label
 * (derived or overridden) tinted in the score color and an optional hint line.
 */
export function PasswordStrengthMeter({
  score,
  label,
  hint,
  className,
  style,
  ...rest
}: PasswordStrengthMeterProps) {
  const s = Math.max(0, Math.min(SEGMENTS, score)) as PasswordStrengthScore;
  const color = SCORE_COLOR[s];
  const text = label ?? LABELS[s];

  return (
    <div
      className={cn('lk-pwstrength', className)}
      role="meter"
      aria-valuemin={0}
      aria-valuemax={SEGMENTS}
      aria-valuenow={s}
      aria-label={`Password strength: ${text}`}
      style={{ ['--pw-color']: color } as CSSProperties}
      {...rest}
    >
      <div className="lk-pwstrength-bars">
        {Array.from({ length: SEGMENTS }, (_, i) => (
          <i key={i} className={cn('lk-pwstrength-seg', i < s && 'is-on')} />
        ))}
      </div>
      <div className="lk-pwstrength-meta">
        <span className="lk-pwstrength-label">{text}</span>
        {hint != null && <span className="lk-pwstrength-hint">{hint}</span>}
      </div>
    </div>
  );
}
