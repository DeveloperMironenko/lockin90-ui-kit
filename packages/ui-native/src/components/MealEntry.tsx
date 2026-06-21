import { type ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  type DimensionValue,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, fonts } from '@lockin90/tokens';
import { Chip, type ChipTone } from './Chip';
import { Card } from './Card';

export interface MealMacros {
  /** protein, grams */
  protein: number;
  /** carbohydrate, grams */
  carbs: number;
  /** fat, grams */
  fat: number;
}

export interface MealEntryProps {
  /** meal name, e.g. "Greek yogurt + berries" */
  name?: string;
  /** logged time, e.g. "8:30am" */
  time?: string;
  /** energy, kcal */
  kcal?: number;
  /** P / C / F in grams */
  macros?: MealMacros;
  /** optional one-line ingredient list under the title */
  foods?: string;
  /** glycemic chip tone (signal color): high = stable/good, mid = moderate, low = spiky */
  glycemicTone?: ChipTone;
  /** glycemic chip label, e.g. "GL 8 · low GI" */
  glycemicLabel?: string;
  /** optional secondary chip, e.g. "stable glucose" */
  note?: string;
  /** custom leading icon (defaults to a meal/cutlery glyph) */
  icon?: ReactNode;
  /** wrap the row in a Card surface (matches the web demo container) */
  card?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Reference per-macro ceilings used to size the mini-bars from raw grams.
 *  Tuned so the design's example (22/24/6 g) renders ≈ .72 / .40 / .18. */
const MACRO_MAX = { protein: 30, carbs: 60, fat: 35 } as const;

/** Per-macro bar gradients — mirror the web .lk-meal-bar.lk-{p,c,f} stops. */
const MACRO_GRAD: Record<'p' | 'c' | 'f', [string, string]> = {
  p: [colors.lime, colors.cyan],
  c: [colors.cyan, colors.accent],
  f: [colors.warn, colors.zoneLow],
};

function frac(grams: number, max: number): number {
  return Math.max(0, Math.min(1, grams / max));
}

const DefaultIcon = () => (
  <Svg width={19} height={19} viewBox="0 0 24 24">
    <Path
      d="M12 2a4 4 0 0 1 4 4c0 2-2 3-2 5h-4c0-2-2-3-2-5a4 4 0 0 1 4-4zM9 16h6M9 19h6"
      stroke={colors.lime}
      strokeWidth={1.6}
      fill="none"
    />
  </Svg>
);

function MacroBar({
  letter,
  grams,
  max,
  kind,
}: {
  letter: string;
  grams: number;
  max: number;
  kind: 'p' | 'c' | 'f';
}) {
  const pct = `${frac(grams, max) * 100}%` as DimensionValue;
  return (
    <View style={styles.mm}>
      <View style={styles.mmTop}>
        <Text style={styles.mmLabel}>{letter}</Text>
        <Text style={styles.mmLabel}>{grams}g</Text>
      </View>
      <View style={styles.bar}>
        <LinearGradient
          colors={MACRO_GRAD[kind]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ height: '100%', width: pct, borderRadius: 999 }}
        />
      </View>
    </View>
  );
}

/** Food-log meal row — icon, name/time/kcal, P/C/F mini-macro bars and glycemic chips. */
export function MealEntry({
  name = 'Greek yogurt + berries',
  time = '8:30am',
  kcal = 220,
  macros = { protein: 22, carbs: 24, fat: 6 },
  foods = 'Greek yogurt · blueberries · honey · pumpkin seeds',
  glycemicTone = 'high',
  glycemicLabel = 'GL 8 · low GI',
  note = 'stable glucose',
  icon,
  card = false,
  style,
}: MealEntryProps) {
  const row = (
    <View style={[styles.entry, !card && style]}>
      <View style={styles.ico}>{icon ?? <DefaultIcon />}</View>
      <View style={styles.body}>
        <View style={styles.row1}>
          <Text style={styles.title} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.time}>{time}</Text>
          <Text style={styles.kcal}>{kcal} kcal</Text>
        </View>
        {foods ? (
          <Text style={styles.foods} numberOfLines={1}>
            {foods}
          </Text>
        ) : null}
        <View style={styles.macros}>
          <MacroBar letter="P" grams={macros.protein} max={MACRO_MAX.protein} kind="p" />
          <MacroBar letter="C" grams={macros.carbs} max={MACRO_MAX.carbs} kind="c" />
          <MacroBar letter="F" grams={macros.fat} max={MACRO_MAX.fat} kind="f" />
        </View>
        <View style={styles.chips}>
          {glycemicLabel ? <Chip tone={glycemicTone} dot label={glycemicLabel} /> : null}
          {note ? <Chip label={note} /> : null}
        </View>
      </View>
    </View>
  );

  return card ? <Card style={style}>{row}</Card> : row;
}

const styles = StyleSheet.create({
  entry: { flexDirection: 'row', gap: 14, paddingVertical: 16 },
  ico: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },
  body: { flex: 1, minWidth: 0 },
  row1: { flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', gap: 10 },
  title: { flexShrink: 1, fontFamily: fonts.display, fontWeight: '700', fontSize: 15, color: colors.text },
  time: { fontFamily: fonts.mono, fontSize: 11, color: colors.textFaint },
  kcal: { marginLeft: 'auto', fontFamily: fonts.mono, fontSize: 12, color: colors.text },
  foods: { fontSize: 12.5, color: colors.textDim, marginTop: 5, marginBottom: 10 },
  macros: { flexDirection: 'row', gap: 10, maxWidth: 380 },
  mm: { flex: 1 },
  mmTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  mmLabel: { fontFamily: fonts.mono, fontSize: 10, color: colors.textFaint },
  bar: { height: 5, borderRadius: radii.pill, backgroundColor: 'rgba(255,255,255,0.06)', overflow: 'hidden' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 11 },
});
