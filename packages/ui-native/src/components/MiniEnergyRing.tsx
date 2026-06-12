import { View, Text, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors, fonts, gradientStops } from '@lockin90/tokens';

export interface MiniEnergyRingProps {
  /** Energy score, 0..100. */
  score: number;
  size?: number;
  stroke?: number;
  gradient?: 'flux' | 'cta' | 'mint' | 'violet' | 'warm';
  showValue?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function MiniEnergyRing({
  score,
  size = 96,
  stroke,
  gradient = 'flux',
  showValue = true,
  style,
}: MiniEnergyRingProps) {
  // Unique per gradient family so multiple rings (e.g. a calendar strip) don't
  // share one <Defs> id and inherit each other's stops.
  const gradientId = `miniEnergyRingGradient-${gradient}`;
  const strokeWidth = stroke ?? size * 0.08;
  const clamped = Math.max(0, Math.min(100, score));
  const radiusPx = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radiusPx;
  const offset = circumference * (1 - clamped / 100);
  const center = size / 2;
  const stops = gradientStops[gradient];

  return (
    <View style={[styles.wrap, { width: size, height: size }, style]}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            {stops.map((color, i) => (
              <Stop
                key={`${color}-${i}`}
                offset={stops.length > 1 ? i / (stops.length - 1) : 0}
                stopColor={color}
              />
            ))}
          </LinearGradient>
        </Defs>
        <Circle
          cx={center}
          cy={center}
          r={radiusPx}
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radiusPx}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="none"
          rotation={-90}
          origin={`${center}, ${center}`}
        />
      </Svg>
      {showValue ? (
        <View style={styles.center} pointerEvents="none">
          <Text style={[styles.value, { fontSize: size * 0.3 }]}>{Math.round(clamped)}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontFamily: fonts.display,
    color: colors.text,
  },
});

export default MiniEnergyRing;
