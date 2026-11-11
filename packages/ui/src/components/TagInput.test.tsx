/* CodeInput — the a11y contract apps rely on (docs/sdd/components/TagInput.md §7): a labelled group,
   a translatable label per box, the error state on every box (where it's announced); and the box math
   (typing, paste, autofill) as pure helpers, since press events can't be dispatched without a DOM. */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { CodeInput, codeToBoxes, resizeBoxes, spreadDigits, typeIntoBox } from './TagInput';

describe('CodeInput', () => {
  it('labels each box "Digit N of L" by default', () => {
    const html = renderToStaticMarkup(<CodeInput length={8} />);
    expect(html).toContain('aria-label="Digit 1 of 8"');
    expect(html).toContain('aria-label="Digit 8 of 8"');
  });

  it("labels each box with the app's digitLabel", () => {
    const html = renderToStaticMarkup(
      <CodeInput length={3} digitLabel={(p, l) => `Цифра ${p} из ${l}`} />,
    );
    expect(html).toContain('aria-label="Цифра 2 из 3"');
    expect(html).not.toContain('Digit');
  });

  it("is a group the app's label names", () => {
    const html = renderToStaticMarkup(<CodeInput aria-labelledby="reset-code-label" />);
    expect(html).toMatch(/<div role="group"[^>]*aria-labelledby="reset-code-label"/);
  });

  it('marks every box invalid, and none when valid', () => {
    const invalid = renderToStaticMarkup(<CodeInput length={4} invalid />);
    expect(invalid.match(/<input[^>]*aria-invalid="true"/g)).toHaveLength(4);
    expect(renderToStaticMarkup(<CodeInput length={4} />)).not.toContain('aria-invalid');
  });
});

describe('codeToBoxes', () => {
  it('puts one digit per box, padded to the length', () => {
    expect(codeToBoxes('12', 4)).toEqual(['1', '2', '', '']);
  });

  it('drops non-digits and anything past the last box', () => {
    expect(codeToBoxes('1a2-345', 4)).toEqual(['1', '2', '3', '4']);
  });
});

describe('spreadDigits (paste, autofill)', () => {
  it('fills from the box on and focuses after the last digit', () => {
    expect(spreadDigits(['', '', '', '', '', '', '', ''], 0, '12345678')).toEqual({
      boxes: ['1', '2', '3', '4', '5', '6', '7', '8'],
      focusIndex: 7,
    });
  });

  it('takes only the digits of a copied "Code: 1234-5678"', () => {
    expect(spreadDigits(['', '', '', '', '', '', '', ''], 0, 'Code: 1234-5678').boxes).toEqual([
      '1', '2', '3', '4', '5', '6', '7', '8',
    ]);
  });

  it('keeps earlier boxes, and a gap stays a gap', () => {
    expect(spreadDigits(['1', '', '3', '', ''], 3, '45')).toEqual({
      boxes: ['1', '', '3', '4', '5'],
      focusIndex: 4,
    });
  });

  it('drops digits past the last box', () => {
    expect(spreadDigits(['', '', '', ''], 2, '78')).toEqual({ boxes: ['', '', '7', '8'], focusIndex: 3 });
    expect(spreadDigits(['', '', '', ''], 3, '78')).toEqual({ boxes: ['', '', '', '7'], focusIndex: 3 });
  });

  it('fills a whole code from the first box, wherever it was pasted', () => {
    expect(spreadDigits(['', '', ''], 1, '789')).toEqual({ boxes: ['7', '8', '9'], focusIndex: 2 });
    expect(spreadDigits(Array(6).fill(''), 3, '123456').boxes).toEqual(['1', '2', '3', '4', '5', '6']);
  });
});

describe('typeIntoBox (typing)', () => {
  it('a digit fills the box and moves on', () => {
    expect(typeIntoBox(['1', '', ''], 1, '2')).toEqual({ boxes: ['1', '2', ''], focusIndex: 2 });
  });

  it("a digit replaces the box's one (it is selected)", () => {
    expect(typeIntoBox(['1', '5', ''], 0, '2')).toEqual({ boxes: ['2', '5', ''], focusIndex: 1 });
  });

  it('two digits into box 0 (a short autofill) spread, not collapse', () => {
    expect(typeIntoBox(['', '', ''], 0, '34')).toEqual({ boxes: ['3', '4', ''], focusIndex: 2 });
  });

  it('a letter is ignored', () => {
    expect(typeIntoBox(['1', '', ''], 1, 'a')).toBeNull();
  });

  it('clearing a middle box leaves a gap, later digits stay put', () => {
    expect(typeIntoBox(['1', '2', '3'], 1, '')).toEqual({ boxes: ['1', '', '3'], focusIndex: 1 });
  });

  it('a whole code spreads like a paste', () => {
    expect(typeIntoBox(['', '', ''], 0, '987')).toEqual({ boxes: ['9', '8', '7'], focusIndex: 2 });
  });
});

describe('resizeBoxes (another length)', () => {
  it('keeps each digit in its place, a gap stays a gap', () => {
    expect(resizeBoxes(['1', '', '3', '4'], 6)).toEqual(['1', '', '3', '4', '', '']);
  });

  it('drops the boxes past the new length', () => {
    expect(resizeBoxes(['1', '2', '3', '4'], 2)).toEqual(['1', '2']);
  });
});

describe('CodeInput boxes', () => {
  it('box 0 takes a whole autofilled code; the rest one digit', () => {
    const html = renderToStaticMarkup(<CodeInput length={8} />);
    const lengths = [...html.matchAll(/maxLength="(\d+)"/g)].map((m) => m[1]);
    expect(lengths).toEqual(['8', '1', '1', '1', '1', '1', '1', '1']);
  });
});

