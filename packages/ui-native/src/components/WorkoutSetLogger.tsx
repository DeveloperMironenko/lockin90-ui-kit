import { type ReactNode } from 'react';
import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';
import { Card } from './Card';
import { Chip } from './Chip';

export interface WorkoutSet {
  /** load lifted, in `unit` */
  weight: number;
  /** repetitions performed */
  reps: number;
  /** rate of perceived exertion (0–10); omit/empty for an unlogged set */
  rpe?: number | '';
  /** whether the set has been completed (mint check, tinted row) */
  done?: boolean;
}

export interface WorkoutSetLoggerProps {
  /** exercise name, e.g. "Barbell Squat" */
  name?: string;
  /** target/summary line under the name, e.g. "4 sets · Target 5 × 100 kg · RPE 8" */
  target?: ReactNode;
  /** logged sets, in order */
  sets?: WorkoutSet[];
  /** weight unit shown beside each load */
  unit?: string;
  style?: StyleProp<ViewStyle>;
}

const DEFAULT_SETS: WorkoutSet[] = [
  { weight: 100, reps: 5, rpe: 7.5, done: true },
  { weight: 100, reps: 5, rpe: 8, done: true },
  { weight: 100, reps: 5, rpe: 8.5 },
  { weight: 100, reps: 5, rpe: '' },
];

/** Index of the first not-yet-done set — the "current" working set. */
function currentIndex(sets: WorkoutSet[]): number {
  return sets.findIndex((s) => !s.done);
}

const BarbellIcon = () => (
  <Svg width={19} height={19} viewBox="0 0 24 24">
    <Path
      d="M6.5 6.5h11M6.5 17.5h11M4 9v6M20 9v6M9 7v10M15 7v10"
      stroke={colors.accent}
      strokeWidth={2}
      fill="none"
    />
  </Svg>
);

const CheckIcon = ({ color }: { color: string }) => (
  <Svg width={17} height={17} viewBox="0 0 24 24">
    <Path d="M20 6 9 17l-5-5" stroke={color} strokeWidth={2.2} fill="none" />
  </Svg>
);

const PlusIcon = () => (
  <Svg width={14} height={14} viewBox="0 0 24 24">
    <Path d="M12 5v14M5 12h14" stroke={colors.textDim} strokeWidth={2} fill="none" />
  </Svg>
);

/** Value box mirroring the web `.lk-set-inp` (read-only on native). */
function ValueBox({ value, done, narrow }: { value: string; done?: boolean; narrow?: boolean }) {
  return (
    <View style={[styles.inp, narrow && styles.inpNarrow, done && styles.inpDone]}>
      <Text style={[styles.inpText, done && styles.inpTextDone]}>{value === '' ? '—' : value}</Text>
    </View>
  );
}

/** Workout set-logger — in-session strength table: exercise header, per-set
 *  weight/reps/RPE values with a mint completion toggle, an "add set" row, and
 *  a volume/PR readout. Static/presentational (RN parity of the web kit). */
