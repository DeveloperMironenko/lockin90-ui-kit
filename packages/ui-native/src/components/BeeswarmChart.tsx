import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, G, Line, Rect, Text as SvgText } from 'react-native-svg';
import { colors, fonts } from '@lockin90/tokens';

/* BeeswarmChart — the shared catalog beeswarm family (BW-01…BW-04,
   lockin90-design/charts/beeswarm-charts.html): every session is a dot — your
   whole history in one swarm along a value axis, drawn in a fixed 320×150
   viewBox. Placement is the catalog's greedy collision-free algorithm ported
   verbatim (sort by x, first non-colliding vertical offset wins). Native twin
   of `@lockin90/ui` BeeswarmChart — same prop API; glows are wider faint
   duplicate shapes and the BW-02 TODAY pulse is a static duplicate halo
   (never SVG filters / CSS animation on native). */

export type BeeswarmChartVariant =
  | 'history-swarm' /* BW-01 — sessions swarmed on the duration axis · colored by type · this week ringed */
  | 'score-swarm' /* BW-02 — daily scores on a 0–100 axis, zone-colored · TODAY pulses with a pill */
  | 'pr-swarm' /* BW-03 — faint history dots · the PR glows mint + pill — one hero dot */
  | 'month-swarm'; /* BW-04 — two swarms stacked on a shared axis + mean ticks + delta pill */

/** One swarm dot: a session/day value on the x axis. */
export interface BeeswarmPoint {
  /** The value (minutes, score, kg, …) — mapped onto `domain`. */
  value: number;
  /** `history-swarm` series index → `palette[series]` (default 0). */
  series?: number;
  /** White outline ring (`history-swarm`'s "this week"). */
  ring?: boolean;
  /** The hero dot — `score-swarm` TODAY pulse / `pr-swarm` glowing PR.
   *  Defaults: last point (`score-swarm`) / max value (`pr-swarm`). */
  hero?: boolean;
}

/** One `month-swarm` row: a labeled swarm sharing the axis. */
export interface BeeswarmGroup {
  /** Row label at the left ('JUN'). */
  label: string;
  /** The row's values. */
  values: number[];
  /** Dot + mean-tick color. Defaults: first mint, second faint text. */
  color?: string;
}

/** An x-axis tick: a domain value + its label. */
export interface BeeswarmTick {
  value: number;
  label: string;
}

export interface BeeswarmChartProps {
  /** Catalog variant (BW-01 / BW-02 / BW-03 / BW-04). */
  variant?: BeeswarmChartVariant;
  /** The swarm dots (all variants except `month-swarm`). */
  points?: BeeswarmPoint[];
  /** `month-swarm` — the two stacked rows (first = current, second = previous). */
  groups?: BeeswarmGroup[];
  /** Value → x-position domain `[min, max]`. Defaults per variant:
   *  history/month `[15, 95]` · score `[0, 100]` · pr `[55, 115]`. */
  domain?: [number, number];
  /** Axis ticks. Defaults per variant (20M/40M/60M/80M · 0–100 · KG · 30M/50M/70M). */
  ticks?: BeeswarmTick[];
  /** `history-swarm` legend labels (pairs with `palette`). */
  seriesLabels?: string[];
  /** `history-swarm` series colors. */
  palette?: string[];
  /** The annotation pill: `score-swarm` TODAY (derived 'TODAY · 72'), `pr-swarm`
   *  PR (derived 'PR · 110'), `month-swarm` delta (derived '+6 MIN AVG'); '' hides. */
  note?: string;
  /** Bottom-right legend line (`history-swarm` derives '○ = THIS WEEK'); '' hides. */
  caption?: string;
  /** `pr-swarm` dim label right of the swarm ('SQUAT'). */
  endLabel?: string;
  /** Top-left mono caption ('ALL WORKOUTS · 60 DAYS'). */
  title?: string;
  /** Soft glow underlay behind every dot (the catalog glow modifier). */
  shine?: boolean;
  /** Accessible description of the chart. */
  ariaLabel?: string;
  /** Optional container style. */
  style?: StyleProp<ViewStyle>;
}

/* ---- catalog geometry (viewBox units — charts/catalog.js + beeswarm page) ---- */
const W = 320;
const H = 150;
const PAD = { l: 10, r: 12, t: 16, b: 14 };
/** Dot radius the swarm packs with (drawn radius can differ — BW-04 draws 2.8). */
const R = 3.1;

/** Round for compact attribute values. */
const rd = (n: number) => Math.round(n * 100) / 100;

