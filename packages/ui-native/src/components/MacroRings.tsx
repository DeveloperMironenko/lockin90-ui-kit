import { useId } from 'react';
import { View, Text, StyleSheet, type StyleProp, type ViewStyle, type DimensionValue } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop, G } from 'react-native-svg';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { colors, radii, fonts, gradients } from '@lockin90/tokens';
import { Card } from './Card';

/** One macro ring (protein / carbs / fats). */
export interface Macro {
  /** display label, e.g. "Protein" */
  label: string;
  /** grams consumed so far (center readout) */
  grams: number;
  /** daily target in grams */
  target: number;
  /** 0..100 fill percentage of the ring */
  pct: number;
  /** the two gradient stops [from, to] for the arc */
  gradient: [string, string];
}

export interface MacroRingsProps {
  /** card title above the rings */
  title?: string;
  /** the three macro rings, in order (protein, carbs, fats) */
  macros?: Macro[];
  /** total calories consumed today (header pill + footer value) */
  kcal?: number;
  /** daily calorie target (footer "/ target") */
  kcalTarget?: number;
  style?: StyleProp<ViewStyle>;
}

/* ring geometry: 78×78 viewBox, stroke ring at r=33 */
const VB = 78;
const CX = 39;
const CY = 39;
const R = 33;
const CIRC = 2 * Math.PI * R; // 207.345
/** on-screen render size of each square ring */
const RING = 78;

/** per-slot center grams color (protein=high, carbs=cyan, fats=mid) */
const SLOT_COLOR = [colors.zoneHigh, colors.accent2, colors.zoneMid];

/** Faithful reproduction of the design's "Today's macros" example. */
const DEFAULT_MACROS: Macro[] = [
  { label: 'Protein', grams: 142, target: 160, pct: 89, gradient: ['#34F5C5', '#A8FF35'] },
  { label: 'Carbs', grams: 186, target: 220, pct: 85, gradient: ['#22D3EE', '#34F5C5'] },
  { label: 'Fats', grams: 58, target: 70, pct: 83, gradient: ['#FFB020', '#FF4D6D'] },
];

const NF = new Intl.NumberFormat('en-US');

/** Macro rings — daily macros as three % progress rings (protein · carbs ·
 *  fats), each showing grams vs target with a % fill, a center grams readout
 *  and a label, over a glass card, with a calories-total footer. Same prop API
 *  as the web component. */
export function MacroRings({
  title = "Today's macros",
  macros = DEFAULT_MACROS,
  kcal = 1840,
  kcalTarget = 2420,
  style,
}: MacroRingsProps) {
  const uid = useId();
  const kcalFrac = kcalTarget > 0 ? Math.max(0, Math.min(1, kcal / kcalTarget)) : 0;
  const barWidth = `${(kcalFrac * 100).toFixed(1)}%` as DimensionValue;

  return (
    <Card style={[styles.macro, style]}>
      <View style={styles.head}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.kcal}>
          <Text style={styles.kcalNum}>{NF.format(kcal)}</Text> kcal
        </Text>
      </View>

      <View style={styles.trio}>
        {macros.map((m, i) => {
          const gradId = `lk-macro-grad-${uid}-${i}`;
          const frac = Math.max(0, Math.min(1, m.pct / 100));
          const dash = `${(CIRC * frac).toFixed(1)} ${(CIRC * (1 - frac)).toFixed(1)}`;
          const centerColor = SLOT_COLOR[i] ?? SLOT_COLOR[SLOT_COLOR.length - 1];
          return (
            <View
              style={styles.cell}
              key={`${m.label}-${i}`}
            >
              <View
                style={styles.ring}
                accessibilityRole="image"
                accessibilityLabel={`${m.label} ${m.grams} of ${m.target}g, ${m.pct}%`}
              >
                <Svg width={RING} height={RING} viewBox={`0 0 ${VB} ${VB}`}>
                  <Defs>
                    <LinearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
                      <Stop offset="0" stopColor={m.gradient[0]} />
                      <Stop offset="1" stopColor={m.gradient[1]} />
                    </LinearGradient>
                  </Defs>
                  {/* rotate -90 so the arc fill starts at 12 o'clock */}
                  <G rotation={-90} originX={CX} originY={CY}>
                    <Circle cx={CX} cy={CY} r={R} fill="none" stroke={colors.border2} strokeWidth={7} />
                    <Circle
                      cx={CX}
                      cy={CY}
                      r={R}
                      fill="none"
                      stroke={`url(#${gradId})`}
                      strokeWidth={7}
                      strokeLinecap="round"
                      strokeDasharray={dash}
                    />
                  </G>
                </Svg>
                <View style={styles.center} pointerEvents="none">
                  <Text style={[styles.grams, { color: centerColor }]}>{m.grams}</Text>
                  <Text style={styles.pct}>{m.pct}%</Text>
                </View>
              </View>
              <Text style={styles.lbl}>{m.label.toUpperCase()}</Text>
              <Text style={styles.tgt}>of {m.target}g</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.foot}>
        <Text style={styles.flbl}>CALORIES</Text>
        <View style={styles.bar}>
          <ExpoLinearGradient
            colors={[...gradients.cta.stops] as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ height: '100%', width: barWidth, borderRadius: 99 }}
          />
        </View>
        <Text style={styles.fval}>
          {NF.format(kcal)}
          <Text style={styles.fu}> / {NF.format(kcalTarget)}</Text>
        </Text>
      </View>
    </Card>
  );
}

export type { Macro as MacroRingsMacro };

const styles = StyleSheet.create({
  macro: { padding: 16, paddingBottom: 14 },

  head: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 14,
  },
  title: { fontFamily: fonts.display, fontWeight: '700', fontSize: 14, letterSpacing: -0.14, color: colors.text },
  kcal: { fontFamily: fonts.mono, fontSize: 11, color: colors.accent2 },
  kcalNum: { color: colors.text },

  trio: { flexDirection: 'row' },
  cell: { flex: 1, alignItems: 'center', gap: 7, paddingHorizontal: 5 },

  ring: { width: RING, height: RING, alignItems: 'center', justifyContent: 'center' },
  center: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', gap: 1 },
  grams: { fontFamily: fonts.display, fontWeight: '700', fontSize: 16, lineHeight: 16, letterSpacing: -0.32 },
  pct: { fontFamily: fonts.mono, fontSize: 8, letterSpacing: 0.32, color: colors.textFaint },

  lbl: { fontFamily: fonts.mono, fontSize: 8.5, letterSpacing: 0.85, color: colors.textFaint },
  tgt: { fontFamily: fonts.mono, fontSize: 9, color: colors.textDim },

  foot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  flbl: { fontFamily: fonts.mono, fontSize: 8.5, letterSpacing: 0.85, color: colors.textFaint },
  bar: { flex: 1, maxWidth: 120, height: 6, borderRadius: 99, backgroundColor: colors.border2, overflow: 'hidden' },
  fval: { marginLeft: 'auto', fontFamily: fonts.display, fontWeight: '700', fontSize: 15, letterSpacing: -0.15, color: colors.text },
  fu: { fontFamily: fonts.mono, fontWeight: '500', fontSize: 9, color: colors.textFaint },
});
