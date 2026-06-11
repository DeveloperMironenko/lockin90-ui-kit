// LOCKIN90 — design tokens (single source of truth)
// Consumed directly by React Native (StyleSheet), and used to generate
// the web `tokens.css` (:root custom properties) + Tailwind preset.
//
// VISUAL LANGUAGE: "Aurora Flux" — deep-void glassmorphism, a flowing
// energy-spectrum gradient (lime → mint → cyan → indigo → violet → magenta),
// glow / soft elevation, rounded glass radii, Space Grotesk display type.
// This REPLACES the retired shipped look (single red #FF1F1F, Barlow Condensed,
// flat / no shadows, sharp 4–6px radii). Key + CSS-var names are preserved so
// existing consumers keep resolving; only the VALUES changed (plus new tokens).

export const colors = {
  // ---- surfaces (deep void → elevated panels) ----
  void: '#05060B',
  bgBase: '#080A12', // page base
  bgSurface: '#0C0F1A', // panel
  bgElevated: '#11151F', // elevated panel
  bgElevated2: '#161B27', // hover / second elevation

  // translucent glass fills (pair with backdrop-blur in CSS / BlurView in RN)
  glass: 'rgba(255,255,255,0.045)',
  glass2: 'rgba(255,255,255,0.075)',

  // ---- borders (hairlines over the void) ----
  border: 'rgba(255,255,255,0.09)',
  borderStrong: 'rgba(255,255,255,0.16)',
  borderSubtle: 'rgba(255,255,255,0.05)',

  // ---- text ----
  textPrimary: '#EEF1F8',
  textSecondary: '#AAB2C6',
  textMuted: '#6A7286',
  textFaint: '#3A4154',

  // ---- accents (electric indigo-violet primary + cyan / mint partners) ----
  accent: '#7C5CFF',
  accentBright: '#9B86FF',
  accentDim: '#4B3F9E',
  accentGlow: 'rgba(124,92,255,0.45)',
  accent2: '#22D3EE', // cyan
  accent3: '#34F5C5', // mint

  // ---- energy spectrum (the signature gradient stops) ----
  lime: '#A8FF35',
  mint: '#34F5C5',
  cyan: '#22D3EE',
  indigo: '#6E7BFF',
  violet: '#A855F7',
  magenta: '#FF3D81',

  // ---- semantic status ----
  good: '#34F5C5',
  warn: '#FFB020',
  bad: '#FF4D6D',
  neutral: '#6A7286',
  ok: '#34F5C5',
  info: '#6E7BFF',

  // ---- energy zone colors (recolored away from the shipped red) ----
  zoneHigh: '#34F5C5',
  zoneMid: '#FFB020',
  zoneLow: '#FF4D6D',
  zoneNeutral: '#AAB2C6',

  // ---- status (admin parity) ----
  statusGreen: '#34F5C5',
  statusAmber: '#FFB020',
  statusRed: '#FF4D6D',
} as const;

// Energy-spectrum gradients. Web: CSS `linear-gradient(...)` strings (emitted as
// CSS vars). Native: use `gradientStops.*` with expo-linear-gradient.
export const gradients = {
  flux: 'linear-gradient(100deg, #A8FF35, #34F5C5, #22D3EE, #7C5CFF, #FF3D81)',
  cta: 'linear-gradient(135deg, #7C5CFF 0%, #22D3EE 100%)',
  mint: 'linear-gradient(135deg, #34F5C5 0%, #22D3EE 100%)',
  violet: 'linear-gradient(135deg, #A855F7 0%, #6E7BFF 100%)',
  warm: 'linear-gradient(135deg, #FFB020 0%, #FF4D6D 100%)',
} as const;

export type GradientName = keyof typeof gradients;

