/* Heatmap `lerpColor` (exported utility): linear interpolation between two hex
   colors → an `rgb(...)` string, with `t` clamped to [0, 1] and 3-digit hex
   shorthand expanded. */
import { describe, expect, it } from 'vitest';
import { lerpColor } from './Heatmap';

describe('lerpColor', () => {
  it('returns the endpoints at t=0 and t=1', () => {
    expect(lerpColor('#000000', '#ffffff', 0)).toBe('rgb(0, 0, 0)');
    expect(lerpColor('#000000', '#ffffff', 1)).toBe('rgb(255, 255, 255)');
  });

  it('interpolates per channel (midpoint rounds)', () => {
    expect(lerpColor('#000000', '#ffffff', 0.5)).toBe('rgb(128, 128, 128)'); // round(127.5)
    expect(lerpColor('#ff0000', '#0000ff', 0.5)).toBe('rgb(128, 0, 128)');
    expect(lerpColor('#102030', '#304050', 0.25)).toBe('rgb(24, 40, 56)');
  });

  it('clamps t outside [0, 1]', () => {
    expect(lerpColor('#000000', '#ffffff', -2)).toBe('rgb(0, 0, 0)');
    expect(lerpColor('#000000', '#ffffff', 3)).toBe('rgb(255, 255, 255)');
  });

  it('expands 3-digit hex shorthand', () => {
    expect(lerpColor('#0f8', '#0f8', 0.7)).toBe('rgb(0, 255, 136)'); // #00ff88
    expect(lerpColor('#fff', '#000', 0)).toBe('rgb(255, 255, 255)');
  });
});
