import { describe, expect, test } from 'vitest';
import { Select } from '../Select';
import { findByText, hasDeclaration, parse, render } from './markup';

const OPTIONS = [{ value: 'en', label: 'English' }];

/* As the web field: the value takes the row (left, after the icon); the small select hugs its content. */
describe('Select field', () => {
  test('the value fills the row in the standard field', () => {
    const value = findByText(parse(render(Select, { options: OPTIONS, value: 'en' })), 'English');
    expect(hasDeclaration(value!, 'flex:1')).toBe(true);
  });

  test('the small select keeps hugging its value', () => {
    const value = findByText(parse(render(Select, { options: OPTIONS, value: 'en', size: 'sm' })), 'English');
    expect(hasDeclaration(value!, 'flex:1')).toBe(false);
  });
});
