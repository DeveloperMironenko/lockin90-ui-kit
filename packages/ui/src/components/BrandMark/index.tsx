import type { CSSProperties } from 'react';
import { cn } from '../../cn';

export interface BrandMarkProps {
  /** Wordmark font-size in px. Matches the native BrandMark `size` prop. */
  size?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * LockIn90 wordmark filled with the Aurora flux gradient (lime→mint→cyan→violet→
 * magenta), display font, 700. Identical look to the @lockin90/ui-native
 * BrandMark (SVG gradient-filled text) so web and native render the SAME logo.
 */
export default function BrandMark({ size = 20, className, style }: BrandMarkProps) {
  return (
    <span className={cn('lk-brandmark', className)} style={{ fontSize: size, ...style }}>
      LockIn90
    </span>
  );
}
