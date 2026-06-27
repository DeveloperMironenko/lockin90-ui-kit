import { View, Text, StyleSheet, type ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, fonts, gradients, nativeShadows } from '@lockin90/tokens';
import { BrandMark } from './BrandMark';
import { GradientText } from './GradientText';
import { Ring } from './Ring';
import { Stat } from './Stat';

export type ShareCardGradient = 'flux' | 'cta' | 'mint' | 'violet';
export type ShareCardSize = 'sm' | 'md' | 'lg';

export interface ShareCardStat {
  label: string;
  value: string;
}

export interface ShareCardProps extends ViewProps {
  /** small mono eyebrow above the metric (e.g. a date range or "Avg energy"). */
  title?: string;
  /** the headline — a number or short string (shown big, or inside the `ring`). */
  metric: string | number;
  /** small mono caption under the metric (e.g. a zone, "out of 100"). */
  metricLabel?: string;
  /** render a `Ring` with `metric` as its centered readout instead of a big number.
   *  `value` is mapped onto 0–100 against `max` (default 100). */
  ring?: { value: number; max?: number };
  /** up to 3 supporting stats (rendered with the `Stat` primitive). */
  stats?: ShareCardStat[];
  /** show the LockIn90 `BrandMark` lockup + watermark @default true */
  brand?: boolean;
  /** aurora wash + ring/headline gradient @default 'flux' */
  gradient?: ShareCardGradient;
  /** share aspect + scale @default 'md' (sm 1:1 · md 4:5 · lg 9:16) */
  size?: ShareCardSize;
}

const SIZES: Record<
  ShareCardSize,
  { aspectRatio: number; pad: number; eyebrow: number; metric: number; score: number; label: number; brand: number; ring: number; thickness: number; wm: number }
> = {
  sm: { aspectRatio: 1, pad: 18, eyebrow: 9, metric: 44, score: 34, label: 9, brand: 18, ring: 96, thickness: 8, wm: 7 },
  md: { aspectRatio: 4 / 5, pad: 22, eyebrow: 10, metric: 56, score: 42, label: 9.5, brand: 20, ring: 120, thickness: 9, wm: 7.5 },
  lg: { aspectRatio: 9 / 16, pad: 26, eyebrow: 10, metric: 64, score: 48, label: 9.5, brand: 22, ring: 140, thickness: 10, wm: 8 },
};

/**
 * ShareCard — the branded, shareable progress/score card users post to socials:
 * a `BrandMark` lockup, a headline `metric` (a big `GradientText` number or a
 * `Ring` readout), an optional caption, and up to three supporting `Stat`s, on
 * an Aurora-gradient wash. The `gradient` token drives the wash + ring/text
 * gradient; `size` picks the share aspect (1:1 / 4:5 / 9:16). Composed from
 * BrandMark + GradientText + Ring + Stat. Mirrors the web `@lockin90/ui`
 * ShareCard. This is the *only* sanctioned share card — never hand-roll one.
 */
export function ShareCard({
  title,
  metric,
  metricLabel,
  ring,
  stats,
  brand = true,
  gradient = 'flux',
  size = 'md',
  style,
  ...rest
}: ShareCardProps) {
  const S = SIZES[size];
  const g = gradients[gradient];
  const arc: [string, string] = [g.stops[0], g.stops[g.stops.length - 1]];
  // GradientText only exposes flux/cta/violet — mint headlines fall back to flux
  // (the wash + ring still carry the true mint tint).
  const headlineGradient = gradient === 'cta' ? 'cta' : gradient === 'violet' ? 'violet' : 'flux';
  const ringPct = ring ? Math.max(0, Math.min(100, (ring.value / (ring.max ?? 100)) * 100)) : 0;
  const visibleStats = stats?.slice(0, 3) ?? [];

  return (
    <View style={[styles.card, { aspectRatio: S.aspectRatio, padding: S.pad }, style]} {...rest}>
      <LinearGradient
        colors={g.stops as unknown as readonly [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.wash}
        pointerEvents="none"
      />

      <View style={styles.top}>{brand ? <BrandMark variant="lockup" size={S.brand} /> : null}</View>

      <View style={styles.body}>
        {title ? <Text style={[styles.eyebrow, { fontSize: S.eyebrow }]}>{title}</Text> : null}

        {ring ? (
          <Ring value={ringPct} size={S.ring} thickness={S.thickness} gradient={arc}>
            <Text style={[styles.score, { fontSize: S.score }]}>{String(metric)}</Text>
          </Ring>
        ) : (
          <GradientText gradient={headlineGradient} style={[styles.metric, { fontSize: S.metric }]}>
            {String(metric)}
          </GradientText>
        )}

        {metricLabel ? <Text style={[styles.metricLabel, { fontSize: S.label }]}>{metricLabel}</Text> : null}

        {visibleStats.length > 0 ? (
          <View style={styles.stats}>
            {visibleStats.map((s, i) => (
              <Stat key={`${s.label}-${i}`} label={s.label} value={s.value} style={styles.stat} />
            ))}
          </View>
        ) : null}
      </View>

      {brand ? (
        <View style={styles.foot}>
          <Text style={[styles.wm, { fontSize: S.wm }]}>lockin90.com</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'space-between',
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border2,
    backgroundColor: colors.void,
    ...nativeShadows.elev2,
  },
  // aurora wash — a subtle token-gradient over the void surface (kept low so the
  // void dominates the center and light --text stays legible, ~matching the web mesh)
  wash: { ...StyleSheet.absoluteFillObject, opacity: 0.32 },
  top: { position: 'relative' },
  body: { flex: 1, position: 'relative', alignItems: 'center', justifyContent: 'center', gap: 10 },
  eyebrow: { fontFamily: fonts.mono, letterSpacing: 2, textTransform: 'uppercase', color: colors.textDim },
  metric: { fontFamily: fonts.display, fontWeight: '700', letterSpacing: -1.6, color: colors.text },
  score: { fontFamily: fonts.display, fontWeight: '700', letterSpacing: -1.4, color: colors.text, textAlign: 'center' },
  metricLabel: { fontFamily: fonts.mono, letterSpacing: 1.6, textTransform: 'uppercase', color: colors.textDim },
  stats: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16, marginTop: 6 },
  stat: { alignItems: 'center' },
  foot: { position: 'relative', alignItems: 'center' },
  wm: { fontFamily: fonts.mono, letterSpacing: 0.6, color: colors.textFaint },
});
