/* tokens — the orange recovery tint (design `--orange`) exists in both the
   typed raw values and the CSS custom-property sheet, and maps via cssVar. */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { breakpoints, colors, cssVar, gradients, highContrastColors, spacing, textStyles } from './index';
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
    expect(Object.keys(screens)).toEqual(['tablet', 'phone', 'narrow']);
    expect(screens.narrow.max).toBe('360px');
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

/* Text on a card over the aurora (CONVENTIONS "Accessibility", measured 2026-11-10): the aurora's
   brightest pixels behind a card, modelled as each blob colour screened over --bg-0 at the intensity
   that reproduces the measured worst case under the old glass card (luminance .081), and at 1.44× that
   for the vivid variant. */
describe('contrast over the aurora', () => {
  const rgb = (c: string): number[] =>
    c.startsWith('#') ? [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)) : (c.match(/[\d.]+/g) ?? []).map(Number);
  const over = (fg: string | number[], bg: number[]) => {
    const [r, g, b, a = 1] = typeof fg === 'string' ? rgb(fg) : fg;
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
  const bg0 = rgb(colors.bg0);
  const peak = (blob: string, i: number) => {
    const screen = rgb(blob).map((v, k) => 255 - ((255 - v) * (255 - bg0[k])) / 255);
    return [...screen, i] as number[];
  };
  const peaks = (
    [
      [colors.cyan, 0.343],
      [colors.accent, 0.547],
      [colors.magenta, 0.497],
    ] as const
  ).flatMap(([c, i]) => [over(peak(c, i), bg0), over(peak(c, Math.min(1, i * 1.44)), bg0)]);

  it('the card keeps dim and faint text at 4.5:1 on the brightest aurora pixel', () => {
    for (const p of peaks) {
      const card = over(colors.card, p);
      expect(ratio(rgb(colors.textDim), card)).toBeGreaterThanOrEqual(4.5);
      expect(ratio(rgb(colors.textFaint), card)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('the old glass card did not (the bug this fixes)', () => {
    const worst = Math.min(...peaks.map((p) => ratio(rgb(colors.textFaint), over(colors.glass, p))));
    expect(worst).toBeLessThan(4.5);
  });

  it('a field is opaque: its placeholder keeps 4.5:1 whatever is behind', () => {
    expect(rgb(colors.field)).toHaveLength(3);
    expect(ratio(rgb(colors.textFaint), rgb(colors.field))).toBeGreaterThanOrEqual(4.5);
  });

  it('the card looks as before on the plain page (#13151D)', () => {
    expect(over(colors.card, bg0).map(Math.round)).toEqual([19, 21, 29]);
  });
});

/* Increase Contrast: the web media block and native's mapping are the same values (highContrastColors). */
describe('Increase Contrast parity', () => {
  it('prefers-contrast: more sets each token to its highContrastColors value', () => {
    const css = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8');
    const block = css.slice(css.indexOf('@media (prefers-contrast: more)'));
    const norm = (v: string) => v.replace(/\s+/g, '').toLowerCase();
    const varOf = { textFaint: '--text-faint', textDim: '--text-dim', border2: '--border-2', borderControl: '--border-control' } as const;
    for (const [key, value] of Object.entries(highContrastColors)) {
      const m = block.match(new RegExp(`${varOf[key as keyof typeof varOf]}:\\s*([^;]+);`));
      expect(norm(m![1])).toBe(norm(value));
    }
    expect(css).toContain('--border-control-strong: rgba(255, 255, 255, 0.5)');
  });
});

/* Owner, 2026-11-11: one soft accent for text, one dark ink on bright surfaces, one type table. */
describe('accent-soft, ink-on-bright and the type table', () => {
  const css = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8');
  const rgb = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
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

  it('accent-soft text keeps 4.5:1 on the card and on a violet-tinted note', () => {
    expect(ratio(rgb(colors.accentSoft), rgb(colors.cardSolid))).toBeGreaterThanOrEqual(4.5);
    // the violet note: the accent at 5.5% over the card
    const note = rgb(colors.cardSolid).map((v, i) => v * 0.945 + rgb(colors.accent)[i] * 0.055);
    expect(ratio(rgb(colors.accentSoft), note)).toBeGreaterThanOrEqual(4.5);
  });

  it('ink-on-bright keeps 4.5:1 at every stop of the CTA gradient and on a solid danger fill', () => {
    for (const stop of [...gradients.cta.stops, colors.bad]) {
      expect(ratio(rgb(colors.inkOnBright), rgb(stop))).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('ships both in tokens.css with the typed values', () => {
    expect(css).toContain(`--accent-soft: ${colors.accentSoft}`);
    expect(css).toContain(`--ink-on-bright: ${colors.inkOnBright}`);
    expect(cssVar('accentSoft')).toBe('var(--accent-soft)');
    expect(cssVar('inkOnBright')).toBe('var(--ink-on-bright)');
  });

  it('every role of the type table is a --fs-* custom property of the same size', () => {
    const kebab = (k: string) => k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
    for (const [role, s] of Object.entries(textStyles)) {
      expect(css).toContain(`--fs-${kebab(role)}: ${s.size}px;`);
    }
    expect(css).toContain(`--ls-label: ${textStyles.label.tracking}em;`);
  });

  it('labels are 11 and over, a control value is 16 (no iOS zoom)', () => {
    for (const s of Object.values(textStyles)) expect(s.size).toBeGreaterThanOrEqual(11);
    expect(textStyles.control.size).toBe(16);
  });
});
