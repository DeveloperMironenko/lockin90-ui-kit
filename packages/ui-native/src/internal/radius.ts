/** The corner radius of a piece drawn `inset` in from a control's outer edge (border included), so its
 *  corners run parallel to the control's (CONVENTIONS "Corner radii"): `outer − inset`, never below 0. */
export function innerRadius(outer: number, inset: number): number {
  return Math.max(0, outer - inset);
}
