import { useId, type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../cn';

export type PasswordStrengthScore = 0 | 1 | 2 | 3 | 4;

/** One line of the checklist under the meter; the app decides the rules and whether each is met. */
export interface PasswordRule {
  id: string;
  label: string;
  met: boolean;
}

interface PasswordStrengthMeterBaseProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** 0 = empty/weakest .. 4 = strongest */
  score: PasswordStrengthScore;
  /** override the derived label (default: 0/1='Weak', 2='Fair', 3='Good', 4='Strong') */
  label?: string;
  /** optional helper line shown under the meter */
  hint?: string;
  /** faint text before the tinted label (e.g. "Strength:") */
  labelPrefix?: string;
  /** the meter's screen-reader name (default: `Password strength: <label>`); pass a translated one */
  accessibleLabel?: string;
}

/** With `rules`, the met/unmet words read after each rule are required (no kit default is ever heard). */
type PasswordStrengthRulesProps =
  | {
      /** the checklist under the meter */
      rules: PasswordRule[];
      /** read right after a met rule's label, as given: include the leading punctuation and space
       *  (", done" / "，已满足"); visually hidden */
      metLabel: string;
      /** read right after an unmet rule's label, as given (", not yet"); visually hidden */
      unmetLabel: string;
    }
  | { rules?: undefined; metLabel?: string; unmetLabel?: string };

export type PasswordStrengthMeterProps = PasswordStrengthMeterBaseProps & PasswordStrengthRulesProps;

/** Number of equal segments rendered (the 4-segment model is shared web↔native). */
const SEGMENTS = 4;

/** Default label per score — 0 and 1 both read 'Weak'. */
const LABELS = ['Weak', 'Weak', 'Fair', 'Good', 'Strong'] as const;

/**
 * Color of the filled segments + label, keyed by score:
 * 1 = bad/red, 2 = warn/amber, 3 = cyan, 4 = mint/ok (score 0 falls back to bad;
 * its label is faint instead: nothing typed yet is not "weak").
 */
const SCORE_COLOR = ['var(--bad)', 'var(--bad)', 'var(--warn)', 'var(--cyan)', 'var(--ok)'] as const;

/**
 * PasswordStrengthMeter — a row of 4 equal segments that fill left→right up to
 * `score`, colored by strength (red → amber → cyan → mint), with a small label
 * (derived or overridden) tinted in the score color, an optional hint line and
 * an optional rule checklist.
 */
export function PasswordStrengthMeter({
  score,
  label,
  hint,
  labelPrefix,
  accessibleLabel,
  rules,
  metLabel,
  unmetLabel,
  className,
  style,
  ...rest
}: PasswordStrengthMeterProps) {
  const s = Math.max(0, Math.min(SEGMENTS, score)) as PasswordStrengthScore;
  const color = SCORE_COLOR[s];
  const text = label ?? LABELS[s];
  const hintId = useId();
  const level = <span className={cn('lk-pwstrength-label', s === 0 && 'is-empty')}>{text}</span>;

  return (
    <div
      className={cn('lk-pwstrength', className)}
      style={{ ['--pw-color']: color, ...style } as CSSProperties}
      {...rest}
    >
      {/* the segment row is the meter: a meter's children are presentational, so the label row and
          the list sit beside it; the hint describes it */}
      <div
        className="lk-pwstrength-bars"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={SEGMENTS}
        aria-valuenow={s}
        aria-label={accessibleLabel ?? `Password strength: ${text}`}
        aria-describedby={hint != null ? hintId : undefined}
      >
        {Array.from({ length: SEGMENTS }, (_, i) => (
          <i key={i} className={cn('lk-pwstrength-seg', i < s && 'is-on')} />
        ))}
      </div>
      <div className="lk-pwstrength-meta">
        {labelPrefix != null ? (
          <span className="lk-pwstrength-prefix">
            {labelPrefix} {level}
          </span>
        ) : (
          level
        )}
        {hint != null && (
          <span id={hintId} className="lk-pwstrength-hint">
            {hint}
          </span>
        )}
      </div>
      {rules?.length ? (
        // not aria-live: every keystroke would be announced; the meter's label is the summary
        <ul className="lk-pwstrength-rules">
          {rules.map((rule) => (
            <li key={rule.id} className={cn('lk-pwstrength-rule', rule.met && 'is-met')}>
              <span className="lk-pwstrength-tick" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M5 12l5 5L20 6" />
                </svg>
              </span>
              <span className="lk-pwstrength-rule-label">{rule.label}</span>
              <span className="lk-sr-only">{rule.met ? metLabel : unmetLabel}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
