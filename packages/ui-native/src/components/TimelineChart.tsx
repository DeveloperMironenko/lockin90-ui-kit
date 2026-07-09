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
import Svg, { Defs, FeGaussianBlur, Filter, Line, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { colors, fonts } from '@lockin90/tokens';

/** Catalog variant names — one per timeline form in
 *  `lockin90-design/charts/timeline-charts.html` (TL-01 … TL-20). */
export type TimelineChartVariant =
  | 'event-line' // TL-01
  | 'now-strip' // TL-04
  | 'planned-hollow' // TL-05
  | 'zone-strip' // TL-06
  | 'spark-under' // TL-07
  | 'heat-ticks' // TL-08
  | 'range-blocks' // TL-09
  | 'multi-lane' // TL-10
  | 'gantt-mini' // TL-11
  | 'duration-brackets' // TL-12
  | 'cluster-bubbles' // TL-13
  | 'ticks-24h' // TL-14
  | 'feed' // TL-15
  | 'milestone-flags' // TL-17
  | 'journey-line' // TL-18
  | 'now-zone-strip'; // TL-20

/** TL-01 SELECT MARKERS: plain dots / icon pins with glow heads / chip pills. */
export type TimelineMarkerStyle = 'dots' | 'pins' | 'pills';
/** TL-15 SELECT LAYOUT: rail on the left / centered with alternating sides. */
export type TimelineFeedLayout = 'single-side' | 'alternating';

/** A point-in-time event on the rail (or a row of the `feed` variant). */
export interface TimelineEvent {
  /** position along the rail as a 0–1 fraction of the visible window
   *  (unused by `feed`, which lays rows out in array order) */
  at?: number;
  /** pill/chip text (pills · feed · milestone-flags) */
  label?: string;
  /** marker color (hex, e.g. `colors.mint`); defaults to `colors.mint` */
  color?: string;
  /** `feed` only: the small time caption beside the rail (e.g. `'7:10'`) */
  time?: string;
}

/** A time range on the rail (`range-blocks` / `gantt-mini` / `duration-brackets`
 *  and the rows inside a `TimelineLane`). */
export interface TimelineSpan {
  /** span start, 0–1 fraction of the window */
  from: number;
  /** span end, 0–1 fraction of the window */
  to: number;
  /** inline label (dark ink inside blocks · chip over brackets) */
  label?: string;
  /** span color (hex); defaults to `colors.mint` */
  color?: string;
}

/** One named lane of the `multi-lane` variant. */
export interface TimelineLane {
  name: string;
  spans: TimelineSpan[];
}

/** A density bubble of the `cluster-bubbles` variant — sized by `count`. */
export interface TimelineCluster {
  at: number;
  count: number;
  color?: string;
}

/** A milestone ring on the `journey-line` rail. */
export interface TimelineMilestone {
  at: number;
  label: string;
}

/** An x-axis caption at a 0–1 fraction of the rail. */
export interface TimelineAxisLabel {
  at: number;
  label: string;
}

/** One stop of the `zone-strip` band gradient (energy by hour). */
export interface TimelineZoneStop {
  offset: number;
  color: string;
  opacity?: number;
}

export interface TimelineChartProps {
  /** catalog variant (TL-01 … TL-20); default `event-line` */
  variant?: TimelineChartVariant;
  /** rail events (event variants · `ticks-24h` · `feed` rows · `milestone-flags`) */
  events?: TimelineEvent[];
  /** time ranges (`range-blocks` / `gantt-mini` / `duration-brackets`) */
  spans?: TimelineSpan[];
  /** named lanes (`multi-lane`) */
  lanes?: TimelineLane[];
  /** density bubbles (`cluster-bubbles`) */
  clusters?: TimelineCluster[];
  /** TL-01 SELECT — event marker style; default `dots` */
  markers?: TimelineMarkerStyle;
  /** TL-15 SELECT — feed layout; default `single-side` */
  layout?: TimelineFeedLayout;
  /** NOW anchor (0–1): vertical rule + pulse; past/future split on
   *  `now-strip`/`now-zone-strip` (future dots 35%) and `planned-hollow`
   *  (future = dashed hollow rings). Defaults: 0.6 / 0.55 / 0.5 per variant. */
  now?: number;
  /** NOW rule caption (default `'NOW'`) */
  nowLabel?: string;
  /** zone band gradient stops (`zone-strip` / `now-zone-strip`); catalog default */
  zoneStops?: TimelineZoneStop[];
  /** faint context sparkline values 0–1 (`spark-under`; drawn on any rail variant) */
  spark?: number[];
  /** hourly values 0–1 → tick color by zone verdict (`heat-ticks`) */
  heat?: number[];
  /** journey position, 0–1 (`journey-line`; default 0.62) */
  progress?: number;
  /** chip riding the journey position (default `'DAY 56 · 62%'`; `''` hides) */
  progressLabel?: string;
  /** journey milestone rings (default START / DAY 30 / DAY 60 / DAY 90) */
  milestones?: TimelineMilestone[];
  /** top-left mono caption. Per-variant catalog default (`'TODAY'`,
   *  `'TODAY · LOG'`, `'PROGRAM PHASES'`, `'MILESTONES · 90D'`,
   *  `'90-DAY PROGRAM'`); pass `''` to hide. */
  title?: string;
  /** x-axis captions; catalog defaults per variant (6AM/NOON/11PM …) */
  axisLabels?: TimelineAxisLabel[];
  /** glow underlay — a Gaussian-blurred rail duplicate on `journey-line`,
   *  glow shadow behind colored dots on the event variants */
  shine?: boolean;
  /** plot height in px (also the viewBox height); default 150
   *  (`feed` auto-grows to fit its rows) */
  height?: number;
  /** accessible description of the chart */
  ariaLabel?: string;
  /** optional wrapper style */
  style?: StyleProp<ViewStyle>;
}

/* ---------------- catalog geometry (timeline-charts.html) ---------------- */

const W = 320;
const P = { l: 10, r: 12, t: 16, b: 14 } as const;
/** rail start x / rail width — the catalog's AX / AW */
const AX = P.l + 6;
const AW = W - P.l - P.r - 12;
const PLOT_W = W - P.l - P.r;

const MINT = colors.mint;
/** dark ink for labels ON colored pills (the catalog's `#07080D`) */
const INK = colors.void;

/** rail fraction → x (viewBox units) */
const ax = (f: number) => AX + AW * f;
/** round for compact attribute strings */
const r = (n: number) => Math.round(n * 100) / 100;

/* ---------------- deterministic demo data (catalog ports) ---------------- */

/** the catalog's seeded PRNG — defaults reproduce the catalog cards exactly */
function mulberry32(a: number): () => number {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const clamp01 = (v: number) => Math.max(0.03, Math.min(0.97, v));

/** `genData('wave', seed, n)` port — the TL-07 context sparkline. */
function genWave(seed: number, n: number): number[] {
  const rand = mulberry32(seed);
  const ph = rand() * 6;
  const f = 1.15 + rand() * 0.5;
  const amp = 0.2 + rand() * 0.08;
  const base = 0.48 + rand() * 0.12;
  const v: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    v.push(clamp01(base + Math.sin(t * Math.PI * 2 * f + ph) * amp + (rand() - 0.5) * 0.08));
  }
  return v;
}

/** `genData('noisy', seed, n)` port — the TL-08 hourly quality values. */
function genNoisy(seed: number, n: number): number[] {
  const rand = mulberry32(seed);
  const base = 0.5 + (rand() - 0.5) * 0.1;
  const v: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    v.push(clamp01(base + Math.sin(t * Math.PI * 2.2 + rand()) * 0.12 + (rand() - 0.5) * 0.3));
  }
  return v;
}

