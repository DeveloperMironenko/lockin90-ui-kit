import type { ReactNode } from 'react';
import { cn } from '../../cn';

export interface PillProps {
  children: ReactNode;
  /** `accent` switches to the violet accent tone; `default` is neutral glass. */
  variant?: 'default' | 'accent';
  /** Leading glowing dot in the current color. */
  dot?: boolean;
  className?: string;
}

/** Small Aurora label pill for eyebrows / tags on the marketing surface. */
export function Pill({ children, variant = 'default', dot = false, className }: PillProps) {
  return (
    <span
      className={cn('lk-pill', variant === 'accent' && 'lk-accent', dot && 'lk-dot', className)}
    >
      {children}
    </span>
  );
}
