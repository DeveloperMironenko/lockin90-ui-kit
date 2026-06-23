import { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
  type DimensionValue,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radii, fonts } from '@lockin90/tokens';

export interface SliderProps {
  /** current value (default 72) */
  value?: number;
  /** scale minimum (default 0) */
  min?: number;
  /** scale maximum (default 100) */
  max?: number;
  /** fired with the new numeric value while dragging */
  onChange?: (value: number) => void;
  /** the filled-portion paint — a solid color OR a `[from, to]` gradient tuple */
  fill?: string | [string, string];
  /** thumb / fill glow color */
  glow?: string;
  /** the unfilled remainder rail color */
  trackColor?: string;
  /** optional scale labels rendered evenly-spaced under the rail (e.g. a
   *  mood/focus/energy scale). When omitted, nothing extra renders. */
  labels?: string[];
  style?: StyleProp<ViewStyle>;
}

/** Generic Aurora-Flux range slider: a neutral remainder rail, a gradient fill
 *  up to the value with a soft glow, and a glowing white thumb with a colored
 *  ring. Draggable via PanResponder; emits the clamped value through `onChange`.
 *  Mirrors the web `Slider` look + prop API. */
export function Slider({
  value = 72,
  min = 0,
  max = 100,
  onChange,
  fill = [colors.accent, colors.cyan],
  glow = colors.accent,
  trackColor = 'rgba(255,255,255,0.10)',
  labels,
  style,
}: SliderProps) {
  const span = max - min || 1;
  const pct = Math.max(0, Math.min(100, ((value - min) / span) * 100));
  const pctStr = `${pct}%` as DimensionValue;

  // measured track width, used to turn drag gestures into values
  const widthRef = useRef(0);
  const [, setWidth] = useState(0);

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    widthRef.current = w;
    setWidth(w);
  };

  const emitAtX = (x: number) => {
    const w = widthRef.current;
    if (w <= 0) return;
    const frac = Math.max(0, Math.min(1, x / w));
    const next = min + frac * span;
    onChange?.(next);
  };

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => emitAtX(e.nativeEvent.locationX),
      onPanResponderMove: (e) => emitAtX(e.nativeEvent.locationX),
    }),
  ).current;

  const useGradient = Array.isArray(fill);

  // the interactive rail (PanResponder + onLayout live here so dragging maps
  // to the rail's measured width). Identical to before when no labels.
  const rail = (
    <View
      style={[styles.root, labels ? undefined : style]}
      onLayout={onLayout}
      {...pan.panHandlers}
    >
      {/* unfilled remainder rail */}
      <View style={[styles.track, { backgroundColor: trackColor }]} pointerEvents="none" />

      {/* gradient/solid fill up to the value, with soft glow */}
      <View
        style={[styles.fillWrap, { width: pctStr, shadowColor: glow }]}
        pointerEvents="none"
      >
        {useGradient ? (
          <LinearGradient
            colors={fill as [string, string]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: fill as string }]} />
        )}
      </View>

      {/* glowing white thumb with a colored ring */}
      <View
        style={[styles.thumb, { left: pctStr, borderColor: glow, shadowColor: glow }]}
        pointerEvents="none"
      />
    </View>
  );

  // No labels → identical to before (rail carries `style`).
  if (!labels || labels.length === 0) {
    return rail;
  }

  // With labels → wrap the rail + an evenly-spaced labels row.
  return (
    <View style={style}>
      {rail}
      <View style={styles.labels} pointerEvents="none">
        {labels.map((label, i) => (
          <Text key={`${i}-${label}`} style={styles.label}>
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { position: 'relative', height: 18, justifyContent: 'center' },
  track: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 10,
    borderRadius: radii.pill,
  },
  fillWrap: {
    position: 'absolute',
    left: 0,
    height: 10,
    borderRadius: radii.pill,
    overflow: 'hidden',
    // soft glow (shadowColor set inline to `glow`)
    shadowOpacity: 0.7,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  thumb: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    // center the 18px thumb on the value point
    marginLeft: -9,
    backgroundColor: '#fff',
    borderWidth: 4,
    // glow (shadowColor set inline)
    shadowOpacity: 0.8,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  // optional scale labels — evenly-spaced row under the rail
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 7,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 8.5,
    color: colors.textFaint,
  },
});
