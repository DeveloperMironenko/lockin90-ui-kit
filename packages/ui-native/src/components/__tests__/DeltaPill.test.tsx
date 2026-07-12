/* DeltaPill (native) — sign inference, including the TRUE MINUS sign U+2212
   ('−4', the design's negative glyph): it must read as negative (energy tone
   → AMBER cost treatment), not lose its sign and paint the mint gain. */
import { describe, expect, test } from 'vitest';
import { DeltaPill } from '../DeltaPill';
import { findByText, hasDeclaration, parse, render, type El } from './markup';

/** The element carries the color, whether react-native-web serialized it as
 *  an atomic class or an inline style (dynamic style objects go inline). */
function carriesColor(el: El, rgb: string): boolean {
  return (el.attrs.style ?? '').includes(rgb) || hasDeclaration(el, rgb);
}

describe('DeltaPill sign inference', () => {
  test("true minus U+2212 '−4' infers down — energy tone paints AMBER, not mint", () => {
    const root = parse(render(DeltaPill, { value: '−4', tone: 'energy' }));
    const val = findByText(root, '−4')!;
    expect(val).toBeDefined();
    expect(carriesColor(val, '255,176,32')).toBe(true); // zoneMid amber
    expect(carriesColor(val, '52,245,197')).toBe(false); // NOT the mint gain
  });

  test("'+2' still infers up (mint gain)", () => {
    const root = parse(render(DeltaPill, { value: '+2', tone: 'energy' }));
    expect(carriesColor(findByText(root, '+2')!, '52,245,197')).toBe(true);
  });

  test("ASCII '-3' stays down (default tone → coral)", () => {
    const root = parse(render(DeltaPill, { value: '-3' }));
    expect(carriesColor(findByText(root, '-3')!, '255,77,109')).toBe(true); // zoneLow
  });
});
