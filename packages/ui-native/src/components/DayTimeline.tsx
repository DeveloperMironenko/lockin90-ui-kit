import {
  View,
  Text,
  StyleSheet,
  type DimensionValue,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors, radii, fonts } from '@lockin90/tokens';
import { Chip } from './Chip';

/** A single category block on the 24h rail, positioned by percent of the day. */
export interface DayBlock {
  /** left edge as a percent of the 24h rail (0–100) */
  left: number;
  /** width as a percent of the 24h rail (0–100) */
  width: number;
  /** fill color — a resolved color (native has no CSS vars) */
  color: string;
  /** tooltip text (web-only; ignored on native) */
  tip?: string;
  /** accessible label for the block */
  label?: string;
}

/** A legend swatch + label pairing a color to a category name. */
export interface DayLegendItem {
  color: string;
  label: string;
}

export interface DayTimelineProps {
  /** card heading, e.g. "Today · 24h" */
  title?: string;
  /** mono chip on the right of the head, e.g. "14h 12m tracked" */
  trackedLabel?: string;
  /** the colored category blocks across the day */
  blocks?: DayBlock[];
  /** position of the live "now" marker as a percent of the day (0–100); null to hide */
  now?: number | null;
  /** label rendered above the now marker (default "now") */
  nowLabel?: string;
  /** hour-tick labels under the rail */
  axis?: string[];
  /** category legend swatches */
  legend?: DayLegendItem[];
  /** screen-reader description of the whole rail */
  trackLabel?: string;
  style?: StyleProp<ViewStyle>;
}

/** Faithful reproduction of the design's example day (web `var(--token)` fills
 *  resolved to their token hex values, since native has no CSS variables). */
const DEFAULT_BLOCKS: DayBlock[] = [
  { left: 0, width: 27.1, color: colors.violet, tip: 'Sleep · 11:00pm–6:30am · 7h 30m' },
  { left: 27.1, width: 3.1, color: colors.lime, tip: 'Morning routine · 6:30–7:15 · 45m' },
  { left: 37.5, width: 12.5, color: colors.cyan, tip: 'Deep work · 9:00am–12:00pm · 3h' },
  { left: 50, width: 3.1, color: colors.warn, tip: 'Lunch · 12:00–12:45 · 45m' },
  { left: 70.8, width: 4.2, color: colors.magenta, tip: 'Training · 5:00–6:00pm · 1h' },
  { left: 89.6, width: 4.2, color: colors.mint, tip: 'Wind-down · 9:30–10:30pm · 1h' },
];

const DEFAULT_AXIS = ['12a', '6a', '12p', '6p', '12a'];

const DEFAULT_LEGEND: DayLegendItem[] = [
  { color: colors.violet, label: 'Sleep' },
  { color: colors.lime, label: 'Routine' },
  { color: colors.cyan, label: 'Deep work' },
  { color: colors.magenta, label: 'Training' },
  { color: colors.mint, label: 'Wind-down' },
  { color: colors.warn, label: 'Meal / break' },
];

const DEFAULT_TRACK_LABEL =
  '24-hour timeline: sleep 11pm–6:30am, deep work 9am–12pm, training 5–6pm, now at 3pm.';

const pct = (n: number): DimensionValue => `${n}%`;

/** 24h day timeline — a horizontal 24-hour rail with time-positioned, colored
 *  category blocks (sleep, work, training, meals…), hour ticks, a live "now"
 *  marker, and a category legend. Same prop API as web (no hover tooltips). */
export function DayTimeline({
  title = 'Today · 24h',
  trackedLabel = '14h 12m tracked',
  blocks = DEFAULT_BLOCKS,
  now = 62.5,
  nowLabel = 'now',
  axis = DEFAULT_AXIS,
  legend = DEFAULT_LEGEND,
  trackLabel = DEFAULT_TRACK_LABEL,
  style,
}: DayTimelineProps) {
  return (
    <View style={[styles.tt, style]}>
      <View style={styles.head}>
        <Text style={styles.title}>{title}</Text>
        {trackedLabel ? <Chip label={trackedLabel} /> : null}
      </View>

      {/* the rail blocks are positioned against */}
      <View style={styles.track} accessibilityRole="image" accessibilityLabel={trackLabel}>
        {blocks.map((b, i) => (
          <View
            key={i}
            style={[styles.block, { left: pct(b.left), width: pct(b.width), backgroundColor: b.color }]}
            accessibilityLabel={b.label ?? b.tip}
          />
        ))}

        {now != null ? (
          <View style={[styles.now, { left: pct(now) }]} pointerEvents="none">
            <View style={styles.nowDot} />
            <Text style={styles.nowLbl}>{nowLabel}</Text>
          </View>
        ) : null}
      </View>

      {axis.length > 0 ? (
        <View style={styles.axis}>
          {axis.map((t, i) => (
            <Text key={i} style={styles.axisLbl}>
              {t}
            </Text>
          ))}
        </View>
      ) : null}

      {legend.length > 0 ? (
        <View style={styles.legend}>
          {legend.map((l, i) => (
            <View key={i} style={styles.legendItem}>
              <View style={[styles.swatch, { backgroundColor: l.color }]} />
              <Text style={styles.legendLbl}>{l.label}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

export type {
  DayBlock as DayTimelineBlock,
  DayLegendItem as DayTimelineLegendItem,
};

const styles = StyleSheet.create({
  tt: { gap: 16, padding: 22 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  title: { fontFamily: fonts.display, fontSize: 14, fontWeight: '600', color: colors.text, letterSpacing: -0.14 },

  track: {
    position: 'relative',
    height: 58,
    borderRadius: radii.sm,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  block: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRadius: 6,
  },

  now: {
    position: 'absolute',
    top: -4,
    bottom: -4,
    width: 2,
    backgroundColor: colors.accent,
    alignItems: 'center',
    shadowColor: colors.accent,
    shadowOpacity: 0.9,
    shadowRadius: 5,
    elevation: 6,
  },
  nowDot: {
    position: 'absolute',
    top: -3,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOpacity: 0.9,
    shadowRadius: 5,
  },
  nowLbl: {
    position: 'absolute',
    top: -22,
    fontFamily: fonts.mono,
    fontSize: 9,
    letterSpacing: 0.36,
    textTransform: 'uppercase',
    color: colors.accent,
    width: 40,
    marginLeft: -19,
    textAlign: 'center',
  },

  axis: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  axisLbl: { fontFamily: fonts.mono, fontSize: 9.5, color: colors.textFaint },

  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginTop: 2 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  swatch: { width: 10, height: 10, borderRadius: 3 },
  legendLbl: { fontFamily: fonts.mono, fontSize: 10.5, color: colors.textDim },
});
