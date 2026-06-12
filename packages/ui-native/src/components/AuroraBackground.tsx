import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { colors } from '@lockin90/tokens';

export interface AuroraBackgroundProps {
  /** Optional override style on the absolute-fill layer. */
  style?: import('react-native').StyleProp<import('react-native').ViewStyle>;
}

/**
 * Deep-void background with the Aurora energy-spectrum corner glows — the native
 * counterpart of the web @lockin90/ui AuroraBackground. Same void base
 * (#05060B) and the same four corner glows (violet / cyan / magenta / mint) at
 * the same positions + opacities, so the two platforms read identically. Static
 * (the web's drift animation isn't visible in a still); render it as the first,
 * absolute-fill child of a screen and put content above it.
 */
export function AuroraBackground({ style }: AuroraBackgroundProps) {
  const { width, height } = useWindowDimensions();
  return (
    <View
      style={[StyleSheet.absoluteFill, { backgroundColor: colors.void }, style]}
      pointerEvents="none"
    >
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          {/* top-left violet */}
          <RadialGradient id="lk-aurora-1" cx="0.12" cy="0.08" r="0.6">
            <Stop offset="0" stopColor="#7C5CFF" stopOpacity={0.2} />
            <Stop offset="0.6" stopColor="#7C5CFF" stopOpacity={0} />
          </RadialGradient>
          {/* top-right cyan */}
          <RadialGradient id="lk-aurora-2" cx="0.88" cy="0.14" r="0.55">
            <Stop offset="0" stopColor="#22D3EE" stopOpacity={0.16} />
            <Stop offset="0.6" stopColor="#22D3EE" stopOpacity={0} />
          </RadialGradient>
          {/* bottom magenta */}
          <RadialGradient id="lk-aurora-3" cx="0.7" cy="0.88" r="0.6">
            <Stop offset="0" stopColor="#FF3D81" stopOpacity={0.12} />
            <Stop offset="0.62" stopColor="#FF3D81" stopOpacity={0} />
          </RadialGradient>
          {/* bottom-left mint */}
          <RadialGradient id="lk-aurora-4" cx="0.22" cy="0.92" r="0.5">
            <Stop offset="0" stopColor="#34F5C5" stopOpacity={0.12} />
            <Stop offset="0.6" stopColor="#34F5C5" stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width={width} height={height} fill="url(#lk-aurora-1)" />
        <Rect x={0} y={0} width={width} height={height} fill="url(#lk-aurora-2)" />
        <Rect x={0} y={0} width={width} height={height} fill="url(#lk-aurora-3)" />
        <Rect x={0} y={0} width={width} height={height} fill="url(#lk-aurora-4)" />
      </Svg>
    </View>
  );
}
