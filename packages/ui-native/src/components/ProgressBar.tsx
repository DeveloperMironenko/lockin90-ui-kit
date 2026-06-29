import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
  type ViewProps,
  type DimensionValue,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@lockin90/tokens';

export interface ProgressBarProps extends ViewProps {
  /**
   * Progress fraction 0..1. When `undefined` the bar is **indeterminate** — a
   * gradient band sweeps continuously (use while a duration is unknown).
   */
  value?: number;
  /** Bar height in px (default 8). */
  height?: number;
  /** Fill gradient stops — accepts any number of colors; defaults to a
   *  2-stop accent→cyan. Pass the full `gradients.flux.stops` for the
   *  multi-color energy spectrum used by the onboarding tracker. */
  gradient?: readonly string[];
  /** The unfilled track color (default a faint glass rail). */
  track?: string;
  /** Optional label rendered above the bar. */
  label?: string;
  /** Render the percentage (only meaningful when determinate). */
  showValue?: boolean;
  /** Fully-rounded ends (default true). */
  rounded?: boolean;
}

const DEFAULT_GRADIENT: readonly string[] = [colors.accent, colors.cyan];
/** Width of the sweeping band, as a fraction of the track. */
const BAND_FRACTION = 0.38;

/**
 * Aurora-Flux linear progress bar with a gradient fill. Supports both a
 * **determinate** mode (a known `value` 0..1 → a sized gradient fill) and an
 * **indeterminate** mode (omit `value` → an Animated sweeping band).
 *
 * Distinct from `BarFill`, which is a static fraction fill only — `ProgressBar`
 * adds the indeterminate animation, an optional label / percentage, and tone.
 */
export function ProgressBar({
  value,
  height = 8,
  gradient = DEFAULT_GRADIENT,
  track = colors.glass,
  label,
  showValue = false,
  rounded = true,
  style,
  ...rest
}: ProgressBarProps) {
  const indeterminate = value == null;
  const v = indeterminate ? 0 : Math.max(0, Math.min(1, value));
  const pct = Math.round(v * 100);
  const radius = rounded ? height : 0;
  const colorStops = gradient ?? DEFAULT_GRADIENT;

  // measure the track so the sweeping band can translate across its real width
  const [trackW, setTrackW] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setTrackW(e.nativeEvent.layout.width);

  const sweep = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!indeterminate || trackW <= 0) return;
    sweep.setValue(0);
    const loop = Animated.loop(
      Animated.timing(sweep, {
        toValue: 1,
        duration: 1500,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [indeterminate, trackW, sweep]);

  const bandW = Math.max(0, trackW * BAND_FRACTION);
  const translateX = sweep.interpolate({
    inputRange: [0, 1],
    outputRange: [-bandW, trackW],
  });

  return (
    <View style={[styles.root, style]} {...rest}>
      {(label || (showValue && !indeterminate)) && (
        <View style={styles.meta}>
          {label ? <Text style={styles.label}>{label}</Text> : <View />}
          {showValue && !indeterminate && <Text style={styles.value}>{pct}%</Text>}
        </View>
      )}

      <View
        onLayout={onLayout}
        style={[styles.track, { height, borderRadius: radius, backgroundColor: track }]}
      >
        {indeterminate ? (
          <Animated.View
            style={[
              styles.band,
              { width: bandW, height: '100%', borderRadius: radius, transform: [{ translateX }] },
            ]}
          >
            <LinearGradient
              colors={colorStops as unknown as readonly [string, string, ...string[]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flex: 1, borderRadius: radius }}
            />
          </Animated.View>
        ) : (
          <LinearGradient
            colors={colorStops as unknown as readonly [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ height: '100%', width: `${pct}%` as DimensionValue, borderRadius: radius }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { width: '100%' },
  meta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 },
  label: { fontFamily: 'JetBrains Mono', fontSize: 10.5, letterSpacing: 0.2, color: colors.textDim },
  value: { fontFamily: 'JetBrains Mono', fontSize: 10.5, color: colors.accent2 },
  track: { width: '100%', overflow: 'hidden' },
  band: { position: 'absolute', top: 0, left: 0, overflow: 'hidden' },
});
