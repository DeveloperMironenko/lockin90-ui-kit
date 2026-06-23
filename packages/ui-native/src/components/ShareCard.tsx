import { type ReactNode } from 'react';
import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { colors, radii, fonts, nativeShadows } from '@lockin90/tokens';
import { Ring } from './Ring';
import { BrandMark } from './BrandMark';
import { Icon, type IconName } from './Icon';

/** Mesh / gradient backdrop colorway (mirrors the `@lockin90/tokens` gradients). */
export type ShareCardGradient = 'flux' | 'cta' | 'violet' | 'mint';
/** Export aspect ratio — `square` 1:1, `story` 9:16, `wide` 16:9. */
export type ShareCardAspect = 'square' | 'story' | 'wide';

export interface ShareCardProps {
  /** eyebrow above the value, e.g. `'Energy Score'` / `'Today'` */
  title?: string;
  /** big headline number / text, e.g. `'87'` */
  value?: string;
  /** `0..1` → a Ring drawn around the `value`. Omit to hide the ring. */
  ring?: number;
  /** small caption under the value */
  subtitle?: ReactNode;
  /** mesh / gradient backdrop @default 'flux' */
  gradient?: ShareCardGradient;
  /** show the corner BrandMark @default true */
  brand?: boolean;
  /** optional `data from {device}` provider logo, e.g. `'oura'` / `'whoop'` */
  device?: IconName;
  /** export aspect @default 'square' */
  aspect?: ShareCardAspect;
  style?: StyleProp<ViewStyle>;
}

type Blob = { cx: number; cy: number; r: number; color: string; opacity: number };

/** Per-gradient mesh blobs — mirrors the web `.lk-sc-{gradient} .lk-sc-mesh` radials. */
const MESH: Record<ShareCardGradient, Blob[]> = {
  flux: [
    { cx: 0.14, cy: 0.1, r: 0.55, color: '#7C5CFF', opacity: 0.42 },
    { cx: 0.88, cy: 0.16, r: 0.5, color: '#22D3EE', opacity: 0.34 },
    { cx: 0.78, cy: 0.92, r: 0.6, color: '#FF3D81', opacity: 0.3 },
    { cx: 0.16, cy: 0.9, r: 0.55, color: '#34F5C5', opacity: 0.26 },
  ],
  cta: [
    { cx: 0.16, cy: 0.12, r: 0.58, color: '#7C5CFF', opacity: 0.46 },
    { cx: 0.86, cy: 0.2, r: 0.55, color: '#22D3EE', opacity: 0.38 },
    { cx: 0.8, cy: 0.9, r: 0.6, color: '#7C5CFF', opacity: 0.28 },
    { cx: 0.14, cy: 0.88, r: 0.55, color: '#22D3EE', opacity: 0.22 },
  ],
  violet: [
    { cx: 0.16, cy: 0.12, r: 0.58, color: '#A855F7', opacity: 0.46 },
    { cx: 0.86, cy: 0.2, r: 0.55, color: '#6E7BFF', opacity: 0.38 },
    { cx: 0.8, cy: 0.9, r: 0.6, color: '#A855F7', opacity: 0.26 },
    { cx: 0.14, cy: 0.88, r: 0.55, color: '#7C5CFF', opacity: 0.24 },
  ],
  mint: [
    { cx: 0.16, cy: 0.1, r: 0.58, color: '#34F5C5', opacity: 0.44 },
    { cx: 0.86, cy: 0.18, r: 0.52, color: '#22D3EE', opacity: 0.36 },
    { cx: 0.8, cy: 0.92, r: 0.6, color: '#A8FF35', opacity: 0.26 },
    { cx: 0.14, cy: 0.9, r: 0.55, color: '#34F5C5', opacity: 0.24 },
  ],
};

/** Per-gradient arc stops for the centre Ring (first → last of the token gradient). */
const RING_STOPS: Record<ShareCardGradient, [string, string]> = {
  flux: [colors.lime, colors.accent],
  cta: [colors.accent, colors.cyan],
  violet: [colors.violet, colors.indigo],
  mint: [colors.mint, colors.cyan],
};

