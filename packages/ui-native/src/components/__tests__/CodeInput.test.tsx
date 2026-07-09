import { describe, expect, test } from 'vitest';
import { CodeInput, spreadCodeAcrossBoxes } from '../TagInput';
import { findAll, parse, render } from './markup';

/* Multi-char paste / iOS SMS autofill lands the whole code in ONE box; the
 * component spreads it across the remaining boxes and moves focus after the
 * last written char. The spread math lives in the pure helper
 * `spreadCodeAcrossBoxes` (extracted from `onBoxChange` — press/typing events
 * can't be dispatched without a DOM environment). */

describe('spreadCodeAcrossBoxes (paste spread math)', () => {
  test('a full-length paste into box 0 fills every box and focuses the last', () => {
    expect(spreadCodeAcrossBoxes(['', '', '', '', '', ''], 0, '123456', 6)).toEqual({
      code: '123456',
      focusIndex: 5,
    });
  });

  test('a mid-code paste fills from that box on and keeps earlier digits', () => {
    expect(spreadCodeAcrossBoxes(['1', '2', '', '', '', ''], 2, '345', 6)).toEqual({
      code: '12345',
      focusIndex: 5,
    });
  });

  test('overflow past the last box is dropped and focus clamps to the last box', () => {
    expect(spreadCodeAcrossBoxes(['1', '2', '3', '4', '', ''], 4, '789XYZ', 6)).toEqual({
      code: '123478',
      focusIndex: 5,
    });
  });

  test('pasting over existing digits overwrites them', () => {
    expect(spreadCodeAcrossBoxes(['9', '9', '9', '9', '9', '9'], 1, '00', 6)).toEqual({
      code: '900999',
      focusIndex: 3,
    });
  });

  test('does not mutate the incoming chars', () => {
    const chars = ['1', '', ''];
    spreadCodeAcrossBoxes(chars, 0, '456', 3);
    expect(chars).toEqual(['1', '', '']);
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
});
