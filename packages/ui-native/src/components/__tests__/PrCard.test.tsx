/* PrCard (native) — the red-hot treatment (new/atPeak: tinted border + red
   PrBadge tag), the quiet amber offPeak text tag, and the content lines.
   Mirrors the web twin. */
import { describe, expect, test } from 'vitest';
import { PrCard } from '../PrCard';
import { findAll, findByText, hasDeclaration, parse, render, type El } from './markup';

/** Any element whose classes or inline style carry the rgb triplet (colors
 *  live in react-native-web's atomic-class sheet, not the HTML). */
function anyWithColor(root: El, rgb: string): boolean {
  return findAll(root, (el) => (el.attrs.style ?? '').includes(rgb) || hasDeclaration(el, rgb)).length > 0;
}

describe('PrCard', () => {
  test('renders name, kind (uppercased), value, detail; no tag without state', () => {
    const root = parse(
      render(PrCard, { name: 'Back Squat', kind: 'Estimated 1RM', value: '130 kg', detail: 'today · +2kg' }),
    );
    expect(findByText(root, 'Back Squat')).toBeDefined();
    expect(findByText(root, 'ESTIMATED 1RM')).toBeDefined();
    expect(findByText(root, '130 kg')).toBeDefined();
    expect(findByText(root, 'today · +2kg')).toBeDefined();
    expect(findByText(root, 'NEW')).toBeUndefined();
    expect(findByText(root, 'OFF PEAK')).toBeUndefined();
  });

  test('new → red border treatment + NEW badge', () => {
    const root = parse(render(PrCard, { name: 'A', kind: '1RM', value: '130 kg', state: 'new' }));
    expect(findByText(root, 'NEW')).toBeDefined();
    expect(anyWithColor(root, '255,71,87')).toBe(true); // PR-red border/glow + badge fill
  });

  test('atPeak → AT PEAK badge', () => {
    const root = parse(render(PrCard, { name: 'A', kind: '1RM', value: '130 kg', state: 'atPeak' }));
    expect(findByText(root, 'AT PEAK')).toBeDefined();
  });

  test('offPeak → amber text tag, no red treatment', () => {
    const root = parse(render(PrCard, { name: 'A', kind: '1RM', value: '130 kg', state: 'offPeak' }));
    const tag = findByText(root, 'OFF PEAK');
    expect(tag).toBeDefined();
    expect(anyWithColor(root, '255,71,87')).toBe(false); // no PR-red anywhere
  });

  test('onPress renders a pressable card (button role)', () => {
    const html = render(PrCard, { name: 'A', kind: '1RM', value: '130 kg', onPress: () => {} });
    expect(html).toContain('role="button"');
  });
});
