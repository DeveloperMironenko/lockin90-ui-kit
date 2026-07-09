/* UnitChart `waffle-share` (UN-02) legend-overlap regression: the 10×10 grid's
   right edge must stay LEFT of the dot legend (dots at cx = 226) — the old
   +20 right-shift ran the last grid columns under the legend. Asserted from
   the rendered markup: max(rect.x + rect.width) of the grid cells vs the
   legend circles' left edge. */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { UnitChart } from './UnitChart';

describe('UnitChart waffle-share grid vs legend', () => {
  const html = renderToStaticMarkup(<UnitChart variant="waffle-share" />);

  it('renders the full 10×10 grid and one legend dot per segment', () => {
    const rects = [...html.matchAll(/<rect [^>]*x="([\d.-]+)"[^>]*width="([\d.-]+)"/g)];
    const dots = [...html.matchAll(/<circle cx="([\d.-]+)" cy="[\d.-]+" r="4"/g)];
    expect(rects.length).toBe(100);
    expect(dots.length).toBe(3); // GOOD / OK / ROUGH
  });

  it("grid cells' max right edge stays left of the legend dots", () => {
    const rects = [...html.matchAll(/<rect [^>]*x="([\d.-]+)"[^>]*width="([\d.-]+)"/g)];
    const maxRight = Math.max(...rects.map((m) => Number(m[1]) + Number(m[2])));

    const dots = [...html.matchAll(/<circle cx="([\d.-]+)" cy="[\d.-]+" r="4"/g)];
    const legendLeft = Math.min(...dots.map((m) => Number(m[1]) - 4)); // cx − r

    expect(maxRight).toBeLessThan(legendLeft);
  });
});
