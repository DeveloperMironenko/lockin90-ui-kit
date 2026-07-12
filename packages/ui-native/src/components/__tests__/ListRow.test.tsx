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
