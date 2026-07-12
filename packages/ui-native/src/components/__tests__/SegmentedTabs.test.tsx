/* SegmentedTabs (native) — the set-type COLOR tones (amber/cyan/violet/
   magenta, design `.sg`): label tinted at ALL times, NO leading dot, active
   segment painted tone@16% fill + tone@50% border; semantic tones (ok/canary/
   danger) keep the leading dot + active-only tint. Mirrors the web twin. */
import { describe, expect, test } from 'vitest';
import { SegmentedTabs, type SegmentedTabItem } from '../SegmentedTabs';
import { ancestors, findAll, findByText, hasDeclaration, parse, render, type El } from './markup';

/** The element carries the color, whether react-native-web serialized it as
 *  an atomic class or an inline style (dynamic style objects go inline). */
function carriesColor(el: El, rgb: string): boolean {
  return (el.attrs.style ?? '').includes(rgb) || hasDeclaration(el, rgb);
}

/** Elements whose INLINE style paints a background in the given rgb (the
 *  leading dot / active fill — both dynamic, so always inline). */
function bgWith(root: El, rgb: string): El[] {
  return findAll(root, (el) => (el.attrs.style ?? '').includes(`background-color:rgba(${rgb}`));
}

const tabs: SegmentedTabItem[] = [
  { label: 'Warm-up', tone: 'amber' },
  { label: 'Working', tone: 'cyan' },
  { label: 'OK', tone: 'ok' },
];

describe('SegmentedTabs color tones', () => {
  test('color-tone labels are tinted even when INACTIVE, and render NO dot', () => {
    const root = parse(render(SegmentedTabs, { tabs, active: 1 }));
    // inactive amber label still tinted warn (#FFB020)
    expect(carriesColor(findByText(root, 'Warm-up')!, '255,176,32')).toBe(true);
    // ... but there is no amber DOT anywhere (the 6px tone dot is skipped)
    expect(bgWith(root, '255,176,32').length).toBe(0);
    // semantic 'ok' keeps its mint dot even while inactive
    expect(bgWith(root, '52,245,197').length).toBe(1);
  });

  test('the ACTIVE color-tone segment paints tone@16% fill + tone@50% border', () => {
    const root = parse(render(SegmentedTabs, { tabs, active: 1 }));
    const label = findByText(root, 'Working')!;
    expect(carriesColor(label, '34,211,238')).toBe(true); // cyan label
    const tab = ancestors(label).find((a) => (a.attrs.style ?? '').includes('rgba(34,211,238,0.16'));
    expect(tab).toBeDefined(); // 16% fill
    expect((tab!.attrs.style ?? '').includes('rgba(34,211,238,0.5')).toBe(true); // 50% border
  });

  test('an INACTIVE color-tone segment has no fill/border paint', () => {
    const root = parse(render(SegmentedTabs, { tabs, active: 1 }));
    // amber is inactive — no 16% fill in amber anywhere
    expect(findAll(root, (el) => (el.attrs.style ?? '').includes('rgba(255,176,32,0.16')).length).toBe(0);
  });

  test('semantic tones keep the active-only label tint (inactive stays dim)', () => {
    const root = parse(render(SegmentedTabs, { tabs, active: 1 }));
    // 'ok' is inactive here — its label must NOT be mint-tinted
    expect(carriesColor(findByText(root, 'OK')!, '52,245,197')).toBe(false);
  });
});
