/* MetricTile (native) — `size="sm"` is the phone's settings readout (design mobile/account.html
   .fcell); `hint` shows under a value as under the dash. */
import { describe, expect, test } from 'vitest';
import { MetricTile } from '../MetricTile';
import { findByText, hasDeclaration, parse, render } from './markup';

describe('MetricTile size', () => {
  test('sm: the value at 20, a word at 15', () => {
    const number = parse(render(MetricTile, { size: 'sm', label: 'Age', value: '31', unit: 'yr' }));
    expect(hasDeclaration(findByText(number, '31')!, 'font-size:20px')).toBe(true);
    const word = parse(render(MetricTile, { size: 'sm', label: 'Sex', value: 'Male', textValue: true }));
    expect(hasDeclaration(findByText(word, 'Male')!, 'font-size:15px')).toBe(true);
  });

  test('md stays the default tile', () => {
    const root = parse(render(MetricTile, { label: 'Age', value: '31' }));
    expect(hasDeclaration(findByText(root, '31')!, 'font-size:24px')).toBe(true);
  });
});

describe('MetricTile hint', () => {
  test('under a value, as under the dash', () => {
    expect(render(MetricTile, { size: 'sm', label: 'Height', value: '183', hint: 'BMI 25.8' })).toContain('BMI 25.8');
    // a default tile keeps its line to empty mode (as web)
    expect(render(MetricTile, { label: 'Height', value: '183', hint: 'BMI 25.8' })).not.toContain('BMI 25.8');
    expect(render(MetricTile, { label: 'Max HR', empty: true, hint: 'no data yet' })).toContain('no data yet');
  });
});

/* A long label or word (Пульс спокою, パワーリフティング at 402) wraps inside the tile: never cut. */
describe('MetricTile word', () => {
  test('sm: a word wraps instead of being cut with an ellipsis', () => {
    const root = parse(render(MetricTile, { size: 'sm', label: 'Sport', value: 'パワーリフティング', textValue: true }));
    const word = findByText(root, 'パワーリフティング')!;
    expect(hasDeclaration(word, 'white-space:nowrap')).toBe(false);
    expect(hasDeclaration(word, 'text-overflow:ellipsis')).toBe(false);
  });
});

describe('MetricTile sm label', () => {
  test('wraps, at 11 at least', () => {
    const root = parse(render(MetricTile, { size: 'sm', label: 'Пульс спокою', value: '52' }));
    const label = findByText(root, 'Пульс спокою')!;
    expect(hasDeclaration(label, 'white-space:nowrap')).toBe(false);
    expect(hasDeclaration(label, 'font-size:11px')).toBe(true);
  });
});

describe('MetricTile value row', () => {
  test('the unit wraps under the value when they don\u2019t fit one line', () => {
    const root = parse(render(MetricTile, { size: 'sm', label: 'Вага', value: '205,9', unit: 'фунт' }));
    const row = findByText(root, '205,9')!.parent!;
    expect(hasDeclaration(row, 'flex-wrap:wrap')).toBe(true);
  });
});
