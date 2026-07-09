import { describe, expect, test } from 'vitest';
import { gradients } from '@lockin90/tokens';
import { GradientText, gradientTextStops } from '../GradientText';
import { render } from './markup';

/* Mirrored-spectrum stops: the animated fill scrolls a 2×-width gradient by
 * one width per loop, so its stop sequence must MIRROR back through the same
 * hues (…lime→…→magenta→…→lime…) — a plain tiled spectrum would jump
 * last-stop→first-stop (flux: magenta→lime) once per loop.
 *
 * NOTE on markup coverage: GradientText renders a hidden measurer <Text> first
 * and only draws the SVG after onLayout reports a size — onLayout never fires
 * under renderToStaticMarkup (and this workspace has no jsdom), so the <Stop>
 * elements are unreachable in static markup. The stop selection was therefore
 * extracted as the pure `gradientTextStops(stops, still)` helper (behavior
 * identical) and is asserted here at helper level. */

const FLUX: readonly string[] = gradients.flux.stops; // lime → mint → cyan → violet → magenta

describe('GradientText mirrored-spectrum stops', () => {
  test('still=true keeps the plain spectrum', () => {
    expect(gradientTextStops(FLUX, true)).toEqual([...FLUX]);
  });

  test('still=false mirrors the spectrum back (…→last→…→first)', () => {
    const stops = gradientTextStops(FLUX, false);
    const n = FLUX.length;
    expect(stops.length).toBe(2 * n - 1);
    // front half is the spectrum, back half retraces it
    expect(stops.slice(0, n)).toEqual([...FLUX]);
    for (let i = 0; i < n; i++) {
      expect(stops[n - 1 + i]).toBe(FLUX[n - 1 - i]);
    }
  });

  test('no hue jump anywhere in the loop (every step moves ≤1 stop; the seam repeats the first hue)', () => {
    const stops = gradientTextStops(FLUX, false);
    // tile it once, as the scrolling loop does, and check every adjacent pair
    const tiled = [...stops, ...stops];
    for (let i = 0; i < tiled.length - 1; i++) {
      const a = FLUX.indexOf(tiled[i]);
      const b = FLUX.indexOf(tiled[i + 1]);
      expect(a, `unknown stop ${tiled[i]}`).toBeGreaterThanOrEqual(0);
      expect(
        Math.abs(a - b),
        `hue jump ${tiled[i]} → ${tiled[i + 1]} at position ${i}`,
      ).toBeLessThanOrEqual(1);
    }
    // in particular the lime→magenta jump of a plain tile never occurs
    const last = FLUX[FLUX.length - 1];
    const first = FLUX[0];
    for (let i = 0; i < tiled.length - 1; i++) {
      expect([tiled[i], tiled[i + 1]]).not.toEqual([last, first]);
    }
  });

  test('two-stop gradients mirror to a 3-stop palindrome', () => {
    expect(gradientTextStops(gradients.cta.stops, false)).toEqual([
      gradients.cta.stops[0],
      gradients.cta.stops[1],
      gradients.cta.stops[0],
    ]);
  });

  test('SSR renders the measuring pass with the text content (pre-layout)', () => {
    const html = render(GradientText, { children: 'Energy', still: true });
    expect(html).toContain('Energy');
  });
});
