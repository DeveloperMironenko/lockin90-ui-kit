import { type HTMLAttributes } from 'react';
import { cn } from '../cn';

export interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  /** fade-to-transparent gradient rule */
  gradient?: boolean;
}

/** Hairline divider. */
export function Divider({ gradient, className, ...rest }: DividerProps) {
  return <hr className={cn('lk-hr', gradient && 'lk-hr-grad', className)} {...rest} />;
}
