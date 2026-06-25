import { useState } from 'react';
import { View, Text, StyleSheet, type DimensionValue, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Rect, Line, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors, fonts } from '@lockin90/tokens';

/** A sleep stage. Ordered top → bottom on the plot: awake, rem, light, deep. */
export type SleepStage = 'awake' | 'rem' | 'light' | 'deep';

/** One contiguous stretch of sleep in a single stage. Segment widths are drawn
 *  proportional to `minutes`. */
export interface HypnogramSegment {
  /** the sleep stage for this stretch */
  stage: SleepStage;
  /** duration in minutes — drives the segment's drawn width */
  minutes: number;
}

export interface HypnogramProps {
  /** chronological sleep segments; widths are proportional to `minutes` */
  segments?: HypnogramSegment[];
  /** plot height in px (also the viewBox height) */
  height?: number;
  /** x-axis time labels under the chart */
  axis?: string[];
  /** show the left-gutter stage labels (Awake / REM / Light / Deep) */
  showStageLabels?: boolean;
  /** optional container style */
  style?: StyleProp<ViewStyle>;
}

const VB_W = 560;
/** vertical inset (viewBox units) so the top/bottom bands never touch the edge */
const PAD_Y = 14;
/** gap between consecutive segment capsules (viewBox units) */
const GAP = 4;
/** capsule bar thickness (viewBox units) */
const BAR_H = 12;
/** width (px) of the left gutter reserved for stage labels */
const STAGE_GUTTER = 48;

/** Stages top → bottom — the classic hypnogram order (deep at the bottom). */
const STAGES: SleepStage[] = ['awake', 'rem', 'light', 'deep'];
const STAGE_LABELS: Record<SleepStage, string> = {
  awake: 'Awake',
  rem: 'REM',
  light: 'Light',
  deep: 'Deep',
};
const STAGE_COLORS: Record<SleepStage, string> = {
  awake: colors.warn,
  rem: colors.violet,
  light: colors.cyan,
  deep: colors.indigo,
};

const DEFAULT_SEGMENTS: HypnogramSegment[] = [
  { stage: 'awake', minutes: 8 },
  { stage: 'light', minutes: 42 },
  { stage: 'deep', minutes: 55 },
  { stage: 'light', minutes: 28 },
  { stage: 'rem', minutes: 22 },
  { stage: 'light', minutes: 35 },
  { stage: 'deep', minutes: 30 },
  { stage: 'rem', minutes: 26 },
  { stage: 'light', minutes: 38 },
  { stage: 'awake', minutes: 6 },
  { stage: 'rem', minutes: 34 },
  { stage: 'light', minutes: 30 },
];
const DEFAULT_AXIS = ['11p', '1a', '3a', '5a', '7a'];

/** Round a number for compact attribute values. */
const r = (n: number) => Math.round(n * 100) / 100;

/** y-center (viewBox units) of a stage's band. */
function bandY(stage: SleepStage, height: number): number {
  const top = PAD_Y;
  const bottom = height - PAD_Y;
  const i = STAGES.indexOf(stage);
  if (STAGES.length === 1) return (top + bottom) / 2;
  return top + (i / (STAGES.length - 1)) * (bottom - top);
}

/**
 * Hypnogram — a sleep-stage timeline. Four horizontal bands (Awake / REM / Light
 * / Deep, top → bottom) each hold rounded capsule bars whose widths are
 * proportional to each segment's minutes; thin vertical connectors link
 * consecutive stage transitions so the eye follows the descent/ascent like a
 * stepped line. The Svg stretches to the measured container width via a fixed
 * viewBox + non-uniform scaling. The left gutter holds the stage labels; an
 * x-axis time row sits below.
 */
