import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';
import { Card } from './Card';

/** One donut segment / legend row. */
export interface DonutSegment {
  /** display label, e.g. "Sleep" */
  label: string;
  /** the segment's value, shown in the legend (e.g. hours: "7.5h") and used to
   *  size the arc relative to the sum of all segment values */
  value: string;
  /** 0..100 share of the whole, shown in the legend and used for the arc width */
  pct: number;
  /** the segment color (dot, arc, % text) */
  color: string;
}

export interface SegmentedDonutProps {
  /** card title above the chart */
  title?: string;
  /** the donut segments, in draw order (clockwise from 12 o'clock) */
  segments?: DonutSegment[];
  /** big center readout (e.g. "24h") */
  centerValue?: string;
  /** small uppercase center label (e.g. "tracked") */
  centerLabel?: string;
  style?: StyleProp<ViewStyle>;
}

/* ring geometry: 200×200 viewBox, stroke ring at r=82 */
const VB = 200;
const C = 100;
const R = 82;
const SW = 20;
const CIRC = 2 * Math.PI * R; // ≈ 515.22
/** on-screen render size of the ring */
const RING = 200;

/** Faithful reproduction of the design's "Where your day goes" example. */
const DEFAULT_SEGMENTS: DonutSegment[] = [
  { label: 'Sleep', value: '7.5h', pct: 31, color: colors.violet },
  { label: 'Work', value: '8h', pct: 33, color: colors.cyan },
  { label: 'Training', value: '1h', pct: 4, color: colors.magenta },
  { label: 'Meals', value: '1.5h', pct: 6, color: colors.warn },
  { label: 'Leisure / other', value: '6h', pct: 25, color: colors.mint },
];

/** Segmented donut + legend — a category breakdown drawn as a multi-segment
 *  SVG donut with a center total, beside a legend of rows (colored dot · label ·
 *  value · %). Arc lengths are derived from each segment's `pct`. Same prop API
 *  as the web component. */
export function SegmentedDonut({
  title = 'Where your day goes',
  segments = DEFAULT_SEGMENTS,
  centerValue = '24h',
  centerLabel = 'tracked',
  style,
}: SegmentedDonutProps) {
  const total = segments.reduce((sum, s) => sum + s.pct, 0) || 1;

  // running offset (negative) so segments chain clockwise from 12 o'clock
  let cursor = 0;
  const arcs = segments.map((s) => {
    const len = (CIRC * s.pct) / total;
    const offset = -cursor;
    cursor += len;
    return { len, offset };
  });

  const ariaLabel = `Donut: ${segments.map((s) => `${s.label} ${s.pct}%`).join(', ')}.`;

  return (
    <Card style={[styles.donut, style]}>
      <View style={styles.head}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.chip}>
          <Text style={styles.chipText}>
            <Text style={styles.chipNum}>{centerValue}</Text> {centerLabel}
          </Text>
        </View>
      </View>

      <View style={styles.grid}>
        <View style={styles.ring} accessibilityRole="image" accessibilityLabel={ariaLabel}>
          <Svg width={RING} height={RING} viewBox={`0 0 ${VB} ${VB}`}>
            <G rotation={-90} originX={C} originY={C}>
              <Circle cx={C} cy={C} r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={SW} />
              {segments.map((s, i) => {
                const a = arcs[i]!;
                return (
                  <Circle
                    key={`${s.label}-${i}`}
                    cx={C}
                    cy={C}
                    r={R}
                    fill="none"
                    stroke={s.color}
                    strokeWidth={SW}
                    strokeLinecap="butt"
                    strokeDasharray={`${a.len.toFixed(1)} ${(CIRC - a.len).toFixed(1)}`}
                    strokeDashoffset={a.offset.toFixed(1)}
                  />
                );
              })}
            </G>
          </Svg>
          <View style={styles.center} pointerEvents="none">
            <Text style={styles.big}>{centerValue}</Text>
            <Text style={styles.centerLbl}>{centerLabel.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.list}>
          {segments.map((s, i) => (
            <View
              style={[styles.row, i === segments.length - 1 && styles.rowLast]}
              key={`${s.label}-${i}`}
            >
              <View style={[styles.sw, { backgroundColor: s.color }]} />
              <Text style={styles.name} numberOfLines={1}>{s.label}</Text>
              <Text style={styles.hrs}>{s.value}</Text>
              <Text style={[styles.pct, { color: s.color }]}>{s.pct}%</Text>
            </View>
          ))}
        </View>
      </View>
    </Card>
  );
}

export type { DonutSegment as SegmentedDonutSegment };

const styles = StyleSheet.create({
  donut: { padding: 18 },

  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 14,
  },
  title: {
    flex: 1,
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: -0.15,
    color: colors.text,
  },
  chip: {
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
  },
  chipText: { fontFamily: fonts.mono, fontSize: 11, fontWeight: '500', letterSpacing: 0.4, color: colors.textDim },
  chipNum: { color: colors.text },

  grid: { flexDirection: 'row', alignItems: 'center', gap: 26 },

  ring: { width: RING, height: RING, alignItems: 'center', justifyContent: 'center' },
  center: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  big: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 26,
    letterSpacing: -0.52,
    color: colors.text,
  },
  centerLbl: {
    fontFamily: fonts.mono,
    fontSize: 9.5,
    letterSpacing: 1.33,
    color: colors.textFaint,
    marginTop: 2,
  },

  list: { flex: 1, flexDirection: 'column' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 9,
    paddingHorizontal: 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLast: { borderBottomWidth: 0 },
  sw: { width: 13, height: 13, borderRadius: 4 },
  name: { flex: 1, fontFamily: fonts.ui, fontWeight: '600', fontSize: 13.5, color: colors.text },
  hrs: {
    width: 64,
    fontFamily: fonts.mono,
    fontSize: 12.5,
    color: colors.textDim,
    textAlign: 'right',
  },
  pct: {
    width: 44,
    fontFamily: fonts.mono,
    fontWeight: '600',
    fontSize: 13,
    textAlign: 'right',
  },
});
