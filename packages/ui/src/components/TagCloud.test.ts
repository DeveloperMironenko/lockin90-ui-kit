/* TagCloud `weightToSize` (exported utility): canonical 1..4 scale maps to the
   4 size buckets; out-of-range and fractional weights clamp to the nearest
   bucket; missing weight defaults to 'md'. */
import { describe, expect, it } from 'vitest';
import { weightToSize } from './TagCloud';

describe('weightToSize', () => {
  it('maps the canonical 1..4 scale to the 4 buckets', () => {
    expect(weightToSize(1)).toBe('sm');
    expect(weightToSize(2)).toBe('md');
    expect(weightToSize(3)).toBe('lg');
    expect(weightToSize(4)).toBe('xl');
  });

  it('defaults a missing weight to md', () => {
    expect(weightToSize(undefined)).toBe('md');
  });

  it('clamps out-of-range weights to the nearest bucket', () => {
    expect(weightToSize(0)).toBe('sm');
    expect(weightToSize(-3)).toBe('sm');
    expect(weightToSize(100)).toBe('xl');
  });

  it('buckets fractional weights by threshold (>=2 md, >=3 lg, >=4 xl)', () => {
    expect(weightToSize(1.9)).toBe('sm');
    expect(weightToSize(2.5)).toBe('md');
    expect(weightToSize(3.99)).toBe('lg');
  });
});
