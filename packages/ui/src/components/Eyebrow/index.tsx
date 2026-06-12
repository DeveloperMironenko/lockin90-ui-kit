import type { ReactNode } from 'react';
import { cn } from '../../cn';

export interface EyebrowProps {
  children: ReactNode;
  className?: string;
}

/** Small mono, uppercase, tracked label that sits above a heading or section. */
export default function Eyebrow({ children, className }: EyebrowProps) {
  return <span className={cn('lk-eyebrow', className)}>{children}</span>;
}
