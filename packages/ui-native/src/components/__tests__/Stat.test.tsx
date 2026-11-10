/* Stat (native) — `labelBelow`: the value over its label, centred (design mobile/account.html .ov-stat). */
import { describe, expect, test } from 'vitest';
import { Stat } from '../Stat';
import { hasDeclaration, parse, render } from './markup';

describe('Stat labelBelow', () => {
  test('puts only the label under the value, centred; the caption stays last', () => {
    const html = render(Stat, { label: 'Events', value: '12', size: 'sm', labelBelow: true, sub: 'this week' });
    const box = parse(html).children[0]!;
    expect(hasDeclaration(box, 'flex-direction:column-reverse')).toBe(false);
    expect(hasDeclaration(box, 'align-items:center')).toBe(true);
    expect(html.indexOf('12')).toBeLessThan(html.indexOf('Events'));
    expect(html.indexOf('Events')).toBeLessThan(html.indexOf('this week'));
  });

  test('keeps the label above without it', () => {
    const root = parse(render(Stat, { label: 'Events', value: '0', size: 'sm' }));
    expect(hasDeclaration(root.children[0]!, 'flex-direction:column-reverse')).toBe(false);
  });
});
