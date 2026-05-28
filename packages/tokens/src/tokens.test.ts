import { describe, expect, it } from 'vitest';
import {
  colors,
  cssVars,
  energyColor,
  energyLabel,
  tailwindThemeExtend,
} from './tokens';

describe('@p90/tokens', () => {
  it('keeps the canonical brand values', () => {
    expect(colors.accent).toBe('#FF1F1F');
    expect(colors.bgSurface).toBe('#0A0A0A');
    expect(colors.border).toBe('#1F1F1F');
  });

  it('exposes CSS variables matching the legacy :root contract', () => {
    expect(cssVars['--accent']).toBe('#FF1F1F');
    expect(cssVars['--bg-surface']).toBe('#0A0A0A');
    expect(cssVars['--ease-smooth']).toBe('cubic-bezier(0.16, 1, 0.3, 1)');
    expect(cssVars['--font-display']).toContain('var(--font-barlow)');
  });

  it('mirrors the legacy tailwind token map', () => {
    expect(tailwindThemeExtend.colors.surface).toBe('#0A0A0A');
    expect(tailwindThemeExtend.colors.accent).toBe('#FF1F1F');
    expect(tailwindThemeExtend.fontFamily.display[0]).toBe('var(--font-barlow)');
  });

  it('maps energy scores to zones', () => {
    expect(energyLabel(80)).toBe('HIGH');
    expect(energyLabel(50)).toBe('MODERATE');
    expect(energyLabel(10)).toBe('LOW');
    expect(energyColor(80)).toBe(colors.zoneHigh);
    expect(energyColor(10)).toBe(colors.zoneLow);
  });
});
