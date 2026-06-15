// LOCKIN90 — design tokens (single source of truth)
// Consumed directly by React Native (StyleSheet), and used to generate the web
// `tokens.css` (:root custom properties) + the Tailwind preset.
//
// VISUAL LANGUAGE: "Aurora Flux" — deep-void glassmorphism, a flowing
// energy-spectrum gradient (lime → mint → cyan → indigo → violet → magenta),
// glow / soft elevation, rounded glass radii, Space Grotesk display type.
//
// These values mirror the canonical design source `mockups/design/1/shared/
// tokens.css` exactly — that preview is the contract the whole kit is rebuilt
// against. CSS-var names below match the design (`--bg-0/1/2`, `--text-dim`,
// `--text-faint`, `--accent`, `--grad-*`, …) so authored markup and the shipped
// `styles.css` resolve identically to the mockups.

export const colors = {
  // ---- surfaces (deep void → elevated glass panels) ----
  void: '#05060B',
  bg0: '#080A12', // page base
  bg1: '#0C0F1A', // panel
  bg2: '#11151F', // elevated panel

  // translucent glass fills (pair with backdrop-blur on web / BlurView in RN)
  glass: 'rgba(255,255,255,0.045)',
  glass2: 'rgba(255,255,255,0.075)',

  // ---- hairline borders over the void ----
  border: 'rgba(255,255,255,0.09)',
  border2: 'rgba(255,255,255,0.16)',

  // ---- text (3 tiers in the design + one darker "ghost" for disabled) ----
  text: '#EEF1F8',
  textDim: '#AAB2C6',
  textFaint: '#6A7286',
  textGhost: '#3A4154',

  // ---- energy spectrum (the signature gradient stops) ----
  lime: '#A8FF35',
  mint: '#34F5C5',
  cyan: '#22D3EE',
  indigo: '#6E7BFF',
  violet: '#A855F7',
  magenta: '#FF3D81',

  // ---- accents (electric indigo-violet primary + cyan / mint partners) ----
  accent: '#7C5CFF',
  accent2: '#22D3EE', // cyan
  accent3: '#34F5C5', // mint
  crimson: '#E11D48', // quick-action accent (Log FAB)

  // ---- energy zones (signal colors, recolored away from the shipped red) ----
  zoneHigh: '#34F5C5',
  zoneMid: '#FFB020',
  zoneLow: '#FF4D6D',

  // ---- semantic status ----
  ok: '#34F5C5',
  warn: '#FFB020',
  bad: '#FF4D6D',
  info: '#6E7BFF',
} as const;

// Energy-spectrum gradients. Web: CSS `linear-gradient(...)` strings (emitted as
// CSS vars + a Tailwind `backgroundImage` preset). Native: use `gradientStops.*`
// with expo-linear-gradient `colors={...}`.
export const gradients = {
  flux: 'linear-gradient(100deg, #A8FF35, #34F5C5, #22D3EE, #7C5CFF, #FF3D81)',
  cta: 'linear-gradient(135deg, #7C5CFF 0%, #22D3EE 100%)',
  mint: 'linear-gradient(135deg, #34F5C5 0%, #22D3EE 100%)',
  violet: 'linear-gradient(135deg, #A855F7 0%, #6E7BFF 100%)',
  warm: 'linear-gradient(135deg, #FFB020 0%, #FF4D6D 100%)',
} as const;

export type GradientName = keyof typeof gradients;

// Ordered color stops for each gradient — for React Native (expo-linear-gradient)
// and SVG <linearGradient> stops on the web.
export const gradientStops: Record<GradientName, readonly string[]> = {
  flux: ['#A8FF35', '#34F5C5', '#22D3EE', '#7C5CFF', '#FF3D81'],
  cta: ['#7C5CFF', '#22D3EE'],
  mint: ['#34F5C5', '#22D3EE'],
  violet: ['#A855F7', '#6E7BFF'],
  warm: ['#FFB020', '#FF4D6D'],
} as const;

