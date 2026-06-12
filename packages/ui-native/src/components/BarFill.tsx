import { View, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle, DimensionValue } from 'react-native';
import { colors } from '@lockin90/tokens';

export interface BarFillProps {
  /** Fill fraction, 0..1. */
  value: number;
  tone?: 'accent' | 'pos' | 'neg';
  height?: number;
  style?: StyleProp<ViewStyle>;
}

const TONE_COLOR: Record<NonNullable<BarFillProps['tone']>, string> = {
  accent: colors.accent,
  pos: colors.zoneHigh,
  neg: colors.zoneLow,
};

export function BarFill({ value, tone = 'accent', height = 8, style }: BarFillProps) {
  const clamped = Math.max(0, Math.min(1, value));
  const width = (`${clamped * 100}%` as DimensionValue);
  return (
    <View style={[styles.track, { height }, style]}>
      <View style={[styles.fill, { width, backgroundColor: TONE_COLOR[tone] }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
});
