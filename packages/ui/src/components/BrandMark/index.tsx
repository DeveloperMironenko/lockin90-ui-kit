import type { CSSProperties } from 'react';
import { cn } from '../../cn';

export interface BrandMarkProps {
  /** Wordmark font-size in px. Matches the native BrandMark `size` prop. */
  size?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * LockIn90 wordmark — "LockIn" in --text, "90" in --accent-3 (mint), display
 * font, 700. Pixel-identical to the @lockin90/ui-native BrandMark so web and
 * native render the SAME brand mark (no divergent logo).
 */
export default function BrandMark({ size = 20, className, style }: BrandMarkProps) {
  return (
    <span className={cn('lk-brandmark', className)} style={{ fontSize: size, ...style }}>
      LockIn<span className="lk-brandmark-accent">90</span>
    </span>
  );
}