// Glow + soft elevation (the opposite of the shipped "no shadows"). Web CSS box-shadow.
export const shadows = {
  glowAccent: '0 0 40px rgba(124,92,255,0.35)',
  glowCyan: '0 0 36px rgba(34,211,238,0.30)',
  glowMint: '0 0 36px rgba(52,245,197,0.30)',
  elev1: '0 2px 20px rgba(0,0,0,0.45)',
  elev2: '0 18px 50px -12px rgba(0,0,0,0.7)',
} as const;

// React Native font family names — Space Grotesk (display) · Inter (UI) ·
// JetBrains Mono (data). Load these via @expo-google-fonts/* in the app.
export const fonts = {
  display: 'SpaceGrotesk_700Bold',
  displayMedium: 'SpaceGrotesk_500Medium',
  displaySemibold: 'SpaceGrotesk_600SemiBold',
  ui: 'Inter_400Regular',
  uiMedium: 'Inter_500Medium',
  uiSemibold: 'Inter_600SemiBold',
  uiBold: 'Inter_700Bold',
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
  aurora: [0.22, 1, 0.36, 1] as const, // --ease
  soft: [0.4, 0, 0.2, 1] as const, // --ease-soft
} as const;

export const durations = {
  fast: 120,
  base: 220,
  slow: 360,
  slower: 550, // --dur 0.55s
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

/** The gradient that matches a 0–100 energy score's zone. */
export function zoneGradient(score: number): GradientName {
  if (score >= 67) return 'mint';
  return 'warm';
}

// --- Web bridge -----------------------------------------------------------
// CSS custom properties — names mirror design/1/shared/tokens.css exactly so the
// shipped components + the design mockups resolve identically. Font vars
// reference per-app next/font variables first, then fall back to the literal
// family (loaded via Google Fonts in standalone / Storybook contexts).
export const cssVars: Record<string, string> = {
  // surfaces
  '--void': colors.void,
  '--bg-0': colors.bg0,
  '--bg-1': colors.bg1,
  '--bg-2': colors.bg2,
  '--glass': colors.glass,
  '--glass-2': colors.glass2,
  // borders
  '--border': colors.border,
  '--border-2': colors.border2,
  // text
  '--text': colors.text,
  '--text-dim': colors.textDim,
  '--text-faint': colors.textFaint,
  '--text-ghost': colors.textGhost,
  // spectrum
  '--lime': colors.lime,
  '--mint': colors.mint,
  '--cyan': colors.cyan,
  '--indigo': colors.indigo,
  '--violet': colors.violet,
  '--magenta': colors.magenta,
  // accents
  '--accent': colors.accent,
  '--accent-2': colors.accent2,
  '--accent-3': colors.accent3,
  '--crimson': colors.crimson,
  // zones / status
  '--zone-high': colors.zoneHigh,
  '--zone-mid': colors.zoneMid,
  '--zone-low': colors.zoneLow,
  '--ok': colors.ok,
  '--warn': colors.warn,
  '--bad': colors.bad,
  '--info': colors.info,
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
  '--ease': 'cubic-bezier(0.22, 1, 0.36, 1)',
  '--ease-soft': 'cubic-bezier(0.4, 0, 0.2, 1)',
  '--dur': '0.55s',
};

// Tailwind `theme.extend` fragment — exposes the Aurora palette as utility
// classes (`text-accent-2`, `bg-mint`, `border-border-2`, `shadow-glow-accent`,
// `bg-grad-flux`, `font-display`, …) for apps that opt into Tailwind. The shipped
// components do NOT depend on Tailwind — they emit `lk-*` classes from styles.css.
export const tailwindThemeExtend = {
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
    ghost: colors.textGhost,
    lime: colors.lime,
    mint: colors.mint,
    cyan: colors.cyan,
    indigo: colors.indigo,
    violet: colors.violet,
    magenta: colors.magenta,
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
  borderRadius: {
    sm: `${radius.sm}px`,
    md: `${radius.md}px`,
    lg: `${radius.lg}px`,
    xl: `${radius.xl}px`,
    pill: `${radius.pill}px`,
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