/** zone verdict for a 0–1 value (the catalog's `zoneOf`). */
const zoneOf = (v: number) => (v >= 0.62 ? colors.zoneHigh : v >= 0.38 ? colors.zoneMid : colors.zoneLow);

const DEFAULT_EVENTS: TimelineEvent[] = [
  { at: 0.08, label: 'WAKE', color: colors.mint },
  { at: 0.22, label: 'COFFEE', color: colors.zoneMid },
  { at: 0.38, label: 'TRAINING', color: colors.cyan },
  { at: 0.55, label: 'LUNCH', color: colors.lime },
  { at: 0.74, label: 'MEETING', color: colors.violet },
  { at: 0.9, label: 'WIND-DOWN', color: colors.indigo },
];
const DEFAULT_FEED: TimelineEvent[] = [
  { time: '7:10', label: 'WOKE · HRV 62', color: colors.mint },
  { time: '9:40', label: 'COFFEE LOGGED', color: colors.zoneMid },
  { time: '13:05', label: 'TRAINING DONE', color: colors.cyan },
  { time: '22:30', label: 'WIND-DOWN', color: colors.violet },
];
const DEFAULT_FLAGS: TimelineEvent[] = [
  { at: 0.12, label: 'FIRST SYNC', color: colors.cyan },
  { at: 0.45, label: 'DAY 30', color: colors.mint },
  { at: 0.8, label: 'PR · SQUAT', color: colors.lime },
];
const DEFAULT_BLOCKS: TimelineSpan[] = [
  { from: 0.02, to: 0.3, label: 'SLEEP', color: colors.violet },
  { from: 0.36, to: 0.46, label: 'TRAIN', color: colors.cyan },
  { from: 0.52, to: 0.72, label: 'DEEP WORK', color: colors.mint },
  { from: 0.78, to: 0.9, label: 'SOCIAL', color: colors.zoneMid },
];
const DEFAULT_GANTT: TimelineSpan[] = [
  { from: 0.05, to: 0.35, label: 'BASELINE', color: colors.mint },
  { from: 0.3, to: 0.6, label: 'CALIBRATE', color: colors.cyan },
  { from: 0.55, to: 0.92, label: 'OPTIMIZE', color: colors.violet },
];
const DEFAULT_BRACKETS: TimelineSpan[] = [
  { from: 0.1, to: 0.34, label: 'FASTED', color: colors.cyan },
  { from: 0.42, to: 0.6, label: 'FED · TRAINING WINDOW', color: colors.mint },
  { from: 0.7, to: 0.94, label: 'CAFFEINE-FREE', color: colors.violet },
];
const DEFAULT_LANES: TimelineLane[] = [
  {
    name: 'BODY',
    spans: [
      { from: 0.02, to: 0.3, color: colors.violet },
      { from: 0.36, to: 0.46, color: colors.cyan },
    ],
  },
  { name: 'MIND', spans: [{ from: 0.5, to: 0.72, color: colors.mint }] },
  {
    name: 'LIFE',
    spans: [
      { from: 0.32, to: 0.36, color: colors.lime },
      { from: 0.76, to: 0.92, color: colors.zoneMid },
    ],
  },
];
const DEFAULT_CLUSTERS: TimelineCluster[] = [
  { at: 0.15, count: 3, color: colors.mint },
  { at: 0.4, count: 7, color: colors.cyan },
  { at: 0.62, count: 2, color: colors.violet },
  { at: 0.85, count: 5, color: colors.zoneMid },
];
const DEFAULT_MILESTONES: TimelineMilestone[] = [
  { at: 0, label: 'START' },
  { at: 0.33, label: 'DAY 30' },
  { at: 0.66, label: 'DAY 60' },
  { at: 1, label: 'DAY 90' },
];
const DEFAULT_ZONE_STOPS: TimelineZoneStop[] = [
  { offset: 0, color: colors.zoneLow, opacity: 0.25 },
  { offset: 0.3, color: colors.zoneHigh, opacity: 0.25 },
  { offset: 0.65, color: colors.zoneMid, opacity: 0.25 },
  { offset: 1, color: colors.zoneLow, opacity: 0.25 },
];
const DEFAULT_SPARK = genWave(77, 24);
const DEFAULT_HEAT = genNoisy(31, 25);
const HOURS_AXIS: TimelineAxisLabel[] = [
  { at: 0, label: '6AM' },
  { at: 0.5, label: 'NOON' },
  { at: 1, label: '11PM' },
];
const TICKS24_AXIS: TimelineAxisLabel[] = [
  { at: 0.25, label: '6AM' },
  { at: 0.5, label: 'NOON' },
  { at: 0.75, label: '6PM' },
];
const DEFAULT_TITLES: Partial<Record<TimelineChartVariant, string>> = {
  feed: 'TODAY · LOG',
  'gantt-mini': 'PROGRAM PHASES',
  'milestone-flags': 'MILESTONES · 90D',
  'journey-line': '90-DAY PROGRAM',
};

