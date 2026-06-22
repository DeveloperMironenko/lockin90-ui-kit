import { type ReactNode } from 'react';
import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { colors, fonts } from '@lockin90/tokens';

/** One arc of the donut, sized by its `value` share of the total. */
export interface DonutSegment {
  /** the segment's value — sizes its arc relative to the sum of all values */
  value: number;
  /** the arc color — a hex/rgb color string */
  color: string;
  /** optional label (for accessibility / external legends) */
  label?: string;
}

export interface DonutChartProps {
  /** the donut segments, drawn clockwise from 12 o'clock */
  segments?: DonutSegment[];
  /** overall diameter in px */
  size?: number;
  /** ring stroke width in px */
  thickness?: number;
  /** gap between segments, in degrees */
  gap?: number;
  /** background (track) ring color */
  track?: string;
  /** center content — if omitted, the summed total is shown */
  children?: ReactNode;
  /** optional wrapper style */
  style?: StyleProp<ViewStyle>;
}

/** Faithful reproduction of a macro-style breakdown. */
const DEFAULT_SEGMENTS: DonutSegment[] = [
  { value: 50, color: colors.cyan, label: 'Carbs' },
  { value: 30, color: colors.lime, label: 'Protein' },
  { value: 20, color: colors.accent, label: 'Fat' },
];

/** Generic segmented-donut chart — an SVG ring split into colored arcs sized by
 *  each segment's share of the total, with a small gap between them, over a
 *  faint track ring. Center shows custom `children` or the summed total. */
export function DonutChart({
  segments = DEFAULT_SEGMENTS,
  size = 120,
  thickness = 14,
  gap = 2,
  track = 'rgba(255,255,255,0.07)',
  children,
  style,
}: DonutChartProps) {
  const c = size / 2;
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;

  const total = segments.reduce((sum, s) => sum + (s.value > 0 ? s.value : 0), 0) || 1;
  /** the visible-arc count: segments with a positive value get a leading gap */
  const drawn = segments.filter((s) => s.value > 0).length;
  /** px length of the angular gap, capped so it never exceeds a segment's share */
  const gapPx = (Math.max(0, gap) / 360) * circ;

  // running offset (negative) so arcs chain clockwise from 12 o'clock
  let cursor = 0;
  const arcs = segments.map((s) => {
    const share = (s.value > 0 ? s.value : 0) / total;
    const full = circ * share;
    // shave a gap off the head of each arc (only when there's room + >1 arc)
    const trim = drawn > 1 ? Math.min(gapPx, full) : 0;
    const len = Math.max(0, full - trim);
    const offset = -(cursor + trim);
    cursor += full;
    return { len, offset };
  });

  return (
    <View style={[{ width: size, height: size }, styles.box, style]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <G origin={`${c}, ${c}`} rotation={-90}>
          <Circle cx={c} cy={c} r={r} fill="none" stroke={track} strokeWidth={thickness} />
          {segments.map((s, i) => {
            const a = arcs[i]!;
            if (a.len <= 0) return null;
            return (
              <Circle
                key={`${s.label ?? 'seg'}-${i}`}
                cx={c}
                cy={c}
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth={thickness}
                strokeLinecap="round"
                strokeDasharray={[a.len, circ - a.len]}
                strokeDashoffset={a.offset}
              />
            );
          })}
        </G>
      </Svg>
      <View style={styles.center} pointerEvents="none">
        {children ?? <Text style={styles.total}>{total}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  total: {
    fontFamily: fonts.display,
    fontSize: 26,
    lineHeight: 26,
    letterSpacing: -0.5,
    color: colors.text,
  },
});
