import { useEffect, useId, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
  type DimensionValue,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, { ClipPath, Defs, Line, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { colors, fonts } from '@lockin90/tokens';

/** A round overlay dot pinned over a data point (kept circular by rendering it as
 *  an absolutely-positioned View over the stretched Svg), with an optional
 *  floating label tag. */
export interface LineMarker {
  /** index into `data` to anchor the dot on */
  index: number;
  /** dot color (hex); defaults to the line `color` */
  color?: string;
  /** optional small floating tag above the dot */
  label?: string;
}

/** Catalog variant names — one per line-chart form in
 *  `lockin90-design/charts/line-charts.html` (LC-01 … LC-56). */
export type LineChartVariant =
  | 'solid' // LC-01
  | 'gradient' // LC-09
  | 'veil' // LC-15
  | 'tide-split' // LC-19
  | 'glass-fill' // LC-20
  | 'curve-styles' // LC-21
  | 'dash-dot' // LC-24
  | 'stroke-weight' // LC-26
  | 'neon' // LC-28
  | 'aurora-halo' // LC-30
  | 'ghost-echo' // LC-32
  | 'bead-chain' // LC-33
  | 'comet-head' // LC-34
  | 'peak-flag' // LC-35
  | 'now-split' // LC-36
  | 'goal-line' // LC-37
  | 'event-pins' // LC-38
  | 'multi-compare' // LC-39
  | 'you-vs-cohort' // LC-41
  | 'ghost-prev' // LC-42
  | 'calibrating-taper' // LC-43
  | 'delta-ribbon' // LC-44
  | 'confidence-veil' // LC-45
  | 'forecast-fan' // LC-46
  | 'range-band' // LC-47
  | 'raw-vs-avg' // LC-48
  | 'anomaly-spark' // LC-49
  | 'zone-ribbon' // LC-50
  | 'day-fade' // LC-51
  | 'forecast-horizon' // LC-52
  | 'zone-forecast' // LC-54
  | 'coach-forecast'; // LC-56

/** Curve interpolation (LC-21): monotone smooth / sharp linear / step-after. */
export type LineCurve = 'smooth' | 'linear' | 'step';
/** Main-line dash pattern (LC-24): solid / dashed 7-5 / dotted round-cap. */
export type LinePattern = 'solid' | 'dashed' | 'dotted';

/** One explicit gradient stop (offset 0..1). A plain `string[]` gradient
 *  spreads its stops evenly instead. */
export interface GradientStop {
  offset: number;
  color: string;
}

/** An extra overlay series sharing the main chart's x/y scale (LC-39/41/42/44/56). */
export interface LineSeries {
  /** y-values on the shared scale */
  data: number[];
  /** stroke color (hex token) */
  color?: string;
  /** stroke width (default 2) */
  weight?: number;
  /** dash style; `dash` (viewBox units) overrides it */
  pattern?: LinePattern;
  dash?: string;
  /** stroke opacity */
  opacity?: number;
  /** per-series curve override (defaults to the chart's curve) */
  curve?: LineCurve;
  /** chip-pill label drawn over the series */
  label?: string;
  /** index into this series' `data` to anchor the label (default: last point) */
  labelIndex?: number;
  /** label y-offset in viewBox px (default −12) */
  labelDy?: number;
  /** the series starts at this index of the main `data`'s x positions (LC-56 RECOMMENDED) */
  fromIndex?: number;
}

/** A chip-pill annotation anchored to a data index (LC-52 ACTUAL / FORECAST). */
export interface LineLabel {
  index: number;
  text: string;
  color?: string;
  /** y-offset in viewBox px from the data point (default −12) */
  dy?: number;
}

export interface LineChartProps {
  /** catalog variant — presets the catalog look; explicit props override */
  variant?: LineChartVariant;
  /** y-values, auto-scaled to fit the plot height */
  data?: number[];
  /** x labels under the chart (optional) */
  axis?: string[];
  /** line color (hex) */
  color?: string;
  /** multi-stop horizontal stroke gradient — evenly-spread `string[]` or
   *  explicit `GradientStop[]` (LC-51 day-fade); overrides `color` for the stroke */
  gradient?: string[] | GradientStop[];
  /** area fill under the line (legacy fade; with a variant: the veil fill) */
  area?: boolean;
  /** smoothing; when false, straight segments (kept for back-compat — prefer `curve`) */
  smooth?: boolean;
  /** curve interpolation (LC-21) — with a variant, `smooth` maps onto this */
  curve?: LineCurve;
  /** main-line dash pattern (LC-24) */
  pattern?: LinePattern;
  /** main-line stroke width (LC-26; default 2.5 with a variant, 3 legacy) */
  weight?: number;
  /** hue-matched glow underlay — a wider faint duplicate of the stroke (no SVG filters) */
  shine?: boolean;
  /** pin the y-scale to [min, max] instead of auto-scaling to the data */
  yDomain?: [number, number];
  /** plot height in px (also the viewBox height) */
  height?: number;
  /** round overlay dots at data indices, with optional label tags */
  markers?: LineMarker[];
  /** faint horizontal gridlines */
  grid?: boolean;
  /** show value labels down the right edge, on the data's y-scale */
  yAxis?: boolean;
  /** explicit y-axis tick values; if omitted (and `yAxis`), ~4 evenly-spaced
   *  ticks are derived from the data min..max */
  yTicks?: number[];
  /** filled uncertainty ribbon behind the line, on the SAME y-scale as data;
   *  restyled by `confidence-veil` (CI gradient + edge) / `range-band` (min-max) */
  band?: { upper: number[]; lower: number[]; color?: string };
  /** widening forecast fan drawn from the `now` index (LC-46/52/54) */
  fan?: { upper: number[]; lower: number[]; color?: string };
  /** from this data index onward the main line renders dashed (forecast continuation) */
  dashedFromIndex?: number;
  /** NOW anchor (data index): vertical rule + dot; past solid / future dashed (LC-36) */
  now?: number;
  /** pulse ring on the NOW dot (reduced-motion safe) */
  nowPulse?: boolean;
  /** NOW rule caption (default 'NOW') */
  nowLabel?: string;
  /** calibrating split (data index): solid→dashed + tag, no rule (LC-43) */
  taper?: number;
  /** taper caption (default 'CALIBRATING') */
  taperLabel?: string;
  /** goal value (data units): dashed rule + dots on points above it (LC-37) */
  goal?: number;
  /** goal caption (default 'GOAL') */
  goalLabel?: string;
  /** tide-split baseline value (data units; default: scale midpoint) (LC-19) */
  baseline?: number;
  /** event pin flags at data indices (LC-38) */
  pins?: number[];
  /** extra overlay series (LC-39/41/42/44/56) */
  series?: LineSeries[];
  /** fill the gap between `data` and `series[0]` (LC-44 delta-ribbon) */
  ribbon?: boolean;
  /** chip-pill annotations at data indices */
  labels?: LineLabel[];
  /** small round dots: at every datum ('all', LC-33) or the last one ('end', LC-34) */
  dots?: 'all' | 'end' | 'none';
  /** pulse ring on the end dot (LC-34) */
  pulse?: boolean;
  /** auto PEAK (mint) / DIP (coral) dots + captions (LC-35) */
  peaks?: boolean;
  /** flag outliers vs the 5-pt moving average (LC-49) */
  anomalies?: boolean;
  /** outlier threshold in data units (default: 14% of the y-span) */
  anomalyThreshold?: number;
  /** stroke = y-mapped zone gradient high→mid→low (LC-50/54/56) */
  zoneStroke?: boolean;
  /** '100' / '0' y-end captions (LC-54/56) */
  yEnds?: boolean;
  /** stroke for the post-`now` segment (+fan tint) (LC-52 forecast-horizon) */
  futureColor?: string;
  /** ghost echo copies below the line (LC-32) */
  echo?: number;
  /** optional container style */
  style?: StyleProp<ViewStyle>;
}

const VB_W = 560;
/** vertical inset (viewBox units) so the line never touches the top/bottom edge */
const PAD_Y = 14;
/** horizontal inset (viewBox units) so the first/last points, the round line caps
 *  and the overlay marker dots stay fully inside the plot instead of clipping at
 *  the left/right edges. */
const PAD_X = 14;
/** number of interior horizontal gridlines */
const GRID_LINES = 3;
/** width (px) of the right gutter reserved for y-axis value labels */
const Y_GUTTER = 36;
/** number of derived y-axis ticks when `yTicks` is omitted */
const Y_TICKS = 4;

/** Map a value to its y position (viewBox units) using the same inverted,
 *  auto-scaled mapping as `toPoints` (max → top, min → bottom). */
function valueToY(v: number, min: number, span: number, height: number): number {
  const top = PAD_Y;
  const bottom = height - PAD_Y;
  const t = (v - min) / span;
  return bottom - t * (bottom - top);
}

/** Derive ~`Y_TICKS` evenly-spaced tick values across [min, max]. */
function deriveTicks(min: number, max: number): number[] {
  if (max === min) return [min];
  const ticks: number[] = [];
  for (let i = 0; i < Y_TICKS; i++) {
    ticks.push(min + ((max - min) * i) / (Y_TICKS - 1));
  }
  return ticks;
}

/** Compact label for a tick value: integers as-is, else 1 decimal. */
const tickLabel = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1));

