import { type ElementType, type HTMLAttributes } from 'react';
import { cn } from '../cn';

export interface EyebrowProps extends HTMLAttributes<HTMLElement> {
  /** Element to render as (default `span`), e.g. `'h2'` for a section overline. */
  as?: ElementType;
}

/** Eyebrow — a mono, uppercase, letter-spaced overline label for section headers
 *  ("Generated · 6", "Targets"). Tiny presentational primitive. */
export function Eyebrow({ as: Tag = 'span', className, ...rest }: EyebrowProps) {
  return <Tag className={cn('lk-eyebrow', className)} {...rest} />;
}
