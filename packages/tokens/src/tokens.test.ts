import { describe, expect, it } from 'vitest';
import {
  colors,
  cssVars,
  energyColor,
  energyLabel,
  gradients,
  gradientStops,
  tailwindThemeExtend,
} from './tokens';

describe('@lockin90/tokens', () => {
  it('keeps the canonical Aurora Flux brand values', () => {
    expect(colors.accent).toBe('#7C5CFF'); // electric indigo-violet (was #FF1F1F)
    expect(colors.accent2).toBe('#22D3EE'); // cyan
    expect(colors.accent3).toBe('#34F5C5'); // mint
    expect(colors.bgBase).toBe('#080A12'); // deep void page base
    expect(colors.border).toBe('rgba(255,255,255,0.09)'); // glass hairline
  });

  it('exposes CSS variables matching the :root contract', () => {
    expect(cssVars['--accent']).toBe('#7C5CFF');
    expect(cssVars['--bg-base']).toBe('#080A12');
    expect(cssVars['--ease-smooth']).toBe('cubic-bezier(0.16, 1, 0.3, 1)');
    expect(cssVars['--font-display']).toContain('Space Grotesk');
    // new Aurora tokens are emitted
    expect(cssVars['--grad-flux']).toContain('linear-gradient');
    expect(cssVars['--glow-accent']).toContain('rgba(124,92,255');
    expect(cssVars['--r']).toBe('16px');
  });

  it('mirrors the tailwind token map', () => {
    expect(tailwindThemeExtend.colors.accent).toBe('#7C5CFF');
    expect(tailwindThemeExtend.colors['accent-2']).toBe('#22D3EE');
    expect(tailwindThemeExtend.fontFamily.display[0]).toBe('var(--font-space-grotesk)');
    expect(tailwindThemeExtend.backgroundImage['grad-flux']).toBe(gradients.flux);
  });

  it('ships the energy spectrum as gradients + ordered stops', () => {
    expect(gradients.flux).toContain('#A8FF35');
    expect(gradientStops.flux).toHaveLength(5);
    expect(gradientStops.cta).toEqual(['#7C5CFF', '#22D3EE']);
  });

  it('maps energy scores to zones', () => {
    expect(energyLabel(80)).toBe('HIGH');
    expect(energyLabel(50)).toBe('MODERATE');
    expect(energyLabel(10)).toBe('LOW');
    expect(energyColor(80)).toBe(colors.zoneHigh);
    expect(energyColor(10)).toBe(colors.zoneLow);
  });
});
