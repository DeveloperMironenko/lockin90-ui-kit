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

/* CONVENTIONS "Accessibility": a field's edge 3:1 on the card, faint text 4.5:1 on a field's fill. */
describe('contrast (accessibility rule)', () => {
  const rgb = (c: string): number[] =>
    c.startsWith('#')
      ? [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16))
      : (c.match(/[\d.]+/g) ?? []).map(Number);
  const over = (fg: string, bg: number[]) => {
    const [r, g, b, a = 1] = rgb(fg);
    return [r, g, b].map((v, i) => v * a + bg[i] * (1 - a));
  };
  const lum = (c: number[]) => {
    const [r, g, b] = c.map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const ratio = (a: number[], b: number[]) => {
    const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };
  const card = over(colors.glass, rgb(colors.bg0));
  const field = over(colors.glass2, card);

  it('the control edge reaches 3:1 on the card and on the page', () => {
    expect(ratio(over(colors.borderControl, card), card)).toBeGreaterThanOrEqual(3);
    expect(ratio(over(colors.borderControl, rgb(colors.bg0)), rgb(colors.bg0))).toBeGreaterThanOrEqual(3);
  });

  it('faint text reaches 4.5:1 on a field', () => {
    expect(ratio(rgb(colors.textFaint), field)).toBeGreaterThanOrEqual(4.5);
  });

  it('ships both in tokens.css with the typed values', () => {
    const css = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8');
    expect(css).toContain('--border-control: rgba(255, 255, 255, 0.36)');
    expect(css).toContain(`--text-faint: ${colors.textFaint}`);
    expect(cssVar('borderControl')).toBe('var(--border-control)');
  });
});
