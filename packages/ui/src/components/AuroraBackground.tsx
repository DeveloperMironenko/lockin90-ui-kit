import { type HTMLAttributes } from 'react';
import { cn } from '../cn';

export interface AuroraBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  /** Intensity of the drifting blobs + grid veil. Default `'default'`. */
  variant?: 'default' | 'subtle' | 'vivid';
  /** Overlay the faint masked grid veil. Default `true`. */
  grid?: boolean;
}

/**
 * Aurora Flux backdrop — drifting energy-spectrum gradient blobs (indigo →
 * cyan → magenta → mint) behind a static radial wash, with an optional faint
 * masked grid veil. An `aria-hidden`, `pointer-events: none`, low-z layer that
 * sits behind app content. Honors `prefers-reduced-motion` (blobs go static).
 *
 * Drop it in as the first child of the app/page shell (which should establish
 * its own stacking context / `position: relative; z-index: 1` for content).
 */
export function AuroraBackground({
  variant = 'default',
  grid = true,
  className,
  ...rest
}: AuroraBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'lk-aurora',
        variant === 'subtle' && 'lk-aurora-subtle',
        variant === 'vivid' && 'lk-aurora-vivid',
        className,
      )}
      {...rest}
    >
      <span className="lk-aurora-blob" />
      <span className="lk-aurora-blob" />
      <span className="lk-aurora-blob" />
      {grid && <div className="lk-aurora-grid" />}
    </div>
  );
}
