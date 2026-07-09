import { Fragment, useId, useState, type ReactNode } from 'react';
import { View, Text, StyleSheet, type DimensionValue, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Rect, Line, Defs, FeGaussianBlur, Filter, LinearGradient, Stop } from 'react-native-svg';
import { colors, fonts, radii } from '@lockin90/tokens';

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

/** Catalog sleep-chart variants (`lockin90-design/charts/sleep-charts.html`).
 *  SL-01 `hypnogram` (default) · SL-04 `efficiency-bars` · SL-05 `sleep-week` ·
 *  SL-06 `bedtime-drift` · SL-07 `night-coach`. SL-02 stage-summary maps to
 *  `StackedBar`, SL-03 sleep-score maps to `Ring` (see the Hypnogram SDD). */
export type HypnogramVariant =
  | 'hypnogram'
  | 'efficiency-bars'
  | 'sleep-week'
  | 'bedtime-drift'
  | 'night-coach';

/** One time bucket of the night for `variant="efficiency-bars"`: minutes asleep
 *  draw a violet bar UP from the midline, minutes awake an amber bar DOWN. */
export interface EfficiencyInterval {
  asleepMinutes: number;
  awakeMinutes: number;
}

/** One night for `variant="bedtime-drift"` — clock hours; values < 12 are read
 *  as next-morning (e.g. `bed: 22.5` = 10:30pm, `bed: 0.5` = 12:30am,
 *  `wake: 6.9` = 6:54am). */
export interface SleepNight {
  bed: number;
  wake: number;
}

