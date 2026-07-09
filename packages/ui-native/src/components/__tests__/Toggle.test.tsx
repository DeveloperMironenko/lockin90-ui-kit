import { describe, expect, test } from 'vitest';
import { Toggle } from '../Toggle';
import { findAll, inlineStyle, parse, render } from './markup';

/* Knob inset math: the track is border-box (1px border) and the knob is
 * absolutely positioned INSIDE the border with a `pad` inset, so the "on"
 * travel must subtract BOTH borders and BOTH pads:
 *   knobOffset = track − 2·border − knob − 2·pad
 * (md: 58−2−24−6 = 26 · sm: 44−2−20−6 = 16). Anything else either overshoots
 * into the border or leaves the knob short of the right pad. */

const SIZES = {
  md: { track: 58, knob: 24, pad: 3 },
  sm: { track: 44, knob: 20, pad: 3 },
} as const;
const BORDER = 1;

/** the knob element — the only element with an inline translateX transform */
function knobOf(html: string) {
  const root = parse(html);
  const knobs = findAll(root, (e) => (e.attrs.style ?? '').includes('translateX('));
  expect(knobs.length).toBe(1);
  return knobs[0];
}

describe('Toggle knob inset math', () => {
  for (const size of ['md', 'sm'] as const) {
    const { track, knob, pad } = SIZES[size];
    const expected = track - 2 * BORDER - knob - 2 * pad;

    test(`${size} checked: knob travels track − 2·border − knob − 2·pad = ${expected}px`, () => {
      const el = knobOf(render(Toggle, { checked: true, size }));
      const style = inlineStyle(el);
      expect(style.transform).toBe(`translateX(${expected}px)`);
      expect(style.left).toBe(`${pad}px`);
      expect(style.width).toBe(`${knob}px`);
      // end position is exactly the mirrored inset: border + pad off the right edge
      expect(BORDER + pad + expected + knob).toBe(track - BORDER - pad);
    });

    test(`${size} unchecked: knob rests at the left pad`, () => {
      const el = knobOf(render(Toggle, { checked: false, size }));
      const style = inlineStyle(el);
      expect(style.transform).toBe('translateX(0px)');
      expect(style.left).toBe(`${pad}px`);
    });
  }
});
