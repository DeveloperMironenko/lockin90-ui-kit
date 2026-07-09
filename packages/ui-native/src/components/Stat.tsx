import { type ReactNode } from 'react';
import { View, Text, StyleSheet, type StyleProp, type ViewStyle, type TextStyle } from 'react-native';
import { colors, fonts } from '@lockin90/tokens';
import { GradientText } from './GradientText';

/** Value color treatment. `gradient` = flux gradient (static flux on the small/
 *  default sizes, full spectrum on `hero`); `mint` = mint accent. */
export type StatTone = 'default' | 'gradient' | 'mint';
/** `md` (default, 30px) · `sm`/`lg` = compact/panel stats (20/28px) · `hero` =
 *  oversized marketing figure with the label BELOW. */
export type StatSize = 'sm' | 'md' | 'lg' | 'hero';

export interface StatProps {
  label: string;
  value: string;
  delta?: string;
  deltaDir?: 'up' | 'down';
  /** value color treatment (gradient / mint); ignored when `valueColor` is set. */
  tone?: StatTone;
  /** explicit value colour (overrides `tone`) — for computed/graded colours. */
  valueColor?: string;
  /** size scale (default `md`). */
  size?: StatSize;
  /** optional caption under the value (mono, faint). */
  sub?: ReactNode;
  /** placeholder mode: renders an em-dash `—` in place of the value, suppresses
   *  the delta, and shows the optional `hint` instead. */
  empty?: boolean;
  /** small helper line shown in empty mode (e.g. "No data yet — connect a wearable"). */
  hint?: string;
  style?: StyleProp<ViewStyle>;
}

const SIZE: Record<
  StatSize,
  {
    gap: number;
    reverse?: boolean;
    labelSize: number;
    labelSpacing: number;
    labelWeight: TextStyle['fontWeight'];
    labelColor: string;
    valueSize: number;
    valueSpacing: number;
  }
> = {
  sm: { gap: 3, labelSize: 10, labelSpacing: 1.2, labelWeight: '400', labelColor: colors.textFaint, valueSize: 20, valueSpacing: -0.4 },
  md: { gap: 6, labelSize: 10.5, labelSpacing: 1.6, labelWeight: '400', labelColor: colors.textFaint, valueSize: 30, valueSpacing: -0.6 },
  lg: { gap: 3, labelSize: 10, labelSpacing: 1.2, labelWeight: '400', labelColor: colors.textFaint, valueSize: 28, valueSpacing: -0.56 },
  hero: { gap: 8, reverse: true, labelSize: 11, labelSpacing: 2, labelWeight: '500', labelColor: colors.textDim, valueSize: 44, valueSpacing: -1.32 },
};

/** Label + big display value + optional signed delta. `tone="gradient"` renders
 *  the value as flux-gradient text; `size` scales it (`hero` flips the label below).
 *  In `empty` mode it shows an em-dash placeholder + an optional `hint`. */
export function Stat({ label, value, delta, deltaDir, tone = 'default', valueColor, size = 'md', sub, empty, hint, style }: StatProps) {
  const s = SIZE[size];
  const isGradient = tone === 'gradient' && !valueColor;
  const valueColorResolved = valueColor ?? (tone === 'mint' ? colors.mint : colors.text);

  const valueStyle: TextStyle = {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: s.valueSize,
    letterSpacing: s.valueSpacing,
  };

  if (empty) {
    return (
      <View style={[styles.stat, { gap: s.gap }, s.reverse && styles.reverse, style]}>
        <Text
          style={[
            styles.label,
            { fontSize: s.labelSize, letterSpacing: s.labelSpacing, fontWeight: s.labelWeight, color: s.labelColor },
          ]}
        >
          {label}
        </Text>
        <Text style={[valueStyle, { color: colors.textFaint }]}>—</Text>
        {hint != null && <Text style={styles.hint}>{hint}</Text>}
      </View>
    );
  }

  return (
    <View style={[styles.stat, { gap: s.gap }, s.reverse && styles.reverse, style]}>
      <Text
        style={[
          styles.label,
          { fontSize: s.labelSize, letterSpacing: s.labelSpacing, fontWeight: s.labelWeight, color: s.labelColor },
        ]}
      >
        {label}
      </Text>
      {isGradient ? (
        <GradientText gradient={size === 'hero' ? 'flux' : 'cta'} style={valueStyle}>
          {value}
        </GradientText>
      ) : (
        <Text style={[valueStyle, { color: valueColorResolved }]}>{value}</Text>
      )}
      {delta != null && (
        <Text style={[styles.delta, { color: deltaDir === 'down' ? colors.zoneLow : colors.zoneHigh }]}>{delta}</Text>
      )}
      {sub != null && <Text style={styles.sub}>{sub}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  stat: { gap: 6 },
  reverse: { flexDirection: 'column-reverse' },
  label: { fontFamily: fonts.mono, textTransform: 'uppercase', color: colors.textFaint },
  delta: { fontFamily: fonts.mono, fontSize: 12 },
  sub: { fontFamily: fonts.mono, fontSize: 10.5, color: colors.textFaint },
  // helper line under the em-dash in empty mode (web `.lk-stat-hint`: mono 11px, 0.02em)
  hint: { fontFamily: fonts.mono, fontSize: 11, letterSpacing: 0.22, color: colors.textFaint },
});
