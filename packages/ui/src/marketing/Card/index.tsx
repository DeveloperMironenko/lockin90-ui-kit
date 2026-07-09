import type { ReactNode } from 'react';
import { cn } from '../../cn';
import { Card as RootCard } from '../../components/Card';

export interface CardProps {
  children: ReactNode;
  className?: string;
  /** Lift + border brighten on hover. */
  hover?: boolean;
  as?: 'div' | 'article' | 'li';
}

/** Marketing glass surface — a thin wrapper over the canonical root `Card` (the
 *  polymorphic `as` lives there now) with the roomier marketing padding scale
 *  (`.lk-mk-card`). Export + props kept for the marketing app. */
export function Card({ children, className, hover = false, as = 'div' }: CardProps) {
  return (
    <RootCard as={as} hover={hover} className={cn('lk-mk-card', className)}>
      {children}
    </RootCard>
  );
}
