import { type HTMLAttributes } from 'react';
import { cn } from '../cn';
import { Icon } from './Icon';

export interface StepIndexProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** the step's number, shown while it isn't done */
  step: number;
  /** done: a mint check in place of the number (the onboarding Finish head) */
  done?: boolean;
}

/** The step number beside a step's title (design onboarding `.ob-index`): a CTA-gradient tile with
 *  the number, or a mint-tinted tile with a check once done. Decorative: the title says the step,
 *  so it is hidden from assistive tech. 44px, 38px on phones. */
export function StepIndex({ step, done, className, ...rest }: StepIndexProps) {
  return (
    <span
      aria-hidden="true"
      className={cn('lk-stepindex', done && 'lk-stepindex--done', className)}
      {...rest}
    >
      {done ? <Icon name="check" size={20} /> : step}
    </span>
  );
}
