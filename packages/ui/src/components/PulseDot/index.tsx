import Pulse from '../Pulse';

export type PulseDotTone = 'ok' | 'warn' | 'bad';

export interface PulseDotProps {
  /** Status tone (default `ok` = live/connected). */
  tone?: PulseDotTone;
  /** Diameter in px (default 9). */
  size?: number;
  className?: string;
  'aria-label'?: string;
}

/**
 * Animated status dot for live sync / active-connection indicators. Defaults to
 * a no-arg call (`<PulseDot />`); accepts `tone`/`size` like the Aurora `Pulse`.
 */
export default function PulseDot({ tone = 'ok', size = 9, className, ...rest }: PulseDotProps) {
  return <Pulse tone={tone} size={size} className={className} {...rest} />;
}
