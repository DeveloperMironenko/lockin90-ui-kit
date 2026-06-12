import type { GradientName } from '@lockin90/tokens';

export interface EnergyRingProps {
  /** Energy score 0–100. */
  score?: number;
  /** Outer diameter in px (default 220). */
  size?: number;
  /** Arc stroke width. Defaults to ~7% of size. */
  stroke?: number;
  /** Gradient family, or 'zone' to pick mint/warm by score. */
  gradient?: GradientName | 'zone';
  /** Center number label below the score, e.g. "ENERGY · TODAY". '' / null hides it. */
  sub?: string | null;
  /** Render the HIGH/MODERATE/LOW zone word under the number. */
  showZone?: boolean;
  /** Hide the center number entirely (mini rings inside calendar cells). */
  showValue?: boolean;
  /** Animate the draw + count-up (default true; respects reduced motion). */
  animate?: boolean;
  className?: string;
}
