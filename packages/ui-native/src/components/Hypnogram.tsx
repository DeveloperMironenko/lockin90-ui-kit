import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path, Line, Rect, Text as SvgText } from 'react-native-svg';
import { colors, radii, fonts } from '@lockin90/tokens';

export type SleepStage = 'awake' | 'rem' | 'light' | 'deep';

/** One contiguous stretch of a single sleep stage, positioned across the night. */
export interface SleepSegment {
  stage: SleepStage;
  /** start position across the night, 0..1 (0 = lights-out, 1 = wake) */
  from: number;
  /** end position across the night, 0..1 */
  to: number;
}

/** Per-stage roll-up shown in the summary tiles + legend. */
export interface SleepStageTotal {
  stage: SleepStage;
  /** human duration, e.g. "1h 18m" */
  duration: string;
  /** share of the night, 0..100 */
  pct: number;
}

export interface HypnogramProps {
  /** mono eyebrow above the title, e.g. "Last night · 7h 24m" */
  eyebrow?: string;
  /** display title */
  title?: string;
  /** the stepped stage timeline, in chronological order */
  segments?: SleepSegment[];
  /** per-stage roll-ups for the summary tiles + legend */
  stageTotals?: SleepStageTotal[];
  /** time-axis ticks under the chart */
  axis?: string[];
  /** accessible description of the chart shape */
  ariaLabel?: string;
  style?: StyleProp<ViewStyle>;
}

/** lane order top→bottom (Awake/REM/Light/Deep) and its y-center within the 168 viewBox */
const STAGE_META: Record<SleepStage, { label: string; color: string; y: number }> = {
  awake: { label: 'Awake', color: colors.textFaint, y: 21 },
  rem: { label: 'REM', color: colors.mint, y: 61 },
  light: { label: 'Light', color: colors.cyan, y: 101 },
  deep: { label: 'Deep', color: colors.violet, y: 141 },
};

const VB_W = 660;
const VB_H = 168;
/** the stepped line is drawn in the violet of the deepest stage */
const LINE_COLOR = colors.violet;

/** Faithful reproduction of the design's "Sleep stages" example. */
const DEFAULT_SEGMENTS: SleepSegment[] = [
  { stage: 'awake', from: 0, to: 24 / VB_W },
  { stage: 'light', from: 24 / VB_W, to: 70 / VB_W },
  { stage: 'deep', from: 70 / VB_W, to: 156 / VB_W },
  { stage: 'light', from: 156 / VB_W, to: 208 / VB_W },
  { stage: 'rem', from: 208 / VB_W, to: 262 / VB_W },
  { stage: 'light', from: 262 / VB_W, to: 318 / VB_W },
  { stage: 'deep', from: 318 / VB_W, to: 372 / VB_W },
  { stage: 'light', from: 372 / VB_W, to: 410 / VB_W },
  { stage: 'awake', from: 410 / VB_W, to: 426 / VB_W },
  { stage: 'light', from: 426 / VB_W, to: 474 / VB_W },
  { stage: 'rem', from: 474 / VB_W, to: 540 / VB_W },
  { stage: 'light', from: 540 / VB_W, to: 578 / VB_W },
  { stage: 'rem', from: 578 / VB_W, to: 626 / VB_W },
  { stage: 'awake', from: 626 / VB_W, to: 640 / VB_W },
  { stage: 'light', from: 640 / VB_W, to: 1 },
];

const DEFAULT_STAGE_TOTALS: SleepStageTotal[] = [
  { stage: 'deep', duration: '1h 18m', pct: 18 },
  { stage: 'light', duration: '3h 52m', pct: 52 },
  { stage: 'rem', duration: '1h 46m', pct: 24 },
  { stage: 'awake', duration: '28m', pct: 6 },
];

const DEFAULT_AXIS = ['11:06pm', '12:30', '2:00', '3:30', '5:00', '6:30am'];

const DEFAULT_ARIA = 'Hypnogram: deep sleep front-loaded early, REM cycles lengthening toward morning.';

/** lane label rows, drawn inside the SVG */
const LANE_LABELS: { text: string; y: number }[] = [
  { text: 'AWAKE', y: 14 },
  { text: 'REM', y: 54 },
  { text: 'LIGHT', y: 94 },
  { text: 'DEEP', y: 134 },
];

/** Build a stepped SVG path that walks the stage timeline left→right,
 *  drawing a flat run at each stage's lane and a vertical riser between runs. */
function buildPath(segments: SleepSegment[]): string {
  if (segments.length === 0) return '';
  const x = (f: number) => +(f * VB_W).toFixed(2);
  const parts: string[] = [];
  segments.forEach((seg, i) => {
    const { y } = STAGE_META[seg.stage];
    const x0 = x(seg.from);
    const x1 = x(seg.to);
    if (i === 0) parts.push(`M${x0},${y}`);
    else parts.push(`L${x0},${y}`); // vertical riser from prev lane to this lane
    parts.push(`L${x1},${y}`); // flat run at this lane
  });
  return parts.join(' ');
}

/** Sleep hypnogram — a stepped stage lane chart (Awake / REM / Light / Deep
 *  across the night) drawn in SVG, with a time axis, stage legend and a row of
 *  per-stage summary tiles (stage · duration · % of night).
 *  Same prop API as the web component. */
