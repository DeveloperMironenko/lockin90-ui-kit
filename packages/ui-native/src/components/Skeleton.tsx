import { View, type ViewProps, type DimensionValue } from 'react-native';
import { colors, radii } from '@lockin90/tokens';

export interface SkeletonProps extends ViewProps {
  width?: DimensionValue;
  height?: DimensionValue;
  radius?: number;
}

/** Placeholder block (static fill; wrap with an Animated shimmer if desired). */
export function Skeleton({ width, height = 14, radius = radii.sm, style, ...rest }: SkeletonProps) {
  return <View style={[{ width, height, borderRadius: radius, backgroundColor: colors.glass }, style]} {...rest} />;
}
