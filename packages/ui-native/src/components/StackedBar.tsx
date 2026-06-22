import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { colors, fonts, radii } from '@lockin90/tokens';

/** One contiguous segment of the stacked bar, sized by its `value` share. */
export interface StackedSegment {
  /** the segment's value — sizes its slice relative to `total` (or the sum) */
  value: number;
  /** the slice color — a hex/rgb color string (e.g. colors.mint) */
  color: string;
  /** optional label (legend + accessibility) */
  label?: string;
}

export interface StackedBarProps {
  /** the segments laid out left→right, sized by their share of the total */
  segments: StackedSegment[];
  /** bar thickness in px */
  height?: number;
  /** pill-rounded ends + clipped corners */
  rounded?: boolean;
  /** px gap between adjacent segments */
  gap?: number;
  /** render a legend (dot + label + value/%) below the bar */
  showLegend?: boolean;
  /** denominator for the shares; if omitted, the summed segment values */
  total?: number;
  /** optional wrapper style */
  style?: StyleProp<ViewStyle>;
}

/** 100%-stacked horizontal bar — one linear track split into colored proportion
 *  segments sized by each segment's share of the total, with an optional legend
 *  of dot + label + value/% rows below. Distinct from BarChart (separate
 *  vertical bars) and DonutChart (radial). Tokens-driven. */
export function StackedBar({
  segments,
  height = 10,
  rounded = true,
  gap = 2,
  showLegend = false,
  total,
  style,
}: StackedBarProps) {
  const sum = segments.reduce((acc, s) => acc + (s.value > 0 ? s.value : 0), 0);
  const denom = total != null && total > 0 ? total : sum || 1;
  const drawn = segments.filter((s) => s.value > 0).length;
  const r = rounded ? height : radii.sm;
  const g = drawn > 1 ? Math.max(0, gap) : 0;

  const ariaLabel = `Stacked bar: ${segments
    .map((s) => `${s.label ?? 'segment'} ${Math.round(((s.value > 0 ? s.value : 0) / denom) * 100)}%`)
    .join(', ')}.`;

  return (
    <View style={[styles.wrap, style]}>
      <View
        style={[styles.track, { height, borderRadius: r, gap: g }]}
        accessibilityRole="image"
        accessibilityLabel={ariaLabel}
      >
        {segments.map((s, i) => {
          const v = s.value > 0 ? s.value : 0;
          if (v <= 0) return null;
          const pct = (v / denom) * 100;
          return (
            <View
              key={`${s.label ?? 'seg'}-${i}`}
              style={{ flexGrow: pct, flexBasis: 0, minWidth: 2, backgroundColor: s.color }}
            />
          );
        })}
      </View>

      {showLegend && (
        <View style={styles.legend}>
          {segments.map((s, i) => {
            const v = s.value > 0 ? s.value : 0;
            const pct = Math.round((v / denom) * 100);
            return (
              <View style={styles.li} key={`li-${s.label ?? 'seg'}-${i}`}>
                <View style={[styles.dot, { backgroundColor: s.color }]} />
                <Text style={styles.name} numberOfLines={1}>
                  {s.label ?? `Segment ${i + 1}`}
                </Text>
                <Text style={styles.val}>{s.value}</Text>
                <Text style={styles.pct}>{pct}%</Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', gap: 12 },
  track: {
    flexDirection: 'row',
    width: '100%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },
  legend: { gap: 2 },
  li: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  dot: { width: 11, height: 11, borderRadius: 3 },
  name: {
    flex: 1,
    minWidth: 0,
    fontFamily: fonts.ui,
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  val: {
    fontFamily: fonts.mono,
    fontSize: 12.5,
    color: colors.textDim,
    textAlign: 'right',
  },
  pct: {
    fontFamily: fonts.mono,
    fontSize: 13,
    fontWeight: '600',
    color: colors.textFaint,
    textAlign: 'right',
    minWidth: 38,
  },
});
