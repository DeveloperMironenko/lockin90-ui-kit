import { useState } from 'react';
import { StyleSheet, Text, type LayoutChangeEvent, type TextProps, type TextStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import { gradients, fonts } from '@lockin90/tokens';

export interface GradientTextProps extends TextProps {
  gradient?: 'flux' | 'cta' | 'violet';
}

/** Energy-spectrum gradient text. Renders the string into an SVG with a real
 *  linear-gradient fill (react-native-svg works on device + react-native-web).
 *  Measures the laid-out text first, then draws the gradient to that exact size. */
export function GradientText({ gradient = 'flux', style, children, ...rest }: GradientTextProps) {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const g = gradients[gradient] ?? gradients.flux;

  const flat = (StyleSheet.flatten(style) ?? {}) as TextStyle;
  const fontSize = typeof flat.fontSize === 'number' ? flat.fontSize : 28;
  const fontWeight = String(flat.fontWeight ?? '700');
  const fontFamily = typeof flat.fontFamily === 'string' ? flat.fontFamily : fonts.display;
  const letterSpacing = typeof flat.letterSpacing === 'number' ? flat.letterSpacing : undefined;
  const text = typeof children === 'string' || typeof children === 'number' ? String(children) : '';

  // pass 1 — lay out the real text (hidden) to measure it; pass 2 draws the SVG
  if (!size || !text) {
    return (
      <Text
        {...rest}
        onLayout={(e: LayoutChangeEvent) => {
          const { width, height } = e.nativeEvent.layout;
          if (width && height) setSize({ w: Math.ceil(width) + 2, h: Math.ceil(height) });
        }}
        style={[style, text ? { opacity: 0 } : null]}
      >
        {children}
      </Text>
    );
  }

  const id = `lk-gt-${gradient}`;
  return (
    <Svg width={size.w} height={size.h} accessibilityLabel={text}>
      <Defs>
        <LinearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          {g.stops.map((c, i) => (
            <Stop key={i} offset={i / (g.stops.length - 1)} stopColor={c} />
          ))}
        </LinearGradient>
      </Defs>
      <SvgText
        fill={`url(#${id})`}
        fontSize={fontSize}
        fontWeight={fontWeight}
        fontFamily={fontFamily}
        letterSpacing={letterSpacing}
        x={0}
        y={size.h * 0.78}
      >
        {text}
      </SvgText>
    </Svg>
  );
}