const DEFAULT_DATA = [52, 40, 30, 28, 38, 56, 80, 104, 116, 118, 108, 90, 76, 66, 60, 58];
const DEFAULT_AXIS = ['9am', '12pm', '3pm', '6pm', '9pm'];

/** Map a series to viewBox points on an EXPLICIT y-scale (min/span), spreading x
 *  evenly across the padded inner width [PAD_X, VB_W−PAD_X]. `n` is the index span
 *  used for x positioning — pass the primary data length so a band's points align
 *  column-for-column with the data. `offset` shifts the series right by that many
 *  x slots (LineSeries.fromIndex). Inverted (max → top, min → bottom). */
function mapPoints(
  values: number[],
  n: number,
  height: number,
  min: number,
  span: number,
  offset = 0,
): Array<[number, number]> {
  if (values.length === 0) return [];
  const top = PAD_Y;
  const bottom = height - PAD_Y;
  const innerW = VB_W - PAD_X * 2;
  return values.map((v, i) => {
    const x = n === 1 ? VB_W / 2 : PAD_X + ((i + offset) / (n - 1)) * innerW;
    const t = (v - min) / span; // 0 at min, 1 at max
    const y = bottom - t * (bottom - top); // max → top, min → bottom
    return [x, y];
  });
}

/** Round a number for compact path strings. */
const r = (n: number) => Math.round(n * 100) / 100;

/** Straight polyline through the points. */
function linePath(pts: Array<[number, number]>): string {
  if (pts.length === 0) return '';
  return pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${r(x)},${r(y)}`).join(' ');
}

/** Catmull-Rom spline expressed as cubic béziers — the legacy smoothing kept for
 *  back-compat (used when neither `variant` nor `curve` is set). */
function smoothPath(pts: Array<[number, number]>): string {
  const n = pts.length;
  if (n < 3) return linePath(pts);
  let d = `M${r(pts[0][0])},${r(pts[0][1])}`;
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    // Catmull-Rom → Bézier control points (tension = 1/6)
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${r(c1x)},${r(c1y)} ${r(c2x)},${r(c2y)} ${r(p2[0])},${r(p2[1])}`;
  }
  return d;
}

/** Fritsch–Carlson monotone cubic — the catalog's `smoothPath` (no overshoot),
 *  used for every variant / explicit `curve` render. Faithful port. */
