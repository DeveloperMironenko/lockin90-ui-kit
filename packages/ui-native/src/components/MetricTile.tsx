import { type ReactNode } from 'react';
import { View, Text, StyleSheet, type ViewProps, type DimensionValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, fonts, gradients } from '@lockin90/tokens';

/* ── MetricTile ──────────────────────────────────────────────────────────── */

export type MetricDeltaTone = 'up' | 'down' | 'flat';

export interface MetricTileProps extends ViewProps {
  /** mono uppercase caption above the value */
  label?: string;
  /** big display number */
  value?: ReactNode;
  /** small suffix after the value (e.g. '%', 'pts') */
  unit?: string;
  /** signed delta shown as a tone-colored pill (e.g. '+3') */
  delta?: string;
  /** colors the delta pill: up=mint, down=red, flat=faint */
  deltaTone?: MetricDeltaTone;
  /** faint icon in the top-right corner */
  icon?: ReactNode;
  /** bottom spark-fill bar. A single value in [0,1] fills the bar to that
   *  fraction; a multi-point series fills to `last / max`. Omit to hide the bar. */
  spark?: number[];
  /** override the spark fill colour (solid); defaults to the flux/cta gradient. */
  sparkColor?: string;
  /** placeholder mode: renders an em-dash `—` in place of the value, suppresses
   *  the unit + delta pill, and shows the optional `hint` instead. */
  empty?: boolean;
  /** a small line: in empty mode under the dash (e.g. "No data yet — connect a wearable"); on an
   *  `sm` tile also under a value. */
  hint?: string;
  /** `sm`: a readout tile in a phone's settings grid, three across (design `mobile/account.html`
   *  `.fcell`, scaled to a 402pt screen): padding 12 × 11, `radii.md`, label 10 `.1em`, value 600 20,
   *  unit mono 12 faint. @default 'md' */
  size?: 'sm' | 'md';
  /** `sm` only: the value is a word, not a number, drawn at 15 (design `.fv.txt`) so it fits a third of
   *  the screen; it wraps when it doesn't fit (never cut: the meaning stays whole). */
  textValue?: boolean;
}

const DELTA: Record<MetricDeltaTone, { color: string; bg: string }> = {
  up: { color: colors.zoneHigh, bg: 'rgba(52,245,197,0.12)' },
  down: { color: colors.zoneLow, bg: 'rgba(255,77,109,0.12)' },
  flat: { color: colors.textFaint, bg: colors.glass2 },
};

/** Fraction (0..1) the spark-fill bar should reach for a given series. */
function sparkFill(vals: number[]): number {
  if (vals.length === 0) return 0;
  if (vals.length === 1) return Math.max(0, Math.min(1, vals[0]!));
  const max = Math.max(...vals, 0);
  if (max <= 0) return 0;
  return Math.max(0, Math.min(1, vals[vals.length - 1]! / max));
}

/** A small KPI tile — glass card with a mono label + optional top-right icon, a
 *  big display value + unit, and an optional tone-colored delta pill. In `empty`
 *  mode it shows an em-dash placeholder + an optional `hint`. */
