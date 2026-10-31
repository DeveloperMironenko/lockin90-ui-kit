import { colors, radii, spacing, breakpoints, shadows, gradientCss } from './index';

/**
 * Tailwind preset — an opt-in, token-driven theme for apps that use Tailwind
 * (e.g. the marketing site: `presets: [require('@lockin90/tokens/tailwind-preset')]`).
 * The shipped kit components do NOT need this — they emit `lk-*` classes from
 * styles.css. Mirrors `@lockin90/tokens` (colors / fonts / radii / gradients /
 * shadows). Typed loosely so this package needs no `tailwindcss` dependency.
 */
const preset = {
  theme: {
    extend: {
      colors: {
        void: colors.void,
        'bg-0': colors.bg0,
        'bg-1': colors.bg1,
        'bg-2': colors.bg2,
        glass: colors.glass,
        'glass-2': colors.glass2,
        border: colors.border,
        'border-2': colors.border2,
        text: colors.text,
        dim: colors.textDim,
        faint: colors.textFaint,
        lime: colors.lime,
        mint: colors.mint,
        cyan: colors.cyan,
        indigo: colors.indigo,
        violet: colors.violet,
        magenta: colors.magenta,
        orange: colors.orange,
        accent: colors.accent,
        'accent-2': colors.accent2,
        'accent-3': colors.accent3,
        'zone-high': colors.zoneHigh,
        'zone-mid': colors.zoneMid,
        'zone-low': colors.zoneLow,
        ok: colors.ok,
        warn: colors.warn,
        bad: colors.bad,
        info: colors.info,
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'Space Grotesk', 'system-ui', 'sans-serif'],
        ui: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'JetBrains Mono', 'monospace'],
      },
      // max-width screens must go widest first, or `tablet:` would win on phones
      screens: {
        tablet: { max: `${breakpoints.tablet}px` },
        phone: { max: `${breakpoints.phone}px` },
      },
      // rem (16px root), like Tailwind's defaults, so spacing still scales with the font size
      spacing: Object.fromEntries(Object.entries(spacing).map(([k, v]) => [k, `${v / 16}rem`])),
      borderRadius: {
        sm: `${radii.sm}px`,
        md: `${radii.md}px`,
        lg: `${radii.lg}px`,
        xl: `${radii.xl}px`,
        pill: `${radii.pill}px`,
      },
      backgroundImage: {
        'grad-flux': gradientCss('flux'),
        'grad-cta': gradientCss('cta'),
        'grad-mint': gradientCss('mint'),
        'grad-violet': gradientCss('violet'),
        'grad-warm': gradientCss('warm'),
      },
      boxShadow: {
        'glow-accent': shadows.glowAccent,
        'glow-cyan': shadows.glowCyan,
        'glow-mint': shadows.glowMint,
        'elev-1': shadows.elev1,
        'elev-2': shadows.elev2,
      },
    },
  },
};

export default preset;