// Ordered color stops for each gradient — for React Native (expo-linear-gradient
// `colors={...}`) and SVG <linearGradient> stops on the web.
export const gradientStops: Record<GradientName, readonly string[]> = {
  flux: ['#A8FF35', '#34F5C5', '#22D3EE', '#7C5CFF', '#FF3D81'],
  cta: ['#7C5CFF', '#22D3EE'],
  mint: ['#34F5C5', '#22D3EE'],
  violet: ['#A855F7', '#6E7BFF'],
  warm: ['#FFB020', '#FF4D6D'],
} as const;

// Glow + elevation (opposite of the shipped "no shadows"). Web CSS box-shadow.
export const shadows = {
  glowAccent: '0 0 40px rgba(124,92,255,0.35)',
  glowCyan: '0 0 36px rgba(34,211,238,0.30)',
  glowMint: '0 0 36px rgba(52,245,197,0.30)',
  elev1: '0 2px 20px rgba(0,0,0,0.45)',
  elev2: '0 18px 50px -12px rgba(0,0,0,0.7)',
} as const;

// React Native font family names (Space Grotesk display · Inter UI · JetBrains
// Mono data). Space Grotesk has no italic/black cuts, so the legacy
// italic/black keys map to the nearest real weight (700 Bold) — the API stays
// stable for existing RN consumers; load these via @expo-google-fonts/*.
export const fonts = {
  display: 'SpaceGrotesk_700Bold',
  displayItalic: 'SpaceGrotesk_700Bold',
  displayBold: 'SpaceGrotesk_700Bold',
  displayBoldItalic: 'SpaceGrotesk_700Bold',
  displayBlack: 'SpaceGrotesk_700Bold',
  displayBlackItalic: 'SpaceGrotesk_700Bold',
  displayMedium: 'SpaceGrotesk_500Medium',
  ui: 'Inter_400Regular',
  uiMedium: 'Inter_500Medium',
  uiSemibold: 'Inter_600SemiBold',
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
  xxl: 30,
  display: 36,
} as const;

export const letterSpacing = {
  tight: -0.6,
  normal: 0,
  wide: 1,
  eyebrow: 2.2,
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
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
  aurora: [0.22, 1, 0.36, 1] as const,
  soft: [0.4, 0, 0.2, 1] as const,
} as const;

