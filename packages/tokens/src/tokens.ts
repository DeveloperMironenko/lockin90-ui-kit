// PERFORMANCE 90 — design tokens (single source of truth)
// Consumed directly by React Native (StyleSheet), and used to generate
// the web `tokens.css` (:root custom properties) + Tailwind preset.

export const colors = {
  bgBase: '#000000',
  bgSurface: '#0A0A0A',
  bgElevated: '#141414',
  bgElevated2: '#1C1C1C',

  border: '#1F1F1F',
  borderStrong: '#2A2A2A',
  borderSubtle: '#131313',

  textPrimary: '#FFFFFF',
  textSecondary: '#888888',
  textMuted: '#555555',
  textFaint: '#2A2A2A',

  accent: '#FF1F1F',
  accentBright: '#FF3333',
  accentDim: '#8B0F0F',
  accentGlow: 'rgba(255,31,31,0.45)',

  good: '#FFFFFF',
  warn: '#FF1F1F',
  bad: '#FF1F1F',
  neutral: '#555555',

  // energy zone colors
  zoneHigh: '#22C55E',
  zoneMid: '#F59E0B',
  zoneLow: '#FF1F1F',
  zoneNeutral: '#888888',

  // status (admin parity)
  statusGreen: '#3FB661',
  statusAmber: '#F0A93B',
  statusRed: '#FF1F1F',
} as const;

// React Native font family names (set after fonts load; web uses CSS vars below).
export const fonts = {
  display: 'BarlowCondensed_800ExtraBold',
  displayItalic: 'BarlowCondensed_800ExtraBold_Italic',
  displayBold: 'BarlowCondensed_700Bold',
  displayBoldItalic: 'BarlowCondensed_700Bold_Italic',
  displayBlack: 'BarlowCondensed_900Black',
  displayBlackItalic: 'BarlowCondensed_900Black_Italic',
  ui: 'Inter_400Regular',
  uiMedium: 'Inter_500Medium',
  mono: 'JetBrainsMono_400Regular',
  monoMedium: 'JetBrainsMono_500Medium',
} as const;

export const fontSizes = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  display: 36,
} as const;

export const letterSpacing = {
  tight: -0.4,
  normal: 0,
  wide: 1,
  eyebrow: 1.6,
} as const;

export const radius = {
  sm: 4,
  md: 6,
  lg: 10,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  pageX: 24,
} as const;

export const easing = {
  smoothBezier: [0.16, 1, 0.3, 1] as const,
  powerBezier: [0.7, 0, 0.3, 1] as const,
} as const;

export const durations = {
  fast: 120,
  base: 220,
  slow: 360,
  slower: 540,
} as const;

export const zIndex = {
  base: 0,
  content: 1,
  header: 10,
  modal: 100,
  toast: 200,
} as const;

export function energyColor(score: number): string {
  if (score >= 67) return colors.zoneHigh;
  if (score >= 34) return colors.zoneMid;
  return colors.zoneLow;
}

export function energyLabel(score: number): 'HIGH' | 'MODERATE' | 'LOW' {
  if (score >= 67) return 'HIGH';
  if (score >= 34) return 'MODERATE';
  return 'LOW';
}

// --- Web bridge -----------------------------------------------------------
// CSS custom properties exactly mirroring the legacy `:root` block so existing
// `var(--accent)` / `ea-*` styles and Tailwind token classes keep working.
// Font vars reference the per-app next/font variables (--font-barlow, etc.).
export const cssVars: Record<string, string> = {
  '--bg-base': colors.bgBase,
  '--bg-surface': colors.bgSurface,
  '--bg-elevated': colors.bgElevated,
  '--bg-elevated-2': colors.bgElevated2,
  '--border': colors.border,
  '--border-strong': colors.borderStrong,
  '--border-subtle': colors.borderSubtle,
  '--text-primary': colors.textPrimary,
  '--text-secondary': colors.textSecondary,
  '--text-muted': colors.textMuted,
  '--text-faint': colors.textFaint,
  '--accent': colors.accent,
  '--accent-bright': colors.accentBright,
  '--accent-dim': colors.accentDim,
  '--accent-glow': colors.accentGlow,
  '--font-display': "var(--font-barlow), 'Barlow Condensed', 'Oswald', 'Impact', sans-serif",
  '--font-ui': "var(--font-inter), 'Inter', -apple-system, 'Helvetica Neue', sans-serif",
  '--font-mono': "var(--font-jetbrains), 'JetBrains Mono', 'SF Mono', 'Courier New', monospace",
  '--ease-smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
  '--ease-power': 'cubic-bezier(0.7, 0, 0.3, 1)',
};

// Tailwind `theme.extend` fragment — mirrors the legacy tailwind.config.ts so
// utility classes like `bg-surface`, `text-accent`, `font-display` resolve.
export const tailwindThemeExtend = {
  colors: {
    base: colors.bgBase,
    surface: colors.bgSurface,
    elevated: colors.bgElevated,
    'elevated-2': colors.bgElevated2,
    secondary: colors.textSecondary,
    muted: colors.textMuted,
    faint: colors.textFaint,
    accent: colors.accent,
    'accent-bright': colors.accentBright,
    'accent-dim': colors.accentDim,
    border: colors.border,
    'border-strong': colors.borderStrong,
  },
  fontFamily: {
    display: ['var(--font-barlow)', 'Barlow Condensed', 'Oswald', 'sans-serif'],
    ui: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
    mono: ['var(--font-jetbrains)', 'JetBrains Mono', 'monospace'],
  },
} as const;
