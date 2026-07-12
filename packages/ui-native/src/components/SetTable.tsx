import { View, Text, Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { colors, fonts, gradients, radii } from '@lockin90/tokens';
import { hapticSelection } from '../internal/optionalHaptics';
import { PrBadge } from './PrBadge';

/** Set kind — drives the SET-column label + color. */
export type SetType = 'warmup' | 'working' | 'drop' | 'failure';

/** Reference-column tint: mint for coach targets, violet accent for AI. */
export type SetReferenceTone = 'coach' | 'ai' | 'none';

export interface WorkoutSet {
  id: string;
  setType: SetType;
  /** SET-column label override. Default: `W` warmup · working sets numbered `1,2,…` · `D` drop · `F` failure. */
  label?: string;
  weight?: number;
  reps?: number;
  unit?: 'kg' | 'lb';
  /** Reference readout (e.g. the coach/AI recommendation `80×5`). */
  reference?: string;
  /** Reference tint — `coach` mint · `ai` violet accent · `none` faint (default). */
  referenceTone?: SetReferenceTone;
  done?: boolean;
  /** Personal record — stamps a red `PR` badge next to the value once `done`. */
  isPr?: boolean;
  /** The set being performed now — subtle cyan row tint. */
  isCurrent?: boolean;
}

export type SetTableColumn = 'set' | 'value' | 'reference' | 'check';

const ALL_COLUMNS: SetTableColumn[] = ['set', 'value', 'reference', 'check'];

export interface SetTableProps {
  /** The sets, in order. */
  sets: WorkoutSet[];
  /** Columns to render, in this order (default all 4). */
  columns?: SetTableColumn[];
  /** Values are tappable (tap → `onSetPress`); they stay plain text — only
   *  the CURRENT set's value gets the cyan-accented box ("you are here"). */
  editable?: boolean;
  /** Row tapped (open the set editor). */
  onSetPress?: (id: string) => void;
  /** Done-check toggled. */
  onTogglePress?: (id: string) => void;
  /** When given, renders the trailing `+ Add set` row. */
  onAddSet?: () => void;
  /** Add-row label (default `'Add set'`). */
  addLabel?: string;
  /** Reference column header (default `'Coach rec'`). */
  referenceHeader?: string;
  style?: StyleProp<ViewStyle>;
}

/** Default SET-column labels: warmup `W`, drop `D`, failure `F`, working sets numbered `1,2,…`. */
export function setLabels(sets: readonly Pick<WorkoutSet, 'setType' | 'label'>[]): string[] {
  let n = 0;
  return sets.map((s) => {
    if (s.setType === 'working') n += 1;
    if (s.label != null) return s.label;
    return s.setType === 'warmup' ? 'W' : s.setType === 'drop' ? 'D' : s.setType === 'failure' ? 'F' : String(n);
  });
}

/* set-type colors — warmup amber · working cyan · drop violet · failure magenta */
const TYPE_COLOR: Record<SetType, string> = {
  warmup: colors.zoneMid,
  working: colors.accent2,
  drop: colors.violet,
  failure: colors.magenta,
};

const REF_COLOR: Record<SetReferenceTone, string> = {
  coach: colors.mint,
  ai: colors.accent,
  none: colors.textFaint,
};

/* row tints — current = cyan (accent-2 @ 7%), done = mint (matched web literals) */
const CURRENT_TINT = 'rgba(34,211,238,0.07)';
const DONE_TINT = 'rgba(52,245,197,0.05)';

/** `80×5`, with an em dash for a missing half. */
function formatValue(s: WorkoutSet): string {
  const w = s.weight != null ? String(s.weight) : '—';
  const r = s.reps != null ? String(s.reps) : '—';
  return `${w}×${r}`;
}

/** Value-column header from the sets' unit (`KG × REPS` / `LB × REPS`). */
function valueHeader(sets: readonly WorkoutSet[]): string {
  const unit = sets.find((s) => s.unit)?.unit;
  return unit ? `${unit.toUpperCase()} × REPS` : 'WEIGHT × REPS';
}

function CheckGlyph({ color }: { color: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path d="M20 6 9 17l-5-5" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/**
 * SetTable — the per-set workout table, the training design's core primitive.
 * Native twin of the web `SetTable` (same prop API): one row per set with the
 * colored SET label (`W`/`1`/`2`/`D`/`F` — warmup amber, working cyan, drop
 * violet, failure magenta), the centered mono `weight×reps` value, the
 * right-aligned mono reference (coach mint / AI violet accent), and the done
 * check (filled mint gradient once done). Current set = subtle cyan row
 * tint; done = subtle mint tint; a PR'd done set floats a red `PrBadge`
 * right of the value without shifting the centered number.
 */
export function SetTable({
  sets,
  columns = ALL_COLUMNS,
  editable = false,
  onSetPress,
  onTogglePress,
  onAddSet,
  addLabel = 'Add set',
  referenceHeader = 'Coach rec',
  style,
}: SetTableProps) {
  const has = (c: SetTableColumn) => columns.includes(c);
  const labels = setLabels(sets);

  const headers: Record<SetTableColumn, string> = {
    set: 'SET',
    value: valueHeader(sets),
    reference: referenceHeader.toUpperCase(),
    check: '',
  };

  const headerStyle: Record<SetTableColumn, StyleProp<ViewStyle>> = {
    set: styles.colSet,
    value: styles.colValue,
    reference: styles.colRef,
    check: styles.colCheck,
  };

  return (
    <View style={style}>
      {/* header row */}
      <View style={[styles.row, styles.headRow]}>
        {columns.map((c) => (
          <View key={c} style={headerStyle[c]}>
            <Text
              style={[
                styles.headText,
                c === 'set' || c === 'value' ? styles.center : null,
                c === 'reference' ? styles.right : null,
              ]}
            >
              {headers[c]}
            </Text>
          </View>
        ))}
      </View>

      {sets.map((s, i) => {
        const rowPress = onSetPress
          ? () => {
              hapticSelection();
              onSetPress(s.id);
            }
          : undefined;
        const rowTint = s.isCurrent ? CURRENT_TINT : s.done ? DONE_TINT : undefined;
        const last = i === sets.length - 1 && !onAddSet;

        const cells = (
          <>
            {has('set') && (
              <View style={styles.colSet}>
                <Text style={[styles.setLabel, { color: TYPE_COLOR[s.setType] }]}>{labels[i]}</Text>
              </View>
            )}
            {has('value') && (
              <View style={styles.colValue}>
                {/* three glance-distinct states: pending = plain mono text,
                    current = the ONE cyan-boxed emphasized value, done =
                    dimmed plain text on the mint row wash */}
                <View style={editable && s.isCurrent ? styles.valBox : null}>
                  <Text style={[styles.valText, s.done ? styles.valDone : null]}>{formatValue(s)}</Text>
                </View>
                {s.isPr && s.done ? <PrBadge size="sm" style={styles.pr} /> : null}
              </View>
            )}
            {has('reference') && (
              <View style={styles.colRef}>
                <Text style={[styles.refText, { color: REF_COLOR[s.referenceTone ?? 'none'] }]} numberOfLines={1}>
                  {s.reference ?? '—'}
                </Text>
              </View>
            )}
            {has('check') && (
              <View style={styles.colCheck}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: !!s.done }}
                  accessibilityLabel={`Set ${labels[i]} done`}
                  hitSlop={6}
                  onPress={
                    onTogglePress
                      ? () => {
                          hapticSelection();
                          onTogglePress(s.id);
                        }
                      : undefined
                  }
                >
                  {s.done ? (
                    <LinearGradient
                      colors={gradients.mint.stops as unknown as [string, string]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={[styles.check, styles.checkDone]}
                    >
                      <CheckGlyph color="#07080D" />
                    </LinearGradient>
                  ) : (
                    <View style={styles.check}>
                      <CheckGlyph color={colors.textFaint} />
                    </View>
                  )}
                </Pressable>
              </View>
            )}
          </>
        );

        const rowStyle = [
          styles.row,
          !last && styles.rowDivider,
          rowTint ? { backgroundColor: rowTint } : null,
        ];

        return rowPress ? (
          <Pressable key={s.id} accessibilityRole="button" onPress={rowPress} style={rowStyle}>
            {cells}
          </Pressable>
        ) : (
          <View key={s.id} style={rowStyle}>
            {cells}
          </View>
        );
      })}

      {onAddSet ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            hapticSelection();
            onAddSet();
          }}
          style={({ pressed }) => [styles.addRow, pressed && styles.addPressed]}
        >
          <Text style={styles.addText}>+ {addLabel.toUpperCase()}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 9, paddingHorizontal: 2 },
  headRow: { paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colors.border },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: colors.border },
  headText: { fontFamily: fonts.mono, fontSize: 9.5, letterSpacing: 1.1, color: colors.textFaint },
  center: { textAlign: 'center' },
  right: { textAlign: 'right' },

  colSet: { width: 44, alignItems: 'center' },
  colValue: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  colRef: { flex: 1, alignItems: 'flex-end', paddingRight: 4 },
  colCheck: { width: 44, alignItems: 'center' },

  setLabel: { fontFamily: fonts.display, fontWeight: '700', fontSize: 14 },

  valText: {
    fontFamily: fonts.mono,
    fontSize: 13.5,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
    color: colors.text,
  },
  valDone: { color: colors.textDim },
  // The one accented box — editable CURRENT set only (mirrors the web valbox).
  valBox: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: 'rgba(34,211,238,0.35)',
    backgroundColor: 'rgba(34,211,238,0.05)',
  },
  pr: { position: 'absolute', right: 8 },

  refText: { fontFamily: fonts.mono, fontSize: 11, fontVariant: ['tabular-nums'] },

  check: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
  },
  checkDone: {
    borderWidth: 0,
    shadowColor: colors.mint,
    shadowOpacity: 0.35,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 0 },
    transform: [{ scale: 1.04 }],
  },

  addRow: { paddingVertical: 11, alignItems: 'center', borderRadius: radii.sm },
  addPressed: { backgroundColor: 'rgba(34,211,238,0.06)' },
  addText: {
    fontFamily: fonts.mono,
    fontSize: 10.5,
    fontWeight: '600',
    letterSpacing: 1.3,
    color: colors.accent2,
  },
});
