import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';
import { Chip } from './Chip';

/** One frequency option in the pill group; exactly one should be `active`. */
export interface GoalFrequency {
  /** Pill label, e.g. "Every day". */
  label: ReactNode;
  /** Whether this option is the selected one. */
  active?: boolean;
}

export interface GoalSettingCardProps extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'onSelect'> {
  /** Card heading. */
  title?: ReactNode;
  /** Trailing status chip text (omit to hide). */
  badge?: ReactNode;
  /** Eyebrow above the metric name. */
  metricLabel?: ReactNode;
  /** The thing being targeted, e.g. "Sleep duration". */
  metric?: ReactNode;
  /** Big target value shown in the stepper readout. */
  value?: ReactNode;
  /** Small unit suffix after the value, e.g. "h". */
  unit?: ReactNode;
  /** Mono caption under the readout, e.g. "target · per night". */
  range?: ReactNode;
  /** Eyebrow above the frequency pills. */
  frequencyLabel?: ReactNode;
  /** Frequency pill options (one active). */
  frequencies?: GoalFrequency[];
  /** "Why it matters" hint body (rich node — may include <b>). */
  hint?: ReactNode;
  /** Submit button label. */
  submitLabel?: ReactNode;
  /** Skip link label (omit to hide). */
  skipLabel?: ReactNode;
  /** Decrement the target value. */
  onDecrement?: () => void;
  /** Increment the target value. */
  onIncrement?: () => void;
  /** Disable the decrement step (e.g. at the minimum). */
  decrementDisabled?: boolean;
  /** Disable the increment step (e.g. at the maximum). */
  incrementDisabled?: boolean;
  /** Fired with the pill index when a frequency is chosen. */
  onSelectFrequency?: (index: number, freq: GoalFrequency) => void;
  /** Fired when "Set goal" is pressed. */
  onSubmit?: () => void;
  /** Fired when the skip link is pressed. */
  onSkip?: () => void;
}

const DEFAULT_FREQUENCIES: GoalFrequency[] = [
  { label: 'Every day', active: true },
  { label: 'Weekdays' },
  { label: 'Custom' },
];

const DEFAULT_HINT: ReactNode = (
  <>
    Most people feel best at <b>7–9h</b>. We&apos;ll nudge you at wind-down and track it against your
    logged sleep.
  </>
);

/**
 * Goal-setting card — set a target: title + a −/value/+ stepper, a one-active
 * frequency pill group, a "why it matters" hint, a gradient "Set goal" button
 * and a skip link. Defaults to the design example ("Sleep duration · 7.5h").
 */
export function GoalSettingCard({
  title = 'New goal',
  badge = 'tracked',
  metricLabel = 'Goal · target value',
  metric = 'Sleep duration',
  value = '7.5',
  unit = 'h',
  range = 'target · per night',
  frequencyLabel = 'Frequency',
  frequencies = DEFAULT_FREQUENCIES,
  hint = DEFAULT_HINT,
  submitLabel = 'Set goal',
  skipLabel = 'Skip for now',
  onDecrement,
  onIncrement,
  decrementDisabled,
  incrementDisabled,
  onSelectFrequency,
  onSubmit,
  onSkip,
  className,
  ...rest
}: GoalSettingCardProps) {
  return (
    <section className={cn('lk-card', 'lk-lit', 'lk-goalset', className)} aria-label="Create a new goal" {...rest}>
      <div className="lk-goalset-head">
        <h3 className="lk-goalset-title lk-display">{title}</h3>
        {badge != null && (
          <Chip tone="accent" dot className="lk-goalset-badge">
            {badge}
          </Chip>
        )}
      </div>

      <span className="lk-goalset-label lk-mono">{metricLabel}</span>
      <div className="lk-goalset-metric">{metric}</div>

      <div className="lk-goalset-stepper" role="group" aria-label="Target value">
        <button
          type="button"
          className="lk-goalset-step"
          aria-label="Decrease"
          disabled={decrementDisabled}
          onClick={onDecrement}
        >
          <svg viewBox="0 0 24 24">
            <path d="M5 12h14" />
          </svg>
        </button>
        <div className="lk-goalset-readout">
          <span className="lk-mono lk-tnum lk-goalset-value">
            {value}
            {unit != null && <span className="lk-goalset-unit">{unit}</span>}
          </span>
          {range != null && <span className="lk-goalset-range">{range}</span>}
        </div>
        <button
          type="button"
          className="lk-goalset-step"
          aria-label="Increase"
          disabled={incrementDisabled}
          onClick={onIncrement}
        >
          <svg viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>

      <span className="lk-goalset-label lk-mono">{frequencyLabel}</span>
      <div className="lk-goalset-freq" role="group" aria-label="Frequency">
        {frequencies.map((freq, i) => (
          <button
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            type="button"
            className="lk-goalset-pill"
            aria-pressed={freq.active ?? false}
            onClick={() => onSelectFrequency?.(i, freq)}
          >
            {freq.label}
          </button>
        ))}
      </div>

      {hint != null && (
        <div className="lk-goalset-hint">
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8h.01M11 12h1v4h1" />
          </svg>
          <p>{hint}</p>
        </div>
      )}

      <div className="lk-goalset-foot">
        <button type="button" className="lk-btn lk-btn-primary lk-goalset-submit" onClick={onSubmit}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M5 13l4 4L19 7" />
          </svg>
          {submitLabel}
        </button>
        {skipLabel != null && (
          <button type="button" className="lk-goalset-skip" onClick={onSkip}>
            {skipLabel}
          </button>
        )}
      </div>
    </section>
  );
}
