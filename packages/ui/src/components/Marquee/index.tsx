import type { ReactNode, CSSProperties } from 'react';

export interface MarqueeProps {
  children: ReactNode;
  /** Seconds per full loop. Lower = faster. */
  speed?: number;
  /** Gap between items, in px. */
  gap?: number;
  className?: string;
}

/**
 * Infinite horizontal ticker — used for the trust / integrations band. The
 * children are duplicated for a seamless loop and the track pauses on hover.
 * Edges fade out via a mask. Respects reduced-motion (the keyframe is disabled).
 */
export default function Marquee({ children, speed = 30, gap = 48, className = '' }: MarqueeProps) {
  const groupStyle: CSSProperties = { display: 'flex', gap, alignItems: 'center', flexShrink: 0 };
  return (
    <div
      className={`overflow-hidden ${className}`.trim()}
      style={{
        maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
      }}
    >
      <div className="ea-marquee" style={{ display: 'flex', width: 'max-content', gap, animation: `ea-marquee ${speed}s linear infinite` }}>
        <div style={groupStyle}>{children}</div>
        <div style={groupStyle} aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}
