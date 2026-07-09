import type { ReactNode } from 'react';
import { Chip } from '../../components/Chip';

export interface PillProps {
  children: ReactNode;
  /** `accent` switches to the violet accent tone; `default` is neutral glass. */
  variant?: 'default' | 'accent';
  /** Leading glowing dot in the current color. */
  dot?: boolean;
  className?: string;
}

/** Small Aurora label pill for eyebrows / tags on the marketing surface.
 *  A thin wrapper over the canonical cross-platform `Chip` (byte-identical
 *  `.lk-pill` ≡ `.lk-chip`); export + props kept for the marketing app. */
export function Pill({ children, variant = 'default', dot = false, className }: PillProps) {
  return (
    <Chip tone={variant === 'accent' ? 'accent' : 'default'} dot={dot} className={className}>
      {children}
    </Chip>
  );
}
