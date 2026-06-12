import { View, Text, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { colors, fonts, spacing } from '@lockin90/tokens';
import { BarFill } from './BarFill';

export interface ProgressBarProps {
  /** Fill fraction, 0..1. */
  value: number;
  label?: string;
  valueLabel?: string;
  tone?: 'accent' | 'pos' | 'neg';
  style?: StyleProp<ViewStyle>;
}

export function ProgressBar({ value, label, valueLabel, tone = 'accent', style }: ProgressBarProps) {
  return (
    <View style={[styles.wrap, style]}>
      {label || valueLabel ? (
        <View style={styles.row}>
          <Text style={styles.label}>{label ?? ''}</Text>
          <Text style={[styles.label, styles.valueLabel]}>{valueLabel ?? ''}</Text>
        </View>
      ) : null}
      <BarFill value={value} tone={tone} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 1,
    color: colors.textFaint,
  },
  valueLabel: {
    color: colors.textDim,
    textAlign: 'right',
  },
});
