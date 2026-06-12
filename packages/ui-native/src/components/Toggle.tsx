import { View, Text, Pressable, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { colors, fonts, fontSizes, spacing } from '@lockin90/tokens';

export interface ToggleProps {
  value: boolean;
  onValueChange?: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Toggle({ value, onValueChange, label, disabled, style }: ToggleProps) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled: !!disabled }}
      disabled={disabled}
      onPress={() => onValueChange?.(!value)}
      style={[styles.row, disabled && styles.disabled, style]}
    >
      <View style={[styles.track, value && styles.trackOn]}>
        <View style={[styles.thumb, value ? styles.thumbOn : styles.thumbOff]} />
      </View>
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  disabled: {
    opacity: 0.5,
  },
  track: {
    width: 42,
    height: 24,
    borderRadius: 999,
    backgroundColor: colors.glass2,
  },
  trackOn: {
    backgroundColor: colors.accent,
  },
  thumb: {
    position: 'absolute',
    top: 3,
    width: 18,
    height: 18,
    borderRadius: 999,
    backgroundColor: colors.text,
  },
  thumbOff: {
    left: 2,
  },
  thumbOn: {
    left: 22,
  },
  label: {
    fontFamily: fonts.ui,
    fontSize: fontSizes.base,
    color: colors.text,
  },
});
