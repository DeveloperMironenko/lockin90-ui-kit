import { View, StyleSheet } from 'react-native';
import type { ViewStyle, StyleProp, DimensionValue } from 'react-native';
import { colors, radius } from '@lockin90/tokens';

export interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  radius?: number;
  circle?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Skeleton({
  width = '100%',
  height = 16,
  radius: r = radius.sm,
  circle,
  style,
}: SkeletonProps) {
  const borderRadius = circle ? 999 : r;
  return <View style={[styles.base, { width, height, borderRadius }, style]} />;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.glass,
  },
});
