import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';
import { Chip, type ChipTone } from './Chip';

export interface HabitRowProps {
  /** Habit name. */
  name?: string;
  /** Schedule / cadence line under the name (e.g. "By 9:00pm · daily"). */
  when?: string;
  /** Current streak length, shown next to the flame. */
  streak?: number;
  /** Last 7 days: true = done, false = missed/skipped. Oldest → newest. */
  days?: boolean[];
  /** 30-day compliance, as a percentage 0–100. */
  compliancePct?: number;
  /** Chip tone for the compliance pill. Defaults to auto from compliancePct. */
  tone?: ChipTone;
  style?: StyleProp<ViewStyle>;
}

/** Auto-tone the compliance chip from the percentage when not given. */
function toneFor(pct: number): ChipTone {
  if (pct >= 80) return 'high';
  if (pct >= 50) return 'mid';
  return 'low';
}

/** Habit list row: name + streak flame + 7-day done/missed strip + compliance %. */
export function HabitRow({
  name = '10k steps',
  when = 'By 9:00pm · daily',
  streak = 9,
  days = [true, true, false, true, true, true, true],
  compliancePct = 83,
  tone,
  style,
}: HabitRowProps) {
  const pct = Math.max(0, Math.min(100, compliancePct));
  return (
    <View style={[styles.row, style]}>
      <View style={styles.main}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <View style={styles.meta}>
          {when ? <Text style={styles.when}>{when}</Text> : null}
          <View style={styles.flame}>
            <Svg width={13} height={13} viewBox="0 0 24 24">
              <Path
                d="M12 2c1 4-2 5-2 8a2 2 0 0 0 4 0c2 2 3 4 3 6a5 5 0 0 1-10 0c0-4 5-6 5-14z"
                stroke={colors.zoneMid}
                strokeWidth={1.6}
                fill="none"
              />
            </Svg>
            <Text style={styles.flameNum}>{streak}</Text>
          </View>
          <View style={styles.strip}>
            {days.map((done, i) => (
              <View
                key={i}
                style={[styles.cell, done ? styles.cellDone : styles.cellMissed]}
              />
            ))}
          </View>
        </View>
      </View>
      <Chip tone={tone ?? toneFor(pct)} dot label={`${pct}%`} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    paddingVertical: 13,
    paddingHorizontal: 15,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },
  main: { flex: 1, minWidth: 0 },
  name: { fontFamily: fonts.ui, fontWeight: '600', fontSize: 14.5, color: colors.text },
  meta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginTop: 5 },
  when: { fontFamily: fonts.mono, fontSize: 11, color: colors.textDim },
  flame: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  flameNum: { fontFamily: fonts.mono, fontSize: 11, color: colors.zoneMid },
  strip: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cell: { width: 11, height: 11, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.08)' },
  cellDone: { backgroundColor: 'rgba(52,245,197,0.9)' },
  cellMissed: { backgroundColor: 'rgba(255,77,109,0.78)' },
});
