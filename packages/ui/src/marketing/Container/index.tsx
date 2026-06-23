import type { ReactNode } from 'react';
import { cn } from '../../cn';

export interface ContainerProps {
  children: ReactNode;
  className?: string;
  /** Max-width preset. `prose` is narrow for long-form reading (legal, blog article). */
  size?: 'default' | 'prose' | 'wide';
}

const SIZE: Record<NonNullable<ContainerProps['size']>, string> = {
  default: 'lk-mk-container-default',
  prose: 'lk-mk-container-prose',
  wide: 'lk-mk-container-wide',
};

/** Centered, gutter-padded max-width wrapper for marketing sections. */
export function Container({ children, className, size = 'default' }: ContainerProps) {
  return <div className={cn('lk-mk-container', SIZE[size], className)}>{children}</div>;
}
