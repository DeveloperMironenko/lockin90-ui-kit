/* tokens — the orange recovery tint (design `--orange`) exists in both the
   typed raw values and the CSS custom-property sheet, and maps via cssVar. */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { breakpoints, colors, cssVar, spacing } from './index';

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

  it('ships every step and breakpoint in tokens.css with the same value', () => {
    for (const [step, px] of Object.entries(spacing)) expect(css).toContain(`--space-${step}: ${px}px;`);
    for (const [name, px] of Object.entries(breakpoints)) expect(css).toContain(`--bp-${name}: ${px}px;`);
  });
});
