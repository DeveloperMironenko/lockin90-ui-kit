import { describe, expect, test } from 'vitest';
import { CodeInput, codeToBoxes, spreadDigits, typeIntoBox } from '../TagInput';
import { findAll, parse, render } from './markup';

/* Multi-char paste / iOS SMS autofill lands the whole code in ONE box; the component spreads it
 * across the remaining boxes and moves focus after the last written digit. The box math lives in
 * the pure helpers `codeToBoxes` / `spreadDigits` (press/typing events can't be dispatched without a
 * DOM environment). */

describe('codeToBoxes', () => {
  test('puts one digit per box, padded to the length', () => {
    expect(codeToBoxes('12', 4)).toEqual(['1', '2', '', '']);
  });

  test('drops non-digits and anything past the last box', () => {
    expect(codeToBoxes('1a2-345', 4)).toEqual(['1', '2', '3', '4']);
  });
});

describe('spreadDigits (paste / autofill)', () => {
  test('a full-length paste into box 0 fills every box and focuses the last', () => {
    expect(spreadDigits(['', '', '', '', '', ''], 0, '123456')).toEqual({
      boxes: ['1', '2', '3', '4', '5', '6'],
      focusIndex: 5,
    });
  });

  test('takes only the digits of a copied "Code: 1234-5678"', () => {
    expect(spreadDigits(Array(8).fill(''), 0, 'Code: 1234-5678').boxes).toEqual([
      '1', '2', '3', '4', '5', '6', '7', '8',
    ]);
  });

  test('keeps earlier boxes, and a gap stays a gap', () => {
    expect(spreadDigits(['1', '', '3', '', ''], 3, '45')).toEqual({
      boxes: ['1', '', '3', '4', '5'],
      focusIndex: 4,
    });
  });

  test('digits past the last box are dropped and focus clamps to the last box', () => {
    expect(spreadDigits(['1', '2', '3', '4', '', ''], 4, '789')).toEqual({
      boxes: ['1', '2', '3', '4', '7', '8'],
      focusIndex: 5,
    });
  });

  test('does not mutate the incoming boxes', () => {
    const boxes = ['1', '', ''];
    spreadDigits(boxes, 0, '456');
    expect(boxes).toEqual(['1', '', '']);
  });
});

describe('typeIntoBox (typing)', () => {
  test('a digit fills the box and moves on', () => {
    expect(typeIntoBox(['1', '', ''], 1, '2')).toEqual({ boxes: ['1', '2', ''], focusIndex: 2 });
  });

  test('a digit typed beside the one a box had replaces it (box 0 takes a whole code)', () => {
    expect(typeIntoBox(['1', '5', ''], 0, '12')).toEqual({ boxes: ['2', '5', ''], focusIndex: 1 });
    expect(typeIntoBox(['1', '5', ''], 0, '21')).toEqual({ boxes: ['2', '5', ''], focusIndex: 1 });
  });

  test('a letter is ignored', () => {
    expect(typeIntoBox(['1', '', ''], 1, 'a')).toBeNull();
  });

  test('clearing a middle box leaves a gap, later digits stay put', () => {
    expect(typeIntoBox(['1', '2', '3'], 1, '')).toEqual({ boxes: ['1', '', '3'], focusIndex: 1 });
  });

  test('a whole code spreads like a paste', () => {
    expect(typeIntoBox(['', '', ''], 0, '987')).toEqual({ boxes: ['9', '8', '7'], focusIndex: 2 });
  });
});

describe('CodeInput rendering', () => {
  test('a controlled value spreads across the boxes, clamped to length', () => {
    const html = render(CodeInput, { length: 6, value: '1234567' });
    const inputs = findAll(parse(html), (e) => e.tag === 'input');
    expect(inputs.length).toBe(6);
    expect(inputs.map((i) => i.attrs.value ?? '')).toEqual(['1', '2', '3', '4', '5', '6']);
  });

  test('box 0 accepts the whole code (paste target); the rest stay single-char', () => {
    const html = render(CodeInput, { length: 6 });
    const inputs = findAll(parse(html), (e) => e.tag === 'input');
    // react-native-web forwards the prop verbatim (camelCase attr in SSR output)
    expect(inputs[0].attrs.maxLength).toBe('6');
    for (const box of inputs.slice(1)) expect(box.attrs.maxLength).toBe('1');
  });

  test('labels each box "Digit N of L" by default', () => {
    const html = render(CodeInput, { length: 8 });
    expect(html).toContain('aria-label="Digit 1 of 8"');
    expect(html).toContain('aria-label="Digit 8 of 8"');
  });

  test("labels each box with the app's digitLabel", () => {
    const html = render(CodeInput, { length: 3, digitLabel: (p: number, l: number) => `Цифра ${p} из ${l}` });
    expect(html).toContain('aria-label="Цифра 2 из 3"');
    expect(html).not.toContain('Digit');
  });
});
