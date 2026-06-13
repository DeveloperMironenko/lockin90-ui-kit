import type { CSSProperties, ReactNode } from 'react';
import { cn } from '../../cn';

/** Back-compat color prop from the pre-Aurora kit (still used by the admin app). */
export type EyebrowColor = 'secondary' | 'accent' | 'muted';

export interface EyebrowProps {
  children: ReactNode;
  /** Optional label color — defaults to the eyebrow's own muted tone. */
  color?: EyebrowColor;
  className?: string;
}

const EYEBROW_COLOR: Record<EyebrowColor, string> = {
  secondary: 'var(--text-dim)',
  accent: 'var(--accent)',
  muted: 'var(--text-faint)',
};

/** Small mono, uppercase, tracked label that sits above a heading or section. */
export default function Eyebrow({ children, color, className }: EyebrowProps) {
  const style: CSSProperties | undefined = color ? { color: EYEBROW_COLOR[color] } : undefined;
  return (
    <span className={cn('lk-eyebrow', className)} style={style}>
      {children}
    </span>
  );
}
