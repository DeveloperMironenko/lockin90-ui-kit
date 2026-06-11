import type { GradientName } from '@lockin90/tokens';

export interface EnergyRingProps {
  score: number;
  size?: number;
  animate?: boolean;
  /** Spectrum gradient for the arc. 'zone' picks the gradient by score band. */
  gradient?: GradientName | 'zone';
  /** Center label under the number. Defaults to 'ENERGY'. Pass '' to hide. */
  label?: string;
  /** Show the HIGH/MODERATE/LOW band sublabel. */
  showZone?: boolean;
}
