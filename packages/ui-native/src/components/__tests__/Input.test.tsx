/* Input (native) — the `numeral` variant added for the edit-set weight/reps
   readout (design `.strow .sv`): 20px bold display-font, centered, with the
   unit suffix styled as a smaller dim companion instead of the default mono
   far-right suffix. */
import { describe, expect, test } from 'vitest';
import { Input } from '../Input';
import { findAll, hasDeclaration, parse, render } from './markup';

describe('Input variant', () => {
  test("variant='numeral' centers a 20px bold display-font value", () => {
    const root = parse(render(Input, { variant: 'numeral', value: '120', unit: 'kg' }));
    const field = findAll(root, (el) => el.tag === 'input')[0];
    expect(field).toBeDefined();
    expect(hasDeclaration(field, 'font-size:20px')).toBe(true);
    expect(hasDeclaration(field, 'font-weight:700')).toBe(true);
    expect(hasDeclaration(field, 'text-align:center')).toBe(true);
  });

  test('default variant does NOT carry the numeral font size', () => {
    const root = parse(render(Input, { value: '120' }));
    const field = findAll(root, (el) => el.tag === 'input')[0];
    expect(field).toBeDefined();
    expect(hasDeclaration(field, 'font-size:20px')).toBe(false);
  });

  test("variant='numeral' still renders the unit suffix text", () => {
    const html = render(Input, { variant: 'numeral', value: '120', unit: 'kg' });
    expect(html).toContain('kg');
  });
});
