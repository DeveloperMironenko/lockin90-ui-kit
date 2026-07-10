import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, type LayoutChangeEvent, type TextProps, type TextStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import { gradients, fonts } from '@lockin90/tokens';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

/** Stop colors for the gradient fill. `still` uses the plain spectrum; animated
 *  uses a MIRRORED spectrum (…→last→…back through the same hues→first) spanning
 *  2× the width, so scrolling it by one width per loop is seamless — the return
 *  leg never jumps last-stop→first-stop (e.g. flux's lime→magenta).
 *  (Pure — extracted from the render path so the stop math is unit-testable.) */
export function gradientTextStops(stops: readonly string[], still: boolean): string[] {
  return still ? [...stops] : [...stops, ...stops.slice(0, -1).reverse()];
}

export interface GradientTextProps extends TextProps {
  gradient?: 'flux' | 'cta' | 'violet' | 'mint';
  /** disable the slow flowing animation (matches web `.lk-gradient-text`); static fill. */
  still?: boolean;
}

/** Energy-spectrum gradient text with a slow flowing animation (native twin of the
 *  web `.lk-gradient-text`, which scrolls `background-position` over 9s). Renders the
 *  string into an SVG with a real linear-gradient fill (react-native-svg works on
 *  device + react-native-web); measures the laid-out text first, then draws to it.
 *  The gradient uses a MIRRORED spectrum spanning 2× the width; scrolling it by one
 *  width per loop makes the flow seamless (the return leg passes back through the
 *  same hues, so it never jumps lime→magenta). */
export function GradientText({ gradient = 'flux', still = false, style, children, ...rest }: GradientTextProps) {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const anim = useRef(new Animated.Value(0)).current;
  const g = gradients[gradient] ?? gradients.flux;

  // slow linear loop; drives the gradient window's horizontal scroll. useNativeDriver
  // is false because SVG gradient coords aren't native-drivable — fine at this low rate.
  useEffect(() => {
    if (!size || still) return;
    const loop = Animated.loop(
      Animated.timing(anim, { toValue: 1, duration: 9000, easing: Easing.linear, useNativeDriver: false }),
    );
    loop.start();
    return () => loop.stop();
  }, [size, still, anim]);

  const flat = (StyleSheet.flatten(style) ?? {}) as TextStyle;
  const fontSize = typeof flat.fontSize === 'number' ? flat.fontSize : 28;
  const fontWeight = String(flat.fontWeight ?? '700');
  const fontFamily = typeof flat.fontFamily === 'string' ? flat.fontFamily : fonts.display;
  const letterSpacing = typeof flat.letterSpacing === 'number' ? flat.letterSpacing : undefined;
  const text = typeof children === 'string' || typeof children === 'number' ? String(children) : '';

  // Horizontal breathing room: react-native-svg lays glyphs out slightly wider than RN's Text
  // measurement (worse with bold display fonts + negative letterSpacing), so a tight SVG width
  // clips the last glyph. Pad both sides and draw the text CENTERED (text-anchor middle) so it
  // never clips left or right regardless of the measurement gap.
  const pad = Math.max(3, Math.round(fontSize * 0.14));

  // pass 1 — lay out the real text (hidden) to measure it; pass 2 draws the SVG
  if (!size || !text) {
    return (
      <Text
        {...rest}
        onLayout={(e: LayoutChangeEvent) => {
          const { width, height } = e.nativeEvent.layout;
          if (width && height) setSize({ w: Math.ceil(width) + pad * 2, h: Math.ceil(height) });
        }}
        // alignSelf:'flex-start' so the hidden measurer shrinks to the glyphs' INTRINSIC
        // width instead of stretching to the parent (which made the SVG full-width and
        // drew the centered text mid-container). Intrinsic width → the gradient SVG is
        // glyph-sized and follows the parent's alignment (left under a left-aligned head).
        style={[style, text ? { opacity: 0, alignSelf: 'flex-start' } : null]}
      >
        {children}
      </Text>
    );
  }

  const id = `lk-gt-${gradient}`;
  // The gradient window is 2× the text width; scroll it left by one width over the loop.
  const x1 = still ? 0 : anim.interpolate({ inputRange: [0, 1], outputRange: [0, -size.w] });
  const x2 = still ? size.w : anim.interpolate({ inputRange: [0, 1], outputRange: [2 * size.w, size.w] });
  // still → plain spectrum; animated → mirrored spectrum (seamless loop).
  const stops = gradientTextStops(g.stops, still);

  return (
    <Svg width={size.w} height={size.h} accessibilityLabel={text}>
      <Defs>
        {/* userSpaceOnUse (explicit px coords), NOT the default objectBoundingBox:
            on the New Architecture react-native-svg computes a degenerate bbox for
            <Text>, so an objectBoundingBox gradient (x1..x2 in 0–1) never paints and
            the glyphs render as flat fallback fill. Spanning the measured pixel width
            makes the flux fill render on device. */}
        <AnimatedLinearGradient id={id} gradientUnits="userSpaceOnUse" x1={x1} y1={0} x2={x2} y2={0}>
          {stops.map((c, i) => (
            <Stop key={i} offset={i / (stops.length - 1)} stopColor={c} />
          ))}
        </AnimatedLinearGradient>
      </Defs>
      <SvgText
        fill={`url(#${id})`}
        fontSize={fontSize}
        fontWeight={fontWeight}
        fontFamily={fontFamily}
        letterSpacing={letterSpacing}
        textAnchor="middle"
        x={size.w / 2}
        y={size.h * 0.78}
      >
        {text}
      </SvgText>
    </Svg>
  );
}