export interface HypnogramProps {
  /** which sleep chart to draw (catalog SL-01/04/05/06/07) */
  variant?: HypnogramVariant;
  /** chronological sleep segments; widths are proportional to `minutes`
   *  (`hypnogram` + `night-coach`) */
  segments?: HypnogramSegment[];
  /** plot height in px (also the viewBox height) */
  height?: number;
  /** x-axis time labels under the chart. Defaults per variant: the night span
   *  for `hypnogram`/`night-coach`, `11PM/3AM/7AM` for `efficiency-bars`, none
   *  for `sleep-week`/`bedtime-drift` (those label days via `days`). */
  axis?: string[];
  /** show the left-gutter stage labels (`hypnogram` + `night-coach` only) */
  showStageLabels?: boolean;
  /** glow underlay behind the colored marks (the catalog's shine modifier) */
  shine?: boolean;
  /** `efficiency-bars`: chronological night buckets */
  intervals?: EfficiencyInterval[];
  /** `efficiency-bars`: top-right violet tag */
  asleepLabel?: string;
  /** `efficiency-bars`: bottom-right amber tag */
  awakeLabel?: string;
  /** `sleep-week`: hours slept per day (one bar each) */
  week?: number[];
  /** `sleep-week`: dashed mint target rule; bars ≥ target − 0.5h are violet,
   *  under are amber */
  targetHours?: number;
  /** `sleep-week` + `bedtime-drift`: day letters under the columns */
  days?: string[];
  /** `bedtime-drift`: per-day bed/wake clock hours */
  nights?: SleepNight[];
  /** `bedtime-drift`: [from, to] bed-time clock hours of the mint band */
  consistencyWindow?: [number, number];
  /** `bedtime-drift`: bed later than this clock hour renders coral (late) */
  lateBedAfter?: number;
  /** `bedtime-drift`: right-edge mint tag over the band */
  windowLabel?: string;
  /** `night-coach`: 0–1 fraction of the night where the wake window opens
   *  (dashed amber rule) */
  wakeWindowAt?: number;
  /** `night-coach`: tag on the wake-window rule */
  wakeWindowLabel?: string;
  /** `night-coach`: mint recommendation pill (bottom-right); omit for the
   *  data-only night */
  recommendation?: string;
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
/** extra size of a shine underlay shape (viewBox units each side) — glow = a
 *  Gaussian-blurred, fainter duplicate behind the mark (Fabric-native SVG
 *  filters in react-native-svg 15), the native twin of the web
 *  `drop-shadow(0 0 7px …)` shine. */
const SHINE_PAD = 4;
/* the duplicate is blurred, so it runs a touch hotter than the old un-blurred
 * fake to keep the perceived glow near the web's full-alpha drop-shadow */
const SHINE_OPACITY = 0.5;

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
/** SL-04's clock axis (fractions 0 / 0.5 / 1 of the night). */
const DEFAULT_CLOCK_AXIS = ['11PM', '3AM', '7AM'];
const DEFAULT_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

/** SL-04 default night — the catalog card's deterministic buckets (32 × ~15min;
 *  3 brief awakenings). */
const DEFAULT_INTERVALS: EfficiencyInterval[] = [
  { asleepMinutes: 0, awakeMinutes: 2 },
  { asleepMinutes: 12, awakeMinutes: 0 },
  { asleepMinutes: 10, awakeMinutes: 0 },
  { asleepMinutes: 9, awakeMinutes: 0 },
  { asleepMinutes: 12, awakeMinutes: 0 },
  { asleepMinutes: 9, awakeMinutes: 0 },
  { asleepMinutes: 11, awakeMinutes: 0 },
  { asleepMinutes: 10, awakeMinutes: 0 },
  { asleepMinutes: 11, awakeMinutes: 0 },
  { asleepMinutes: 14, awakeMinutes: 0 },
  { asleepMinutes: 13, awakeMinutes: 0 },
  { asleepMinutes: 8, awakeMinutes: 0 },
  { asleepMinutes: 9, awakeMinutes: 0 },
  { asleepMinutes: 13, awakeMinutes: 0 },
  { asleepMinutes: 0, awakeMinutes: 5 },
  { asleepMinutes: 12, awakeMinutes: 0 },
  { asleepMinutes: 14, awakeMinutes: 0 },
  { asleepMinutes: 14, awakeMinutes: 0 },
  { asleepMinutes: 8, awakeMinutes: 0 },
  { asleepMinutes: 10, awakeMinutes: 0 },
  { asleepMinutes: 8, awakeMinutes: 0 },
  { asleepMinutes: 0, awakeMinutes: 5 },
  { asleepMinutes: 10, awakeMinutes: 0 },
  { asleepMinutes: 14, awakeMinutes: 0 },
  { asleepMinutes: 12, awakeMinutes: 0 },
  { asleepMinutes: 10, awakeMinutes: 0 },
  { asleepMinutes: 8, awakeMinutes: 0 },
  { asleepMinutes: 10, awakeMinutes: 0 },
  { asleepMinutes: 12, awakeMinutes: 0 },
  { asleepMinutes: 8, awakeMinutes: 0 },
  { asleepMinutes: 14, awakeMinutes: 0 },
  { asleepMinutes: 13, awakeMinutes: 0 },
];
/** SL-05 default week (hours). */
const DEFAULT_WEEK = [7.4, 6.1, 7.9, 8.2, 5.8, 8.6, 7.7];
/** SL-06 default nights — weekday-consistent, Fri/Sat drift late. */
const DEFAULT_NIGHTS: SleepNight[] = [
  { bed: 22.6, wake: 6.9 },
  { bed: 22.9, wake: 6.7 },
  { bed: 22.4, wake: 7.0 },
  { bed: 22.7, wake: 6.8 },
  { bed: 24.5, wake: 7.6 },
  { bed: 25.0, wake: 7.9 },
  { bed: 22.9, wake: 7.0 },
];
const DEFAULT_WINDOW: [number, number] = [22.3, 23.5];

/** SL-06 column geometry — fractions of the drawable width (catalog: dots run
 *  x = P.l+34 … plot right − 4; the mint band starts a hair earlier). */
const DRIFT_X0 = 0.114;
const DRIFT_X1 = 0.9866;
const DRIFT_BAND_X = 0.1;
const DRIFT_BAND_W = 0.87;

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

/** Clock hour → continuous night-axis hour (values < 12 read as next morning). */
const nightHour = (h: number) => (h < 12 ? h + 24 : h);

/** Floating pill tag over the plot (mirrors the catalog's `C.tag` / the web
 *  `.lk-hyp-tag`). Absolutely positioned via `style`. */
function HypTag({ text, color, style }: { text: string; color: string; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.tag, { borderColor: color }, style]} pointerEvents="none">
      <Text style={[styles.tagText, { color }]} numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
}

/**
 * Hypnogram — the sleep-chart family. The default variant is a sleep-stage
 * timeline: four horizontal bands (Awake / REM / Light / Deep, top → bottom)
 * each hold rounded capsule bars whose widths are proportional to each
 * segment's minutes; thin vertical connectors link consecutive stage
 * transitions so the eye follows the descent/ascent like a stepped line.
 * Catalog variants add: `efficiency-bars` (asleep up / awake down from the
 * midline), `sleep-week` (7 duration bars vs a dashed target rule),
 * `bedtime-drift` (bed/wake dots per day + consistency band) and `night-coach`
 * (the hypnogram + wake-window rule + optional recommendation pill). The Svg
 * stretches to the measured container width via a fixed viewBox + non-uniform
 * scaling; tags, dots and day letters are RN overlays so they stay crisp.
 * Shine glow = wider, fainter duplicate shapes behind the marks (no SVG
 * filters on native).
 */
