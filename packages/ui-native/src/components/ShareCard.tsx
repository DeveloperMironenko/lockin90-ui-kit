import { useId } from 'react';
import { View, Text, StyleSheet, Pressable, type StyleProp, type ViewStyle, type DimensionValue } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop, G, Path, Rect } from 'react-native-svg';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { colors, radii, fonts } from '@lockin90/tokens';
import { BrandMark } from './BrandMark';

/** One bar of the weekly sparkline (0..100). */
export type ShareSpark = number;

/** A share target chip below the card. */
export interface ShareTarget {
  /** chip label, e.g. "Copy link" */
  label: string;
  /** glyph drawn inside the 24×24 stroked svg */
  icon: 'link' | 'instagram' | 'x' | 'more';
  /** filled gradient pill (the primary action) */
  primary?: boolean;
  onPress?: () => void;
}

export interface ShareCardProps {
  /** big energy score in the ring center (0..100) */
  score?: number;
  /** zone label under the score, e.g. "HIGH" */
  zone?: string;
  /** ring fill fraction 0..1; defaults to score/100 */
  ringFraction?: number;
  /** headline — first line is plain, the (optional) accent word is gradient */
  headline?: string;
  /** the gradient-tinted second word of the headline, e.g. "week." */
  headlineAccent?: string;
  /** sub pill copy, e.g. "+12% vs last week" */
  sub?: string;
  /** date / context eyebrow, e.g. "Jun 9 – 15 · Weekly recap" */
  date?: string;
  /** weekly sparkline values (0..100); the tallest bar is highlighted */
  spark?: ShareSpark[];
  /** hashtag / brand tag, e.g. "#LockIn90" */
  tag?: string;
  /** share-to chips rendered below the card */
  targets?: ShareTarget[];
  style?: StyleProp<ViewStyle>;
}

const DEFAULT_SPARK: ShareSpark[] = [48, 62, 55, 74, 68, 100, 82];

const DEFAULT_TARGETS: ShareTarget[] = [
  { label: 'Copy link', icon: 'link', primary: true },
  { label: 'Instagram', icon: 'instagram' },
  { label: 'X', icon: 'x' },
  { label: 'More', icon: 'more' },
];

/** ring geometry: 120×120 viewBox, stroke ring at r=50 */
const VB = 120;
const RING = 116;
const R = 50;
const CIRC = 2 * Math.PI * R; // ~314.16