/** Fritsch–Carlson monotone cubic — the catalog's `smoothPath` (spark only). */
function monotonePath(pts: Array<[number, number]>): string {
  const n = pts.length;
  if (n < 3) return pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${r(x)} ${r(y)}`).join('');
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
  let d = `M${r(pts[0][0])} ${r(pts[0][1])}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += `C${r(pts[i][0] + h)} ${r(pts[i][1] + h * tg[i])} ${r(pts[i + 1][0] - h)} ${r(
      pts[i + 1][1] - h * tg[i + 1],
    )} ${r(pts[i + 1][0])} ${r(pts[i + 1][1])}`;
  }
  return d;
}

/* ---------------- render model (SVG marks + round/text overlays) ---------------- */

type Anchor = 'start' | 'middle' | 'end';

type SvgMark =
  | {
      k: 'line';
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      stroke: string;
      w: number;
      opacity?: number;
      dash?: string;
      cap?: boolean;
      /** SVG filter reference (`url(#…)`) — the journey-line shine blur */
      filter?: string;
    }
  | { k: 'rect'; x: number; y: number; w: number; h: number; rx: number; fill: string; opacity?: number }
  | { k: 'path'; d: string; stroke: string; w: number; opacity?: number; dash?: string; cap?: boolean };

interface ODot {
  x: number;
  y: number;
  d: number;
  color: string;
  opacity?: number;
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
  y: number; // text baseline (catalog coords)
  text: string;
  color: string;
  anchor: Anchor;
}
interface OChip {
  x: number;
  y: number; // pill center
  text: string;
  color: string;
  anchor: Anchor;
}
interface OPulse {
  x: number;
  y: number;
  color: string;
}
interface OBubble {
  x: number;
  y: number;
  radius: number;
  color: string;
  count: number;
}
interface OFlag {
  x: number;
  y: number;
  color: string;
}
interface OMilestone {
  x: number;
  y: number;
  passed: boolean;
}

