import Svg, { Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import type { StyleProp, ViewStyle } from 'react-native';
import { gradientStops, fonts } from '@lockin90/tokens';

export interface BrandMarkProps {
  /** Wordmark font-size in px. */
  size?: number;
  style?: StyleProp<ViewStyle>;
}

const WORDMARK = 'LockIn90';

/**
 * LockIn90 wordmark filled with the Aurora flux gradient — the native
 * counterpart of the web @lockin90/ui BrandMark (CSS gradient-clipped text).
 * Rendered as gradient-filled SVG text so the two platforms show the SAME logo.
 */
export function BrandMark({ size = 20, style }: BrandMarkProps) {
  const width = Math.ceil(size * 5.2);
  const height = Math.ceil(size * 1.2);
  const stops = gradientStops.flux;
  return (
    <Svg width={width} height={height} style={style}>
      <Defs>
        <LinearGradient id="lk-brandmark-grad" x1="0" y1="0" x2="1" y2="0.25">
          {stops.map((color, i) => (
            <Stop key={color} offset={i / (stops.length - 1)} stopColor={color} />
          ))}
        </LinearGradient>
      </Defs>
      <SvgText
        x={0}
        y={Math.round(size * 0.92)}
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
