import { View, StyleSheet, type ViewProps, type DimensionValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients } from '@lockin90/tokens';

export interface BarFillProps extends ViewProps {
  /** 0..1 fill fraction */
  value: number;
  height?: number;
}

/** Thin gradient progress bar. */
export function BarFill({ value, height = 8, style, ...rest }: BarFillProps) {
  const v = Math.max(0, Math.min(1, value));
  const pct = `${v * 100}%` as DimensionValue;
  return (
    <View style={[styles.track, { height, borderRadius: height }, style]} {...rest}>
      <LinearGradient
        colors={[...gradients.cta.stops] as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ height: '100%', width: pct, borderRadius: height }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { width: '100%', backgroundColor: 'rgba(255,255,255,0.06)', overflow: 'hidden' },
});
