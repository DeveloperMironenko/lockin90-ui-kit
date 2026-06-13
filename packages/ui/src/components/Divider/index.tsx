import type { CSSProperties } from 'react';
import { cn } from '../../cn';

export interface DividerProps {
  /** Fading center-weighted gradient rule instead of a flat hairline. */
  gradient?: boolean;
  /** Back-compat (pre-Aurora): 'strong' uses a stronger border color (admin app). */
  strength?: 'default' | 'strong';
  className?: string;
  style?: CSSProperties;
}

/** Horizontal rule — flat hairline or a fading gradient line. */
export default function Divider({ gradient = false, strength = 'default', className, style }: DividerProps) {
  const merged: CSSProperties | undefined =
    strength === 'strong' ? { borderColor: 'var(--border-2)', ...style } : style;
  return <hr className={cn(gradient ? 'lk-hr-grad' : 'lk-hr', className)} style={merged} />;
}