export function Hypnogram({
  eyebrow = 'Last night · 7h 24m',
  title = 'Sleep stages',
  segments = DEFAULT_SEGMENTS,
  stageTotals = DEFAULT_STAGE_TOTALS,
  axis = DEFAULT_AXIS,
  ariaLabel = DEFAULT_ARIA,
  style,
}: HypnogramProps) {
  const path = buildPath(segments);

  return (
    <View style={[styles.hyp, style]}>
      {/* header */}
      <View style={styles.head}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* chart */}
      <View style={styles.wrap} accessibilityRole="image" accessibilityLabel={ariaLabel}>
        <Svg width="100%" height={168} viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none">
          {/* lane background washes */}
          <Rect x={0} y={2} width={VB_W} height={38} fill="rgba(106,114,134,0.05)" />
          <Rect x={0} y={42} width={VB_W} height={38} fill="rgba(74,222,168,0.05)" />
          <Rect x={0} y={82} width={VB_W} height={38} fill="rgba(34,211,238,0.05)" />
          <Rect x={0} y={122} width={VB_W} height={38} fill="rgba(124,92,255,0.06)" />
          {/* lane dividers */}
          <Line x1={0} y1={40} x2={VB_W} y2={40} stroke={colors.border} strokeWidth={1} />
          <Line x1={0} y1={80} x2={VB_W} y2={80} stroke={colors.border} strokeWidth={1} />
          <Line x1={0} y1={120} x2={VB_W} y2={120} stroke={colors.border} strokeWidth={1} />
          {/* lane labels */}
          {LANE_LABELS.map((l) => (
            <SvgText
              key={l.text}
              x={4}
              y={l.y}
              fontFamily={fonts.mono}
              fontSize={8.5}
              fill={colors.textFaint}
            >
              {l.text}
            </SvgText>
          ))}
          {/* stepped stage line */}
          <Path
            d={path}
            fill="none"
            stroke={LINE_COLOR}
            strokeWidth={2.4}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </Svg>

        {/* time axis */}
        <View style={styles.axis}>
          {axis.map((t, i) => (
            <Text key={i} style={styles.axisTick}>
              {t}
            </Text>
          ))}
        </View>

        {/* stage legend */}
        <View style={styles.legend}>
          {stageTotals.map((s) => {
            const meta = STAGE_META[s.stage];
            return (
              <View key={s.stage} style={styles.legendItem}>
                <View style={[styles.legendSwatch, { backgroundColor: meta.color }]} />
                <Text style={styles.legendText}>
                  {meta.label} · {s.duration}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* stage summary tiles */}
      <View style={styles.grid}>
        {stageTotals.map((s) => {
          const meta = STAGE_META[s.stage];
          return (
            <View key={s.stage} style={styles.tileWrap}>
              <View style={styles.tile}>
                <View style={[styles.dot, { backgroundColor: meta.color }]} />
                <Text style={styles.name}>{meta.label}</Text>
                <Text style={styles.min}>{s.duration}</Text>
                <Text style={styles.pct}>
                  <Text style={styles.pctNum}>{s.pct}%</Text> of night
                </Text>
                <View style={styles.bar}>
                  <View style={[styles.barFill, { width: `${s.pct}%`, backgroundColor: meta.color }]} />
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export type { SleepSegment as HypnogramSegment, SleepStageTotal as HypnogramStageTotal };

const TILE_GAP = 14;
/** four tiles share the row minus three gaps */
const TILE_BASIS = `${100 / 4}%` as const;

const styles = StyleSheet.create({
  hyp: { padding: 24, flexDirection: 'column' },

  head: { flexDirection: 'column', gap: 4, marginBottom: 16 },
  eyebrow: {
    fontFamily: fonts.mono,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.6,
    color: colors.textFaint,
  },
  title: { fontFamily: fonts.display, fontWeight: '700', fontSize: 22, letterSpacing: -0.44, color: colors.text },

  wrap: { position: 'relative', marginTop: 4 },

  axis: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 7 },
  axisTick: { fontFamily: fonts.mono, fontSize: 9.5, color: colors.textFaint },

  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  legendSwatch: { width: 11, height: 11, borderRadius: 3 },
  legendText: { fontFamily: fonts.mono, fontSize: 10.5, color: colors.textDim },

  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 20, marginHorizontal: -TILE_GAP / 2 },
  tileWrap: { flexBasis: TILE_BASIS, paddingHorizontal: TILE_GAP / 2 },
  tile: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.glass,
    alignItems: 'center',
    gap: 4,
  },
  dot: { width: 10, height: 10, borderRadius: 5, marginBottom: 6 },
  name: {
    fontFamily: fonts.mono,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.6,
    color: colors.textFaint,
  },
  min: { fontFamily: fonts.display, fontWeight: '700', fontSize: 22, letterSpacing: -0.44, color: colors.text },
  pct: { fontFamily: fonts.mono, fontSize: 11, color: colors.textDim },
  pctNum: { fontFamily: fonts.mono, fontSize: 11, color: colors.textDim },
  bar: { width: '100%', height: 5, marginTop: 9, borderRadius: 99, backgroundColor: colors.glass2, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 99 },
});
