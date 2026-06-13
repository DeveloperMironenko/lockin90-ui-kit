import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import { gradientStops, fonts } from '@lockin90/tokens';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const WORDMARK = 'LockIn90';
// Repeat the flux palette so the gradient can scroll a full period and wrap.
const SCROLL_STOPS = [...gradientStops.flux, ...gradientStops.flux];

export interface BrandMarkProps {
  /** Wordmark font-size in px. */
  size?: number;
  /** Freeze the flowing gradient (e.g. for reduced motion). Default animated. */
  animated?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * LockIn90 wordmark filled with the flowing Aurora flux gradient — the native
 * counterpart of the web @lockin90/ui BrandMark (CSS gradient-clipped + animated
 * text). The gradient scrolls horizontally across the glyphs (8s linear loop),
 * mirroring the web `lk-flow-text` animation, so the two platforms show the SAME
 * animated logo.
 */
export function BrandMark({ size = 20, animated = true, style }: BrandMarkProps) {
  const width = Math.ceil(size * 5.2);
  const height = Math.ceil(size * 1.2);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animated) return undefined;
    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [animated, progress]);

  // Scroll the gradient one wordmark-width across (userSpaceOnUse coords).
  const x1 = progress.interpolate({ inputRange: [0, 1], outputRange: [-width, 0] });
  const x2 = progress.interpolate({ inputRange: [0, 1], outputRange: [width, width * 2] });

  return (
    <Svg width={width} height={height} style={style}>
      <Defs>
        <AnimatedLinearGradient
          id="lk-brandmark-grad"
          gradientUnits="userSpaceOnUse"
          x1={x1}
          y1={0}
          x2={x2}
          y2={0}
        >
          {SCROLL_STOPS.map((color, i) => (
            <Stop key={`${color}-${i}`} offset={i / (SCROLL_STOPS.length - 1)} stopColor={color} />
          ))}
        </AnimatedLinearGradient>
      </Defs>
      <SvgText
        x={width / 2}
        y={Math.round(size * 0.92)}
        textAnchor="middle"
        fontFamily={fonts.display}
        fontSize={size}
        fontWeight="700"
        fill="url(#lk-brandmark-grad)"
      >
        {WORDMARK}
      </SvgText>
    </Svg>
  );
}
