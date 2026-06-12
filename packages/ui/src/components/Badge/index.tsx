import type { ReactNode } from 'react';
import { cn } from '../../cn';

export interface BadgeProps {
  children: ReactNode;
  className?: string;
}

/** Tiny mono, uppercase, tracked micro-label — lighter than a Chip. */
export default function Badge({ children, className }: BadgeProps) {
  return <span className={cn('lk-badge', className)}>{children}</span>;
}