export function Hypnogram({
  segments = DEFAULT_SEGMENTS,
  height = 160,
  axis = DEFAULT_AXIS,
  showStageLabels = true,
  style,
}: HypnogramProps) {
  const [width, setWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  const total = segments.reduce((s, seg) => s + Math.max(0, seg.minutes), 0) || 1;
  const gaps = Math.max(0, segments.length - 1) * GAP;
  const drawable = Math.max(0, VB_W - gaps);

  // lay segments left → right, width ∝ minutes, with a GAP between each
  let x = 0;
  const bars = segments.map((seg, i) => {
    const w = (Math.max(0, seg.minutes) / total) * drawable;
    const y = bandY(seg.stage, height);
    const bar = { x, w, cy: y, stage: seg.stage, x0: x, x1: x + w, key: i };
    x += w + GAP;
    return bar;
  });

  // vertical connectors: link the end-y of one segment to the start-y of the next
  const connectors = bars.slice(1).map((b, i) => {
    const prev = bars[i];
    const cx = (prev.x1 + b.x0) / 2;
    return { cx, y1: prev.cy, y2: b.cy, key: i };
  });

  // the drawing area shrinks by the gutter width when the stage labels are on, so
  // the bars stay clear of the labels (the bars still use the full segment range).
  const canvasW = showStageLabels ? Math.max(0, width - STAGE_GUTTER) : width;

  return (
    <View style={[styles.root, style]}>
      <View style={[styles.plot, { height }]} onLayout={onLayout}>
        {showStageLabels ? (
          <View style={styles.stages} pointerEvents="none">
            {STAGES.map((stage) => (
              <Text
                key={stage}
                style={[styles.stage, { top: `${(bandY(stage, height) / height) * 100}%` as DimensionValue }]}
                numberOfLines={1}
              >
                {STAGE_LABELS[stage]}
              </Text>
            ))}
          </View>
        ) : null}

        <View style={[styles.canvas, { width: canvasW }]}>
          {canvasW > 0 && (
            <Svg
              width={canvasW}
              height={height}
              viewBox={`0 0 ${VB_W} ${height}`}
              preserveAspectRatio="none"
            >
              <Defs>
                {STAGES.map((stage) => (
                  // per-BAR gradient (objectBoundingBox), so every band reads
                  // bright like web — NOT a full-height userSpaceOnUse ramp that
                  // made the lower bands sample the dark/transparent end.
                  <LinearGradient key={stage} id={`lk-hyp-${stage}`} x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor={STAGE_COLORS[stage]} stopOpacity={0.95} />
                    <Stop offset="1" stopColor={STAGE_COLORS[stage]} stopOpacity={0.85} />
                  </LinearGradient>
                ))}
              </Defs>

              {/* thin vertical connectors between consecutive stage bands */}
              {connectors.map((c) => (
                <Line
                  key={c.key}
                  x1={r(c.cx)}
                  y1={r(c.y1)}
                  x2={r(c.cx)}
                  y2={r(c.y2)}
                  stroke={colors.border2}
                  strokeWidth={1.5}
                  opacity={0.8}
                />
              ))}

              {/* rounded capsule bars, one per segment, on its stage band */}
              {bars.map((b) => (
                <Rect
                  key={b.key}
                  x={r(b.x)}
                  y={r(b.cy - BAR_H / 2)}
                  width={r(Math.max(0, b.w))}
                  height={BAR_H}
                  rx={BAR_H / 2}
                  ry={BAR_H / 2}
                  fill={`url(#lk-hyp-${b.stage})`}
                />
              ))}
            </Svg>
          )}
        </View>
      </View>

      {axis && axis.length > 0 && (
        <View style={[styles.axis, showStageLabels ? { paddingLeft: STAGE_GUTTER } : null]}>
          {axis.map((t, i) => (
            <Text key={i} style={styles.axisText}>{t}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flexDirection: 'column', gap: 8, width: '100%' },
  plot: { position: 'relative', flexDirection: 'row', width: '100%' },
  // left gutter holding the stage labels
  stages: { position: 'absolute', top: 0, left: 0, bottom: 0, width: STAGE_GUTTER },
  stage: {
    position: 'absolute',
    left: 0,
    marginTop: -5,
    fontFamily: fonts.mono,
    fontSize: 10,
    lineHeight: 10,
    letterSpacing: 0.2,
    color: colors.textFaint,
  },
  // drawing area: holds the Svg; sits to the right of the stage gutter
  canvas: { position: 'relative', height: '100%', marginLeft: 'auto' },
  axis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 1,
  },
  axisText: {
    fontFamily: fonts.mono,
    fontSize: 9.5,
    color: colors.textFaint,
  },
});
