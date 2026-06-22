import { View, Text, StyleSheet, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, gradients } from '@lockin90/tokens';

/** One bar in the chart. */
export interface BarItem {
  /** the bar's value — its height is `value / max` of the chart area */
  value: number;
  /** label shown below the bar (mono, uppercase, faint) */
  label?: string;
  /** override fill — a solid hex; defaults to the shared `gradient` */
  color?: string;
  /** highlight this bar (brighter mint gradient + glow) */
  highlight?: boolean;
}

export interface BarChartProps {
  /** the bars, drawn left → right */
  bars?: BarItem[];
  /** the value that maps to full chart height (100%); defaults to the max bar value */
  max?: number;
  /** chart area height in px */
  height?: number;
  /** show the value above each bar */
  showValues?: boolean;
  /** default bar gradient stops (top → bottom) when an item has no `color` */
  gradient?: [string, string];
  /** optional container style */
  style?: StyleProp<ViewStyle>;
}

/** Faithful reproduction of the design's weekday-style bars. */
const DEFAULT_BARS: BarItem[] = [
  { value: 71, label: 'M' },
  { value: 76, label: 'T' },
  { value: 79, label: 'W', highlight: true },
  { value: 74, label: 'T' },
  { value: 68, label: 'F' },
  { value: 61, label: 'S', color: colors.zoneMid },
  { value: 70, label: 'S' },
];

/** default bar gradient — cyan → accent, top to bottom (matches web 180deg) */
const DEFAULT_GRADIENT: [string, string] = [colors.cyan, colors.accent];

/** brighter mint gradient used for highlighted bars (when they have no `color`) */
const HIGHLIGHT_GRADIENT: [string, string] = [gradients.mint.stops[0], gradients.mint.stops[1]];

/**
 * Generic vertical bar chart — a flex row of columns, each a gradient-filled bar
 * sized by `value / max` of the chart area, with an optional value label above
 * and a mono/uppercase label below. Highlighted bars get a brighter mint
 * gradient + glow. Per-bar `color` overrides the shared `gradient`. Tokens-driven.
 * Defaults reproduce the weekday example.
 */
export function BarChart({
  bars = DEFAULT_BARS,
  max,
  height = 150,
  showValues = true,
  gradient = DEFAULT_GRADIENT,
  style,
}: BarChartProps) {
  const ref = max ?? Math.max(0, ...bars.map((b) => b.value));
  const denom = ref > 0 ? ref : 1;

  return (
    <View style={[styles.root, style]}>
      {bars.map((b, i) => {
        const pct = Math.max(0, Math.min(1, b.value / denom));
        const barHeight = (pct * height) as DimensionValue;
        const stops = b.highlight ? HIGHLIGHT_GRADIENT : gradient;
        return (
          <View key={i} style={styles.col}>
            {showValues && (
              <Text style={[styles.val, b.highlight && styles.valHl]}>{b.value}</Text>
            )}
            {b.color ? (
              <View style={[styles.bar, b.highlight && styles.barHl, { height: barHeight, backgroundColor: b.color }]} />
            ) : (
              <LinearGradient
                colors={stops}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={[styles.bar, b.highlight && styles.barHl, { height: barHeight }]}
              />
            )}
            {b.label != null && (
              <Text style={[styles.label, b.highlight && styles.labelHl]}>{b.label}</Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  col: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    minWidth: 0,
  },
  // value label above each bar
  val: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.textDim,
  },
  valHl: { color: colors.zoneHigh },
  // the bar itself — rounded top
  bar: {
    width: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  // highlighted bar — clears border + adds a soft mint glow
  barHl: {
    borderColor: 'transparent',
    shadowColor: colors.mint,
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  // label below each bar
  label: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.textFaint,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  labelHl: { color: colors.textDim },
});
