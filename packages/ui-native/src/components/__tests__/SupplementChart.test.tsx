import { describe, expect, test } from 'vitest';
import { SupplementChart } from '../SupplementChart';
import { findAll, parse, render } from './markup';

/* `stack-levels` (SP-07) pill collision: each series gets an end-of-line chip
 * pill at its final level's y; overlapping pills are pushed apart top-down by
 * ≥ pill height (13) + 2 = 15 viewBox units and kept inside the plot
 * (PAD.t=16 … H−PAD.b=136, pill half-height 6.5 → centers in [22.5, 129.5]).
 * The zone band labels move to the LEFT edge because the right edge belongs
 * to the pills. Pill text y = pill center y + 2.8. */

const PILL_MIN_GAP = 15; // pillH 13 + 2
const Y_MIN = 16 + 13 / 2; // PAD.t + pillH/2 = 22.5
const Y_MAX = 150 - 14 - 13 / 2; // H − PAD.b − pillH/2 = 129.5

/** pill-center y for each named series pill, read from the rendered <text>. */
function pillCenters(html: string, names: string[]): number[] {
  const root = parse(html);
  return names.map((name) => {
    const el = findAll(root, (e) => e.tag === 'text' && e.text.trim() === name)[0];
    expect(el, `pill "${name}" not rendered`).toBeTruthy();
    return Number(el!.attrs.y) - 2.8;
  });
}

describe('SupplementChart stack-levels pill collision', () => {
  test('three series ending at the SAME level get pills pushed ≥15 units apart, inside the plot', () => {
    const html = render(SupplementChart, {
      variant: 'stack-levels' as const,
      series: [
        { name: 'AAA', levels: [0.5, 0.5, 0.5] },
        { name: 'BBB', levels: [0.5, 0.5, 0.5] },
        { name: 'CCC', levels: [0.5, 0.5, 0.5] },
      ],
    });
    const ys = pillCenters(html, ['AAA', 'BBB', 'CCC']).sort((a, b) => a - b);
    expect(ys[1] - ys[0]).toBeGreaterThanOrEqual(PILL_MIN_GAP);
    expect(ys[2] - ys[1]).toBeGreaterThanOrEqual(PILL_MIN_GAP);
    for (const y of ys) {
      expect(y).toBeGreaterThanOrEqual(Y_MIN);
      expect(y).toBeLessThanOrEqual(Y_MAX);
    }
  });

  test('pills colliding at the plot BOTTOM shift back up as a chain instead of running out', () => {
    const html = render(SupplementChart, {
      variant: 'stack-levels' as const,
      series: [
        { name: 'AAA', levels: [0.02, 0.02] },
        { name: 'BBB', levels: [0.02, 0.02] },
        { name: 'CCC', levels: [0.02, 0.02] },
      ],
    });
    const ys = pillCenters(html, ['AAA', 'BBB', 'CCC']).sort((a, b) => a - b);
    expect(ys[1] - ys[0]).toBeGreaterThanOrEqual(PILL_MIN_GAP);
    expect(ys[2] - ys[1]).toBeGreaterThanOrEqual(PILL_MIN_GAP);
    expect(ys[2]).toBeLessThanOrEqual(Y_MAX);
    expect(ys[0]).toBeGreaterThanOrEqual(Y_MIN);
  });

  test('zone band labels anchor LEFT (the right edge belongs to the pills)', () => {
    const html = render(SupplementChart, { variant: 'stack-levels' as const });
    const root = parse(html);
    for (const label of ['SATURATED', 'LOW']) {
      const el = findAll(root, (e) => e.tag === 'text' && e.text.trim() === label)[0];
      expect(el, `band label "${label}" not rendered`).toBeTruthy();
      expect(el!.attrs['text-anchor']).toBe('start');
      expect(Number(el!.attrs.x)).toBe(12); // PAD.l + 2
    }
  });
});
