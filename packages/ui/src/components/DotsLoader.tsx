import { type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../cn';

export interface DotsLoaderProps extends HTMLAttributes<HTMLSpanElement> {
  /** dot diameter in px */
  size?: number;
  /** dot color (any CSS color); defaults to the accent token */
  color?: string;
  /** number of dots */
  count?: number;
  /** gap between dots in px */
  gap?: number;
}

/**
 * Three (or `count`) small dots that pulse/bounce in a staggered sequence.
 * Used as a typing indicator (the AI coach composing) and as a generic inline
 * loading state. Pure CSS animation — holds static under prefers-reduced-motion.
 */
export function DotsLoader({
  size = 7,
  color,
  count = 3,
  gap,
  className,
  style,
  ...rest
}: DotsLoaderProps) {
  const n = Math.max(1, Math.floor(count));
  return (
    <span
      className={cn('lk-dots', className)}
      role="status"
      aria-label="Loading"
      style={
        {
          '--lk-dot-size': `${size}px`,
          ...(color ? { '--lk-dot-color': color } : null),
          ...(gap != null ? { '--lk-dot-gap': `${gap}px` } : null),
          ...style,
        } as CSSProperties
      }
      {...rest}
    >
      {Array.from({ length: n }, (_, i) => (
        // each dot is delayed by 0.16s × index for the staggered wave
        <i key={i} style={{ animationDelay: `${i * 0.16}s` } as CSSProperties} />
      ))}
    </span>
  );
}
