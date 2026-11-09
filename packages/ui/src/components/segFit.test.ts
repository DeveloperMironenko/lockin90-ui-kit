import { describe, expect, it } from 'vitest';
import { segFitPercent } from './segFit';

describe('segFitPercent', () => {
  it('scales only the text part, in whole percents', () => {
    // 76 wide with 8 padding, 78 of content: 68 / 70 of the text fits → 97 %
    expect(segFitPercent(76, 78, 8)).toBe(97);
  });

  it('never below 80 % (native minimumFontScale 0.8), never above 98 % when it overflows', () => {
    expect(segFitPercent(40, 100, 8)).toBe(80);
    expect(segFitPercent(99, 100, 0)).toBe(98);
  });
});