export function Hypnogram({
  variant = 'hypnogram',
  segments = DEFAULT_SEGMENTS,
  height = 160,
  axis,
  showStageLabels = true,
  shine = false,
  intervals = DEFAULT_INTERVALS,
  asleepLabel = 'ASLEEP 94%',
  awakeLabel = 'AWAKE 22 MIN',
  week = DEFAULT_WEEK,
  targetHours = 8,
  days = DEFAULT_DAYS,
  nights = DEFAULT_NIGHTS,
  consistencyWindow = DEFAULT_WINDOW,
  lateBedAfter = 24,
  windowLabel = 'CONSISTENT WINDOW',
  wakeWindowAt = 0.62,
  wakeWindowLabel = 'WAKE WINDOW OPENS',
  recommendation,
  style,
}: HypnogramProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const [width, setWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  const staged = variant === 'hypnogram' || variant === 'night-coach';
  const resolvedAxis =
    axis ?? (staged ? DEFAULT_AXIS : variant === 'efficiency-bars' ? DEFAULT_CLOCK_AXIS : []);

  /* ---- SL-01 / SL-07 · stage bands + capsules (+ coach overlays) ---- */
  let bars: Array<{ x: number; w: number; cy: number; stage: SleepStage; x0: number; x1: number; key: number }> = [];
  let connectors: Array<{ cx: number; y1: number; y2: number; key: number }> = [];
  if (staged) {
    const total = segments.reduce((s, seg) => s + Math.max(0, seg.minutes), 0) || 1;
    const gaps = Math.max(0, segments.length - 1) * GAP;
    const drawable = Math.max(0, VB_W - gaps);
    // lay segments left → right, width ∝ minutes, with a GAP between each
    let x = 0;
    bars = segments.map((seg, i) => {
      const w = (Math.max(0, seg.minutes) / total) * drawable;
      const y = bandY(seg.stage, height);
      const bar = { x, w, cy: y, stage: seg.stage, x0: x, x1: x + w, key: i };
      x += w + GAP;
      return bar;
    });
    // vertical connectors: link the end-y of one segment to the start-y of the next
    connectors = bars.slice(1).map((b, i) => {
      const prev = bars[i];
      const cx = (prev.x1 + b.x0) / 2;
      return { cx, y1: prev.cy, y2: b.cy, key: i };
    });
  }
  const wwX = Math.max(0, Math.min(1, wakeWindowAt)) * VB_W;

  /* ---- SL-04 · efficiency bars (asleep up / awake down from the midline) ---- */
  const effMid = height / 2;
  const effAmp = height / 2 - 10;
  const effUnit = Math.max(
    1,
    ...intervals.map((iv) => Math.max(0, iv.asleepMinutes) + Math.max(0, iv.awakeMinutes)),
  );
  const effStep = VB_W / Math.max(1, intervals.length);

  /* ---- SL-05 · week bars vs target ---- */
  const weekMax = Math.max(targetHours + 1.5, Math.max(0, ...week) + 0.9);
  const weekY = (v: number) => 4 + (1 - v / weekMax) * (height - 5);
  const weekStep = VB_W / Math.max(1, week.length);
  const targetY = weekY(targetHours);

  /* ---- SL-06 · bedtime drift (earlier at the top, later at the bottom) ---- */
  const winLo = nightHour(Math.min(consistencyWindow[0], consistencyWindow[1]));
  const winHi = nightHour(Math.max(consistencyWindow[0], consistencyWindow[1]));
  const driftHours = nights.flatMap((n) => [nightHour(n.bed), nightHour(n.wake)]).concat(winLo, winHi);
  const driftLo = Math.min(...driftHours) - 0.6;
  const driftSpan = Math.max(...driftHours) + 0.6 - driftLo || 1;
  // 24px reserved at the top so the window tag sits above the band (catalog P.t)
  const driftY = (h: number) => 24 + ((nightHour(h) - driftLo) / driftSpan) * (height - 32);
  const driftX = (i: number) =>
    VB_W * (nights.length > 1 ? DRIFT_X0 + (i * (DRIFT_X1 - DRIFT_X0)) / (nights.length - 1) : 0.5);
  const bedMeanY = nights.length ? nights.reduce((s, n) => s + driftY(n.bed), 0) / nights.length : 0;
  const wakeMeanY = nights.length ? nights.reduce((s, n) => s + driftY(n.wake), 0) / nights.length : 0;

  // the drawing area shrinks by the gutter width when the stage labels are on
  // (staged variants only), so the bars stay clear of the labels.
  const canvasW = staged && showStageLabels ? Math.max(0, width - STAGE_GUTTER) : width;
  /** viewBox x-units → rendered px inside the canvas */
  const px = (xUnits: number) => (xUnits / VB_W) * canvasW;

  /* SVG shapes per variant (drawn only once the container width is known) */
  let shapes: ReactNode = null;
  if (canvasW > 0 && staged) {
    shapes = (
      <>
        <Defs>
          {STAGES.map((stage) => (
            // per-BAR gradient (objectBoundingBox), so every band reads
            // bright like web — NOT a full-height userSpaceOnUse ramp that
            // made the lower bands sample the dark/transparent end.
            <LinearGradient key={stage} id={`lk-hyp-${stage}-${uid}`} x1="0" y1="0" x2="0" y2="1">
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

        {/* shine — Gaussian-blurred capsule duplicates behind the bars (the web
            bars' drop-shadow(0 0 7px) glow) */}
        {shine &&
          bars.map((b) => (
            <Rect
              key={`s${b.key}`}
              x={r(b.x - SHINE_PAD)}
              y={r(b.cy - BAR_H / 2 - SHINE_PAD)}
              width={r(Math.max(0, b.w) + SHINE_PAD * 2)}
              height={BAR_H + SHINE_PAD * 2}
              rx={(BAR_H + SHINE_PAD * 2) / 2}
              ry={(BAR_H + SHINE_PAD * 2) / 2}
              fill={STAGE_COLORS[b.stage]}
              opacity={SHINE_OPACITY}
              filter={`url(#lk-hyp-blur-${uid})`}
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
            fill={`url(#lk-hyp-${b.stage}-${uid})`}
          />
        ))}

        {/* SL-07: dashed wake-window rule across the night */}
        {variant === 'night-coach' && (
          <Line
            x1={r(wwX)}
            y1={2}
            x2={r(wwX)}
            y2={height - 2}
            stroke={colors.zoneMid}
            strokeWidth={1}
            strokeDasharray="3 4"
            opacity={0.7}
          />
        )}
      </>
    );
  } else if (canvasW > 0 && variant === 'efficiency-bars') {
    shapes = (
      <>
        <Rect x={0.5} y={0.5} width={VB_W - 1} height={height - 1} rx={8} fill={colors.violet} opacity={0.05} />
        {intervals.map((iv, i) => {
          const x = i * effStep + effStep * 0.18;
          const w = effStep * 0.64;
          const up = (Math.max(0, iv.asleepMinutes) / effUnit) * effAmp;
          const down = (Math.max(0, iv.awakeMinutes) / effUnit) * effAmp;
          return (
            <Fragment key={i}>
              {/* shine — Gaussian-blurred duplicates (the web drop-shadow(0 0 7px)) */}
              {shine && up > 0 && (
                <Rect
                  x={r(x - SHINE_PAD / 2)}
                  y={r(effMid - up - SHINE_PAD / 2)}
                  width={r(w + SHINE_PAD)}
                  height={r(up + SHINE_PAD)}
                  rx={3}
                  fill={colors.violet}
                  opacity={SHINE_OPACITY}
                  filter={`url(#lk-hyp-blur-${uid})`}
                />
              )}
              {shine && down > 0 && (
                <Rect
                  x={r(x - SHINE_PAD / 2)}
                  y={r(effMid - SHINE_PAD / 2)}
                  width={r(w + SHINE_PAD)}
                  height={r(down + SHINE_PAD)}
                  rx={3}
                  fill={colors.zoneMid}
                  opacity={SHINE_OPACITY}
                  filter={`url(#lk-hyp-blur-${uid})`}
                />
              )}
              {up > 0 && (
                <Rect x={r(x)} y={r(effMid - up)} width={r(w)} height={r(up)} rx={2} fill={colors.violet} opacity={0.8} />
              )}
              {down > 0 && (
                <Rect x={r(x)} y={r(effMid)} width={r(w)} height={r(down)} rx={2} fill={colors.zoneMid} opacity={0.95} />
              )}
            </Fragment>
          );
        })}
      </>
    );
  } else if (canvasW > 0 && variant === 'sleep-week') {
    shapes = (
      <>
        {[0.25, 0.5, 0.75].map((f) => (
          <Line
            key={f}
            x1={0}
            x2={VB_W}
            y1={r(4 + (height - 5) * f)}
            y2={r(4 + (height - 5) * f)}
            stroke={colors.border}
            strokeWidth={1}
            opacity={0.55}
          />
        ))}
        <Line x1={0} x2={VB_W} y1={height - 1} y2={height - 1} stroke={colors.border} strokeWidth={1} />
        {week.map((d, i) => {
          const under = d < targetHours - 0.5;
          const color = under ? colors.zoneMid : colors.violet;
          const y = weekY(Math.max(0, d));
          const x = i * weekStep + weekStep * 0.22;
          const w = weekStep * 0.56;
          return (
            <Fragment key={i}>
              {/* shine — a Gaussian-blurred duplicate bar (the web
                  drop-shadow(0 0 7px) glow) */}
              {shine && (
                <Rect
                  x={r(x - SHINE_PAD / 2)}
                  y={r(y - SHINE_PAD / 2)}
                  width={r(w + SHINE_PAD)}
                  height={r(Math.max(0, height - 1 - y) + SHINE_PAD / 2)}
                  rx={5}
                  fill={color}
                  opacity={SHINE_OPACITY}
                  filter={`url(#lk-hyp-blur-${uid})`}
                />
              )}
              <Rect
                x={r(x)}
                y={r(y)}
                width={r(w)}
                height={r(Math.max(0, height - 1 - y))}
                rx={4}
                fill={color}
                opacity={0.9}
              />
            </Fragment>
          );
        })}
        <Line
          x1={0}
          x2={VB_W}
          y1={r(targetY)}
          y2={r(targetY)}
          stroke={colors.mint}
          strokeWidth={1}
          strokeDasharray="5 4"
          opacity={0.85}
        />
      </>
    );
  } else if (canvasW > 0 && variant === 'bedtime-drift') {
    shapes = (
      <>
        <Rect x={0.5} y={0.5} width={VB_W - 1} height={height - 1} rx={8} fill={colors.violet} opacity={0.05} />
        <Rect
          x={r(VB_W * DRIFT_BAND_X)}
          y={r(driftY(winLo))}
          width={r(VB_W * DRIFT_BAND_W)}
          height={r(Math.max(0, driftY(winHi) - driftY(winLo)))}
          rx={3}
          fill={colors.mint}
          opacity={0.07}
        />
        {nights.map((n, i) => (
          <Line
            key={i}
            x1={r(driftX(i))}
            x2={r(driftX(i))}
            y1={r(driftY(n.bed))}
            y2={r(driftY(n.wake))}
            stroke={colors.border2}
            strokeWidth={2}
          />
        ))}
      </>
    );
  }

  /** a round overlay dot (RN View); shine = a real `boxShadow` glow — the
   *  native twin of the web `.lk-hyp-dot` box-shadow(0 0 8px) */
  const dot = (key: string, xPx: number, yPx: number, color: string) => (
    <Fragment key={key}>
      <View
        style={[
          styles.dot,
          { left: xPx - 4, top: yPx - 4, backgroundColor: color },
          shine ? { boxShadow: `0 0 8px ${color}` } : null,
        ]}
        pointerEvents="none"
      />
    </Fragment>
  );

  return (
    <View style={[styles.root, style]}>
      <View style={[styles.plot, { height }]} onLayout={onLayout}>
        {staged && showStageLabels ? (
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
            <Svg width={canvasW} height={height} viewBox={`0 0 ${VB_W} ${height}`} preserveAspectRatio="none">
              {shine ? (
                /* real Gaussian blur for the shine (Fabric-native in
                   react-native-svg 15) — the native twin of the web
                   drop-shadow(0 0 7px). Region in user space over the full
                   canvas so flat bars never clip the blur. */
                <Defs>
                  <Filter
                    id={`lk-hyp-blur-${uid}`}
                    filterUnits="userSpaceOnUse"
                    x={-12}
                    y={-12}
                    width={VB_W + 24}
                    height={height + 24}
                  >
                    <FeGaussianBlur stdDeviation={3.5} />
                  </Filter>
                </Defs>
              ) : null}
              {shapes}
            </Svg>
          )}

          {/* SL-04 tags */}
          {canvasW > 0 && variant === 'efficiency-bars' && (
            <>
              <HypTag text={asleepLabel} color={colors.violet} style={{ top: 4, right: 2 }} />
              <HypTag text={awakeLabel} color={colors.zoneMid} style={{ bottom: 4, right: 2 }} />
            </>
          )}

          {/* SL-05 target tag, above the rule at the right edge */}
          {canvasW > 0 && variant === 'sleep-week' && (
            <HypTag text={`TARGET ${targetHours}H`} color={colors.mint} style={{ top: targetY - 21, right: 2 }} />
          )}

          {/* SL-06 overlays: window tag, round dots, BED/WAKE side labels */}
          {canvasW > 0 && variant === 'bedtime-drift' && (
            <>
              <HypTag text={windowLabel} color={colors.mint} style={{ top: driftY(winLo) - 21, right: 2 }} />
              {nights.map((n, i) => {
                const late = nightHour(n.bed) > nightHour(lateBedAfter);
                return (
                  <Fragment key={i}>
                    {dot(`b${i}`, px(driftX(i)), driftY(n.bed), late ? colors.zoneLow : colors.violet)}
                    {dot(`w${i}`, px(driftX(i)), driftY(n.wake), colors.zoneMid)}
                  </Fragment>
                );
              })}
              <Text style={[styles.side, { top: bedMeanY - 5, color: colors.violet }]} pointerEvents="none">
                BED
              </Text>
              <Text style={[styles.side, { top: wakeMeanY - 5, color: colors.zoneMid }]} pointerEvents="none">
                WAKE
              </Text>
            </>
          )}

          {/* SL-07 tags: wake-window + optional mint recommendation pill */}
          {canvasW > 0 && variant === 'night-coach' && (
            <>
              <View
                style={[styles.centerRow, { top: 2, transform: [{ translateX: px(wwX) - canvasW / 2 }] }]}
                pointerEvents="none"
              >
                <HypTag text={wakeWindowLabel} color={colors.zoneMid} />
              </View>
              {recommendation ? (
                <HypTag text={recommendation} color={colors.mint} style={{ bottom: 2, right: 2 }} />
              ) : null}
            </>
          )}
        </View>
      </View>

      {/* SL-05/06: day letters centered under each column */}
      {(variant === 'sleep-week' || variant === 'bedtime-drift') && days.length > 0 && width > 0 && (
        <View style={styles.days} pointerEvents="none">
          {days.slice(0, variant === 'bedtime-drift' ? nights.length : week.length).map((d, i) => {
            const xPx =
              variant === 'bedtime-drift' ? px(driftX(i)) : px(i * weekStep + weekStep * 0.5);
            return (
              <Text key={i} style={[styles.day, { left: xPx - 24 }]} numberOfLines={1}>
                {d}
              </Text>
            );
          })}
        </View>
      )}

      {resolvedAxis.length > 0 && (
        <View style={[styles.axis, staged && showStageLabels ? { paddingLeft: STAGE_GUTTER } : null]}>
          {resolvedAxis.map((t, i) => (
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
  // drawing area: holds the Svg + overlays; sits to the right of the stage gutter
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
  // floating pill tag (mirrors web .lk-hyp-tag) — dark-backed like the
  // catalog's C.tag so it stays readable over bright bars
  tag: {
    position: 'absolute',
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: radii.pill,
    borderWidth: 1,
    backgroundColor: colors.bg1,
  },
  tagText: {
    fontFamily: fonts.mono,
    fontSize: 9,
    lineHeight: 9,
    letterSpacing: 0.36,
  },
  // full-width row that centers a tag; shifted via translateX to the anchor
  centerRow: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  // round bed/wake dots + the fainter, wider shine halo behind them
  dot: { position: 'absolute', width: 8, height: 8, borderRadius: 4 },
  // BED / WAKE side labels pinned at the series' mean y
  side: {
    position: 'absolute',
    left: 2,
    fontFamily: fonts.mono,
    fontSize: 10,
    lineHeight: 10,
    letterSpacing: 0.2,
  },
  // day letters row under the plot (SL-05/06)
  days: { position: 'relative', height: 12 },
  day: {
    position: 'absolute',
    top: 0,
    width: 48,
    textAlign: 'center',
    fontFamily: fonts.mono,
    fontSize: 9.5,
    lineHeight: 10,
    color: colors.textFaint,
  },
});
