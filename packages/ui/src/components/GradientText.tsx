import { type HTMLAttributes } from 'react';
import { cn } from '../cn';

export interface GradientTextProps extends HTMLAttributes<HTMLSpanElement> {
  /** which gradient to clip the text to */
  gradient?: 'flux' | 'cta' | 'violet';
}

/** Energy-spectrum gradient-clipped, slowly-flowing text. */
export function GradientText({ gradient = 'flux', className, ...rest }: GradientTextProps) {
  return (
    <span
      className={cn('lk-gradient-text', gradient === 'cta' && 'lk-cta', gradient === 'violet' && 'lk-violet', className)}
      {...rest}
    />
  );
}
