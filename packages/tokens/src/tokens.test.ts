/* tokens — the orange recovery tint (design `--orange`) exists in both the
   typed raw values and the CSS custom-property sheet, and maps via cssVar. */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { breakpoints, colors, cssVar, spacing } from './index';
import preset from './tailwind-preset';

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

describe('spacing + breakpoints (layout rules)', () => {
  const css = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8');

  it('is a 4px scale', () => {
    for (const [step, px] of Object.entries(spacing)) expect(px).toBe(Number(step) * 4);
  });

  const vars = (prefix: string) =>
    Object.fromEntries([...css.matchAll(new RegExp(`--${prefix}-([a-z0-9]+):\\s*(\\d+)px;`, 'g'))].map((m) => [m[1], Number(m[2])]));

  it('tokens.css has exactly the typed steps and breakpoints, no more, no less', () => {
    expect(vars('space')).toEqual(Object.fromEntries(Object.entries(spacing).map(([k, v]) => [k, v])));
    expect(vars('bp')).toEqual({ ...breakpoints });
  });

  it('the Tailwind preset lists max-width screens widest first, in rem spacing', () => {
    const { screens, spacing: tw } = preset.theme.extend as {
      screens: Record<string, { max: string }>;
      spacing: Record<string, string>;
    };
    expect(Object.keys(screens)).toEqual(['tablet', 'phone']);
    expect(screens.phone.max).toBe('540px');
    expect(tw['4']).toBe('1rem');
  });
});