export const durations = {
  fast: 120,
  base: 220,
  slow: 360,
  slower: 540,
  ring: 1500,
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
// CSS custom properties. The legacy `--*` names are preserved (existing
// `var(--accent)` / `ea-*` styles + Tailwind token classes keep working) — their
// VALUES are now Aurora Flux. New `--*` tokens (spectrum, gradients, glass,
// glow, radii) are added for the new components. Font vars reference per-app
// next/font variables and fall back to the literal family (Google Fonts).
export const cssVars: Record<string, string> = {
  // surfaces
  '--void': colors.void,
  '--bg-base': colors.bgBase,
  '--bg-surface': colors.bgSurface,
  '--bg-elevated': colors.bgElevated,
  '--bg-elevated-2': colors.bgElevated2,
  '--glass': colors.glass,
  '--glass-2': colors.glass2,
  // borders
  '--border': colors.border,
  '--border-strong': colors.borderStrong,
  '--border-2': colors.borderStrong, // Aurora alias
  '--border-subtle': colors.borderSubtle,
  // text
  '--text-primary': colors.textPrimary,
  '--text-secondary': colors.textSecondary,
  '--text-dim': colors.textSecondary, // Aurora alias
  '--text-muted': colors.textMuted,
  '--text-faint': colors.textFaint,
  // accents
  '--accent': colors.accent,
  '--accent-bright': colors.accentBright,
  '--accent-dim': colors.accentDim,
  '--accent-glow': colors.accentGlow,
  '--accent-2': colors.accent2,
  '--accent-3': colors.accent3,
  // spectrum
  '--lime': colors.lime,
  '--mint': colors.mint,
  '--cyan': colors.cyan,
  '--indigo': colors.indigo,
  '--violet': colors.violet,
  '--magenta': colors.magenta,
  // status / zones
  '--ok': colors.ok,
  '--warn': colors.warn,
  '--bad': colors.bad,
  '--info': colors.info,
  '--zone-high': colors.zoneHigh,
  '--zone-mid': colors.zoneMid,
  '--zone-low': colors.zoneLow,
  // gradients
  '--grad-flux': gradients.flux,
  '--grad-cta': gradients.cta,
  '--grad-mint': gradients.mint,
  '--grad-violet': gradients.violet,
  '--grad-warm': gradients.warm,
  // glow / elevation
  '--glow-accent': shadows.glowAccent,
  '--glow-cyan': shadows.glowCyan,
  '--glow-mint': shadows.glowMint,
  '--elev-1': shadows.elev1,
  '--elev-2': shadows.elev2,
  // geometry
  '--r-sm': `${radius.sm}px`,
  '--r': `${radius.md}px`,
  '--r-lg': `${radius.lg}px`,
  '--r-xl': `${radius.xl}px`,
  '--r-pill': `${radius.pill}px`,
  // type
  '--font-display': "var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif",
  '--font-ui': "var(--font-inter), 'Inter', -apple-system, 'Helvetica Neue', sans-serif",
  '--font-mono': "var(--font-jetbrains), 'JetBrains Mono', 'SF Mono', 'Courier New', monospace",
  // motion
  '--ease-smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
  '--ease-power': 'cubic-bezier(0.7, 0, 0.3, 1)',
  '--ease': 'cubic-bezier(0.22, 1, 0.36, 1)',
  '--ease-soft': 'cubic-bezier(0.4, 0, 0.2, 1)',
};

// Tailwind `theme.extend` fragment — mirrors the legacy keys (so `bg-surface`,
// `text-accent`, `font-display`, `border-strong` keep resolving) and adds the
// Aurora palette so new components can use `text-accent-2`, `bg-mint`, etc.
export const tailwindThemeExtend = {
  colors: {
    void: colors.void,
    base: colors.bgBase,
    surface: colors.bgSurface,
    elevated: colors.bgElevated,
    'elevated-2': colors.bgElevated2,
    glass: colors.glass,
    'glass-2': colors.glass2,
    secondary: colors.textSecondary,
    dim: colors.textSecondary,
    muted: colors.textMuted,
    faint: colors.textFaint,
    accent: colors.accent,
    'accent-bright': colors.accentBright,
    'accent-dim': colors.accentDim,
    'accent-2': colors.accent2,
    'accent-3': colors.accent3,
    lime: colors.lime,
    mint: colors.mint,
    cyan: colors.cyan,
    indigo: colors.indigo,
    violet: colors.violet,
    magenta: colors.magenta,
    ok: colors.ok,
    warn: colors.warn,
    bad: colors.bad,
    info: colors.info,
    'zone-high': colors.zoneHigh,
    'zone-mid': colors.zoneMid,
    'zone-low': colors.zoneLow,
    'green-zone': colors.statusGreen,
    'amber-zone': colors.statusAmber,
    border: colors.border,
    'border-strong': colors.borderStrong,
    'border-subtle': colors.borderSubtle,
  },
  fontFamily: {
    display: ['var(--font-space-grotesk)', 'Space Grotesk', 'system-ui', 'sans-serif'],
    ui: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
    mono: ['var(--font-jetbrains)', 'JetBrains Mono', 'monospace'],
  },
  borderRadius: {
    sm: `${radius.sm}px`,
    md: `${radius.md}px`,
    lg: `${radius.lg}px`,
    xl: `${radius.xl}px`,
  },
  backgroundImage: {
    'grad-flux': gradients.flux,
    'grad-cta': gradients.cta,
    'grad-mint': gradients.mint,
    'grad-violet': gradients.violet,
    'grad-warm': gradients.warm,
  },
  boxShadow: {
    'glow-accent': shadows.glowAccent,
    'glow-cyan': shadows.glowCyan,
    'glow-mint': shadows.glowMint,
    'elev-1': shadows.elev1,
    'elev-2': shadows.elev2,
  },
} as const;
