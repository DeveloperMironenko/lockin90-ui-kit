import { type HTMLAttributes } from 'react';
import { cn } from '../cn';

export interface InstructionListProps extends HTMLAttributes<HTMLDivElement> {
  /** Small mono uppercase label above the heading. */
  eyebrow?: string;
  /** Bold sub-heading above the steps. */
  heading?: string;
  /** Ordered list of instruction steps. */
  steps?: string[];
  /** Label for the trailing "More…" link. */
  moreLabel?: string;
  /** Fired when the "More…" link is pressed. */
  onMore?: () => void;
}

const DEFAULT_STEPS: string[] = [
  'Lie flat on the bench with feet flat on the floor.',
  'Position yourself so eyes are directly under the bar.',
  'Grip the bar slightly wider than shoulder-width.',
];

/** Numbered instruction list — eyebrow + heading, counter-numbered steps, red "More…" link. */
export function InstructionList({
  eyebrow = 'Instructions',
  heading = 'Setup',
  steps = DEFAULT_STEPS,
  moreLabel = 'More…',
  onMore,
  className,
  ...rest
}: InstructionListProps) {
  return (
    <div className={cn('lk-instr', className)} {...rest}>
      {eyebrow && <div className="lk-instr-eyebrow">{eyebrow}</div>}
      <h4 className="lk-instr-heading">{heading}</h4>
      <ol className="lk-instr-steps">
        {steps.map((step, i) => (
          <li key={i} className="lk-instr-step">
            <span className="lk-instr-step-txt">{step}</span>
          </li>
        ))}
      </ol>
      <button type="button" className="lk-instr-more" onClick={onMore}>
        {moreLabel}
      </button>
    </div>
  );
}
