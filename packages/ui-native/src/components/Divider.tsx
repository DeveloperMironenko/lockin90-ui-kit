import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts } from '@lockin90/tokens';

export interface DividerProps {
  /** fade-to-transparent gradient rule (mirrors the web `gradient` variant) */
  gradient?: boolean;
  /**
   * Optional centered label — renders `hairline — label — hairline` (the
   * "or continue with" pattern). Mirrors the web `label` variant.
   */
  label?: string;
  style?: StyleProp<ViewStyle>;
}

/** Hairline divider. With `gradient`, the rule fades to transparent at both ends —
 *  the native analogue of web `linear-gradient(90deg, transparent, var(--border-2), transparent)`.
 *  With `label`, renders a flat hairline on each side of a centered label. */
export function Divider({ gradient, label, style }: DividerProps) {
  if (label != null) {
    return (
      <View style={[styles.labelRow, style]}>
        <View style={styles.labelLine} />
        <Text style={styles.label}>{label}</Text>
        <View style={styles.labelLine} />
      </View>
    );
  }
  if (gradient) {
    return (
      <LinearGradient
        colors={['transparent', colors.border2, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.line, style]}
      />
    );
  }
  return <View style={[styles.line, styles.flat, style]} />;
}

const styles = StyleSheet.create({
  line: { height: 1 },
  flat: { backgroundColor: colors.border },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  labelLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  label: {
    flexShrink: 0,
    fontFamily: fonts.ui,
    fontSize: 12,
    color: colors.textFaint,
  },
});
