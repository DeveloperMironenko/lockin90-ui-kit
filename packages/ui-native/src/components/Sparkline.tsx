import { useId } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Polyline, Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors } from '@lockin90/tokens';

export interface SparklineProps {
  /** The series, oldest → newest. Auto-scaled to fit the box. */
  data?: number[];
  /** Box width in px. */
  width?: number;
  /** Box height in px. */
  height?: number;
  /** Line color (hex/rgb color string). */
  color?: string;
  /** Fill the area under the line with a faint gradient of `color`. */
  fill?: boolean;
  /** Draw a glowing dot at the last point. */
  dot?: boolean;
  /** Line stroke width in px. */
  strokeWidth?: number;
  /** optional wrapper style */
  style?: StyleProp<ViewStyle>;
}

/** A gentle rising sample so `<Sparkline />` renders something on its own. */
const DEFAULT_DATA = [40, 44, 42, 50, 55, 53, 62, 68, 72];

/** A little vertical breathing room so the line/dot never touch the edges. */
const PAD = 3;

/**
 * Sparkline — a generic mini trend line. Normalizes `data` into a width×height
 * box (min → bottom, max → top, with a touch of vertical padding) and draws it
 * as a rounded polyline. Optionally fills the area beneath with a faint gradient
 * of `color`, and marks the last point with a glowing dot. The line stretches to
 * fill whatever box you give it.
 */
export function Sparkline({
  data = DEFAULT_DATA,
  width = 120,
  height = 32,
  color = colors.mint,
  fill = false,
  dot = true,
  strokeWidth = 2,
  style,
}: SparklineProps) {
  const gradId = useId();
  const n = data.length;

  // Horizontal padding so the first/last points and the trailing dot stay fully
  // inside the box (stroke half-width + dot radius). Dot radius is strokeWidth+1.
  const dotR = strokeWidth + 1;
  const padX = strokeWidth + dotR;
  const innerW = Math.max(0, width - padX * 2);

  // Normalize each value into the box: x spreads evenly across the padded inner
  // width (padX..width-padX), y maps min→bottom / max→top.
  const min = n ? Math.min(...data) : 0;
  const max = n ? Math.max(...data) : 0;
  const span = max - min || 1;
  const innerH = height - PAD * 2;

  const pts = data.map((v, i) => {
    const x = n <= 1 ? padX + innerW / 2 : padX + (i / (n - 1)) * innerW;
    const frac = (v - min) / span;
    const y = PAD + (1 - frac) * innerH;
    return [+x.toFixed(2), +y.toFixed(2)] as const;
  });

  const polyPoints = pts.map(([x, y]) => `${x},${y}`).join(' ');
  const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ');
  // Closed path for the area fill: line, then down to the baseline and back.
  const area =
    pts.length > 0 ? `${line} L${pts[pts.length - 1]![0]},${height} L${pts[0]![0]},${height} Z` : '';
  const last = pts[pts.length - 1];

  return (
    <View style={[{ width, height }, style]}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
        {fill && pts.length > 0 && (
          <>
            <Defs>
              <LinearGradient id={gradId} x1="0" y1="0" x2="0" y2={height}>
                <Stop offset="0%" stopColor={color} stopOpacity={0.28} />
                <Stop offset="100%" stopColor={color} stopOpacity={0} />
              </LinearGradient>
            </Defs>
            <Path d={area} fill={`url(#${gradId})`} />
          </>
        )}

        {pts.length > 0 && (
          <Polyline
            points={polyPoints}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {dot && last && <Circle cx={last[0]} cy={last[1]} r={dotR} fill={color} />}
      </Svg>
    </View>
  );
}
