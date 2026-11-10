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

describe('MetricTile word', () => {
  test('sm: a word stays on one line', () => {
    const root = parse(render(MetricTile, { size: 'sm', label: 'Sport', value: 'Powerlifting', textValue: true }));
    expect(hasDeclaration(findByText(root, 'Powerlifting')!, 'white-space:nowrap')).toBe(true);
  });
});

describe('MetricTile sm label', () => {
  test('stays on one line', () => {
    const root = parse(render(MetricTile, { size: 'sm', label: 'Biological sex', value: 'Male', textValue: true }));
    expect(hasDeclaration(findByText(root, 'Biological sex')!, 'white-space:nowrap')).toBe(true);
  });
});
