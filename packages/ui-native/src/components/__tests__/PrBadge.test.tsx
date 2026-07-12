/* PrBadge (native) — the solid red PR flag: PR-red fill, white mono label
   (uppercased), 4px radius, and the sm size. Mirrors the web twin. */
import { describe, expect, test } from 'vitest';
import { PrBadge, PR_RED } from '../PrBadge';
import { findByText, hasDeclaration, parse, render } from './markup';

describe('PrBadge', () => {
  test('renders the default PR label on the PR-red 4px-radius tab', () => {
    const root = parse(render(PrBadge, {}));
    const label = findByText(root, 'PR');
    expect(label).toBeDefined();
    expect(PR_RED).toBe('#FF4757');
    // the badge surface carries the red fill + the 4px radius
    const badge = label!.parent!;
    const carries = (decl: string) => (badge.attrs.style ?? '').includes(decl) || hasDeclaration(badge, decl);
    expect(carries('255,71,87')).toBe(true); // PR-red fill (rgb/rgba serialization-agnostic)
    // react-native-web expands borderRadius into per-corner longhands
    expect(carries('border-bottom-left-radius:4px')).toBe(true);
  });

  test('uppercases custom labels (PrCard state tags)', () => {
    const root = parse(render(PrBadge, { label: 'At Peak' }));
    expect(findByText(root, 'AT PEAK')).toBeDefined();
  });

  test('sm renders the tighter 8.5px label', () => {
    const root = parse(render(PrBadge, { size: 'sm' }));
    const label = findByText(root, 'PR');
    expect(label).toBeDefined();
    expect(hasDeclaration(label!, 'font-size:8.5px')).toBe(true);
  });
});
