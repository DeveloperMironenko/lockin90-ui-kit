import { type HTMLAttributes, Fragment } from 'react';
import { cn } from '../cn';

export interface MuscleTagsProps extends HTMLAttributes<HTMLDivElement> {
  /** Primary muscles worked — bright + weight 600 (var(--text)). */
  primary?: string[];
  /** Secondary muscles worked — muted (var(--text-faint)). */
  secondary?: string[];
  /** Mono uppercase label above the list. */
  eyebrow?: string;
  /** `'text'` (default) flows one inline comma-separated sentence; `'chips'`
   *  renders each muscle as a pill in a flex-wrap row. */
  variant?: 'text' | 'chips';
  className?: string;
}

/** Inline muscles-worked list — primary muscles bright/bold, secondary muscles
 *  muted, all flowing as one comma-separated sentence (or as accent-tinted /
 *  plain pills in the `chips` variant), under a mono uppercase eyebrow. */
export function MuscleTags({
  primary = ['Pectoralis Major', 'Front Delts', 'Triceps'],
  secondary = ['Pectoralis Minor', 'Traps', 'Side Delts', 'Rotator Cuff'],
  eyebrow = 'Muscles',
  variant = 'text',
  className,
  ...rest
}: MuscleTagsProps) {
  const last = primary.length + secondary.length - 1;
  return (
    <div className={cn('lk-mtag', className)} {...rest}>
      {eyebrow ? <div className="lk-mtag-eyebrow">{eyebrow}</div> : null}
      {variant === 'chips' ? (
        <div className="lk-mtag-chips">
          {primary.map((m) => (
            <span key={m} className="lk-mtag-chip lk-mtag-chip-primary">
              {m}
            </span>
          ))}
          {secondary.map((m) => (
            <span key={m} className="lk-mtag-chip lk-mtag-chip-secondary">
              {m}
            </span>
          ))}
        </div>
      ) : (
        <p className="lk-mtag-text">
          {primary.map((m, i) => (
            <Fragment key={m}>
              <span className="lk-mtag-primary">{m}</span>
              {i < last ? ', ' : null}
            </Fragment>
          ))}
          {secondary.map((m, i) => (
            <Fragment key={m}>
              <span className="lk-mtag-secondary">{m}</span>
              {primary.length + i < last ? ', ' : null}
            </Fragment>
          ))}
        </p>
      )}
    </div>
  );
}