function monotonePath(pts: Array<[number, number]>): string {
  const n = pts.length;
  if (n < 3) return linePath(pts);
  const dx: number[] = [];
  const m: number[] = [];
  const tg: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx[i] = pts[i + 1][0] - pts[i][0];
    m[i] = (pts[i + 1][1] - pts[i][1]) / dx[i];
  }
  tg[0] = m[0];
  tg[n - 1] = m[n - 2];
  for (let i = 1; i < n - 1; i++) tg[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) {
      tg[i] = 0;
      tg[i + 1] = 0;
    } else {
      const a = tg[i] / m[i];
      const b = tg[i + 1] / m[i];
      const s = a * a + b * b;
      if (s > 9) {
        const tau = 3 / Math.sqrt(s);
        tg[i] = tau * a * m[i];
        tg[i + 1] = tau * b * m[i];
      }
    }
  }
  let d = `M${r(pts[0][0])},${r(pts[0][1])}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += ` C${r(pts[i][0] + h)},${r(pts[i][1] + h * tg[i])} ${r(pts[i + 1][0] - h)},${r(
      pts[i + 1][1] - h * tg[i + 1],
    )} ${r(pts[i + 1][0])},${r(pts[i + 1][1])}`;
  }
  return d;
}

/** Step-after path (doses, tiers) — the catalog's `stepPath`. */
function stepPath(pts: Array<[number, number]>): string {
  if (pts.length === 0) return '';
  let d = `M${r(pts[0][0])},${r(pts[0][1])}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L${r(pts[i][0])},${r(pts[i - 1][1])} L${r(pts[i][0])},${r(pts[i][1])}`;
  }
  return d;
}

/** Trailing moving average over a window (the catalog's `movAvg`). */
function movAvg(data: number[], w: number): number[] {
  return data.map((_, i) => {
    const a = Math.max(0, i - w + 1);
    let s = 0;
    for (let j = a; j <= i; j++) s += data[j];
    return s / (i - a + 1);
  });
}

/** dash string for a `LinePattern` (viewBox units, per the catalog). */
function patternDash(p: LinePattern | undefined): string | undefined {
  if (p === 'dashed') return '7 5';
  if (p === 'dotted') return '0.1 6.5';
  return undefined;
}

const isUrlRef = (s: string) => s.startsWith('url(');

/* ---------------- variant presets (the catalog CFG, tokens only) ---------------- */

const FLUX: GradientStop[] = [
  { offset: 0, color: colors.lime },
  { offset: 0.28, color: colors.mint },
  { offset: 0.52, color: colors.cyan },
  { offset: 0.76, color: colors.accent },
  { offset: 1, color: colors.magenta },
];
const DAY_FADE: GradientStop[] = [
  { offset: 0, color: colors.mint },
  { offset: 0.35, color: colors.lime },
  { offset: 0.7, color: colors.zoneMid },
  { offset: 1, color: colors.zoneLow },
];

interface SeriesPreset {
  color?: string;
  weight?: number;
  dash?: string;
  opacity?: number;
}

interface Preset {
  color?: string;
  gradient?: GradientStop[];
  weight?: number;
  opacity?: number;
  fill?: 'off' | 'veil' | 'glass' | 'split';
  pattern?: LinePattern;
  shine?: boolean;
  /** neon/halo glow — rendered as a wider faint duplicate path (no SVG filters) */
  glow?: { r: number; alpha: number; color?: string };
  echo?: number;
  dots?: 'all' | 'end';
  pulse?: boolean;
  peaks?: boolean;
  rawAvg?: boolean;
  anomalies?: boolean;
  zoneStroke?: boolean;
  ribbon?: boolean;
  yEnds?: boolean;
  nowPulse?: boolean;
  futureColor?: string;
  bandStyle?: 'ci' | 'range';
  fanColor?: string;
  seriesDefaults?: SeriesPreset[];
}

const PRESETS: Record<LineChartVariant, Preset> = {
  solid: { weight: 2.5, fill: 'off' },
  gradient: { weight: 3, fill: 'off', gradient: FLUX },
  veil: { weight: 2.5, fill: 'veil' },
  'tide-split': { fill: 'split' },
  'glass-fill': { weight: 2.5, fill: 'glass', color: colors.textDim },
  'curve-styles': { weight: 2.5, fill: 'off' },
  'dash-dot': { weight: 2.5, fill: 'off', pattern: 'dashed', color: colors.violet },
  'stroke-weight': { weight: 2.5, fill: 'off' },
  neon: { weight: 2.5, fill: 'off', glow: { r: 7, alpha: 0.8 } },
  'aurora-halo': {
    weight: 3,
    fill: 'off',
    gradient: FLUX,
    glow: { r: 12, alpha: 0.55, color: colors.accent },
  },
  'ghost-echo': { weight: 2.5, fill: 'off', echo: 2, color: colors.cyan },
  'bead-chain': { weight: 2.5, fill: 'off', dots: 'all' },
  'comet-head': { weight: 2.5, fill: 'off', dots: 'end', pulse: true },
  'peak-flag': { weight: 2.5, fill: 'off', peaks: true, color: colors.cyan },
  'now-split': { weight: 2.5, fill: 'off', color: colors.accent },
  'goal-line': { weight: 2.5, fill: 'off', color: colors.cyan },
  'event-pins': { weight: 2.5, fill: 'off' },
  'multi-compare': {
    weight: 2.5,
    fill: 'off',
    seriesDefaults: [
      { color: colors.violet, weight: 2.2 },
      { color: colors.lime, weight: 2 },
    ],
  },
  'you-vs-cohort': {
    weight: 2.5,
    fill: 'off',
    seriesDefaults: [{ color: colors.text, opacity: 0.35, dash: '5 5', weight: 1.8 }],
  },
  'ghost-prev': {
    weight: 2.5,
    fill: 'off',
    color: colors.cyan,
    seriesDefaults: [{ color: colors.cyan, opacity: 0.28, weight: 2 }],
  },
  'calibrating-taper': { weight: 2.5, fill: 'off', color: colors.zoneMid },
  'delta-ribbon': {
    weight: 2.5,
    fill: 'off',
    ribbon: true,
    seriesDefaults: [{ color: colors.violet, weight: 2.2 }],
  },
  'confidence-veil': { weight: 2.5, fill: 'off', color: colors.cyan, bandStyle: 'ci' },
  'forecast-fan': { weight: 2.5, fill: 'off', color: colors.accent },
  'range-band': { weight: 2.5, fill: 'off', color: colors.violet, bandStyle: 'range' },
  'raw-vs-avg': { fill: 'off', rawAvg: true, color: colors.cyan },
  'anomaly-spark': {
    weight: 1.5,
    fill: 'off',
    color: colors.text,
    opacity: 0.4,
    anomalies: true,
  },
  'zone-ribbon': { weight: 3, fill: 'off', zoneStroke: true },
  'day-fade': { weight: 3, fill: 'off', gradient: DAY_FADE, shine: true },
  'forecast-horizon': {
    weight: 2.5,
    fill: 'off',
    color: colors.mint,
    futureColor: colors.violet,
    fanColor: colors.violet,
    shine: true,
    nowPulse: true,
  },
  'zone-forecast': {
    weight: 3,
    fill: 'off',
    zoneStroke: true,
    shine: true,
    nowPulse: true,
    yEnds: true,
    fanColor: colors.text,
  },
  'coach-forecast': {
    weight: 3,
    fill: 'off',
    zoneStroke: true,
    shine: true,
    nowPulse: true,
    yEnds: true,
    seriesDefaults: [
      { color: colors.textDim, weight: 1.6, dash: '3 4', opacity: 0.75 },
      { color: colors.mint, weight: 1.8, dash: '2 4', opacity: 0.6 },
    ],
  },
};

/** fallback overlay-series palette when neither the series nor the variant styles it */
const SERIES_FALLBACK = [colors.violet, colors.lime, colors.cyan];

/* ---------------- overlay descriptors ---------------- */

interface ODot {
  x: number;
  y: number;
  d: number;
  color: string;
  glow?: boolean;
}
interface ORing {
  x: number;
  y: number;
  d: number;
  color: string;
}
interface ONote {
  x: number;
  y: number;
  text: string;
  color: string;
  anchor: 'top' | 'point' | 'right';
}
interface OChip {
  x: number;
  y: number;
  text: string;
  color: string;
}
interface OPulse {
  x: number;
  y: number;
  color: string;
}

/** Expanding + fading ring riding a dot (NOW / comet head) — Animated loop,
 *  mirroring the web CSS `lk-lc-pulse` keyframes (1.8s, scale 1→3, .8→0). */
function PulseRing({ color }: { color: string }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(v, {
        toValue: 1,
        duration: 1800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [v]);
  return (
    <Animated.View
      style={[
        styles.pulse,
        {
          borderColor: color,
          opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.8, 0] }),
          transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [1, 3] }) }],
        },
      ]}
    />
  );
}

/** LineChart — a generic line/area chart primitive: a smooth (monotone-cubic /
 *  Catmull-Rom) or straight gradient/solid line over a faint area fill and
 *  horizontal grid, with optional round overlay marker dots + label tags and an
 *  x-axis row. `variant` unlocks the 32 catalog looks (LC-01…LC-56): veils,
 *  tide-split, neon/halo/echo, bead/comet/peak/now/goal/pin markers, compare
 *  series, CI/range bands, forecast fans and zone-gradient strokes. The Svg
 *  stretches to the measured container width via a fixed viewBox + non-uniform
 *  scaling; dots and text are absolutely-positioned Views placed by percentage
 *  so they stay perfectly round/legible. Glow/shine render as wider faint
 *  duplicate paths — never SVG filters (patchy on device). */
export function LineChart({
  variant,
  data = DEFAULT_DATA,
  axis = DEFAULT_AXIS,
  color,
  gradient,
  area,
  smooth = true,
  curve,
  pattern,
  weight,
  shine,
  yDomain,
  height = 180,
  markers,
  grid = true,
  yAxis = false,
  yTicks,
  band,
  fan,
  dashedFromIndex,
  now,
  nowPulse,
  nowLabel = 'NOW',
  taper,
  taperLabel = 'CALIBRATING',
  goal,
  goalLabel = 'GOAL',
  baseline,
  pins,
  series,
  ribbon,
  labels,
  dots,
  pulse,
  peaks,
  anomalies,
  anomalyThreshold,
  zoneStroke,
  yEnds,
  futureColor,
  echo,
  style,
}: LineChartProps) {
  const [width, setWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);
  const uid = useId();
  const strokeId = `lk-lc-stroke-${uid}`;
  const fillId = `lk-lc-fill-${uid}`;
  const zoneId = `lk-lc-zone-${uid}`;
  const bandId = `lk-lc-band-${uid}`;
  const fanId = `lk-lc-fan-${uid}`;
  const splitId = `lk-lc-split-${uid}`;

  const preset = variant ? PRESETS[variant] : undefined;

  /* ---- resolved options: explicit prop > variant preset > legacy default ---- */
  const strokeColor = color ?? preset?.color ?? colors.mint;
  const gradInput = gradient ?? preset?.gradient;
  const gradStops: GradientStop[] | null =
    Array.isArray(gradInput) && gradInput.length >= 2
      ? typeof gradInput[0] === 'string'
        ? (gradInput as string[]).map((c, i) => ({ offset: i / (gradInput.length - 1), color: c }))
        : (gradInput as GradientStop[])
      : null;
  const w = weight ?? preset?.weight ?? (variant ? 2.5 : 3);
  const mainOpacity = preset?.opacity;
  const mainDash = patternDash(pattern ?? preset?.pattern);
  const wantShine = shine ?? preset?.shine ?? false;
  const glowCfg = preset?.glow;
  const echoN = echo ?? preset?.echo ?? 0;
  const dotsMode = dots ?? preset?.dots ?? 'none';
  const wantPulse = pulse ?? preset?.pulse ?? false;
  const wantPeaks = peaks ?? preset?.peaks ?? false;
  const wantAnoms = anomalies ?? preset?.anomalies ?? false;
  const wantZone = zoneStroke ?? preset?.zoneStroke ?? false;
  const wantRibbon = (ribbon ?? preset?.ribbon ?? false) && !!series?.length;
  const wantYEnds = yEnds ?? preset?.yEnds ?? false;
  const wantNowPulse = nowPulse ?? preset?.nowPulse ?? false;
  const futColor = futureColor ?? preset?.futureColor;
  const wantRawAvg = preset?.rawAvg ?? false;
  const bandStyle = preset?.bandStyle;

  // area fill mode: explicit `area` > variant preset > legacy default (on)
  const fillMode: 'legacy' | 'veil' | 'glass' | 'split' | null = (() => {
    const presetFill = preset?.fill;
    if (area === false) return null;
    if (area === true) {
      if (presetFill === 'glass' || presetFill === 'split') return presetFill;
      return variant ? 'veil' : 'legacy';
    }
    if (variant) return presetFill === 'off' || presetFill == null ? null : presetFill;
    return 'legacy';
  })();

  /* ---- shared y-scale: data ∪ band ∪ fan ∪ series ∪ goal/baseline, or yDomain ---- */
  const hasBand = !!band && band.upper.length > 0 && band.lower.length > 0;
  const hasFan = !!fan && fan.upper.length > 0 && fan.lower.length > 0;
  const scaleVals: number[] = hasBand ? [...data, ...band!.upper, ...band!.lower] : [...data];
  if (hasFan) scaleVals.push(...fan!.upper, ...fan!.lower);
  series?.forEach((s) => scaleVals.push(...s.data));
  if (goal != null) scaleVals.push(goal);
  if (baseline != null) scaleVals.push(baseline);
  const dMin = yDomain ? yDomain[0] : scaleVals.length ? Math.min(...scaleVals) : 0;
  const dMax = yDomain ? yDomain[1] : scaleVals.length ? Math.max(...scaleVals) : 0;
  const dSpan = dMax - dMin || 1;

  /* ---- curve: variants (and explicit `curve`) use the monotone catalog math ---- */
  const curveKind: LineCurve = curve ?? (smooth ? 'smooth' : 'linear');
  const legacySmoothing = variant == null && curve == null;
  const pathFor = (p: Array<[number, number]>, k: LineCurve = curveKind): string =>
    k === 'step'
      ? stepPath(p)
      : k === 'linear'
        ? linePath(p)
        : legacySmoothing
          ? smoothPath(p)
          : monotonePath(p);

  const pts = mapPoints(data, data.length, height, dMin, dSpan);
  const line = pathFor(pts);
  // close the line down to the floor for the area fill — drop straight down from
  // the last/first points (which are inset by PAD_X) so the fill stays aligned.
  const firstX = pts.length ? r(pts[0][0]) : 0;
  const lastX = pts.length ? r(pts[pts.length - 1][0]) : 0;
  const areaPath = line ? `${line} L${lastX},${height} L${firstX},${height} Z` : '';

  /* ---- main-line split: `now`/`taper` (catalog 5-5) or legacy dashedFromIndex ---- */
  const clampIdx = (i: number) => Math.max(0, Math.min(data.length - 1, Math.round(i)));
  const nowIdx = now != null && data.length > 1 ? clampIdx(now) : null;
  const taperIdx = taper != null && data.length > 1 ? clampIdx(taper) : null;
  const variantSplit =
    nowIdx != null && nowIdx > 0 && nowIdx < pts.length - 1
      ? nowIdx
      : taperIdx != null && taperIdx > 0 && taperIdx < pts.length - 1
        ? taperIdx
        : null;
  // legacy split (kept byte-identical when no variant props are used)
  const splitAt =
    variantSplit == null &&
    dashedFromIndex != null &&
    dashedFromIndex > 0 &&
    dashedFromIndex < pts.length - 1
      ? dashedFromIndex
      : null;
  const headEnd = variantSplit ?? splitAt;
  const solidPts = headEnd != null ? pts.slice(0, headEnd + 1) : pts;
  const dashPts = headEnd != null ? pts.slice(headEnd) : [];
  const solidLine = headEnd != null ? pathFor(solidPts) : line;
  const dashLine = headEnd != null ? pathFor(dashPts) : '';

  /* ---- band ribbon (legacy solid / LC-45 CI / LC-47 range) ---- */
  const bandUpperPts = hasBand ? mapPoints(band!.upper, data.length, height, dMin, dSpan) : [];
  const bandLowerPts = hasBand ? mapPoints(band!.lower, data.length, height, dMin, dSpan) : [];
  const bandLowerBack = bandLowerPts
    .slice()
    .reverse()
    .map(([x, y]) => `L${r(x)},${r(y)}`)
    .join(' ');
  const bandPath =
    hasBand && bandUpperPts.length > 0 && bandLowerPts.length > 0
      ? bandStyle
        ? `${pathFor(bandUpperPts)} ${bandLowerBack} Z`
        : `${linePath(bandUpperPts)} ${bandLowerBack} Z`
      : '';
  const bandFill = band?.color ?? strokeColor;

  /* ---- forecast fan: drawn from the `now` index (LC-46/52/54) ---- */
  const fanFrom = nowIdx ?? 0;
  const fanUpperPts = hasFan
    ? mapPoints(fan!.upper, data.length, height, dMin, dSpan).slice(fanFrom)
    : [];
  const fanLowerPts = hasFan
    ? mapPoints(fan!.lower, data.length, height, dMin, dSpan).slice(fanFrom)
    : [];
  const fanPath =
    fanUpperPts.length > 1
      ? `${pathFor(fanUpperPts)} ${fanLowerPts
          .slice()
          .reverse()
          .map(([x, y]) => `L${r(x)},${r(y)}`)
          .join(' ')} Z`
      : '';
  const fanColor = fan?.color ?? preset?.fanColor ?? colors.accent;

  /* ---- stroke refs ---- */
  const useGradient = gradStops != null && !wantZone;
  const stroke = wantZone ? `url(#${zoneId})` : useGradient ? `url(#${strokeId})` : strokeColor;
  const pastStroke = stroke;
  const futStroke = wantZone ? stroke : (futColor ?? stroke);
  const nowDotColor = isUrlRef(pastStroke) ? colors.text : pastStroke;
  const plainDotColor = isUrlRef(stroke) ? colors.mint : stroke;

  /* ---- raw-vs-avg (LC-48) ---- */
  const avgPts = wantRawAvg ? mapPoints(movAvg(data, 5), data.length, height, dMin, dSpan) : [];

  /* ---- glow (neon/halo): wider faint duplicate path — NO SVG filters ---- */
  const glowColor = glowCfg
    ? (glowCfg.color ?? (isUrlRef(stroke) ? colors.accent : strokeColor))
    : null;

  /* ---- tide-split geometry (LC-19) ---- */
  const baseVal = baseline ?? dMin + dSpan / 2;
  const baseY = valueToY(baseVal, dMin, dSpan, height);
  const splitAreaPath = line ? `${line} L${lastX},${r(baseY)} L${firstX},${r(baseY)} Z` : '';

  /* ---- goal rule (LC-37) ---- */
  const goalY = goal != null ? valueToY(goal, dMin, dSpan, height) : null;

  /* ---- overlays (Views — stay round/legible under the non-uniform stretch) ---- */
  const oDots: ODot[] = [];
  const oRings: ORing[] = [];
  const oNotes: ONote[] = [];
  const oChips: OChip[] = [];
  const oPulses: OPulse[] = [];

  if (dotsMode === 'all') for (const [x, y] of pts) oDots.push({ x, y, d: 5.2, color: plainDotColor });
  if (dotsMode === 'end' || wantPulse) {
    const last = pts[pts.length - 1];
    if (last) {
      oDots.push({ x: last[0], y: last[1], d: 7.2, color: plainDotColor, glow: true });
      if (wantPulse) oPulses.push({ x: last[0], y: last[1], color: plainDotColor });
    }
  }
  if (wantPeaks && data.length > 1) {
    const mx = data.indexOf(Math.max(...data));
    const mn = data.indexOf(Math.min(...data));
    oDots.push({ x: pts[mx][0], y: pts[mx][1], d: 6.4, color: colors.mint, glow: true });
    oNotes.push({ x: pts[mx][0], y: pts[mx][1] - 10, text: 'PEAK', color: colors.mint, anchor: 'point' });
    oDots.push({ x: pts[mn][0], y: pts[mn][1], d: 6.4, color: colors.zoneLow, glow: true });
    oNotes.push({ x: pts[mn][0], y: pts[mn][1] + 12, text: 'DIP', color: colors.zoneLow, anchor: 'point' });
  }
  if (goalY != null) {
    oNotes.push({ x: VB_W, y: goalY - 8, text: goalLabel, color: colors.zoneMid, anchor: 'right' });
    data.forEach((v, i) => {
      if (goal != null && v > goal) oDots.push({ x: pts[i][0], y: pts[i][1], d: 4.4, color: colors.mint });
    });
  }
  pins?.forEach((pi) => {
    const q = pts[clampIdx(pi)];
    if (!q) return;
    oDots.push({ x: q[0], y: q[1] - 19, d: 6, color: colors.accent, glow: true });
    oDots.push({ x: q[0], y: q[1], d: 4.4, color: colors.text });
  });
  if (nowIdx != null && pts[nowIdx]) {
    oDots.push({ x: pts[nowIdx][0], y: pts[nowIdx][1], d: 7.2, color: nowDotColor, glow: true });
    if (wantNowPulse) oPulses.push({ x: pts[nowIdx][0], y: pts[nowIdx][1], color: nowDotColor });
    oNotes.push({ x: pts[nowIdx][0], y: 0, text: nowLabel, color: colors.textDim, anchor: 'top' });
  }
  if (taperIdx != null && nowIdx == null) {
    const li = Math.min(taperIdx + 3, pts.length - 1);
    oNotes.push({ x: pts[li][0], y: 0, text: taperLabel, color: colors.zoneMid, anchor: 'top' });
  }
  if (wantAnoms && data.length > 1) {
    const avg = movAvg(data, 5);
    const thr = anomalyThreshold ?? dSpan * 0.14;
    data.forEach((v, i) => {
      if (Math.abs(v - avg[i]) > thr) {
        oDots.push({ x: pts[i][0], y: pts[i][1], d: 6.4, color: colors.zoneLow, glow: true });
        oRings.push({ x: pts[i][0], y: pts[i][1], d: 12, color: colors.zoneLow });
      }
    });
  }
  if (wantYEnds) {
    oNotes.push({ x: PAD_X + 6, y: PAD_Y, text: '100', color: colors.zoneHigh, anchor: 'point' });
    oNotes.push({ x: PAD_X + 2, y: height - PAD_Y, text: '0', color: colors.zoneLow, anchor: 'point' });
  }
  labels?.forEach((L) => {
    const q = pts[clampIdx(L.index)];
    if (!q) return;
    oChips.push({ x: q[0], y: q[1] + (L.dy ?? -12), text: L.text, color: L.color ?? colors.textDim });
  });

  /* ---- overlay series (LC-39/41/42/44/56) ---- */
  const seriesRender = (series ?? []).map((s, i) => {
    const sd = preset?.seriesDefaults?.[i];
    const sColor = s.color ?? sd?.color ?? SERIES_FALLBACK[i % SERIES_FALLBACK.length];
    const sW = s.weight ?? sd?.weight ?? 2;
    const sDash = s.dash ?? patternDash(s.pattern) ?? sd?.dash;
    const sOpacity = s.opacity ?? sd?.opacity;
    const sPts = mapPoints(s.data, data.length, height, dMin, dSpan, s.fromIndex ?? 0);
    const d = pathFor(sPts, s.curve ?? curveKind);
    if (s.label && sPts.length > 0) {
      const li = Math.max(0, Math.min(sPts.length - 1, s.labelIndex ?? sPts.length - 1));
      oChips.push({ x: sPts[li][0], y: sPts[li][1] + (s.labelDy ?? -12), text: s.label, color: sColor });
    }
    return { d, sColor, sW, sDash, sOpacity, sPts, key: i };
  });

  /* ---- delta ribbon between data and series[0] (LC-44) ---- */
  const ribbonPath =
    wantRibbon && seriesRender[0] && seriesRender[0].sPts.length > 0
      ? `${line} ${seriesRender[0].sPts
          .slice()
          .reverse()
          .map(([x, y]) => `L${r(x)},${r(y)}`)
          .join(' ')} Z`
      : '';

  const ticks = yAxis ? (yTicks && yTicks.length > 0 ? yTicks : deriveTicks(dMin, dMax)) : [];
  const tickRows = ticks.map((v) => ({ v, y: valueToY(v, dMin, dSpan, height) }));

  // the drawing area shrinks by the gutter width when the y-axis is on, so the
  // line/markers stay in lock-step with the value labels (the line still uses
  // the full data range — only the rendered width changes).
  const canvasW = yAxis ? Math.max(0, width - Y_GUTTER) : width;

  // interior gridline y-positions — align with the ticks when the y-axis is on,
  // otherwise the evenly-spaced default interior lines.
  let gridYs: number[] = [];
  if (grid) {
    if (yAxis && tickRows.length > 0) {
      gridYs = tickRows.map((t) => t.y);
    } else {
      for (let i = 1; i <= GRID_LINES; i++) {
        gridYs.push((height / (GRID_LINES + 1)) * i);
      }
    }
  }

  const ox = (x: number) => `${(x / VB_W) * 100}%` as DimensionValue;
  const oy = (y: number) => `${(y / height) * 100}%` as DimensionValue;
  const drawMain = fillMode !== 'split' && !wantRawAvg;

  return (
    <View style={[styles.root, style]}>
      <View style={[styles.plot, { height }]} onLayout={onLayout}>
        <View style={[styles.canvas, { width: canvasW }]}>
        {canvasW > 0 && (
          <Svg
            width={canvasW}
            height={height}
            viewBox={`0 0 ${VB_W} ${height}`}
            preserveAspectRatio="none"
          >
            <Defs>
              {useGradient && (
                <LinearGradient id={strokeId} x1="0" y1="0" x2={VB_W} y2="0" gradientUnits="userSpaceOnUse">
                  {gradStops!.map((stop, i) => (
                    <Stop key={i} offset={stop.offset} stopColor={stop.color} />
                  ))}
                </LinearGradient>
              )}
              {wantZone && (
                <LinearGradient
                  id={zoneId}
                  x1="0"
                  y1={PAD_Y}
                  x2="0"
                  y2={height - PAD_Y}
                  gradientUnits="userSpaceOnUse"
                >
                  <Stop offset="0" stopColor={colors.zoneHigh} />
                  <Stop offset="0.52" stopColor={colors.zoneMid} />
                  <Stop offset="1" stopColor={colors.zoneLow} />
                </LinearGradient>
              )}
              {(fillMode === 'legacy' || fillMode === 'veil' || variant == null) && (
                <LinearGradient id={fillId} x1="0" y1="0" x2="0" y2={height} gradientUnits="userSpaceOnUse">
                  <Stop offset="0" stopColor={strokeColor} stopOpacity={0.26} />
                  <Stop offset="1" stopColor={strokeColor} stopOpacity={fillMode === 'veil' ? 0.02 : 0} />
                </LinearGradient>
              )}
              {fillMode === 'split' && (
                <>
                  <LinearGradient id={`${splitId}-au`} x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor={colors.mint} stopOpacity={0.28} />
                    <Stop offset="1" stopColor={colors.mint} stopOpacity={0.02} />
                  </LinearGradient>
                  <LinearGradient id={`${splitId}-al`} x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor={colors.zoneLow} stopOpacity={0.02} />
                    <Stop offset="1" stopColor={colors.zoneLow} stopOpacity={0.26} />
                  </LinearGradient>
                  <ClipPath id={`${splitId}-cu`}>
                    <Rect x={0} y={0} width={VB_W} height={r(baseY)} />
                  </ClipPath>
                  <ClipPath id={`${splitId}-cl`}>
                    <Rect x={0} y={r(baseY)} width={VB_W} height={Math.max(0, height - baseY)} />
                  </ClipPath>
                </>
              )}
              {bandStyle && (
                <LinearGradient id={bandId} x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor={bandFill} stopOpacity={bandStyle === 'ci' ? 0.16 : 0.14} />
                  <Stop offset="1" stopColor={bandFill} stopOpacity={0.03} />
                </LinearGradient>
              )}
              {fanPath ? (
                <LinearGradient id={fanId} x1="0" y1="0" x2="1" y2="0">
                  <Stop offset="0" stopColor={fanColor} stopOpacity={0.2} />
                  <Stop offset="1" stopColor={fanColor} stopOpacity={0.02} />
                </LinearGradient>
              ) : null}
            </Defs>

            {/* faint horizontal gridlines */}
            {gridYs.map((gy) => (
              <Line key={gy} x1={0} y1={r(gy)} x2={VB_W} y2={r(gy)} stroke={colors.border} strokeWidth={1} opacity={0.6} />
            ))}

            {/* uncertainty ribbon — legacy solid, or the LC-45 CI / LC-47 range styling */}
            {bandPath && !bandStyle ? (
              <Path d={bandPath} fill={bandFill} fillOpacity={0.14} stroke="none" />
            ) : null}
            {bandPath && bandStyle === 'ci' ? (
              <Path
                d={bandPath}
                fill={`url(#${bandId})`}
                stroke={bandFill}
                strokeOpacity={0.25}
                strokeWidth={0.7}
              />
            ) : null}
            {bandPath && bandStyle === 'range' ? (
              <>
                <Path d={bandPath} fill={`url(#${bandId})`} stroke="none" />
                <Path d={pathFor(bandUpperPts)} fill="none" stroke={bandFill} strokeOpacity={0.3} strokeWidth={1} />
                <Path d={pathFor(bandLowerPts)} fill="none" stroke={bandFill} strokeOpacity={0.3} strokeWidth={1} />
              </>
            ) : null}

            {/* forecast fan — widening uncertainty from the NOW anchor (LC-46/52/54) */}
            {fanPath ? <Path d={fanPath} fill={`url(#${fanId})`} stroke="none" /> : null}

            {/* delta ribbon between the two series (LC-44) */}
            {ribbonPath ? <Path d={ribbonPath} fill={colors.accent} fillOpacity={0.12} stroke="none" /> : null}

            {/* area fills: legacy/veil fade · flat glass · tide-split (LC-15/19/20) */}
            {(fillMode === 'legacy' || fillMode === 'veil') && areaPath ? (
              <Path d={areaPath} fill={`url(#${fillId})`} />
            ) : null}
            {fillMode === 'glass' && areaPath ? <Path d={areaPath} fill={colors.glass2} /> : null}
            {fillMode === 'split' && splitAreaPath ? (
              <>
                <Path d={splitAreaPath} fill={`url(#${splitId}-au)`} clipPath={`url(#${splitId}-cu)`} />
                <Path d={splitAreaPath} fill={`url(#${splitId}-al)`} clipPath={`url(#${splitId}-cl)`} />
                <Path
                  d={line}
                  fill="none"
                  stroke={colors.mint}
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  clipPath={`url(#${splitId}-cu)`}
                />
                <Path
                  d={line}
                  fill="none"
                  stroke={colors.zoneLow}
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  clipPath={`url(#${splitId}-cl)`}
                />
                <Line
                  x1={0}
                  x2={VB_W}
                  y1={r(baseY)}
                  y2={r(baseY)}
                  stroke={colors.text}
                  strokeOpacity={0.18}
                  strokeWidth={1}
                  strokeDasharray="3 4"
                />
              </>
            ) : null}

            {/* raw series + 5-pt moving average (LC-48) */}
            {wantRawAvg ? (
              <>
                <Path d={linePath(pts)} fill="none" stroke={colors.text} strokeOpacity={0.16} strokeWidth={1} />
                <Path
                  d={monotonePath(avgPts)}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={2.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            ) : null}

            {/* ghost echoes — offset faint copies (LC-32) */}
            {echoN > 0
              ? Array.from({ length: echoN }, (_, i) => echoN - i).map((e) => (
                  <Path
                    key={`echo-${e}`}
                    d={line}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={w}
                    strokeLinecap="round"
                    transform={`translate(0, ${e * 7})`}
                    opacity={Math.max(0, 0.28 - e * 0.09)}
                  />
                ))
              : null}

            {/* neon/halo glow — a wider faint duplicate path (no SVG filters) */}
            {drawMain && glowCfg && solidLine ? (
              <Path
                d={solidLine}
                fill="none"
                stroke={glowColor!}
                strokeWidth={w + glowCfg.r}
                strokeLinecap="round"
                strokeOpacity={0.35}
              />
            ) : null}

            {/* shine — wider faint hue-matched underlay (gradient/zone-safe) */}
            {drawMain && wantShine && solidLine ? (
              <Path
                d={solidLine}
                fill="none"
                stroke={pastStroke}
                strokeWidth={w + 5}
                strokeLinecap="round"
                strokeDasharray={headEnd == null ? mainDash : undefined}
                strokeOpacity={0.3}
              />
            ) : null}
            {drawMain && wantShine && dashLine ? (
              <Path
                d={dashLine}
                fill="none"
                stroke={futStroke}
                strokeWidth={w + 5}
                strokeLinecap="round"
                strokeDasharray="5 5"
                strokeOpacity={0.3}
              />
            ) : null}

            {/* the main line — split into a solid head + dashed forecast tail when
                `now`/`taper`/`dashedFromIndex` is set; one continuous path otherwise */}
            {drawMain && solidLine ? (
              <Path
                d={solidLine}
                fill="none"
                stroke={pastStroke}
                strokeWidth={w}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={headEnd == null ? mainDash : undefined}
                opacity={mainOpacity}
              />
            ) : null}
            {drawMain && dashLine && variantSplit != null ? (
              <Path
                d={dashLine}
                fill="none"
                stroke={futStroke}
                strokeWidth={w}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="5 5"
                opacity={0.75}
              />
            ) : null}
            {drawMain && dashLine && variantSplit == null ? (
              <Path
                d={dashLine}
                fill="none"
                stroke={stroke}
                strokeWidth={w}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="6 6"
                opacity={0.85}
              />
            ) : null}

            {/* overlay series (LC-39/41/42/44/56) */}
            {seriesRender.map((s) => (
              <Path
                key={`s-${s.key}`}
                d={s.d}
                fill="none"
                stroke={s.sColor}
                strokeWidth={s.sW}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={s.sDash}
                opacity={s.sOpacity}
              />
            ))}

            {/* GOAL rule (LC-37) */}
            {goalY != null ? (
              <Line
                x1={0}
                x2={VB_W}
                y1={r(goalY)}
                y2={r(goalY)}
                stroke={colors.zoneMid}
                strokeWidth={1}
                strokeDasharray="5 4"
                opacity={0.8}
              />
            ) : null}

            {/* NOW rule (LC-36/46/52/54/56) */}
            {nowIdx != null && pts[nowIdx] ? (
              <Line
                x1={r(pts[nowIdx][0])}
                x2={r(pts[nowIdx][0])}
                y1={2}
                y2={height}
                stroke={colors.text}
                strokeOpacity={0.22}
                strokeWidth={1}
              />
            ) : null}

            {/* event-pin stems (LC-38) — dots are View overlays */}
            {pins?.map((pi, i) => {
              const q = pts[clampIdx(pi)];
              if (!q) return null;
              return (
                <Line
                  key={`pin-${i}`}
                  x1={r(q[0])}
                  x2={r(q[0])}
                  y1={r(q[1])}
                  y2={r(q[1] - 16)}
                  stroke={colors.text}
                  strokeOpacity={0.3}
                  strokeWidth={1}
                />
              );
            })}
          </Svg>
        )}

        {/* round marker overlays — positioned by % so they stay circular */}
        {markers?.map((m, i) => {
          const pt = pts[m.index];
          if (!pt) return null;
          const left = `${(pt[0] / VB_W) * 100}%` as DimensionValue;
          const top = `${(pt[1] / height) * 100}%` as DimensionValue;
          const dot = m.color ?? strokeColor;
          return (
            <View key={i} style={[styles.marker, { left, top }]} pointerEvents="none">
              {m.label ? (
                <View style={[styles.tag, { borderColor: dot }]}>
                  <Text style={[styles.tagText, { color: dot }]}>{m.label}</Text>
                </View>
              ) : null}
              <View style={[styles.dot, { backgroundColor: dot }]} />
            </View>
          );
        })}

        {/* variant dot overlays (beads, comet head, peaks, goal hits, pins, now, anomalies) */}
        {oDots.map((d, i) => (
          <View key={`vd-${i}`} style={[styles.anchor, { left: ox(d.x), top: oy(d.y) }]} pointerEvents="none">
            <View
              style={[
                { position: 'absolute', width: d.d, height: d.d, borderRadius: d.d / 2, backgroundColor: d.color },
                d.glow
                  ? { shadowColor: d.color, shadowOpacity: 0.8, shadowRadius: 6, shadowOffset: { width: 0, height: 0 }, elevation: 3 }
                  : null,
              ]}
            />
          </View>
        ))}
        {oRings.map((g, i) => (
          <View key={`vr-${i}`} style={[styles.anchor, { left: ox(g.x), top: oy(g.y) }]} pointerEvents="none">
            <View
              style={{
                position: 'absolute',
                width: g.d,
                height: g.d,
                borderRadius: g.d / 2,
                borderWidth: 1,
                borderColor: g.color,
                opacity: 0.5,
              }}
            />
          </View>
        ))}
        {oPulses.map((p, i) => (
          <View key={`vp-${i}`} style={[styles.anchor, { left: ox(p.x), top: oy(p.y) }]} pointerEvents="none">
            <PulseRing color={p.color} />
          </View>
        ))}
        {oNotes.map((nte, i) =>
          nte.anchor === 'right' ? (
            <Text
              key={`vn-${i}`}
              style={[styles.note, { position: 'absolute', right: 2, top: oy(nte.y), marginTop: -4, color: nte.color }]}
            >
              {nte.text}
            </Text>
          ) : (
            <View
              key={`vn-${i}`}
              style={[
                nte.anchor === 'top' ? styles.anchorTop : styles.anchor,
                { left: ox(nte.x), top: nte.anchor === 'top' ? 0 : oy(nte.y) },
              ]}
              pointerEvents="none"
            >
              <Text style={[styles.note, { position: 'absolute', color: nte.color }]} numberOfLines={1}>
                {nte.text}
              </Text>
            </View>
          ),
        )}
        {oChips.map((c, i) => (
          <View key={`vc-${i}`} style={[styles.anchor, { left: ox(c.x), top: oy(c.y) }]} pointerEvents="none">
            <View style={[styles.chip, { borderColor: c.color }]}>
              <Text style={[styles.chipText, { color: c.color }]} numberOfLines={1}>
                {c.text}
              </Text>
            </View>
          </View>
        ))}
        </View>

        {/* y-axis value labels, pinned in the right gutter at each tick's y */}
        {yAxis && tickRows.length > 0 ? (
          <View style={styles.yaxis} pointerEvents="none">
            {tickRows.map((t, i) => (
              <Text
                key={i}
                style={[styles.ytick, { top: `${(t.y / height) * 100}%` as DimensionValue }]}
                numberOfLines={1}
              >
                {tickLabel(t.v)}
              </Text>
            ))}
          </View>
        ) : null}
      </View>

      {axis && axis.length > 0 && (
        <View style={[styles.axis, yAxis ? { paddingRight: Y_GUTTER } : null]}>
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
  // drawing area: holds the Svg + marker overlays; markers anchor against it
  canvas: { position: 'relative', height: '100%' },
  // right gutter holding the y-axis value labels
  yaxis: { width: Y_GUTTER, height: '100%' },
  ytick: {
    position: 'absolute',
    right: 0,
    marginTop: -5,
    paddingLeft: 6,
    fontFamily: fonts.mono,
    fontSize: 10,
    lineHeight: 10,
    letterSpacing: 0.2,
    color: colors.textFaint,
    textAlign: 'right',
  },
  marker: {
    position: 'absolute',
    // translate(-50%, -50%) on an 11px dot
    marginLeft: -5.5,
    marginTop: -5.5,
    alignItems: 'center',
  },
  dot: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
    borderWidth: 2,
    borderColor: colors.bg0,
    shadowColor: '#fff',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  tag: {
    position: 'absolute',
    bottom: 16,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    backgroundColor: colors.glass2,
  },
  tagText: {
    fontFamily: fonts.mono,
    fontSize: 9,
    lineHeight: 11,
    letterSpacing: 0.36,
  },
  // zero-size anchor centered on its data point: absolutely-positioned children
  // with no offsets are centered on it by alignItems/justifyContent (Yoga static
  // position), so dots/text/chips stay round & legible under the SVG stretch.
  anchor: {
    position: 'absolute',
    width: 0,
    height: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // same anchor pinned to the plot top (NOW / CALIBRATING captions)
  anchorTop: {
    position: 'absolute',
    width: 0,
    height: 0,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  // pulse ring riding the NOW / comet dot (mirrors web lk-lc-pulse)
  pulse: {
    position: 'absolute',
    width: 9,
    height: 9,
    borderRadius: 4.5,
    borderWidth: 1.4,
  },
  // tiny mono annotations (NOW / GOAL / PEAK / DIP / CALIBRATING / 100 / 0)
  note: {
    fontFamily: fonts.mono,
    fontSize: 8.5,
    lineHeight: 9,
    letterSpacing: 0.5,
  },
  // chip-pill series/inline labels (dark chip + tinted hairline border)
  chip: {
    position: 'absolute',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: colors.bg0,
  },
  chipText: {
    fontFamily: fonts.mono,
    fontSize: 8,
    lineHeight: 9,
    letterSpacing: 0.4,
  },
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
