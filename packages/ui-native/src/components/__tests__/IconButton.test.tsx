import { describe, expect, test } from 'vitest';
import { IconButton } from '../IconButton';
import { findAll, hasDeclaration, inlineStyle, parse, render } from './markup';

/* One kit icon, no text: announced as a button by its required label; a 10-corner square at its size
   inside a touch target of at least 44. */
describe('IconButton', () => {
  const markup = (props: Partial<Parameters<typeof IconButton>[0]> = {}) =>
    parse(render(IconButton, { label: 'Change photo', icon: 'camera', ...props }));
  // the square: the one element with its side inline
  const square = (props: Partial<Parameters<typeof IconButton>[0]> = {}) =>
    findAll(markup(props), (el) => inlineStyle(el).width !== undefined)[0]!;

  test('is a button named by its label, which the rest props can’t replace', () => {
    const rest = { 'aria-label': '' } as object;
    const html = render(IconButton, { label: 'Change photo', icon: 'camera', ...rest });
    expect(html).toMatch(/role="button"/);
    expect(html).toMatch(/aria-label="Change photo"/);
  });

  test('md is a 44 square, sm a 36 one (the two control sizes), with a control’s 10 corners', () => {
    expect(inlineStyle(square())).toMatchObject({ width: '44px', height: '44px' });
    expect(inlineStyle(square({ size: 'sm' }))).toMatchObject({ width: '36px' });
    expect(hasDeclaration(square(), 'border-top-left-radius:10px')).toBe(true);
  });

  test('the touch target is at least 44 × 44', () => {
    const button = findAll(markup({ size: 'sm' }), (el) => el.attrs.role === 'button')[0]!;
    expect(hasDeclaration(button, 'min-width:44px')).toBe(true);
    expect(hasDeclaration(button, 'min-height:44px')).toBe(true);
  });

  test('draws the kit icon at 18, or 16 for sm', () => {
    expect(render(IconButton, { label: 'x', icon: 'camera' })).toMatch(/width="18"/);
    expect(render(IconButton, { label: 'x', icon: 'camera', size: 'sm' })).toMatch(/width="16"/);
  });

  test('half strength when disabled, full otherwise', () => {
    const dimmed = (props: Partial<Parameters<typeof IconButton>[0]>) =>
      findAll(markup(props), (el) => hasDeclaration(el, 'opacity:0.5')).length > 0;
    expect(dimmed({ disabled: true })).toBe(true);
    expect(dimmed({})).toBe(false);
  });
});
