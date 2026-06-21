import { type ReactNode } from 'react';
import { View, Text, StyleSheet, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, fonts, gradients } from '@lockin90/tokens';
import { Card } from './Card';
import { Chip, type ChipTone } from './Chip';

/** One bar in the weekday chart. */
export interface WeekdayBar {
  /** short day label, e.g. "Mon" */
  day: string;
  /** the value shown above the bar, e.g. 71 */
  value: number;
  /** bar height as a 0–100 percentage of the chart height */
  h: number;
  /** highlight as the best (mint) day */
  best?: boolean;
  /** highlight as the worst (rose) day */
  worst?: boolean;
}

/** A chip shown under the bars. */
export interface WeekdayChip {
  label: string;
  tone?: ChipTone;
  dot?: boolean;
}

export interface WeekdayBarsProps {
  /** display title, e.g. "Energy by weekday" */
  title?: string;
  /** mono sub-eyebrow under the title, e.g. "8-week avg" */
  sub?: string;
  /** the 7 weekday bars, Mon → Sun */
  days?: WeekdayBar[];
  /** best/worst callout copy (rich node) */
  callout?: ReactNode;
  /** chips between the bars and the callout */
  chips?: WeekdayChip[];
  /** accessible description of the chart */
  ariaLabel?: string;
  style?: StyleProp<ViewStyle>;
}

/** Faithful reproduction of the design's "Energy by weekday" example. */
const DEFAULT_DAYS: WeekdayBar[] = [
  { day: 'Mon', value: 71, h: 78 },
  { day: 'Tue', value: 76, h: 88 },
  { day: 'Wed', value: 79, h: 94, best: true },
  { day: 'Thu', value: 74, h: 84 },
  { day: 'Fri', value: 68, h: 72 },
  { day: 'Sat', value: 61, h: 58, worst: true },
  { day: 'Sun', value: 70, h: 76 },
];

const DEFAULT_CHIPS: WeekdayChip[] = [
  { label: 'best · Wed 79', tone: 'high', dot: true },
  { label: 'worst · Sat 61', tone: 'low', dot: true },
];

const DEFAULT_ARIA =
  'Avg energy by weekday: Mon 71, Tue 76, Wed 79 best, Thu 74, Fri 68, Sat 61 worst, Sun 70.';

/** plot area height the bar percentages are measured against */
const BARS_H = 134;

/**
 * Weekday bars — a 7-bar chart of average energy per weekday (Mon–Sun) with the
 * best day highlighted in mint and the worst in rose, value labels above and day
 * labels below, plus a best/worst callout and chips. Bars are Views whose height
 * is the `h` percentage of the chart; best/worst bars are gradient-filled. Same
 * prop API as the web component.
 */
export function WeekdayBars({
  title = 'Energy by weekday',
  sub = '8-week avg',
  days = DEFAULT_DAYS,
  callout = (
    <Text>
      You peak on <Text style={styles.calloutBest}>Wednesdays</Text>, dip on{' '}
      <Text style={styles.calloutWorst}>Saturdays</Text>.
    </Text>
  ),
  chips = DEFAULT_CHIPS,
  ariaLabel = DEFAULT_ARIA,
  style,
}: WeekdayBarsProps) {
  return (
    <Card style={[styles.wk, style]}>
      {/* header: title + mono sub */}
      <View style={styles.head}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sub}>{sub}</Text>
      </View>

      {/* bars */}
      <View style={styles.bars} accessibilityRole="image" accessibilityLabel={ariaLabel}>
        {days.map((d, i) => {
          const colHeight = `${Math.max(0, Math.min(100, d.h))}%` as DimensionValue;
          return (
            <View key={i} style={styles.bar}>
              <Text style={[styles.val, d.best && styles.valBest, d.worst && styles.valWorst]}>{d.value}</Text>
              <View style={styles.plot}>
                {d.best ? (
                  <LinearGradient
                    colors={[...gradients.mint.stops] as [string, string]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={[styles.col, styles.colBest, { height: colHeight }]}
                  />
                ) : d.worst ? (
                  <LinearGradient
                    colors={[...gradients.warm.stops] as [string, string]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={[styles.col, styles.colWorst, { height: colHeight }]}
                  />
                ) : (
                  <View style={[styles.col, styles.colPlain, { height: colHeight }]} />
                )}
              </View>
              <Text style={[styles.day, (d.best || d.worst) && styles.dayHi]}>{d.day}</Text>
            </View>
          );
        })}
      </View>

      {/* chips */}
      {chips.length > 0 && (
        <View style={styles.chips}>
          {chips.map((c, i) => (
            <Chip key={i} tone={c.tone} dot={c.dot} label={c.label} />
          ))}
        </View>
      )}

      {/* best/worst callout */}
      {callout != null && (
        <View style={styles.callout}>
          <Text style={styles.calloutText}>{callout}</Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  wk: { padding: 20 },

  head: { flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  title: { fontFamily: fonts.display, fontWeight: '700', fontSize: 16, letterSpacing: -0.32, color: colors.text },
  sub: { fontFamily: fonts.mono, fontSize: 11, color: colors.textFaint },

  bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, height: BARS_H + 36, paddingTop: 18 },
  bar: { flex: 1, flexDirection: 'column', alignItems: 'center', gap: 8, justifyContent: 'flex-end' },

  /* the fixed-height area each bar's % height is measured against */
  plot: { width: '100%', height: BARS_H, justifyContent: 'flex-end' },
  col: { width: '100%', borderTopLeftRadius: 8, borderTopRightRadius: 8, borderBottomLeftRadius: 4, borderBottomRightRadius: 4 },
  colPlain: { backgroundColor: colors.glass2, borderWidth: 1, borderColor: colors.border2 },
  colBest: { shadowColor: colors.mint, shadowOpacity: 0.22, shadowRadius: 18, shadowOffset: { width: 0, height: 0 }, elevation: 6 },
  colWorst: { shadowColor: colors.zoneLow, shadowOpacity: 0.18, shadowRadius: 16, shadowOffset: { width: 0, height: 0 }, elevation: 6 },

  val: { fontFamily: fonts.mono, fontSize: 11, color: colors.textDim },
  valBest: { color: colors.zoneHigh },
  valWorst: { color: colors.zoneLow },

  day: { fontFamily: fonts.mono, fontSize: 10, color: colors.textFaint, textTransform: 'uppercase', letterSpacing: 0.4 },
  dayHi: { color: colors.textDim },

  chips: { flexDirection: 'row', gap: 9, flexWrap: 'wrap', marginTop: 12 },

  callout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
    paddingVertical: 11,
    paddingHorizontal: 13,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },
  calloutText: { fontSize: 12.5, color: colors.textDim, lineHeight: 18 },
  calloutBest: { color: colors.zoneHigh, fontWeight: '600' },
  calloutWorst: { color: colors.zoneLow, fontWeight: '600' },
});
