/** SegmentedTabs `fill`: the first whole-percent font scale (80–98) for a label wider than its segment.
 *  The text scales with the font, the padding doesn't, so only the text part counts. */
export function segFitPercent(clientWidth: number, scrollWidth: number, padding: number): number {
  const percent = Math.floor((100 * (clientWidth - padding)) / (scrollWidth - padding));
  return Math.min(98, Math.max(80, percent));
}
