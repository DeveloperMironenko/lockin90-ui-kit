/* SessionBanner (native) — live dot + live-tinted status, stats capped at 3
   (labels uppercased), Button actions, and the header slots. Mirrors the
   web twin. (The dot's Animated pulse never runs under static markup —
   asserted by presence, like the other Animated components.) */
import { createElement } from 'react';
import { Text } from 'react-native';
import { describe, expect, test } from 'vitest';
import { SessionBanner } from '../SessionBanner';
import { ancestors, findAll, findByText, hasDeclaration, parse, render, type El } from './markup';

/** Any element whose classes or inline style carry the rgb triplet (colors
 *  live in react-native-web's atomic-class sheet, not the HTML). */
function anyWithColor(root: El, rgb: string): boolean {
  return findAll(root, (el) => (el.attrs.style ?? '').includes(rgb) || hasDeclaration(el, rgb)).length > 0;
}

describe('SessionBanner', () => {
  test('renders title, status, subtitle', () => {
    const root = parse(
      render(SessionBanner, { title: 'Push Day A', status: 'Live · 24:18', subtitle: 'Bench Press · set 2 of 5' }),
    );
    expect(findByText(root, 'Push Day A')).toBeDefined();
    expect(findByText(root, 'Live · 24:18')).toBeDefined();
    expect(findByText(root, 'Bench Press · set 2 of 5')).toBeDefined();
  });

  test('live shows the magenta dot + tints the status; off shows neither', () => {
    const live = parse(render(SessionBanner, { title: 'A', status: 'Live · 24:18', live: true }));
    expect(anyWithColor(live, '255,61,129')).toBe(true); // magenta dot + status tint
    const off = parse(render(SessionBanner, { title: 'A', status: 'Paused' }));
    expect(anyWithColor(off, '255,61,129')).toBe(false);
  });

  test('renders at most 3 stats, labels uppercased', () => {
    const root = parse(
      render(SessionBanner, {
        title: 'A',
        stats: [
          { value: '142', label: 'bpm' },
          { value: '12', label: 'sets' },
          { value: '8 400', label: 'kg vol' },
          { value: 'X', label: 'dropped' },
        ],
      }),
    );
    expect(findByText(root, '142')).toBeDefined();
    expect(findByText(root, 'BPM')).toBeDefined();
    expect(findByText(root, 'KG VOL')).toBeDefined();
    expect(findByText(root, 'DROPPED')).toBeUndefined();
    expect(findByText(root, 'X')).toBeUndefined();
  });

  test('actions render as kit Buttons; leading slot renders', () => {
    const root = parse(
      render(SessionBanner, {
        title: 'A',
        leading: createElement(Text, null, 'ICON'),
        actions: [
          { label: 'Resume', variant: 'primary' as const },
          { label: 'Discard' },
        ],
      }),
    );
    expect(findByText(root, 'Resume')).toBeDefined();
    expect(findByText(root, 'Discard')).toBeDefined();
    expect(findByText(root, 'ICON')).toBeDefined();
  });

  test('single-row: with no subtitle/stats the actions fold INLINE into the head row', () => {
    const root = parse(
      render(SessionBanner, {
        title: 'Push Day A',
        status: 'LIVE · 24:18',
        live: true,
        actions: [{ label: 'Finish', variant: 'primary' as const }],
      }),
    );
    const head = findByText(root, 'Push Day A')!.parent!; // the head row View
    const finish = findByText(root, 'Finish')!;
    expect(ancestors(finish)).toContain(head);
  });

  test('with stats present the actions keep their own row below', () => {
    const root = parse(
      render(SessionBanner, {
        title: 'Push Day A',
        stats: [{ value: '142', label: 'bpm' }],
        actions: [{ label: 'Finish' }],
      }),
    );
    const head = findByText(root, 'Push Day A')!.parent!;
    const finish = findByText(root, 'Finish')!;
    expect(finish).toBeDefined();
    expect(ancestors(finish)).not.toContain(head);
  });
});
