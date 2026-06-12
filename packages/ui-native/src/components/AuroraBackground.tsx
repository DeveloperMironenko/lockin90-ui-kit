import { useEffect, useId, useRef } from 'react';
import { Animated, Easing, View, StyleSheet, useWindowDimensions } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect, Pattern, Path, Mask } from 'react-native-svg';
import { colors } from '@lockin90/tokens';

export interface AuroraBackgroundProps {
  /** Optional override style on the absolute-fill layer. */
  style?: StyleProp<ViewStyle>;
  /** Freeze the drifting blobs (reduced motion). Default animated. */
  animated?: boolean;
}

interface BlobSpec {
  color: string;
  size: number;
  x: number;
  y: number;
  duration: number;
  dx: number;
  dy: number;
  opacity: number;
}

/** One drifting, soft radial glow — the native analogue of a web `.lk-aurora span`. */
function Blob({ color, size, x, y, duration, dx, dy, opacity, animated }: BlobSpec & { animated: boolean }) {
  const t = useRef(new Animated.Value(0)).current;
  const gradId = `lk-blob-${useId().replace(/:/g, '')}`;

  useEffect(() => {
    if (!animated) return undefined;
    const loop = Animated.loop(
      Animated.timing(t, {
        toValue: 1,
        duration,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [t, duration, animated]);

  const translateX = t.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, dx, 0] });
  const translateY = t.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, dy, 0] });
  const scale = t.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.12, 1] });

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        opacity,
        transform: [{ translateX }, { translateY }, { scale }],
      }}
    >
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id={gradId} cx="0.5" cy="0.5" r="0.5">
            <Stop offset="0" stopColor={color} stopOpacity={0.55} />
            <Stop offset="0.7" stopColor={color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width={size} height={size} fill={`url(#${gradId})`} />
      </Svg>
    </Animated.View>
  );
}

/**
 * Deep-void background with the Aurora energy-spectrum glows + the faint 56px
 * grid veil — the native counterpart of the web @lockin90/ui AuroraBackground.
 * Same void base (#05060B); four drifting glow blobs (violet / cyan / magenta /
 * mint) animate on the GPU (native-driver transforms), mirroring the web
 * `lk-drift` animations; the masked grid pattern fades from the top. Render it as
 * the first, absolute-fill child of a screen and put content above it.
 */
export function AuroraBackground({ style, animated = true }: AuroraBackgroundProps) {
  const { width: W, height: H } = useWindowDimensions();

  const blobs: BlobSpec[] = [
    { color: '#7C5CFF', size: W * 0.95, x: -W * 0.18, y: -H * 0.12, duration: 26000, dx: W * 0.14, dy: H * 0.08, opacity: 0.45 },
    { color: '#22D3EE', size: W * 0.85, x: W * 0.5, y: -H * 0.1, duration: 30000, dx: -W * 0.12, dy: H * 0.08, opacity: 0.38 },
    { color: '#FF3D81', size: W * 0.9, x: W * 0.22, y: H * 0.62, duration: 34000, dx: -W * 0.1, dy: -H * 0.08, opacity: 0.32 },
    { color: '#34F5C5', size: W * 0.8, x: -W * 0.15, y: H * 0.66, duration: 28000, dx: W * 0.1, dy: -H * 0.07, opacity: 0.3 },
  ];

  return (
    <View
      style={[StyleSheet.absoluteFill, { backgroundColor: colors.void, overflow: 'hidden' }, style]}
      pointerEvents="none"
    >
      {blobs.map((b, i) => (
        <Blob key={i} {...b} animated={animated} />
      ))}

      {/* faint 56px grid veil, faded from the top (web .lk-grid-veil) */}
      <Svg width={W} height={H} style={StyleSheet.absoluteFill}>
        <Defs>
          <Pattern id="lk-grid" width={56} height={56} patternUnits="userSpaceOnUse">
            <Path d="M56 0 H0 V56" stroke="rgba(255,255,255,0.025)" strokeWidth={1} fill="none" />
          </Pattern>
          <RadialGradient id="lk-grid-fade" cx="0.5" cy="0" r="0.9">
            <Stop offset="0.3" stopColor="#ffffff" stopOpacity={0.5} />
            <Stop offset="0.75" stopColor="#ffffff" stopOpacity={0} />
          </RadialGradient>
          <Mask id="lk-grid-mask">
            <Rect x={0} y={0} width={W} height={H} fill="url(#lk-grid-fade)" />
          </Mask>
        </Defs>
        <Rect x={0} y={0} width={W} height={H} fill="url(#lk-grid)" mask="url(#lk-grid-mask)" />
      </Svg>
    </View>
  );
}
