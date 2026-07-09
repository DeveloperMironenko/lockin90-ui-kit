import { Stat as RootStat } from '../../components/Stat';

export interface StatProps {
  /** The headline figure, e.g. "90", "2.4×", "12k". */
  value: string;
  /** The caption beneath it. */
  label: string;
  className?: string;
}

/** A figure block — a big Aurora display number over a mono eyebrow label.
 *  A thin wrapper over the canonical root `Stat` at its `hero` size with the flux
 *  gradient value; export + props kept for the marketing app. */
export function Stat({ value, label, className }: StatProps) {
  return <RootStat className={className} value={value} label={label} size="hero" tone="gradient" />;
}
