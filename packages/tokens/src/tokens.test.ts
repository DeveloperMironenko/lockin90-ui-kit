/* tokens — the orange recovery tint (design `--orange`) exists in both the
   typed raw values and the CSS custom-property sheet, and maps via cssVar. */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { colors, cssVar } from './index';

describe('orange (recovery tint)', () => {
  it('is the design --orange in the typed palette', () => {
    expect(colors.orange).toBe('#FF8A3D');
  });

  it('ships as --orange in tokens.css', () => {
    const css = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8');
    expect(css).toContain('--orange: #FF8A3D');
  });

  it('maps to its CSS custom property', () => {
    expect(cssVar('orange')).toBe('var(--orange)');
  });
});
