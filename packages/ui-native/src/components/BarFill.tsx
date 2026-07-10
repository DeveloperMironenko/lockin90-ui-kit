import { View, StyleSheet, type ViewProps, type DimensionValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients } from '@lockin90/tokens';

/** Fill gradient — one of the `@lockin90/tokens` gradient tokens. */
export type BarFillGradient = 'cta' | 'mint' | 'warm' | 'flux' | 'violet';

export interface BarFillProps extends ViewProps {
  /** 0..1 fill fraction */
  value: number;
  height?: number;
  /** fill gradient token (default `'cta'` — unchanged legacy look). The design
   *  uses `mint` for healthy coverage/unlimited bars and `warm` for
   *  warn-threshold quota bars (mock `.barfill.q-unlimited` / `.q-warn`). */
  gradient?: BarFillGradient;
}

/** Thin gradient progress bar. */
export function BarFill({ value, height = 8, gradient = 'cta', style, ...rest }: BarFillProps) {
  const v = Math.max(0, Math.min(1, value));
  const pct = `${v * 100}%` as DimensionValue;
  const stops = gradients[gradient].stops as unknown as readonly [string, string, ...string[]];
  return (
    <View style={[styles.track, { height, borderRadius: height }, style]} {...rest}>
      <LinearGradient
        colors={stops}
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
