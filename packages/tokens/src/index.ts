/**
 * @lockin90/tokens — LockIn90 "Aurora Flux" design tokens as typed raw values.
 *
 * Web consumers should also import the CSS custom properties once at the app
 * root: `import '@lockin90/tokens/tokens.css'` and reference `var(--accent)` etc.
 * Native (React Native) consumers use these raw values directly in StyleSheet,
 * since `var(--x)` is not available there.
 */

/** Core palette — resolved hex / rgba values (single source of truth). */
export const colors = {
  // surfaces
  void: '#05060B',
  bg0: '#080A12',
  bg1: '#0C0F1A',
  bg2: '#11151F',
  glass: 'rgba(255,255,255,0.045)',
  glass2: 'rgba(255,255,255,0.075)',
  border: 'rgba(255,255,255,0.09)',
  border2: 'rgba(255,255,255,0.16)',
  // text
  text: '#EEF1F8',
  textDim: '#AAB2C6',
  textFaint: '#828B9F',
  // energy spectrum
  lime: '#A8FF35',
  mint: '#34F5C5',
  cyan: '#22D3EE',
  indigo: '#6E7BFF',
  violet: '#A855F7',
  magenta: '#FF3D81',
  orange: '#FF8A3D', // recovery tint (design `--orange`)
  // accents
  accent: '#7C5CFF',
  accent2: '#22D3EE',
  accent3: '#34F5C5',
  // energy zones (signal)
  zoneHigh: '#34F5C5',
  zoneMid: '#FFB020',
  zoneLow: '#FF4D6D',
  // status
  ok: '#34F5C5',
  warn: '#FFB020',
  bad: '#FF4D6D',
  info: '#6E7BFF',
} as const;

/**
 * Gradient stops as ordered color arrays + the design angle, ready for
 * `expo-linear-gradient` / `react-native-linear-gradient` on native and for
 * reconstructing `linear-gradient(...)` on web.
 */
export const gradients = {
  flux: { angle: 100, stops: ['#A8FF35', '#34F5C5', '#22D3EE', '#7C5CFF', '#FF3D81'] },
  cta: { angle: 135, stops: ['#7C5CFF', '#22D3EE'] },
  mint: { angle: 135, stops: ['#34F5C5', '#22D3EE'] },
  violet: { angle: 135, stops: ['#A855F7', '#6E7BFF'] },
  warm: { angle: 135, stops: ['#FFB020', '#FF4D6D'] },
} as const;

/** Corner radii (px). */
export const radii = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
} as const;

/** Font families (load the actual fonts via your platform's font loader). */
export const fonts = {
  display: 'Space Grotesk',
  ui: 'Inter',
  mono: 'JetBrains Mono',
} as const;

/** Glow / elevation shadows (web box-shadow strings). */
export const shadows = {
  glowAccent: '0 0 40px rgba(124,92,255,0.35)',
  glowCyan: '0 0 36px rgba(34,211,238,0.30)',
  glowMint: '0 0 36px rgba(52,245,197,0.30)',
  elev1: '0 2px 20px rgba(0,0,0,0.45)',
  elev2: '0 18px 50px -12px rgba(0,0,0,0.7)',
} as const;

/** Native (React Native) shadow descriptors for the same elevations. */
// Softened 2026-07: the old values (elev2 at 0.7 opacity / 18px offset) rendered as a
// HARD, offset dark box-shadow on the RN New Architecture (Fabric) instead of a soft
// drop. Lower opacity + smaller offset + wider radius read as a soft shadow on device.
// True CSS box-shadows via RN's New-Architecture `boxShadow` style prop (RN 0.76+,
// Fabric): the SAME strings as the web `shadows` tokens, so both platforms render
// identical shadow geometry. The legacy iOS layer-shadow props (shadowColor/Opacity/
// Radius/Offset) are gone deliberately — they bleed through translucent glass
// backgrounds and trace content rects, which read as a hard "glossy" smear on device.
export const nativeShadows = {
  elev1: { boxShadow: shadows.elev1 },
  elev2: { boxShadow: shadows.elev2 },
  glowAccent: { boxShadow: shadows.glowAccent },
  glowCyan: { boxShadow: shadows.glowCyan },
  glowMint: { boxShadow: shadows.glowMint },
} as const;

/** Motion primitives. */
export const motion = {
  /** cubic-bezier(0.22, 1, 0.36, 1) */
  ease: [0.22, 1, 0.36, 1] as const,
  /** cubic-bezier(0.4, 0, 0.2, 1) */
  easeSoft: [0.4, 0, 0.2, 1] as const,
  /** default reveal duration, ms */
  dur: 550,
} as const;

/** The signature brand mark colors (energy line + peak dot). */
export const brand = {
  line: '#78CEDF',
  dot: '#C6F84E',
  iconBg: ['#1b2438', '#0b0f18'] as const,
  iconGlow: '#5d40ad',
} as const;

/** Everything, bundled. */
export const tokens = { colors, gradients, radii, fonts, shadows, nativeShadows, motion, brand } as const;

export type Colors = typeof colors;
export type ColorToken = keyof Colors;
export type Gradients = typeof gradients;
export type GradientToken = keyof Gradients;
export type Radii = typeof radii;
export type Tokens = typeof tokens;

/** Map a color token to its CSS custom property, e.g. `cssVar('zoneHigh')` → `var(--zone-high)`. */
const cssVarName: Record<ColorToken, string> = {
  void: '--void', bg0: '--bg-0', bg1: '--bg-1', bg2: '--bg-2',
  glass: '--glass', glass2: '--glass-2', border: '--border', border2: '--border-2',
  text: '--text', textDim: '--text-dim', textFaint: '--text-faint',
  lime: '--lime', mint: '--mint', cyan: '--cyan', indigo: '--indigo', violet: '--violet', magenta: '--magenta', orange: '--orange',
  accent: '--accent', accent2: '--accent-2', accent3: '--accent-3',
  zoneHigh: '--zone-high', zoneMid: '--zone-mid', zoneLow: '--zone-low',
  ok: '--ok', warn: '--warn', bad: '--bad', info: '--info',
};

/** `cssVar('accent')` → `'var(--accent)'`. */
export function cssVar(token: ColorToken): string {
  return `var(${cssVarName[token]})`;
}

/** Reconstruct a web `linear-gradient(...)` string from a gradient token. */
export function gradientCss(token: GradientToken): string {
  const g = gradients[token];
  return `linear-gradient(${g.angle}deg, ${g.stops.join(', ')})`;
}

export default tokens;
