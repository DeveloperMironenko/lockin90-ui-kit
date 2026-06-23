import { type ReactNode } from 'react';
import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { colors, fonts } from '@lockin90/tokens';
import { Icon, type IconName } from './Icon';

export type EffectTone = 'auto' | 'positive' | 'negative' | 'neutral';

export interface EffectAttributionLineProps {
  /** Signed contribution; rendered with an explicit + or − sign. */
  value: number;
  /** What the contribution is attributed to, e.g. 'Deep sleep 1h20m'. */
  label: ReactNode;
  /** Unit appended to the value, e.g. 'pts'. */
  unit?: string;
  /** Color tone. 'auto' (default) = positive if value>0, negative if <0, neutral if 0. */
  tone?: EffectTone;
  /** Optional leading glyph. */
  icon?: IconName;
  style?: StyleProp<ViewStyle>;
}

// Native has no `currentColor`; resolve each tone to its value/icon color.
const TONE_COLOR: Record<'positive' | 'negative' | 'neutral', string> = {
  positive: colors.zoneHigh,
  negative: colors.zoneLow,
  neutral: colors.textDim,
};

/** Resolve the effective tone from the explicit prop, falling back to the numeric sign. */
function resolveTone(tone: EffectTone, value: number): 'positive' | 'negative' | 'neutral' {
  if (tone !== 'auto') return tone;
  if (value > 0) return 'positive';
  if (value < 0) return 'negative';
  return 'neutral';
}

function signFor(value: number): string {
  if (value > 0) return '+';
  if (value < 0) return '−';
  return '±';
}

/**
 * A single "why this score" attribution row: optional leading icon, a large
 * signed contribution (display font, tinted by tone) with unit, and the label
 * describing the driver. Stack several inside an energy-explain list.
 */
export function EffectAttributionLine({
  value,
  label,
  unit,
  tone = 'auto',
  icon,
  style,
}: EffectAttributionLineProps) {
  const resolved = resolveTone(tone, value);
  const color = TONE_COLOR[resolved];
  return (
    <View style={[styles.row, style]}>
      {icon != null && (
        <View style={styles.icon}>
          <Icon name={icon} size={16} color={color} />
        </View>
      )}
      <Text style={[styles.value, { color }]}>
        <Text style={styles.sign}>{signFor(value)}</Text>
        {String(Math.abs(value))}
        {unit != null && <Text style={styles.unit}>{unit}</Text>}
      </Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  icon: { alignSelf: 'center' },
  value: { fontFamily: fonts.display, fontWeight: '700', fontSize: 26, letterSpacing: -0.52, lineHeight: 28 },
  sign: { fontFamily: fonts.display, fontWeight: '700' },
  unit: { fontSize: 13, fontWeight: '500', color: colors.textFaint },
  label: { fontFamily: fonts.mono, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.2, color: colors.textDim },
});
