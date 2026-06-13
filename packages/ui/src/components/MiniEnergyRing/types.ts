export interface MiniEnergyRingProps {
  /** Energy score 0–100 — shown in the center, drives the arc + zone color. */
  score: number;
  /** Outer diameter in px (default 56). */
  size?: number;
}