/** Zone verdict color for a 0–100 value (same thresholds as the catalog). */
const zoneColor = (v: number) => (v >= 62 ? colors.zoneHigh : v >= 38 ? colors.zoneMid : colors.zoneLow);

/** The catalog's deterministic PRNG — the default demo data reproduces the
 *  design page dot-for-dot (seeds 7 / 11 / 13 / 21 / 22). */
function mulberry32(a: number): () => number {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface XY {
  x: number;
  y: number;
}

/** Greedy beeswarm (ported from the catalog): sort by x; for each dot try
 *  vertical offsets 0, ±STEP, ±2·STEP … and keep the first that doesn't
 *  collide with an already-placed dot. If all 24 offsets collide the dot is
 *  placed at the last offset anyway (the catalog drops it — we never lose data). */
function swarm(xs: number[], cy: number): XY[] {
  const step = R * 2 + 0.6;
  const minD = 2 * R + 0.4;
  const order = xs.map((x, i) => ({ x, i })).sort((a, b) => a.x - b.x);
  const placed: XY[] = [];
  const out: XY[] = new Array(xs.length);
  for (const o of order) {
    let py = cy;
    for (let k = 0; k < 24; k++) {
      const y = cy + (k % 2 ? -1 : 1) * Math.ceil(k / 2) * step;
      py = y;
      let ok = true;
      for (let j = placed.length - 1; j >= 0; j--) {
        const p = placed[j];
        if (o.x - p.x > minD) break; // placed stays x-sorted
        const dx = o.x - p.x;
        const dy = y - p.y;
        if (dx * dx + dy * dy < minD * minD) {
          ok = false;
          break;
        }
      }
      if (ok) break;
    }
    placed.push({ x: o.x, y: py });
    out[o.i] = { x: o.x, y: py };
  }
  return out;
}

/* ---- per-variant catalog layout ---- */
const LAYOUT: Record<BeeswarmChartVariant, { x0: number; x1: number; cy: number; axisY: number }> = {
  'history-swarm': { x0: 26, x1: 226, cy: 74, axisY: 126 },
  'score-swarm': { x0: 26, x1: 292, cy: 78, axisY: 130 },
  'pr-swarm': { x0: 26, x1: 250, cy: 76, axisY: 126 },
  'month-swarm': { x0: 46, x1: 292, cy: 52, axisY: 136 }, // second row at cy 106
};
const DEFAULT_DOMAINS: Record<BeeswarmChartVariant, [number, number]> = {
  'history-swarm': [15, 95],
  'score-swarm': [0, 100],
  'pr-swarm': [55, 115],
  'month-swarm': [15, 95],
};
const DEFAULT_TICKS: Record<BeeswarmChartVariant, BeeswarmTick[]> = {
  'history-swarm': [
    { value: 20, label: '20M' },
    { value: 40, label: '40M' },
    { value: 60, label: '60M' },
    { value: 80, label: '80M' },
  ],
  'score-swarm': [0, 25, 50, 75, 100].map((v) => ({ value: v, label: String(v) })),
  'pr-swarm': [
    { value: 60, label: '60KG' },
    { value: 80, label: '80KG' },
    { value: 100, label: '100KG' },
  ],
  'month-swarm': [
    { value: 30, label: '30M' },
    { value: 50, label: '50M' },
    { value: 70, label: '70M' },
  ],
};

/* ---- the catalog demo data (same seeds → dot-for-dot parity) ---- */
function historyDefaults(): BeeswarmPoint[] {
  const r = mulberry32(7);
  const pts: BeeswarmPoint[] = [];
  for (let i = 0; i < 60; i++) {
    const value = 20 + 70 * (r() * 0.5 + r() * 0.5); // minutes 20..90
    const tv = r();
    pts.push({ value, series: tv < 0.5 ? 0 : tv < 0.82 ? 1 : 2, ring: i >= 55 });
  }
  return pts;
}
function scoreDefaults(): BeeswarmPoint[] {
  const r = mulberry32(11);
  const pts: BeeswarmPoint[] = [];
  for (let i = 0; i < 50; i++) pts.push({ value: Math.round(28 + 66 * (r() * 0.5 + r() * 0.5)) });
  pts[49] = { value: 72, hero: true };
  return pts;
}
function prDefaults(): BeeswarmPoint[] {
  const r = mulberry32(13);
  const pts: BeeswarmPoint[] = [];
  for (let i = 0; i < 40; i++) pts.push({ value: 62 + 40 * (r() * 0.6 + r() * 0.4) });
  pts[39] = { value: 110, hero: true };
  return pts;
}
function monthDefaults(): BeeswarmGroup[] {
  const gen = (seed: number, boost: number) => {
    const r = mulberry32(seed);
    const v: number[] = [];
    for (let q = 0; q < 30; q++) v.push(22 + 62 * (r() * 0.5 + r() * 0.5) + boost);
    return v;
  };
  return [
    { label: 'JUN', values: gen(21, 6) },
    { label: 'MAY', values: gen(22, 0) },
  ];
}
const DEFAULT_POINTS: Record<Exclude<BeeswarmChartVariant, 'month-swarm'>, BeeswarmPoint[]> = {
  'history-swarm': historyDefaults(),
  'score-swarm': scoreDefaults(),
  'pr-swarm': prDefaults(),
};
const DEFAULT_GROUPS = monthDefaults();

const DEFAULT_SERIES_LABELS = ['STRENGTH', 'CARDIO', 'MOBILITY'];
const DEFAULT_PALETTE = [colors.violet, colors.cyan, colors.lime];

/** Mono catalog label (8.5px JetBrains Mono, ~.06em tracking). */
function Label({
  x,
  y,
  fill,
  anchor = 'middle',
  children,
}: {
  x: number;
  y: number;
  fill: string;
  anchor?: 'start' | 'middle' | 'end';
  children: string;
}) {
  return (
    <SvgText
      x={rd(x)}
      y={rd(y)}
      fill={fill}
      textAnchor={anchor}
      fontSize={8.5}
      fontFamily={fonts.mono}
      letterSpacing={0.5}
    >
      {children}
    </SvgText>
  );
}

/** Chip-pill annotation (dark rounded rect + tinted hairline + mono text). */
function Tag({
  x,
  y,
  color,
  anchor = 'middle',
  children,
}: {
  x: number;
  y: number;
  color: string;
  anchor?: 'start' | 'middle' | 'end';
  children: string;
}) {
  const w = children.length * 5.35 + 12;
  let xa = anchor === 'end' ? x - w : anchor === 'start' ? x : x - w / 2;
  xa = Math.max(PAD.l - 4, Math.min(xa, W - PAD.r - w + 4));
  return (
    <G>
      <Rect
        x={rd(xa)}
        y={rd(y - 6.5)}
        width={rd(w)}
        height={13}
        rx={6.5}
        fill={colors.bg0}
        fillOpacity={0.78}
        stroke={color}
        strokeOpacity={0.35}
        strokeWidth={0.8}
      />
      <SvgText
        x={rd(xa + w / 2)}
        y={rd(y + 2.8)}
        fill={color}
        textAnchor="middle"
        fontSize={8}
        fontFamily={fonts.mono}
        letterSpacing={0.4}
      >
        {children}
      </SvgText>
    </G>
  );
}

/** The x axis: hairline + value ticks + labels (the catalog axis()). */
function Axis({
  x0,
  x1,
  y,
  ticks,
  domain,
}: {
  x0: number;
  x1: number;
  y: number;
  ticks: BeeswarmTick[];
  domain: [number, number];
}) {
  const span = domain[1] - domain[0] || 1;
  return (
    <G>
      <Line x1={x0} x2={x1} y1={y} y2={y} stroke={colors.text} strokeOpacity={0.12} strokeWidth={1} />
      {ticks.map((t, i) => {
        const tx = x0 + ((x1 - x0) * (t.value - domain[0])) / span;
        return (
          <G key={i}>
            <Line x1={rd(tx)} x2={rd(tx)} y1={y - 2} y2={y + 2} stroke={colors.text} strokeOpacity={0.2} strokeWidth={1} />
            <Label x={tx} y={y + 11} fill={colors.textFaint}>
              {t.label}
            </Label>
          </G>
        );
      })}
    </G>
  );
}

/**
 * BeeswarmChart — dot-swarm distribution chart for product surfaces (catalog
 * family BW-01…BW-04). `history-swarm` is THE training-history overview:
 * every session is a dot along the duration axis, colored by type, this week
 * ringed white. `score-swarm` places TODAY (pilled, static halo on native)
 * inside your own score distribution, `pr-swarm` celebrates one glowing PR
 * dot, `month-swarm` stacks two months on a shared axis with mean ticks and
 * a delta pill.
 */
export function BeeswarmChart({
  variant = 'history-swarm',
  points,
  groups,
  domain,
  ticks,
  seriesLabels = DEFAULT_SERIES_LABELS,
  palette = DEFAULT_PALETTE,
  note,
  caption,
  endLabel,
  title,
  shine = false,
  ariaLabel = 'Beeswarm chart',
  style,
}: BeeswarmChartProps) {
  const L = LAYOUT[variant];
  const dom = domain ?? DEFAULT_DOMAINS[variant];
  const axisTicks = ticks ?? DEFAULT_TICKS[variant];
  const span = dom[1] - dom[0] || 1;
  const xOf = (v: number) => L.x0 + ((L.x1 - L.x0) * (v - dom[0])) / span;

  const usingDefaultPoints = points === undefined;
  const pts =
    variant === 'month-swarm' ? [] : (points ?? DEFAULT_POINTS[variant as Exclude<BeeswarmChartVariant, 'month-swarm'>]);
  const rows = variant === 'month-swarm' ? (groups ?? DEFAULT_GROUPS).slice(0, 2) : [];

  /* shine underlay — a wider faint duplicate behind a dot (no blur on native) */
  const glow = (x: number, y: number, r: number, fill: string, key: string) => (
    <Circle key={key} cx={rd(x)} cy={rd(y)} r={rd(r)} fill={fill} opacity={0.3} />
  );

  let body = null;
  if (variant === 'history-swarm') {
    /* ---- BW-01 · the training-history swarm ---- */
    const dots = swarm(pts.map((p) => xOf(p.value)), L.cy);
    const resolvedCaption = caption ?? (pts.some((p) => p.ring) ? '○ = THIS WEEK' : undefined);
    body = (
      <>
        {shine ? dots.map((d, i) => glow(d.x, d.y, R + 2.5, palette[(pts[i].series ?? 0) % palette.length], `g${i}`)) : null}
        {dots.map((d, i) => (
          <Circle
            key={i}
            cx={rd(d.x)}
            cy={rd(d.y)}
            r={R}
            fill={palette[(pts[i].series ?? 0) % palette.length]}
            opacity={0.85}
            stroke={pts[i].ring ? colors.text : undefined}
            strokeOpacity={pts[i].ring ? 0.95 : undefined}
            strokeWidth={pts[i].ring ? 1.2 : undefined}
          />
        ))}
        <Axis x0={L.x0} x1={L.x1} y={L.axisY} ticks={axisTicks} domain={dom} />
        {seriesLabels.map((lg, i) => (
          <G key={lg}>
            <Circle cx={246} cy={46 + i * 18} r={3.5} fill={palette[i % palette.length]} />
            <Label x={254} y={49 + i * 18} fill={colors.textDim} anchor="start">
              {lg}
            </Label>
          </G>
        ))}
        {resolvedCaption ? (
          <Label x={246} y={106} fill={colors.textDim} anchor="start">
            {resolvedCaption}
          </Label>
        ) : null}
      </>
    );
  } else if (variant === 'score-swarm') {
    /* ---- BW-02 · you vs your own history (TODAY — static halo on native) ---- */
    const heroIdx = (() => {
      const h = pts.findIndex((p) => p.hero);
      return h >= 0 ? h : pts.length - 1;
    })();
    const dots = swarm(pts.map((p) => xOf(p.value)), L.cy);
    const hero = dots[heroIdx];
    const resolvedNote = note ?? (pts.length ? `TODAY · ${Math.round(pts[heroIdx].value)}` : undefined);
    body = (
      <>
        {shine ? dots.map((d, i) => (i === heroIdx ? null : glow(d.x, d.y, R + 2.5, zoneColor(pts[i].value), `g${i}`))) : null}
        {dots.map((d, i) =>
          i === heroIdx ? null : (
            <Circle key={i} cx={rd(d.x)} cy={rd(d.y)} r={R} fill={zoneColor(pts[i].value)} opacity={0.8} />
          ),
        )}
        {hero ? (
          <>
            <Circle cx={rd(hero.x)} cy={rd(hero.y)} r={7} fill="none" stroke={colors.text} strokeWidth={1.4} strokeOpacity={0.4} />
            <Circle cx={rd(hero.x)} cy={rd(hero.y)} r={3.6} fill={colors.text} />
            {resolvedNote ? (
              <Tag x={hero.x} y={hero.y - 16} color={colors.mint}>
                {resolvedNote}
              </Tag>
            ) : null}
          </>
        ) : null}
        <Axis x0={L.x0} x1={L.x1} y={L.axisY} ticks={axisTicks} domain={dom} />
      </>
    );
  } else if (variant === 'pr-swarm') {
    /* ---- BW-03 · one hero dot (the PR glows — wider faint duplicate) ---- */
    const heroIdx = (() => {
      const h = pts.findIndex((p) => p.hero);
      if (h >= 0) return h;
      let best = 0;
      pts.forEach((p, i) => {
        if (p.value > (pts[best]?.value ?? -Infinity)) best = i;
      });
      return best;
    })();
    const dots = swarm(pts.map((p) => xOf(p.value)), L.cy);
    const hero = dots[heroIdx];
    const resolvedNote = note ?? (pts.length ? `PR · ${Math.round(pts[heroIdx].value)}` : undefined);
    const resolvedEnd = endLabel ?? (usingDefaultPoints ? 'SQUAT' : undefined);
    body = (
      <>
        {dots.map((d, i) =>
          i === heroIdx ? null : (
            <Circle key={i} cx={rd(d.x)} cy={rd(d.y)} r={R} fill={colors.text} opacity={0.35} />
          ),
        )}
        {hero ? (
          <>
            <Circle cx={rd(hero.x)} cy={rd(hero.y)} r={7} fill={colors.mint} opacity={0.35} />
            <Circle cx={rd(hero.x)} cy={rd(hero.y)} r={4.2} fill={colors.mint} />
            {resolvedNote ? (
              <Tag x={hero.x - 2} y={hero.y - 18} color={colors.mint}>
                {resolvedNote}
              </Tag>
            ) : null}
          </>
        ) : null}
        <Axis x0={L.x0} x1={L.x1} y={L.axisY} ticks={axisTicks} domain={dom} />
        {resolvedEnd ? (
          <Label x={282} y={76} fill={colors.textDim}>
            {resolvedEnd}
          </Label>
        ) : null}
      </>
    );
  } else {
    /* ---- BW-04 · month vs month on a shared axis ---- */
    const cys = [52, 106];
    const meansX: number[] = [];
    const rendered = rows.map((g, gi) => {
      const cy = cys[gi] ?? 106;
      const col = g.color ?? (gi === 0 ? colors.mint : colors.text);
      const fillOp = g.color ? 1 : gi === 0 ? 1 : 0.5;
      const op = gi === 0 ? 0.85 : 0.7;
      const dots = swarm(g.values.map(xOf), cy);
      const mean = g.values.length ? g.values.reduce((a, b) => a + b, 0) / g.values.length : dom[0];
      const mx = xOf(mean);
      meansX.push(mx);
      return (
        <G key={gi}>
          {shine ? dots.map((d, i) => glow(d.x, d.y, 2.8 + 2.5, col, `g${gi}-${i}`)) : null}
          {dots.map((d, i) => (
            <Circle key={i} cx={rd(d.x)} cy={rd(d.y)} r={2.8} fill={col} fillOpacity={fillOp} opacity={op} />
          ))}
          <Line
            x1={rd(mx)}
            x2={rd(mx)}
            y1={cy - 15}
            y2={cy + 15}
            stroke={col}
            strokeOpacity={rd(fillOp * 0.9)}
            strokeWidth={1.6}
          />
          <Label x={26} y={cy + 3} fill={gi === 0 ? col : colors.textDim} anchor="start">
            {g.label}
          </Label>
        </G>
      );
    });
    const meanOf = (g?: BeeswarmGroup) =>
      g && g.values.length ? g.values.reduce((a, b) => a + b, 0) / g.values.length : 0;
    const delta = meanOf(rows[0]) - meanOf(rows[1]);
    const resolvedNote =
      note ?? (rows.length >= 2 ? `${delta >= 0 ? '+' : ''}${Math.round(delta)} MIN AVG` : undefined);
    body = (
      <>
        {rendered}
        <Axis x0={L.x0} x1={L.x1} y={L.axisY} ticks={axisTicks} domain={dom} />
        {resolvedNote && meansX.length >= 2 ? (
          <Tag x={(meansX[0] + meansX[1]) / 2 + 30} y={24} color={colors.mint}>
            {resolvedNote}
          </Tag>
        ) : null}
      </>
    );
  }

  return (
    <View accessibilityRole="image" accessibilityLabel={ariaLabel} style={[styles.root, style]}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
        {title ? (
          <Label x={PAD.l + 2} y={11} fill={colors.textFaint} anchor="start">
            {title}
          </Label>
        ) : null}
        {body}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  /* fixed catalog aspect (320×150); the Svg scales the viewBox to fit */
  root: { width: '100%', aspectRatio: W / H },
});