const ASPECT: Record<ShareCardAspect, { ratio: number; maxWidth: number }> = {
  square: { ratio: 1, maxWidth: 440 },
  story: { ratio: 9 / 16, maxWidth: 320 },
  wide: { ratio: 16 / 9, maxWidth: 560 },
};

/**
 * ShareCard — a branded, export-ready score card: a `void` panel filled with a
 * recolored radial-gradient *mesh* (per `gradient`) under a glassy sheen, sized
 * to `aspect` (1:1 / 9:16 / 16:9). Composes the shared `Ring` (around the big
 * `value`), the `BrandMark` lockup in a corner (when `brand`), and a
 * `data from • {device}` footer (when `device`). The most visual primitive —
 * tokens-driven; web twin lives in `@lockin90/ui` with an identical name, props
 * and visuals.
 */
export function ShareCard({
  title,
  value,
  ring,
  subtitle,
  gradient = 'flux',
  brand = true,
  device,
  aspect = 'square',
  style,
}: ShareCardProps) {
  const hasRing = typeof ring === 'number';
  const { ratio, maxWidth } = ASPECT[aspect];
  const blobs = MESH[gradient];

  const valueNode = value ? <Text style={styles.value}>{value}</Text> : null;

  return (
    <View style={[styles.card, { aspectRatio: ratio, maxWidth }, style]}>
      {/* mesh — soft recolored radial blobs (mirrors the web mesh) */}
      <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          {blobs.map((b, i) => (
            <RadialGradient key={i} id={`scm${i}`} cx={`${b.cx * 100}%`} cy={`${b.cy * 100}%`} r={`${b.r * 100}%`}>
              <Stop offset="0" stopColor={b.color} stopOpacity={b.opacity} />
              <Stop offset="0.6" stopColor={b.color} stopOpacity={0} />
            </RadialGradient>
          ))}
        </Defs>
        {blobs.map((_, i) => (
          <Rect key={i} x="0" y="0" width="100%" height="100%" fill={`url(#scm${i})`} />
        ))}
      </Svg>

      {/* glossy top-right sheen */}
      <View style={styles.sheen} pointerEvents="none" />

      {/* header: brand lockup + device lockup */}
      {(brand || device) && (
        <View style={styles.head}>
          {brand ? <BrandMark variant="lockup" size={22} /> : <View />}
          {device ? (
            <View style={styles.dev}>
              <Text style={styles.devLbl}>DATA FROM</Text>
              <Text style={styles.devDot}>•</Text>
              <Icon name={device} size={20} color={colors.violet} />
            </View>
          ) : null}
        </View>
      )}

      {/* center: title eyebrow + ring/value + subtitle */}
      <View style={[styles.body, aspect === 'wide' && styles.bodyWide]}>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        {hasRing ? (
          <Ring
            value={Math.max(0, Math.min(1, ring)) * 100}
            size={184}
            thickness={14}
            gradient={RING_STOPS[gradient]}
          >
            {valueNode}
          </Ring>
        ) : (
          valueNode
        )}
        {subtitle != null ? (
          typeof subtitle === 'string' || typeof subtitle === 'number' ? (
            <Text style={styles.sub}>{subtitle}</Text>
          ) : (
            <View>{subtitle}</View>
          )
        ) : null}
      </View>

      {/* footer watermark */}
      <Text style={styles.foot}>lockin90.com</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    width: '100%',
    padding: 32,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border2,
    backgroundColor: colors.void,
    overflow: 'hidden',
    justifyContent: 'space-between',
    ...nativeShadows.elev2,
  },
  sheen: {
    position: 'absolute',
    right: -50,
    top: -70,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  dev: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  devLbl: {
    fontFamily: fonts.mono,
    fontSize: 9.5,
    letterSpacing: 1.6,
    color: colors.textFaint,
  },
  devDot: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.textFaint,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  bodyWide: {
    gap: 12,
  },
  title: {
    fontFamily: fonts.mono,
    fontSize: 12,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: colors.textDim,
    textAlign: 'center',
  },
  value: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 56,
    letterSpacing: -1.4,
    lineHeight: 60,
    color: colors.text,
    textAlign: 'center',
  },
  sub: {
    maxWidth: 280,
    fontFamily: fonts.ui,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textDim,
    textAlign: 'center',
  },
  foot: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 0.6,
    color: colors.textFaint,
    textAlign: 'center',
  },
});
