import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** lift + glow on hover */
  hover?: boolean;
  /** gradient hairline on the top edge */
  lit?: boolean;
  /** larger padding (shorthand for `pad="lg"`) */
  padLg?: boolean;
  /** padding size — overrides the default 22px */
  pad?: 'none' | 'sm' | 'md' | 'lg';
  /** drop the elevation shadow */
  flat?: boolean;
}

/** Glassmorphism panel — the base surface for everything. */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { hover, lit, padLg, pad, flat, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'lk-card',
        hover && 'lk-hover',
        lit && 'lk-lit',
        padLg && 'lk-pad-lg',
        pad && `lk-pad-${pad}`,
        flat && 'lk-flat',
        className,
      )}
      {...rest}
    />
  );
});
