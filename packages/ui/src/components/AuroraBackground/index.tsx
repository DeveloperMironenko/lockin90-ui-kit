import { cn } from '../../cn';

export interface AuroraBackgroundProps {
  /** Also render the faint grid veil over the aurora (default true). */
  grid?: boolean;
  className?: string;
}

/**
 * Fixed, drifting energy-spectrum blobs that sit behind page content (pure CSS,
 * no JS). Drop once as the first child of your page/app shell; give your content
 * `position: relative; z-index: 1`. Reduced-motion freezes the drift.
 */
export default function AuroraBackground({ grid = true, className }: AuroraBackgroundProps) {
  return (
    <>
      <div className={cn('lk-aurora', className)} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      {grid && <div className="lk-grid-veil" aria-hidden="true" />}
    </>
  );
}
