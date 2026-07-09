import { describe, expect, test } from 'vitest';
import { UnitChart } from '../UnitChart';
import { findAll, parse, render } from './markup';

/* `waffle-share` (UN-02) regression: the 10×10 grid used to be shifted +20
 * right of center, running its last columns UNDER the dot legend at x=226.
 * The grid must end clear of the legend: every cell's right edge < the
 * legend dots' left edge. */

describe('UnitChart waffle-share grid vs legend', () => {
  test('grid cell max-x stays left of the legend dot x', () => {
    const html = render(UnitChart, { variant: 'waffle-share' as const });
    const root = parse(html);

    const cells = findAll(root, (e) => e.tag === 'rect');
    expect(cells.length).toBe(100); // the full 10×10 grid
    const maxRight = Math.max(...cells.map((c) => Number(c.attrs.x) + Number(c.attrs.width)));

    const dots = findAll(root, (e) => e.tag === 'circle' && Number(e.attrs.r) === 4);
    expect(dots.length).toBe(3); // one legend dot per default segment
    const dotLeft = Math.min(...dots.map((d) => Number(d.attrs.cx) - Number(d.attrs.r)));

    expect(maxRight).toBeLessThan(dotLeft);
    // regression guard: keep real clearance, not a 1px squeak (was overlapping by ~18)
    expect(dotLeft - maxRight).toBeGreaterThanOrEqual(30);
  });

  test('custom segments keep the same grid geometry (partition only recolors cells)', () => {
    const html = render(UnitChart, {
      variant: 'waffle-share' as const,
      segments: [
        { label: 'DEEP', value: 70 },
        { label: 'LIGHT', value: 30 },
      ],
    });
    const root = parse(html);
    const cells = findAll(root, (e) => e.tag === 'rect');
    expect(cells.length).toBe(100);
    const maxRight = Math.max(...cells.map((c) => Number(c.attrs.x) + Number(c.attrs.width)));
    const dots = findAll(root, (e) => e.tag === 'circle' && Number(e.attrs.r) === 4);
    expect(dots.length).toBe(2);
    expect(maxRight).toBeLessThan(Math.min(...dots.map((d) => Number(d.attrs.cx) - 4)));
  });
});
