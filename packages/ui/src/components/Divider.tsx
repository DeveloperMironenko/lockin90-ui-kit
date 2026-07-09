import { type HTMLAttributes } from 'react';
import { cn } from '../cn';

export interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  /** fade-to-transparent gradient rule */
  gradient?: boolean;
  /** centered label between two hairlines (the "or continue with" pattern) */
  label?: string;
}

/** Hairline divider. With `label`, renders `hairline — centered label — hairline`. */
export function Divider({ gradient, label, className, ...rest }: DividerProps) {
  if (label != null) {
    return (
      <div
        className={cn('lk-hr-labeled', className)}
        role="separator"
        aria-label={label}
        {...(rest as HTMLAttributes<HTMLDivElement>)}
      >
        <span className="lk-hr-line" aria-hidden="true" />
        <span className="lk-hr-label">{label}</span>
        <span className="lk-hr-line" aria-hidden="true" />
      </div>
    );
  }
  return <hr className={cn('lk-hr', gradient && 'lk-hr-grad', className)} {...rest} />;
}
