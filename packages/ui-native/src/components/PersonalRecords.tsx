import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Polyline, Path, Circle } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';
import { Chip } from './Chip';
import { GradientText } from './GradientText';

/** A tiny rising progress spark: a polyline of points + colors for line and dot. */
export interface PersonalRecordSpark {
  /** Spark vertices in a 120×26 viewBox. */
  points: Array<[number, number]>;
  /** Line stroke color. */
  line?: string;
  /** Trailing glow-dot color. Defaults to the line color. */
  dot?: string;
}

export interface PersonalRecord {
  /** Lift / exercise name, e.g. "Back Squat 1RM". */
  name: string;
  /** Record value, e.g. 180. */
  value: string | number;
  /** Unit suffix, e.g. "kg". */
  unit?: string;
  /** Date the record was set, e.g. "Jun 14". */
  date?: string;
  /** Improvement over the previous best, e.g. "+5 kg". */
  delta?: string;
  /** How long ago it was set, e.g. "11d" — shown top-right when not a new PR. */
  age?: string;
  /** Tiny progress spark. */
  spark?: PersonalRecordSpark;
  /** Freshly-set PR — lights the card + shows the trophy. */
  isNew?: boolean;
}

export interface PersonalRecordsProps {
  /** PR cards to render. Defaults to the design's example set. */
  records?: PersonalRecord[];
  style?: StyleProp<ViewStyle>;
}

/** Trophy glyph (24×24), the new-PR mark. */
function Trophy() {
  const p = { fill: 'none', stroke: colors.accent3, strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <Svg width={15} height={15} viewBox="0 0 24 24">
      <Path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" {...p} />
      <Path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" {...p} />
      <Path d="M6 2h12v7a6 6 0 0 1-12 0V2Z" {...p} />
      <Path d="M9 18h6" {...p} />
      <Path d="M10 22h4" {...p} />
      <Path d="M12 15v3" {...p} />
    </Svg>
  );
}

/** The design's example PR set: one new PR (lit) + two older records. */
const DEFAULT_RECORDS: PersonalRecord[] = [
  {
    name: 'Back Squat 1RM',
    value: 180,
    unit: 'kg',
    date: 'Jun 14',
    delta: '+5 kg',
    isNew: true,
    spark: { points: [[0, 22], [24, 19], [48, 15], [72, 12], [96, 7], [120, 3]], line: colors.accent, dot: colors.accent3 },
  },
  {
    name: 'Bench Press 1RM',
    value: 110,
    unit: 'kg',
    date: 'Jun 9',
    delta: '+2.5 kg',
    age: '11d',
    spark: { points: [[0, 21], [24, 17], [48, 18], [72, 12], [96, 11], [120, 8]], line: colors.accent3, dot: colors.accent2 },
  },
  {
    name: 'Deadlift 1RM',
    value: 220,
    unit: 'kg',
    date: 'May 30',
    delta: '+10 kg',
    age: '21d',
    spark: { points: [[0, 23], [24, 20], [48, 15], [72, 14], [96, 8], [120, 2]], line: colors.magenta, dot: colors.magenta },
  },
];

/**
 * Personal records — a grid of PR cards. Each card is a lift/exercise name, the
 * record value (gradient 1RM number + unit), a date with a "new PR" delta chip,
 * and a tiny rising progress spark. New PRs light the card and show a trophy;
 * older records show their age top-right. Mirrors the web `PersonalRecords`
 * prop API and defaults to the design's example set. Cards wrap and grow to
 * fill, collapsing to a single column on narrow widths.
 */
export function PersonalRecords({ records = DEFAULT_RECORDS, style }: PersonalRecordsProps) {
  return (
    <View style={[styles.grid, style]}>
      {records.map((r, i) => {
        const isNew = r.isNew ?? false;
        const spark = r.spark;
        const last = spark && spark.points.length > 0 ? spark.points[spark.points.length - 1]! : null;
        return (
          <View key={i} style={[styles.card, isNew && styles.cardLit]}>
            <View style={styles.top}>
              <Text style={styles.lift}>{r.name}</Text>
              {isNew ? <Trophy /> : r.age != null ? <Text style={styles.age}>{r.age}</Text> : null}
            </View>

            <View style={styles.val}>
              <GradientText gradient="cta" style={styles.num}>
                {r.value}
              </GradientText>
              {r.unit != null && <Text style={styles.unit}>{r.unit}</Text>}
            </View>

            {(r.date != null || r.delta != null) && (
              <View style={styles.meta}>
                {r.date != null ? <Text style={styles.date}>{r.date}</Text> : <View />}
                {r.delta != null && <Chip tone="high" dot label={`▲ ${r.delta}`} />}
              </View>
            )}

            {spark && (
              <Svg width="100%" height={28} viewBox="0 0 120 26" preserveAspectRatio="none" style={styles.spark}>
                <Polyline
                  points={spark.points.map(([x, y]) => `${x},${y}`).join(' ')}
                  fill="none"
                  stroke={spark.line ?? colors.accent}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {last && <Circle cx={last[0]} cy={last[1]} r={3} fill={spark.dot ?? spark.line ?? colors.accent3} />}
              </Svg>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  card: {
    flexGrow: 1,
    flexBasis: '30%',
    minWidth: 150,
    padding: 16,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
    overflow: 'hidden',
  },
  cardLit: { borderColor: 'rgba(124,92,255,0.35)', backgroundColor: colors.glass2 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginBottom: 4 },
  lift: { fontFamily: fonts.mono, fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.9, color: colors.textDim, flexShrink: 1 },
  age: { fontFamily: fonts.mono, fontSize: 8, color: colors.textFaint },
  val: { flexDirection: 'row', alignItems: 'baseline' },
  num: { fontFamily: fonts.display, fontWeight: '700', fontSize: 32, letterSpacing: -1, lineHeight: 32 },
  unit: { fontFamily: fonts.mono, fontSize: 12, color: colors.textFaint, marginLeft: 3 },
  meta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 7 },
  date: { fontFamily: fonts.mono, fontSize: 9, color: colors.textFaint },
  spark: { marginTop: 9 },
});
