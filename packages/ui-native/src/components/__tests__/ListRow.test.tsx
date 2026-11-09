/* ListRow (native) — `activeTint` overrides the ACTIVE-state background
   (design `.exl.on` cyan); default active keeps the accent tint. Mirrors the
   web twin's --lk-listrow-active-bg custom property. */
import { describe, expect, test } from 'vitest';
import { ListRow } from '../ListRow';
import { findAll, hasDeclaration, parse, render, type El } from './markup';

/** The element paints the background, whether react-native-web serialized it
 *  as an atomic class (registered style) or an inline style (dynamic tint). */
function paintsBg(el: El, rgba: string): boolean {
  return (el.attrs.style ?? '').includes(rgba) || hasDeclaration(el, `background-color:${rgba}`);
}

describe('ListRow activeTint', () => {
  test('active + activeTint paints the override instead of the accent tint', () => {
    const root = parse(
      render(ListRow, { title: 'Incline DB Press', active: true, activeTint: 'rgba(34,211,238,0.09)' }),
    );
    expect(findAll(root, (el) => paintsBg(el, 'rgba(34,211,238,0.09')).length).toBeGreaterThan(0);
    expect(findAll(root, (el) => paintsBg(el, 'rgba(124,92,255,0.14')).length).toBe(0);
  });

  test('active without a tint keeps the default accent fill', () => {
    const root = parse(render(ListRow, { title: 'Row', active: true }));
    expect(findAll(root, (el) => paintsBg(el, 'rgba(124,92,255,0.14')).length).toBeGreaterThan(0);
    expect(findAll(root, (el) => paintsBg(el, 'rgba(34,211,238,0.09')).length).toBe(0);
  });
});

describe('ListRow boxed', () => {
  test('a bordered glass box whose summary wraps', () => {
    const root = parse(render(ListRow, { title: 'Profile', subtitle: '32 yrs · male · 86 kg', boxed: true }));
    const row = root.children[0]!;
    expect(hasDeclaration(row, 'radius:16px')).toBe(true);
    const subtitle = findAll(root, (el) => el.text === '32 yrs · male · 86 kg')[0]!;
    expect(hasDeclaration(subtitle, 'font-size:13px')).toBe(true);
    // numberOfLines={1} is nowrap + ellipsis on react-native-web; a boxed summary wraps
    expect(hasDeclaration(subtitle, 'white-space:nowrap')).toBe(false);
    expect(hasDeclaration(subtitle, 'text-overflow:ellipsis')).toBe(false);
  });
});

/* `disabled` (docs/sdd/components/ListRow.md): shown but unavailable — dimmed and announced. */
describe('ListRow disabled', () => {
  test('a disabled row is announced unavailable, pressable or not, and dimmed', () => {
    const plain = render(ListRow, { title: 'Security', disabled: true });
    expect(plain).toContain('aria-disabled="true"');
    expect(plain).toContain('r-opacity');
    expect(render(ListRow, { title: 'Security', disabled: true, onPress: () => {} })).toContain(
      'aria-disabled="true"',
    );
  });

  test('a plain row is not', () => {
    expect(render(ListRow, { title: 'Security' })).not.toContain('aria-disabled');
  });
});
