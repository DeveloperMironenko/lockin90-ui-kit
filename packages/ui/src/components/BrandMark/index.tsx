import type { CSSProperties } from 'react';
import { cn } from '../../cn';

/** Back-compat named sizes from the pre-Aurora kit (admin app), mapped to px. */
export type BrandMarkSize = number | 'sm' | 'md' | 'lg';

const NAMED_SIZE: Record<'sm' | 'md' | 'lg', number> = { sm: 18, md: 24, lg: 34 };

export interface BrandMarkProps {
  /** Wordmark font-size in px (a number), or a named size 'sm'|'md'|'lg'. */
  size?: BrandMarkSize;
  className?: string;
  style?: CSSProperties;
}

/**
 * LockIn90 wordmark filled with the Aurora flux gradient (lime→mint→cyan→violet→
 * magenta), display font, 700. Identical look to the @lockin90/ui-native
 * BrandMark (SVG gradient-filled text) so web and native render the SAME logo.
 */
export default function BrandMark({ size = 20, className, style }: BrandMarkProps) {
  const px = typeof size === 'number' ? size : NAMED_SIZE[size];
  return (
    <span className={cn('lk-brandmark', className)} style={{ fontSize: px, ...style }}>
      LockIn90
    </span>
  );
}
