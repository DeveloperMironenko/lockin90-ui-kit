import type { ReactNode } from 'react';
import { cn } from '../../cn';

export interface CardProps {
  children: ReactNode;
  className?: string;
  /** Lift + border brighten on hover. */
  hover?: boolean;
  as?: 'div' | 'article' | 'li';
}

/** Marketing glass surface — the base panel for feature/pricing/testimonial blocks. */
export function Card({ children, className, hover = false, as = 'div' }: CardProps) {
  const Tag = as;
  return (
    <Tag className={cn('lk-card', 'lk-mk-card', hover && 'lk-hover', className)}>{children}</Tag>
  );
}
