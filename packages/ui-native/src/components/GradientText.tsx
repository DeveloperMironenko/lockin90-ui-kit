import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import { fonts, gradientStops } from '@lockin90/tokens';

export type GradientFamily = 'flux' | 'cta' | 'violet';

// Module-scoped counter for unique <LinearGradient> ids (Math.random is unavailable;
// each mounted instance gets a stable, distinct id so multiple GradientTexts on one
// screen don't share a gradient def).
let gradSeq = 0;

export interface GradientTextProps {
  /** Single-line heading string to render with the gradient fill. */
  children: string;
  /** Gradient family — matches the web @lockin90/ui GradientText. Default 'flux'. */
  gradient?: GradientFamily;
  /** Font size in px. Default 28. */
  size?: number;
  /** Font weight. Default '700'. */
  weight?: TextStyle['fontWeight'];
  /** Font family. Default the display face. */
  fontFamily?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Gradient-filled heading text — the native counterpart of the web @lockin90/ui
 * `GradientText` (which clips a CSS gradient to the glyphs). A hidden Text measures
 * the glyph width; an absolutely-positioned react-native-svg `<Text>` then paints the
 * same string filled with the Aurora gradient (stops from @lockin90/tokens). Mirrors
 * `BrandMark`'s verified SVG-gradient approach so web and native render the same.
 */
export function GradientText({
  children,
  gradient = 'flux',
  size = 28,
  weight = '700',
  fontFamily = fonts.display,
  style,
}: GradientTextProps) {
  const [width, setWidth] = useState(0);
  const gradId = useMemo(() => `lk-grad-text-${(gradSeq += 1)}`, []);
  const stops = gradientStops[gradient];
  const height = Math.ceil(size * 1.2);

  return (
    <View style={style}>
      {/* The real (transparent) text: it reserves layout, measures the glyph width,
          and carries accessibility + selectable content. The gradient SVG paints the
          same glyphs on top; the user sees the gradient, screen readers read this. */}
      <Text
        onLayout={(e) => setWidth(Math.ceil(e.nativeEvent.layout.width))}
        style={[
          styles.measure,
          { fontFamily, fontSize: size, fontWeight: weight, lineHeight: height },
        ]}
      >
        {children}
      </Text>
      {width > 0 ? (
        <Svg
          width={width}
          height={height}
          style={StyleSheet.absoluteFill}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <Defs>
            <LinearGradient
              id={gradId}
              gradientUnits="userSpaceOnUse"
              x1={0}
              y1={0}
              x2={width}
              y2={0}
            >
              {stops.map((color, i) => (
                <Stop key={`${color}-${i}`} offset={i / (stops.length - 1)} stopColor={color} />
              ))}
            </LinearGradient>
          </Defs>
          <SvgText
            x={0}
            y={Math.round(size * 0.92)}
            fontFamily={fontFamily}
            fontSize={size}
            fontWeight={weight}
            fill={`url(#${gradId})`}
          >
            {children}
          </SvgText>
        </Svg>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  // Invisible (the SVG paints the visible gradient on top) but still laid out,
  // measured, accessible, and selectable.
  measure: { color: 'transparent' },
});