/** Trend-up glyph for the sub pill, drawn in a 24×24 viewBox. */
function TrendGlyph({ color }: { color: string }) {
  return (
    <Svg width={12} height={12} viewBox="0 0 24 24">
      <Path d="M5 15l5-5 4 4 6-7" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M16 7h5v5" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/** Share-target glyph, drawn in a 24×24 viewBox, stroked in `color`. */
function TargetGlyph({ icon, color }: { icon: ShareTarget['icon']; color: string }) {
  const stroke = { fill: 'none' as const, stroke: color, strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <Svg width={15} height={15} viewBox="0 0 24 24">
      {icon === 'link' && (
        <>
          <Path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5" {...stroke} />
          <Path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5" {...stroke} />
        </>
      )}
      {icon === 'instagram' && (
        <>
          <Rect x={3} y={3} width={18} height={18} rx={5} {...stroke} />
          <Circle cx={12} cy={12} r={4} {...stroke} />
          <Circle cx={17.5} cy={6.5} r={1.1} fill={color} />
        </>
      )}
      {icon === 'x' && <Path d="M4 4l16 16M20 4L4 20" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" />}
      {icon === 'more' && (
        <>
          <Circle cx={5} cy={12} r={1.6} fill={color} />
          <Circle cx={12} cy={12} r={1.6} fill={color} />
          <Circle cx={19} cy={12} r={1.6} fill={color} />
        </>
      )}
    </Svg>
  );
}

/**
 * ShareCard (native) — a branded, shareable "story" card. A dark mesh-gradient
 * canvas holds a big energy-score ring, a headline stat with a gradient accent
 * word, a weekly sparkline, a date eyebrow, and the LockIn90 brand mark in the
 * footer; a row of share-target chips sits below the card. Same prop API as the
 * web component (`onPress` instead of `onClick` on targets).
 */
export function ShareCard({
  score = 84,
  zone = 'HIGH',
  ringFraction,
  headline = 'Strong',
  headlineAccent = 'week.',
  sub = '+12% vs last week',
  date = 'Jun 9 – 15 · Weekly recap',
  spark = DEFAULT_SPARK,
  tag = '#LockIn90',
  targets = DEFAULT_TARGETS,
  style,
}: ShareCardProps) {
  const uid = useId();
  const ringId = `lk-share-ring-${uid}`;
  const frac = Math.max(0, Math.min(1, ringFraction ?? score / 100));
  const dash = `${(CIRC * frac).toFixed(1)} ${(CIRC * (1 - frac)).toFixed(1)}`;
  const peak = spark.length ? Math.max(...spark) : 0;

  const label = `Shareable energy card: score ${score}, ${headline} ${headlineAccent}, ${sub}, ${date}. LockIn90.`;

  return (
    <View style={[styles.root, style]}>
      <View style={styles.card} accessibilityRole="image" accessibilityLabel={label}>
        {/* mesh canvas: dark bg + a diagonal violet→cyan→lime→mint wash approximating the radial mesh */}
        <ExpoLinearGradient
          colors={['rgba(124,92,255,0.34)', 'rgba(34,211,238,0.22)', 'rgba(168,255,53,0.18)', 'rgba(52,245,197,0.16)']}
          locations={[0, 0.4, 0.75, 1]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />

        <View style={styles.pad}>
          <Text style={styles.eyb}>{date}</Text>

          <View style={styles.mid}>
            <View style={styles.ringwrap}>
              <View style={styles.ring}>
                <Svg width={RING} height={RING} viewBox={`0 0 ${VB} ${VB}`}>
                  <Defs>
                    <LinearGradient id={ringId} x1="0" y1="0" x2="1" y2="1">
                      <Stop offset="0" stopColor={colors.lime} />
                      <Stop offset="0.5" stopColor={colors.cyan} />
                      <Stop offset="1" stopColor={colors.violet} />
                    </LinearGradient>
                  </Defs>
                  <Circle cx={60} cy={60} r={R} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth={11} />
                  {/* rotate -90 so the arc fill starts at 12 o'clock */}
                  <G rotation={-90} originX={60} originY={60}>
                    <Circle
                      cx={60}
                      cy={60}
                      r={R}
                      fill="none"
                      stroke={`url(#${ringId})`}
                      strokeWidth={11}
                      strokeLinecap="round"
                      strokeDasharray={dash}
                    />
                  </G>
                </Svg>
                <View style={styles.ringCenter} pointerEvents="none">
                  <Text style={styles.ringNum}>{score}</Text>
                  <Text style={styles.ringZone}>{zone}</Text>
                </View>
              </View>

              <View style={styles.head}>
                <Text style={styles.headline}>
                  {headline}
                  {headlineAccent ? '\n' : ''}
                  {headlineAccent ? <Text style={styles.headlineAccent}>{headlineAccent}</Text> : null}
                </Text>
                {sub ? (
                  <View style={styles.sub}>
                    <TrendGlyph color={colors.zoneHigh} />
                    <Text style={styles.subText}>{sub}</Text>
                  </View>
                ) : null}
              </View>
            </View>

            <View style={styles.spark}>
              {spark.map((v, i) => {
                const h = `${Math.max(0, Math.min(100, v))}%` as DimensionValue;
                const isPeak = v === peak;
                return (
                  <View key={i} style={styles.barWrap}>
                    <ExpoLinearGradient
                      colors={isPeak ? [colors.lime, colors.cyan] : [colors.cyan, colors.violet]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      style={[styles.bar, { height: h }]}
                    />
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.foot}>
            <View style={styles.brand}>
              <BrandMark variant="mark" size={30} />
              <Text style={styles.brandNm}>
                LockIn<Text style={styles.brandNm90}>90</Text>
              </Text>
            </View>
            {tag ? <Text style={styles.tag}>{tag}</Text> : null}
          </View>
        </View>
      </View>

      <View style={styles.targets} accessibilityRole="menu" accessibilityLabel="Share to">
        {targets.map((t, i) => {
          const tint = t.primary ? '#0A0A12' : colors.textDim;
          return (
            <Pressable
              key={i}
              onPress={t.onPress}
              accessibilityRole="button"
              accessibilityLabel={t.label}
              style={({ pressed }) => [styles.tgt, t.primary && styles.tgtPrimary, pressed && styles.tgtPressed]}
            >
              {t.primary ? (
                <ExpoLinearGradient
                  colors={[colors.accent, colors.cyan]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
              ) : null}
              <TargetGlyph icon={t.icon} color={tint} />
              <Text style={[styles.tgtText, { color: tint, fontWeight: t.primary ? '600' : '500' }]}>{t.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: 18, alignItems: 'flex-start' },
  card: {
    position: 'relative',
    width: 320,
    aspectRatio: 4 / 5,
    borderRadius: radii.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#0B0E1A',
  },
  pad: { flex: 1, padding: 22, paddingBottom: 20, justifyContent: 'space-between' },
  eyb: { fontFamily: fonts.mono, fontSize: 9.5, textTransform: 'uppercase', letterSpacing: 2.4, color: colors.textDim },
  mid: { flex: 1, justifyContent: 'center', gap: 16 },
  ringwrap: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  ring: { width: RING, height: RING, alignItems: 'center', justifyContent: 'center' },
  ringCenter: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  ringNum: { fontFamily: fonts.display, fontWeight: '700', fontSize: 40, lineHeight: 44, color: colors.text },
  ringZone: { fontFamily: fonts.mono, fontSize: 11, letterSpacing: 4, color: colors.zoneHigh, marginTop: 2 },
  head: { flex: 1, gap: 4 },
  headline: { fontFamily: fonts.display, fontWeight: '700', fontSize: 26, lineHeight: 27, letterSpacing: -0.5, color: colors.text },
  headlineAccent: { color: colors.cyan },
  sub: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    marginTop: 2,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(52,245,197,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(52,245,197,0.35)',
  },
  subText: { fontFamily: fonts.mono, fontSize: 12, color: colors.zoneHigh },
  spark: { flexDirection: 'row', alignItems: 'flex-end', gap: 7, height: 44, marginTop: 6 },
  barWrap: { flex: 1, height: '100%', justifyContent: 'flex-end' },
  bar: { width: '100%', borderTopLeftRadius: 4, borderTopRightRadius: 4, borderBottomLeftRadius: 2, borderBottomRightRadius: 2 },
  foot: { marginTop: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  brandNm: { fontFamily: fonts.display, fontWeight: '700', fontSize: 18, letterSpacing: -0.2, color: colors.text },
  brandNm90: { color: colors.lime },
  tag: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.textFaint,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    paddingVertical: 5,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  targets: { flexDirection: 'row', alignItems: 'center', gap: 8, width: 320, flexWrap: 'wrap' },
  tgt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
    overflow: 'hidden',
  },
  tgtPrimary: { borderColor: 'transparent' },
  tgtPressed: { opacity: 0.85 },
  tgtText: { fontFamily: fonts.ui, fontSize: 12.5 },
});
