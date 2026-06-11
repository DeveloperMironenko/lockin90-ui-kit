export interface AuroraBackgroundProps {
  /** Also render the subtle moving grid veil over the blobs. */
  grid?: boolean;
  className?: string;
}

/**
 * Fixed, full-viewport energy-spectrum aurora — three drifting blurred blobs
 * (violet / cyan / magenta) behind all content. Render once as the first child
 * of the app shell; it's `position: fixed` and `pointer-events: none`. Put your
 * content in a `position: relative; z-index: 1` container above it.
 */
export default function AuroraBackground({ grid = false, className = '' }: AuroraBackgroundProps) {
  return (
    <>
      <div className={`ea-aurora ${className}`.trim()} aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      {grid && <div className="ea-grid-veil" aria-hidden="true" />}
    </>
  );
}
