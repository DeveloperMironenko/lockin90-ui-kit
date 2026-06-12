import { View, Text, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { colors, fonts, fontSizes, spacing } from '@lockin90/tokens';

export interface StatBlockProps {
  label: string;
  value: string;
  delta?: string;
  deltaDir?: 'up' | 'down';
  style?: StyleProp<ViewStyle>;
}

export function StatBlock({ label, value, delta, deltaDir, style }: StatBlockProps) {
  return (
    <View style={[styles.wrap, style]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {delta ? (
        <Text
          style={[
            styles.delta,
            deltaDir === 'up' && { color: colors.zoneHigh },
            deltaDir === 'down' && { color: colors.zoneLow },
          ]}
        >
          {delta}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs },
  label: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.textFaint,
  },
  value: { fontFamily: fonts.display, fontSize: fontSizes.xxl, color: colors.text },
  delta: { fontFamily: fonts.mono, fontSize: 12, color: colors.textDim },
});
