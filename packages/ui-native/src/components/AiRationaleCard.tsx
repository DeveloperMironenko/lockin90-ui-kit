import { View, Text, StyleSheet, type ViewProps } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';
import { Card } from './Card';
import { Chip } from './Chip';

/** One inline prose segment. `tone` colours it green (helped) or red (hurt). */
export interface AiProseSegment {
  text: string;
  tone?: 'good' | 'bad';
}

/** One "what drove this" contribution row. */
export interface AiFactor {
  /** factor label, e.g. 'Sleep' */
  name: string;
  /** signed point contribution, e.g. 6 or -5 */
  pts: number;
  /** direction — drives dot/track/points color (defaults to sign of `pts`) */
  dir?: 'pos' | 'neg';
  /** track fill, 0..100 (magnitude of influence) */
  fill: number;
}

export interface AiRationaleCardProps extends ViewProps {
  /** card title (the score can be embedded in the string) */
  title?: string;
  /** prose rationale as an array of segments; segments with a `tone` are highlighted */
  prose?: AiProseSegment[];
  /** "what drove this" contribution rows */
  factors?: AiFactor[];
  /** confidence percent 0..100 shown in the footer */
  confidence?: number;
  /** provenance line */
  source?: string;
  /** eyebrow over the title */
  eyebrow?: string;
  /** label of the status chip top-right (omit to hide) */
  badge?: string;
  /** heading for the factor list */
  factorsLabel?: string;
}

const DEFAULT_PROSE: AiProseSegment[] = [
  { text: 'Your ' },
  { text: '8h 12m of sleep', tone: 'good' },
  { text: ' and a dose of ' },
  { text: 'morning sunlight', tone: 'good' },
  { text: ' set you up well and lifted today’s baseline. But a ' },
  { text: '6:40pm espresso', tone: 'bad' },
  { text: ' landed deep inside your caffeine-sensitivity window, and ' },
  { text: 'a missed lunch', tone: 'bad' },
  { text: ' left a mid-afternoon glucose gap — together they trimmed the high you’d otherwise have hit.' },
];

const DEFAULT_FACTORS: AiFactor[] = [
  { name: 'Sleep', pts: 6, dir: 'pos', fill: 75 },
  { name: 'Morning sunlight', pts: 3, dir: 'pos', fill: 38 },
  { name: 'Late caffeine', pts: -5, dir: 'neg', fill: 63 },
  { name: 'Missed lunch', pts: -4, dir: 'neg', fill: 50 },
];

/** Format a signed point value with the typographic minus sign (U+2212). */
function fmtPts(pts: number): string {
  return pts < 0 ? `−${Math.abs(pts)}` : `+${pts}`;
}

/** AI summary / rationale surface — prose with colour-coded highlight runs
 *  (green = helped, red = hurt), a signed-contribution factor list with track
 *  bars, and a ✨ AI · confidence footer. Renders the showcase example by default. */
export function AiRationaleCard({
  title = 'Why your energy is 78 today',
  prose = DEFAULT_PROSE,
  factors = DEFAULT_FACTORS,
  confidence = 84,
  source = 'model v4.2 · 14 logged events · 61d calibration',
  eyebrow = '✨ AI rationale',
  badge = 'narrative',
  factorsLabel = 'What drove this',
  style,
  ...rest
}: AiRationaleCardProps) {
  return (
    <Card lit style={[styles.card, style]} {...rest}>
      <View style={styles.head}>
        <View style={styles.ic}>
          <Svg width={19} height={19} viewBox="0 0 24 24">
            <Path
              d="M12 2 9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z"
              stroke={colors.accent}
              strokeWidth={1.6}
              fill="none"
            />
          </Svg>
        </View>
        <View style={styles.headText}>
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
        {!!badge && <Chip tone="accent" dot label={badge} style={styles.badge} />}
      </View>

      <Text style={styles.prose}>
        {prose.map((seg, i) => (
          <Text
            key={i}
            style={seg.tone === 'good' ? styles.good : seg.tone === 'bad' ? styles.bad : undefined}
          >
            {seg.text}
          </Text>
        ))}
      </Text>

      {factors.length > 0 && (
        <View style={styles.factors}>
          <Text style={styles.flbl}>{factorsLabel}</Text>
          {factors.map((f, i) => {
            const pos = (f.dir ?? (f.pts < 0 ? 'neg' : 'pos')) === 'pos';
            const tone = pos ? colors.zoneHigh : colors.zoneLow;
            const w = Math.max(0, Math.min(100, f.fill));
            return (
              <View key={i} style={styles.frow}>
                <View style={[styles.fdot, { backgroundColor: tone, shadowColor: tone }]} />
                <Text style={styles.fname} numberOfLines={1}>
                  {f.name}
                </Text>
                <View style={styles.ftrack}>
                  <View
                    style={[
                      styles.ffill,
                      { width: `${w}%`, backgroundColor: tone, shadowColor: tone },
                      pos ? styles.ffillPos : styles.ffillNeg,
                    ]}
                  />
                </View>
                <Text style={[styles.fpts, { color: tone }]}>{fmtPts(f.pts)}</Text>
              </View>
            );
          })}
        </View>
      )}

      <View style={styles.foot}>
        {!!source && <Text style={styles.src}>{source}</Text>}
        {confidence != null && (
          <Text style={styles.conf}>
            <Text style={styles.sparkle}>✨</Text>
            {' AI · '}
            <Text style={styles.confPct}>{confidence}%</Text>
            {' confidence'}
          </Text>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { padding: 22 },
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 15 },
  ic: {
    width: 36,
    height: 36,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.glass2,
    borderWidth: 1,
    borderColor: colors.border2,
  },
  headText: { flex: 1, minWidth: 0 },
  eyebrow: {
    fontFamily: fonts.mono,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    color: colors.accent,
    marginBottom: 4,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.36,
    lineHeight: 22,
    color: colors.text,
  },
  badge: { marginTop: 2 },
  prose: { fontSize: 14.5, lineHeight: 24, color: colors.text },
  good: { color: colors.zoneHigh, fontWeight: '600', backgroundColor: 'rgba(52,245,197,0.10)' },
  bad: { color: colors.zoneLow, fontWeight: '600', backgroundColor: 'rgba(255,77,109,0.10)' },
  factors: { marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: colors.border },
  flbl: {
    fontFamily: fonts.mono,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    color: colors.textFaint,
    marginBottom: 7,
  },
  frow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 7, paddingHorizontal: 9, borderRadius: radii.sm },
  fdot: { width: 6, height: 6, borderRadius: 3, shadowOpacity: 0.5, shadowRadius: 6 },
  fname: { fontSize: 13, color: colors.textDim, flex: 1, minWidth: 0 },
  ftrack: { width: 56, height: 4, borderRadius: radii.pill, backgroundColor: colors.glass2, overflow: 'hidden' },
  ffill: { position: 'absolute', top: 0, bottom: 0, borderRadius: radii.pill, shadowOpacity: 0.45, shadowRadius: 6 },
  ffillPos: { left: 0 },
  ffillNeg: { right: 0 },
  fpts: {
    fontFamily: fonts.mono,
    fontSize: 13,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
    width: 36,
    textAlign: 'right',
  },
  foot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
    marginTop: 15,
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  src: { fontFamily: fonts.mono, fontSize: 11, color: colors.textFaint, flex: 1, minWidth: 0 },
  conf: { fontFamily: fonts.mono, fontSize: 11, color: colors.textDim },
  sparkle: { color: colors.accent },
  confPct: { color: colors.zoneHigh, fontWeight: '600', fontVariant: ['tabular-nums'] },
});