/** Expanding + fading ring riding the NOW / journey dot — Animated loop,
 *  mirroring the web SMIL pulse (1.8s, r 3.6→11, opacity .8→0). */
function PulseRing({ color }: { color: string }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(v, { toValue: 1, duration: 1800, easing: Easing.out(Easing.quad), useNativeDriver: true }),
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

/**
 * TimelineChart — the timeline family: events, spans and journeys through the
 * day (catalog TL-01…TL-20). One component covers the 16 catalog forms via
 * `variant`: event rails (dots / glowing icon pins / alternating chip pills,
 * NOW split, planned-hollow, zone band, context spark, heat ticks), span lanes
 * (range blocks, BODY/MIND/LIFE lanes, mini gantt with dependency elbows,
 * duration brackets, cluster bubbles, 24h ticks) and feeds/journeys (vertical
 * feed, milestone flags, the 90-day journey rail, the full now+zone day
 * widget). The Svg stretches to the measured container width via a fixed
 * viewBox + non-uniform scaling; dots, pills, pennants and text render as
 * absolutely-positioned Views placed by percentage so they stay perfectly
 * round and legible.
 */
export function TimelineChart({
  variant = 'event-line',
  events,
  spans,
  lanes = DEFAULT_LANES,
  clusters = DEFAULT_CLUSTERS,
  markers = 'dots',
  layout = 'single-side',
  now,
  nowLabel = 'NOW',
  zoneStops = DEFAULT_ZONE_STOPS,
  spark,
  heat = DEFAULT_HEAT,
  progress = 0.62,
  progressLabel = 'DAY 56 · 62%',
  milestones = DEFAULT_MILESTONES,
  title,
  axisLabels,
  shine = false,
  height = 150,
  ariaLabel,
  style,
}: TimelineChartProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const zoneId = `lk-tlc-zone-${uid}`;
  const railId = `lk-tlc-rail-${uid}`;
  const blurId = `lk-tlc-blur-${uid}`;
  const [width, setWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  const evs =
    events ??
    (variant === 'feed'
      ? DEFAULT_FEED
      : variant === 'milestone-flags'
        ? DEFAULT_FLAGS
        : variant === 'ticks-24h'
          ? DEFAULT_EVENTS.slice(1, 5)
          : DEFAULT_EVENTS);
  const spanRows =
    spans ??
    (variant === 'gantt-mini'
      ? DEFAULT_GANTT
      : variant === 'duration-brackets'
        ? DEFAULT_BRACKETS
        : DEFAULT_BLOCKS);
  const resolvedTitle = title ?? DEFAULT_TITLES[variant] ?? 'TODAY';

  const nowAt =
    now ??
    (variant === 'now-strip'
      ? 0.6
      : variant === 'now-zone-strip'
        ? 0.55
        : variant === 'planned-hollow'
          ? 0.5
          : undefined);

  const h =
    variant === 'feed' ? Math.max(height, 36 + Math.max(0, evs.length - 1) * 26 + 36) : height;
  const y = h / 2 + 4;
  const plotH = h - P.t - P.b;

  const marks: SvgMark[] = [];
  const oDots: ODot[] = [];
  const oRings: ORing[] = [];
  const oNotes: ONote[] = [];
  const oChips: OChip[] = [];
  const oPulses: OPulse[] = [];
  const oBubbles: OBubble[] = [];
  const oFlags: OFlag[] = [];
  const oMilestones: OMilestone[] = [];
  let needZoneGrad = false;
  let needRailGrad = false;
  let needBlur = false;

  if (resolvedTitle)
    oNotes.push({ x: P.l + 2, y: 11, text: resolvedTitle, color: colors.textFaint, anchor: 'start' });

  /** the horizontal rail + optional hour captions (the catalog's `axis()`) */
  const drawAxis = (ay: number, hours: boolean) => {
    marks.push({
      k: 'line',
      x1: AX,
      y1: ay,
      x2: AX + AW,
      y2: ay,
      stroke: colors.text,
      w: 1.5,
      opacity: 0.14,
      cap: true,
    });
    if (hours)
      (axisLabels ?? HOURS_AXIS).forEach((L) =>
        oNotes.push({
          x: ax(L.at),
          y: ay + 16,
          text: L.label,
          color: colors.textFaint,
          anchor: L.at === 0 ? 'start' : L.at === 1 ? 'end' : 'middle',
        }),
      );
  };
  /** NOW rule + pulse + caption */
  const drawNow = (nf: number) => {
    const nx = ax(nf);
    marks.push({ k: 'line', x1: nx, y1: y - 26, x2: nx, y2: y + 20, stroke: colors.text, w: 1, opacity: 0.25 });
    oPulses.push({ x: nx, y, color: colors.text });
    oNotes.push({ x: nx, y: y - 32, text: nowLabel, color: colors.textDim, anchor: 'middle' });
  };

  /* ---------- A · event rails ---------- */
  const railVariant =
    variant === 'event-line' ||
    variant === 'now-strip' ||
    variant === 'planned-hollow' ||
    variant === 'zone-strip' ||
    variant === 'spark-under' ||
    variant === 'heat-ticks' ||
    variant === 'now-zone-strip';

  if (railVariant) {
    const sparkData = spark ?? (variant === 'spark-under' ? DEFAULT_SPARK : undefined);
    if (sparkData && sparkData.length > 1) {
      const pts = sparkData.map(
        (v, i) =>
          [P.l + (i * PLOT_W) / (sparkData.length - 1), P.t + (1 - v) * plotH] as [number, number],
      );
      marks.push({ k: 'path', d: monotonePath(pts), stroke: colors.text, w: 1.5, opacity: 0.1 });
    }
    if (variant === 'zone-strip' || variant === 'now-zone-strip') {
      needZoneGrad = true;
      marks.push({ k: 'rect', x: AX, y: y - 5, w: AW, h: 10, rx: 5, fill: `url(#${zoneId})` });
    }
    drawAxis(y, true);

    if (variant === 'heat-ticks') {
      heat.forEach((v, i) => {
        const x = ax(heat.length > 1 ? i / (heat.length - 1) : 0.5);
        marks.push({ k: 'line', x1: x, y1: y - 7, x2: x, y2: y + 7, stroke: zoneOf(v), w: 2.4, cap: true });
      });
    } else {
      const dimFuture = variant === 'now-strip' || variant === 'now-zone-strip';
      evs.forEach((ev, i) => {
        const x = ax(ev.at ?? 0);
        const color = ev.color ?? MINT;
        const past = nowAt == null || (ev.at ?? 0) <= nowAt;
        if (markers === 'pins') {
          marks.push({ k: 'line', x1: x, y1: y, x2: x, y2: y - 18, stroke: colors.text, w: 1, opacity: 0.3 });
          oDots.push({ x, y: y - 21, d: 6.8, color, glow: true });
          oDots.push({ x, y, d: 4, color: colors.text });
        } else if (variant === 'planned-hollow' && !past) {
          oRings.push({ x, y, d: 9.5, color });
        } else {
          oDots.push({ x, y, d: 8, color, opacity: dimFuture && !past ? 0.35 : 1, glow: shine });
        }
        if (markers === 'pills' && ev.label) {
          oChips.push({ x, y: i % 2 === 0 ? y - 18 : y + 18, text: ev.label, color, anchor: 'middle' });
        }
      });
    }
    if (nowAt != null) drawNow(nowAt);
  }

  /* ---------- B · spans & lanes ---------- */
  if (variant === 'range-blocks') {
    drawAxis(y + 14, true);
    spanRows.forEach((b) => {
      const x0 = ax(b.from);
      const wpx = ax(b.to) - x0;
      marks.push({ k: 'rect', x: x0, y: y - 10, w: wpx, h: 16, rx: 8, fill: b.color ?? MINT, opacity: 0.8 });
      if (b.label && wpx > 46) oNotes.push({ x: x0 + wpx / 2, y: y + 1.5, text: b.label, color: INK, anchor: 'middle' });
    });
  }
  if (variant === 'multi-lane') {
    lanes.forEach((ln, li) => {
      const ly = 42 + li * 32;
      oNotes.push({ x: AX, y: ly + 3, text: ln.name, color: colors.textFaint, anchor: 'start' });
      marks.push({ k: 'line', x1: AX + 34, y1: ly, x2: AX + AW, y2: ly, stroke: colors.text, w: 1, opacity: 0.07 });
      ln.spans.forEach((b) => {
        const x0 = AX + 34 + (AW - 34) * b.from;
        const wpx = Math.max(8, (AW - 34) * (b.to - b.from));
        marks.push({ k: 'rect', x: x0, y: ly - 7, w: wpx, h: 14, rx: 7, fill: b.color ?? MINT, opacity: 0.85 });
      });
    });
    drawAxis(42 + lanes.length * 32 - 14, false);
  }
  if (variant === 'gantt-mini') {
    spanRows.forEach((s, ri) => {
      const ly = 46 + ri * 30;
      const x0 = ax(s.from);
      const wpx = ax(s.to) - x0;
      marks.push({ k: 'rect', x: x0, y: ly - 8, w: wpx, h: 16, rx: 4, fill: s.color ?? MINT, opacity: 0.85 });
      if (s.label) oNotes.push({ x: x0 + wpx / 2, y: ly + 2, text: s.label, color: INK, anchor: 'middle' });
      const next = spanRows[ri + 1];
      if (next) {
        const nx0 = ax(next.from);
        marks.push({
          k: 'path',
          d: `M${r(x0 + wpx)} ${ly + 8}L${r(x0 + wpx)} ${ly + 15}L${r(nx0)} ${ly + 15}L${r(nx0)} ${ly + 22}`,
          stroke: colors.text,
          w: 1,
          opacity: 0.25,
          dash: '2 2',
        });
      }
    });
  }
  if (variant === 'duration-brackets') {
    drawAxis(y, true);
    spanRows.forEach((b) => {
      const x0 = ax(b.from);
      const x1 = ax(b.to);
      const color = b.color ?? MINT;
      marks.push({
        k: 'path',
        d: `M${r(x0)} ${y - 12}L${r(x0)} ${y - 18}L${r(x1)} ${y - 18}L${r(x1)} ${y - 12}`,
        stroke: color,
        w: 1.4,
      });
      if (b.label) oChips.push({ x: (x0 + x1) / 2, y: y - 28, text: b.label, color, anchor: 'middle' });
    });
  }
  if (variant === 'cluster-bubbles') {
    drawAxis(y, true);
    clusters.forEach((cl) =>
      oBubbles.push({ x: ax(cl.at), y, radius: 6 + cl.count * 1.6, color: cl.color ?? MINT, count: cl.count }),
    );
  }
  if (variant === 'ticks-24h') {
    drawAxis(y, false);
    for (let i = 0; i <= 24; i++) {
      const big = i % 6 === 0;
      marks.push({
        k: 'line',
        x1: ax(i / 24),
        y1: y - (big ? 6 : 3),
        x2: ax(i / 24),
        y2: y + (big ? 6 : 3),
        stroke: colors.text,
        w: 1,
        opacity: big ? 0.3 : 0.12,
      });
    }
    (axisLabels ?? TICKS24_AXIS).forEach((L) =>
      oNotes.push({ x: ax(L.at), y: y + 20, text: L.label, color: colors.textFaint, anchor: 'middle' }),
    );
    evs.forEach((ev) => oDots.push({ x: ax(ev.at ?? 0), y, d: 6.8, color: ev.color ?? MINT, glow: shine }));
  }

  /* ---------- C · feeds & journeys ---------- */
  if (variant === 'feed') {
    const fx = layout === 'alternating' ? W / 2 : 46;
    marks.push({ k: 'line', x1: fx, y1: 26, x2: fx, y2: h - 18, stroke: colors.text, w: 1.5, opacity: 0.14 });
    evs.forEach((it, i) => {
      const iy = 36 + i * 26;
      const color = it.color ?? MINT;
      oDots.push({ x: fx, y: iy, d: 7.2, color, glow: true });
      if (layout === 'single-side') {
        if (it.time) oNotes.push({ x: fx - 10, y: iy + 3, text: it.time, color: colors.textFaint, anchor: 'end' });
        if (it.label) oChips.push({ x: fx + 12, y: iy, text: it.label, color, anchor: 'start' });
      } else {
        const left = i % 2 === 0;
        if (it.label)
          oChips.push({ x: fx + (left ? -12 : 12), y: iy, text: it.label, color, anchor: left ? 'end' : 'start' });
        if (it.time)
          oNotes.push({
            x: fx + (left ? 10 : -10),
            y: iy + 3,
            text: it.time,
            color: colors.textFaint,
            anchor: left ? 'start' : 'end',
          });
      }
    });
  }
  if (variant === 'milestone-flags') {
    drawAxis(y + 10, true);
    evs.forEach((f) => {
      const x = ax(f.at ?? 0);
      const color = f.color ?? MINT;
      marks.push({ k: 'line', x1: x, y1: y + 10, x2: x, y2: y - 22, stroke: colors.text, w: 1.2, opacity: 0.3 });
      oFlags.push({ x, y: y - 22, color });
      if (f.label) oChips.push({ x, y: y + 24, text: f.label, color, anchor: 'middle' });
    });
  }
  if (variant === 'journey-line') {
    const jy = y + 6;
    const prog = Math.max(0, Math.min(1, progress));
    marks.push({ k: 'line', x1: AX, y1: jy, x2: AX + AW, y2: jy, stroke: colors.text, w: 6, opacity: 0.1, cap: true });
    if (shine) {
      // shine — a Gaussian-blurred duplicate rail behind the crisp one: the
      // native twin of the web mark's `blur(6px)` underlay
      needBlur = true;
      marks.push({
        k: 'line',
        x1: AX,
        y1: jy,
        x2: ax(prog),
        y2: jy,
        stroke: MINT,
        w: 11,
        opacity: 0.5,
        cap: true,
        filter: `url(#${blurId})`,
      });
    }
    needRailGrad = true;
    marks.push({ k: 'line', x1: AX, y1: jy, x2: ax(prog), y2: jy, stroke: `url(#${railId})`, w: 6, cap: true });
    milestones.forEach((m) => {
      const passed = prog >= m.at;
      oMilestones.push({ x: ax(m.at), y: jy, passed });
      oNotes.push({
        x: ax(m.at),
        y: jy + 20,
        text: m.label,
        color: passed ? colors.textDim : colors.textFaint,
        anchor: 'middle',
      });
    });
    oPulses.push({ x: ax(prog), y: jy, color: MINT });
    if (progressLabel) oChips.push({ x: ax(prog), y: jy - 18, text: progressLabel, color: MINT, anchor: 'middle' });
  }

  /* ---------------- render ---------------- */

  const pctX = (x: number) => `${r((x / W) * 100)}%` as DimensionValue;
  const anchorAlign = (a: Anchor) =>
    a === 'start' ? ('flex-start' as const) : a === 'middle' ? ('center' as const) : ('flex-end' as const);

  return (
    <View style={[styles.root, style]} accessibilityRole="image" accessibilityLabel={ariaLabel}>
      <View style={{ position: 'relative', height: h }} onLayout={onLayout}>
        {width > 0 && (
          <Svg width={width} height={h} viewBox={`0 0 ${W} ${h}`} preserveAspectRatio="none">
            <Defs>
              {needZoneGrad ? (
                <LinearGradient id={zoneId} x1="0" y1="0" x2="1" y2="0">
                  {zoneStops.map((s, i) => (
                    <Stop key={i} offset={s.offset} stopColor={s.color} stopOpacity={s.opacity ?? 1} />
                  ))}
                </LinearGradient>
              ) : null}
              {needRailGrad ? (
                <LinearGradient id={railId} x1="0" y1="0" x2="1" y2="0">
                  <Stop offset="0" stopColor={colors.lime} />
                  <Stop offset="1" stopColor={colors.mint} />
                </LinearGradient>
              ) : null}
              {needBlur ? (
                /* real Gaussian blur for the journey-line shine (Fabric-native in
                   react-native-svg 15) — the native twin of the web `blur(6px)`.
                   Region in user space over the full canvas so the flat rail
                   never clips the blur to its bounding box. */
                <Filter id={blurId} filterUnits="userSpaceOnUse" x={-12} y={-12} width={W + 24} height={h + 24}>
                  <FeGaussianBlur stdDeviation={3} />
                </Filter>
              ) : null}
            </Defs>
            {marks.map((mk, i) =>
              mk.k === 'rect' ? (
                <Rect
                  key={i}
                  x={r(mk.x)}
                  y={r(mk.y)}
                  width={r(Math.max(0, mk.w))}
                  height={mk.h}
                  rx={mk.rx}
                  fill={mk.fill}
                  opacity={mk.opacity}
                />
              ) : mk.k === 'line' ? (
                <Line
                  key={i}
                  x1={r(mk.x1)}
                  y1={r(mk.y1)}
                  x2={r(mk.x2)}
                  y2={r(mk.y2)}
                  stroke={mk.stroke}
                  strokeWidth={mk.w}
                  strokeOpacity={mk.opacity}
                  strokeDasharray={mk.dash}
                  strokeLinecap={mk.cap ? 'round' : undefined}
                  filter={mk.filter}
                />
              ) : (
                <Path
                  key={i}
                  d={mk.d}
                  fill="none"
                  stroke={mk.stroke}
                  strokeWidth={mk.w}
                  strokeOpacity={mk.opacity}
                  strokeDasharray={mk.dash}
                  strokeLinecap={mk.cap ? 'round' : undefined}
                />
              ),
            )}
          </Svg>
        )}

        {/* round marks + text — View overlays so they never distort with the stretch */}
        {oDots.map((d, i) => (
          <View key={`d-${i}`} style={[styles.anchor, { left: pctX(d.x), top: d.y }]} pointerEvents="none">
            <View
              style={[
                {
                  position: 'absolute',
                  width: d.d,
                  height: d.d,
                  borderRadius: d.d / 2,
                  backgroundColor: d.color,
                  opacity: d.opacity,
                },
                d.glow
                  ? {
                      shadowColor: d.color,
                      shadowOpacity: 0.8,
                      shadowRadius: 4,
                      shadowOffset: { width: 0, height: 0 },
                      elevation: 3,
                    }
                  : null,
              ]}
            />
          </View>
        ))}
        {oRings.map((g, i) => (
          <View key={`r-${i}`} style={[styles.anchor, { left: pctX(g.x), top: g.y }]} pointerEvents="none">
            <View
              style={{
                position: 'absolute',
                width: g.d,
                height: g.d,
                borderRadius: g.d / 2,
                borderWidth: 1.5,
                borderStyle: 'dashed',
                borderColor: g.color,
              }}
            />
          </View>
        ))}
        {oBubbles.map((b, i) => (
          <View key={`b-${i}`} style={[styles.anchor, { left: pctX(b.x), top: b.y }]} pointerEvents="none">
            <View
              style={{
                position: 'absolute',
                width: b.radius * 2,
                height: b.radius * 2,
                borderRadius: b.radius,
                borderWidth: 1.2,
                borderColor: b.color,
                backgroundColor: `${b.color}40`,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={styles.bubbleText}>{b.count}</Text>
            </View>
          </View>
        ))}
        {oMilestones.map((m, i) => (
          <View key={`m-${i}`} style={[styles.anchor, { left: pctX(m.x), top: m.y }]} pointerEvents="none">
            <View
              style={{
                position: 'absolute',
                width: 11,
                height: 11,
                borderRadius: 5.5,
                backgroundColor: m.passed ? MINT : colors.bg1,
                borderWidth: 1.6,
                borderColor: m.passed ? MINT : `${colors.text}40`,
              }}
            />
          </View>
        ))}
        {oFlags.map((f, i) => (
          <View
            key={`f-${i}`}
            style={{ position: 'absolute', left: pctX(f.x), top: f.y, width: 30, height: 12 }}
            pointerEvents="none"
          >
            <Svg width={30} height={12} viewBox="0 0 30 12">
              <Path d="M0 0L30 6L0 12Z" fill={f.color} opacity={0.9} />
            </Svg>
          </View>
        ))}
        {oPulses.map((p, i) => (
          <View key={`p-${i}`} style={[styles.anchor, { left: pctX(p.x), top: p.y }]} pointerEvents="none">
            <View
              style={{
                position: 'absolute',
                width: 7.2,
                height: 7.2,
                borderRadius: 3.6,
                backgroundColor: p.color,
                shadowColor: p.color,
                shadowOpacity: 0.8,
                shadowRadius: 5,
                shadowOffset: { width: 0, height: 0 },
                elevation: 3,
              }}
            />
            <PulseRing color={p.color} />
          </View>
        ))}
        {oNotes.map((nte, i) => (
          <View
            key={`n-${i}`}
            style={[styles.anchor, { left: pctX(nte.x), top: nte.y - 9, alignItems: anchorAlign(nte.anchor) }]}
            pointerEvents="none"
          >
            <Text style={[styles.note, { color: nte.color }]} numberOfLines={1}>
              {nte.text}
            </Text>
          </View>
        ))}
        {oChips.map((c, i) => (
          <View
            key={`c-${i}`}
            style={[styles.anchor, { left: pctX(c.x), top: c.y, alignItems: anchorAlign(c.anchor) }]}
            pointerEvents="none"
          >
            <View style={[styles.chip, { borderColor: `${c.color}59` }]}>
              <Text style={[styles.chipText, { color: c.color }]} numberOfLines={1}>
                {c.text}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { width: '100%' },
  // zero-size anchor centered on its point: absolutely-positioned children with
  // no offsets are placed by alignItems/justifyContent (Yoga static position),
  // so dots/text/chips stay round & legible under the SVG stretch.
  anchor: {
    position: 'absolute',
    width: 0,
    height: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // pulse ring riding the NOW / journey dot (mirrors the web SMIL pulse)
  pulse: {
    position: 'absolute',
    width: 9,
    height: 9,
    borderRadius: 4.5,
    borderWidth: 1.4,
  },
  // tiny mono annotations (title, hour captions, NOW, lane names, inline labels)
  note: {
    position: 'absolute',
    fontFamily: fonts.mono,
    fontSize: 8.5,
    lineHeight: 9,
    letterSpacing: 0.5,
  },
  // chip-pill labels (dark chip + tinted hairline border — the catalog's tag())
  chip: {
    position: 'absolute',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: `${colors.bg0}C7`,
  },
  chipText: {
    fontFamily: fonts.mono,
    fontSize: 8,
    lineHeight: 9,
    letterSpacing: 0.4,
  },
  bubbleText: {
    fontFamily: fonts.mono,
    fontSize: 9,
    lineHeight: 10,
    color: colors.text,
  },
});
