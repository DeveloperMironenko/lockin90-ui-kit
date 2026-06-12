import { cn } from '../../cn';

export interface PulseProps {
  /** Status tone (default 'ok' = mint). */
  tone?: 'ok' | 'warn' | 'bad';
  /** Diameter in px (default 9). */
  size?: number;
  className?: string;
  'aria-label'?: string;
}

/** A live, breathing status dot. */
export default function Pulse({ tone = 'ok', size = 9, className, ...rest }: PulseProps) {
  return (
    <span
      className={cn('lk-pulse', tone === 'warn' && 'lk-warn', tone === 'bad' && 'lk-bad', className)}
      style={{ width: size, height: size }}
      aria-hidden={rest['aria-label'] ? undefined : true}
      {...rest}
    />
  );
}