export function MetricTile({
  label = 'Followers',
  value = '1.2k',
  unit,
  delta,
  deltaTone = 'flat',
  icon,
  spark,
  sparkColor,
  empty,
  hint,
  size = 'md',
  textValue,
  style,
  ...rest
}: MetricTileProps) {
  const sm = size === 'sm';
  const labelStyle = [styles.label, sm && styles.labelSm];
  // an sm label stays on one line, cut with an ellipsis when it doesn't fit (owner, 2026-11-10)
  if (empty) {
    return (
      <View style={[styles.tile, sm && styles.tileSm, style]} {...rest}>
        <View style={styles.top}>
          <Text style={labelStyle}>{label}</Text>
          {icon != null && <View style={styles.icon}>{icon}</View>}
        </View>
        <View style={styles.body}>
          <Text style={[styles.value, sm && styles.valueSm, styles.valueEmpty]}>—</Text>
        </View>
        {hint != null && <Text style={[styles.hint, sm && styles.hintSm]}>{hint}</Text>}
      </View>
    );
  }
  const d = DELTA[deltaTone];
  return (
    <View style={[styles.tile, sm && styles.tileSm, style]} {...rest}>
      <View style={styles.top}>
        <Text style={labelStyle}>{label}</Text>
        {icon != null && <View style={styles.icon}>{icon}</View>}
      </View>
      <View style={styles.body}>
        <Text
          style={[styles.value, sm && styles.valueSm, sm && textValue && styles.valueWord]}
        >
          {value}
        </Text>
        {unit != null && <Text style={[styles.unit, sm && styles.unitSm]}>{unit}</Text>}
      </View>
      {delta != null && (
        <View style={[styles.delta, { backgroundColor: d.bg }]}>
          <Text style={[styles.deltaText, { color: d.color }]}>{delta}</Text>
        </View>
      )}
      {spark != null && spark.length > 0 && (
        <View style={styles.spark}>
          {sparkColor != null ? (
            <View
              style={[styles.sparkFill, { width: `${sparkFill(spark) * 100}%` as DimensionValue, backgroundColor: sparkColor }]}
            />
          ) : (
            <LinearGradient
              colors={[...gradients.cta.stops] as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.sparkFill, { width: `${sparkFill(spark) * 100}%` as DimensionValue }]}
            />
          )}
        </View>
      )}
      {/* under a value only on the settings tile (as web): elsewhere it's empty mode's line */}
      {sm && hint != null && <Text style={[styles.hint, styles.hintSm]}>{hint}</Text>}
    </View>
  );
}

/* ── ProgressDots ────────────────────────────────────────────────────────── */

export interface ProgressDotsProps extends ViewProps {
  /** number of segment dots */
  total?: number;
  /** how many dots are filled (clamped to 0…total) */
  filled?: number;
  /** color of the filled dots */
  color?: string;
}

/** A row of segment dots showing progress (e.g. calibration day 5 of 14).
 *  Filled dots glow in `color`; the rest stay faint, the current dot is larger. */
export function ProgressDots({
  total = 14,
  filled = 5,
  color = colors.accent,
  style,
  ...rest
}: ProgressDotsProps) {
  const count = Math.max(0, Math.floor(total));
  const done = Math.max(0, Math.min(count, Math.floor(filled)));
  const currentIndex = done - 1;

  return (
    <View style={[styles.dots, style]} {...rest}>
      {Array.from({ length: count }, (_, i) => {
        const on = i < done;
        return (
          <View
            key={i}
            style={[
              styles.dot,
              on && { backgroundColor: color, shadowColor: color, shadowOpacity: 0.8, shadowRadius: 6 },
              i === currentIndex && styles.dotNow,
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  /* MetricTile */
  tile: {
    flexDirection: 'column',
    gap: 6,
    padding: 14,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1.68,
    color: colors.textFaint,
  },
  icon: { opacity: 0.8 },
  body: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  value: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 24,
    letterSpacing: -0.48,
    color: colors.text,
  },
  unit: {
    fontFamily: fonts.ui,
    fontSize: 12,
    fontWeight: '500',
    color: colors.textDim,
  },
  delta: {
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: radii.sm,
  },
  deltaText: {
    fontFamily: fonts.mono,
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.22,
  },
  /* empty / zero-data placeholder: faint em-dash value + a faint mono hint line */
  valueEmpty: { color: colors.textFaint },
  hint: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 0.21,
    color: colors.textFaint,
  },
  /* spark-fill bar */
  spark: {
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    marginTop: 3,
  },
  sparkFill: { height: '100%', borderRadius: 999 },
  /* size sm: the phone's settings readout (design mobile/account.html .fcell × 402/294) */
  tileSm: { gap: 3, paddingVertical: 12, paddingHorizontal: 11, borderRadius: radii.md },
  // flexShrink: in its row the text is held to the tile's width, so the ellipsis shows
  labelSm: { fontSize: 11, fontWeight: '400', letterSpacing: 1, flexShrink: 1 },
  valueSm: { fontWeight: '600', fontSize: 20, letterSpacing: -0.2 },
  valueWord: { fontSize: 15, letterSpacing: 0, flexShrink: 1 },
  unitSm: { fontFamily: fonts.mono, fontSize: 12, color: colors.textFaint },
  hintSm: { fontFamily: fonts.ui, fontSize: 11, letterSpacing: 0, color: colors.textDim },
  /* ProgressDots */
  dots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.border2,
  },
  dotNow: { transform: [{ scale: 1.35 }] },
});
