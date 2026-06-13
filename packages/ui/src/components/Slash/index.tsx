import type { CSSProperties } from 'react';
import { cn } from '../../cn';
import type { SlashProps } from './types';

export type { SlashProps } from './types';

/** A short tilted accent slash — a decorative separator glyph. */
export default function Slash({
  width = 80,
  thickness = 3,
  angle = -8,
  margin = '8px 0',
  className,
}: SlashProps) {
  const wrap: CSSProperties = {
    position: 'relative',
    overflow: 'visible',
    width,
    height: 4,
    margin,
  };
  const bar: CSSProperties = {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: thickness,
    transformOrigin: 'left center',
    transform: `translateY(-50%) rotate(${angle}deg)`,
    background: 'var(--accent)',
  };

  return (
    <div className={cn(className)} style={wrap} aria-hidden>
      <span style={bar} />
    </div>
  );
}
