import type { CSSProperties } from 'react';
import { cn } from '../../cn';

export interface DividerProps {
  /** Fading center-weighted gradient rule instead of a flat hairline. */
  gradient?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** Horizontal rule — flat hairline or a fading gradient line. */
export default function Divider({ gradient = false, className, style }: DividerProps) {
  return <hr className={cn(gradient ? 'lk-hr-grad' : 'lk-hr', className)} style={style} />;
}
