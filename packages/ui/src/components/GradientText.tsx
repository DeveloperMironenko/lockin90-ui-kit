import { type ElementType, type HTMLAttributes } from 'react';
import { cn } from '../cn';

export interface GradientTextProps extends HTMLAttributes<HTMLElement> {
  /** which gradient to clip the text to */
  gradient?: 'flux' | 'cta' | 'violet';
  /** element to render as (default `span`), e.g. `'h1'` for a gradient headline */
  as?: ElementType;
}

/** Energy-spectrum gradient-clipped, slowly-flowing text. */
export function GradientText({ gradient = 'flux', as: Tag = 'span', className, ...rest }: GradientTextProps) {
  return (
    <Tag
      className={cn('lk-gradient-text', gradient === 'cta' && 'lk-cta', gradient === 'violet' && 'lk-violet', className)}
      {...rest}
    />
  );
}
