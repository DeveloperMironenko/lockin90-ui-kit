import type { ElementType, ReactNode } from 'react';
import { cn } from '../../cn';

export interface GradientTextProps {
  children: ReactNode;
  /** Gradient family — 'flux' (full spectrum), 'cta' (violet→cyan), 'violet'. */
  gradient?: 'flux' | 'cta' | 'violet';
  as?: ElementType;
  className?: string;
}

/**
 * Animated energy-spectrum gradient text — for big numbers and hero words.
 * Clips the flowing gradient to the glyphs.
 */
export default function GradientText({
  children,
  gradient = 'flux',
  as,
  className,
}: GradientTextProps) {
  const Tag = (as ?? 'span') as ElementType;
  return (
    <Tag
      className={cn(
        'lk-gradient-text',
        gradient === 'cta' && 'lk-cta',
        gradient === 'violet' && 'lk-violet',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
