import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts } from '@lockin90/tokens';
import { Chip } from './Chip';

export interface ContributionStripProps {
  /** 30 intensity levels (0..4), one per day, oldest→today. */
  cells?: number[];
  /** current logging-streak length, in days. */
  streak?: number;
  /** days logged out of the window, e.g. "26 / 30". */
  days?: string;
  /** longest streak ever, in days. */
  longest?: number;
  /** section title. */
  label?: string;
  style?: StyleProp<ViewStyle>;
}

/** Faithful reproduction of the design's 30-day logging-streak example. */
const DEFAULT_CELLS: number[] = [
  3, 4, 2, 4, 3, 1, 0, 3, 4, 4, 2, 0, 3, 4, 3, 4, 2, 4, 3, 4, 4, 3, 2, 4, 3, 4, 4, 3, 4, 4,
];

/** per-level flat tint (matches the web rgba intensities); l4 fills via gradient. */
const LEVEL_BG: Record<number, string> = {
  0: 'rgba(255,255,255,0.045)',
  1: 'rgba(52,245,197,0.18)',
  2: 'rgba(52,245,197,0.38)',
  3: 'rgba(52,245,197,0.62)',
  4: 'transparent',
};
const LEVEL_BORDER: Record<number, string> = {
  0: colors.border,
  1: 'rgba(52,245,197,0.22)',
  2: 'rgba(52,245,197,0.4)',
  3: 'rgba(52,245,197,0.6)',
  4: 'rgba(168,255,53,0.55)',
};

/** mint→lime, the bright l4 fill (web: linear-gradient(150deg, mint, lime)). */
const L4_FILL: [string, string] = [colors.mint, colors.lime];

/** clamp an arbitrary value into the 0..4 level range. */
function levelOf(v: number): number {
  return Math.max(0, Math.min(4, Math.round(v)));
}

/** Contribution heat strip — a fixed 30-day logging-streak strip: 30 cells
 *  tinted by intensity (5 levels l0–l4), a current-streak readout and a
 *  less→more legend. Same prop API as the web component. */
export function ContributionStrip({
  cells = DEFAULT_CELLS,
  streak = 18,
  days = '26 / 30',
  longest = 23,
  label = 'Logging streak',
  style,
}: ContributionStripProps) {
  return (
    <View style={[styles.strip, style]}>
      {/* header */}
      <View style={styles.head}>
        <Text style={styles.title}>{label}</Text>
        <Chip tone="high" dot label={`${days} days`} />
        <Text style={styles.sub}>last 30 days</Text>
      </View>

      {/* 30-cell heat grid */}
      <View
        style={styles.grid}
        accessibilityRole="image"
        accessibilityLabel={`30-day logging heat strip, current run of ${streak} days`}
      >
        {cells.map((c, i) => {
          const lvl = levelOf(c);
          return (
            <View
              key={i}
              style={[styles.cell, { backgroundColor: LEVEL_BG[lvl], borderColor: LEVEL_BORDER[lvl] }]}
            >
              {lvl === 4 && (
                <LinearGradient
                  colors={L4_FILL}
                  start={{ x: 0.15, y: 0 }}
                  end={{ x: 0.85, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
              )}
            </View>
          );
        })}
      </View>

      {/* 30d-ago → today axis */}
      <View style={styles.axis}>
        <Text style={styles.axisText}>30d ago</Text>
        <Text style={styles.axisText}>today</Text>
      </View>

      {/* footer: streak readout + meta + legend */}
      <View style={styles.foot}>
        <View style={styles.streak}>
          <Text style={styles.flame}>🔥</Text>
          <Text style={styles.streakText}>
            <Text style={styles.streakN}>{streak}</Text>-day current streak
          </Text>
        </View>
        <Text style={styles.meta}>
          <Text style={styles.metaB}>{days}</Text> days logged · longest{' '}
          <Text style={styles.metaB}>{longest}</Text>
        </Text>
        <View style={styles.legend}>
          <Text style={styles.legendText}>less</Text>
          {[0, 1, 2, 3].map((lvl) => (
            <View
              key={lvl}
              style={[styles.legendSwatch, { backgroundColor: LEVEL_BG[lvl], borderColor: LEVEL_BORDER[lvl] }]}
            />
          ))}
          <LinearGradient
            colors={L4_FILL}
            start={{ x: 0.15, y: 0 }}
            end={{ x: 0.85, y: 1 }}
            style={[styles.legendSwatch, { borderColor: LEVEL_BORDER[4] }]}
          />
          <Text style={styles.legendText}>more</Text>
        </View>
      </View>
    </View>
  );
}

/** thirty columns share the row minus the inter-cell gaps */
const CELL_BASIS = `${100 / 30}%` as const;
const GRID_GAP = 3;

const styles = StyleSheet.create({
  strip: { flexDirection: 'column', gap: 14 },

  head: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  title: { fontFamily: fonts.display, fontSize: 16, fontWeight: '700', letterSpacing: -0.16, color: colors.text },
  sub: { fontFamily: fonts.mono, fontSize: 10.5, color: colors.textFaint, marginLeft: 'auto' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -GRID_GAP / 2, marginVertical: -GRID_GAP / 2 },
  cell: {
    flexBasis: CELL_BASIS,
    height: 26,
    borderRadius: 5,
    borderWidth: 1,
    marginHorizontal: GRID_GAP / 2,
    marginVertical: GRID_GAP / 2,
    overflow: 'hidden',
  },

  axis: { flexDirection: 'row', justifyContent: 'space-between', marginTop: -4 },
  axisText: { fontFamily: fonts.mono, fontSize: 9.5, letterSpacing: 0.6, color: colors.textFaint },

  foot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  streak: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  flame: { fontSize: 16, lineHeight: 16 },
  streakText: { fontFamily: fonts.display, fontSize: 15, fontWeight: '700', color: colors.text },
  streakN: { color: colors.zoneHigh, fontVariant: ['tabular-nums'] },
  meta: { fontFamily: fonts.mono, fontSize: 11, color: colors.textDim },
  metaB: { color: colors.text, fontWeight: '600' },

  legend: { flexDirection: 'row', alignItems: 'center', gap: 5, marginLeft: 'auto' },
  legendText: { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 0.4, color: colors.textFaint },
  legendSwatch: { width: 11, height: 11, borderRadius: 3, borderWidth: 1, overflow: 'hidden' },
});