export function WorkoutSetLogger({
  name = 'Barbell Squat',
  target,
  sets = DEFAULT_SETS,
  unit = 'kg',
  style,
}: WorkoutSetLoggerProps) {
  const current = currentIndex(sets);
  const doneSets = sets.filter((s) => s.done);
  const volume = doneSets.reduce((sum, s) => sum + s.weight * s.reps, 0);
  const topSet = doneSets.reduce<number>((max, s) => Math.max(max, s.weight), 0);

  return (
    <Card style={style}>
      <View style={styles.root}>
        <View style={styles.ex}>
          <View style={styles.exIco}>
            <BarbellIcon />
          </View>
          <View style={styles.exMain}>
            <Text style={styles.exName} numberOfLines={1}>
              {name}
            </Text>
            {target != null ? (
              <Text style={styles.exTarget} numberOfLines={1}>
                {target}
              </Text>
            ) : (
              <Text style={styles.exTarget} numberOfLines={1}>
                {sets.length} sets · Target 5 × 100 {unit} · RPE 8
              </Text>
            )}
          </View>
        </View>

        <View>
          <View style={[styles.row, styles.headRow]}>
            <Text style={[styles.head, styles.colIdx]}>Set</Text>
            <Text style={[styles.head, styles.colVal]}>Weight</Text>
            <Text style={[styles.head, styles.colVal]}>Reps</Text>
            <Text style={[styles.head, styles.colRpe]}>RPE</Text>
            <Text style={[styles.head, styles.colDone]}>✓</Text>
          </View>
          {sets.map((s, i) => {
            const n = i + 1;
            const isCurrent = !s.done && i === current;
            const rpe = s.rpe === undefined ? '' : String(s.rpe);
            return (
              <View key={i} style={[styles.row, styles.bodyRow, isCurrent && styles.rowCurrent]}>
                <Text style={[styles.idx, styles.colIdx, s.done && styles.idxDone, isCurrent && styles.idxCurrent]}>
                  {n}
                </Text>
                <View style={styles.colVal}>
                  <View style={styles.valWrap}>
                    <ValueBox value={String(s.weight)} done={s.done} />
                    <Text style={styles.unit}>{unit}</Text>
                  </View>
                </View>
                <View style={styles.colVal}>
                  <ValueBox value={String(s.reps)} done={s.done} />
                </View>
                <View style={styles.colRpe}>
                  <ValueBox value={rpe} done={s.done} narrow />
                </View>
                <View style={styles.colDone}>
                  <View style={[styles.check, s.done && styles.checkDone]}>
                    <CheckIcon color={s.done ? '#07080d' : colors.textFaint} />
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.add}>
          <PlusIcon />
          <Text style={styles.addText}>Add set</Text>
        </View>

        <View style={styles.foot}>
          <View style={styles.stat}>
            <Text style={styles.statLbl}>Volume</Text>
            <Text style={styles.statVal}>
              {volume.toLocaleString()}
              <Text style={styles.statUnit}> {unit}</Text>
            </Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLbl}>Top set</Text>
            <Text style={styles.statVal}>
              {topSet}
              <Text style={styles.statUnit}> {unit}</Text>
            </Text>
          </View>
          <View style={styles.footChip}>
            <Chip tone="high" dot label="PR pace" />
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  root: { gap: 12 },

  ex: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  exIco: {
    width: 38,
    height: 38,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border2,
    backgroundColor: colors.glass2,
  },
  exMain: { flex: 1, minWidth: 0, gap: 2 },
  exName: { fontFamily: fonts.display, fontWeight: '700', fontSize: 15, letterSpacing: -0.15, color: colors.text },
  exTarget: { fontFamily: fonts.ui, fontSize: 11.5, color: colors.textDim },

  row: { flexDirection: 'row', alignItems: 'center' },
  headRow: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
  bodyRow: { paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: colors.border },
  rowCurrent: { backgroundColor: 'rgba(124,92,255,0.06)' },

  head: {
    fontFamily: fonts.mono,
    fontSize: 9.5,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    color: colors.textFaint,
    fontWeight: '500',
  },

  colIdx: { width: 38, textAlign: 'center' },
  colVal: { flex: 1, alignItems: 'flex-start' },
  colRpe: { width: 64, alignItems: 'flex-start' },
  colDone: { width: 44, alignItems: 'center' },

  idx: { fontFamily: fonts.display, fontWeight: '700', fontSize: 15, textAlign: 'center', color: colors.textDim },
  idxDone: { color: colors.zoneHigh },
  idxCurrent: { color: colors.accent },

  valWrap: { flexDirection: 'row', alignItems: 'center' },
  inp: {
    width: 64,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
    alignItems: 'center',
  },
  inpNarrow: { width: 52 },
  inpDone: { borderColor: 'rgba(52,245,197,0.18)', backgroundColor: 'rgba(52,245,197,0.04)' },
  inpText: { fontFamily: fonts.mono, fontSize: 13.5, color: colors.text },
  inpTextDone: { color: colors.textDim },
  unit: { fontFamily: fonts.mono, fontSize: 10, color: colors.textFaint, marginLeft: 5 },

  check: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },
  checkDone: { backgroundColor: colors.mint, borderColor: 'transparent' },

  add: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 10,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border2,
  },
  addText: {
    fontFamily: fonts.mono,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    color: colors.textDim,
  },

  foot: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 12, paddingTop: 4 },
  stat: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  statLbl: {
    fontFamily: fonts.mono,
    fontSize: 9.5,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    color: colors.textFaint,
  },
  statVal: { fontFamily: fonts.mono, fontSize: 14, color: colors.text },
  statUnit: { fontFamily: fonts.mono, fontSize: 10, color: colors.textFaint },
  footChip: { marginLeft: 'auto' },
});
