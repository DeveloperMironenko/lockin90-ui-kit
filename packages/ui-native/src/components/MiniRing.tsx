import { Fragment } from 'react';
import { Ring, type RingProps } from './Ring';

export type MiniRingProps = RingProps;

/** MiniRing — a compact `Ring` preset for dense grids (e.g. the calendar month
 *  grid of daily energy rings). Same prop API as `Ring`; smaller/thinner defaults
 *  with glow off (glow reads as noise at this size). The arc + zone colour carry
 *  the value, so the big default centre number is suppressed — pass `children`
 *  (e.g. a small day number) if you want a centre readout. The web twin of native. */
export function MiniRing({ size = 34, thickness = 4, glow = false, children, ...rest }: MiniRingProps) {
  return (
    <Ring size={size} thickness={thickness} glow={glow} {...rest}>
      {children ?? <Fragment />}
    </Ring>
  );
}
