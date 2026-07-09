import { useId, type ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Defs, FeGaussianBlur, Filter, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import { colors, fonts } from '@lockin90/tokens';

/* CompositeChart — the catalog composite family (CM-01/03/05/07,
   lockin90-design/charts/composite-charts.html): density + structure charts —
   treemaps, horizon rows, calendar micro-charts and goal trees, drawn in the
   fixed 320×150 catalog viewBox. Native twin of `@lockin90/ui`
   CompositeChart — same prop API + geometry; every `shine` glow is a real
   Gaussian-blurred duplicate shape (Fabric-native SVG filters in
   react-native-svg 15). */

/** Catalog variant names (`lockin90-design/charts/composite-charts.html`). */
export type CompositeChartVariant =
  | 'treemap' /* CM-01 — nested rounded rects, 28% fills + tinted borders */
  | 'horizon-rows' /* CM-03 — folded 2-layer bands, metrics × days */
  | 'calendar-micro' /* CM-05 — month grid, every day a micro-chart */
  | 'goal-tree'; /* CM-07 — root goal ring + child habit rings + connectors */

/** One `treemap` tile (CM-01). */
export interface CompositeTreemapItem {
  /** tile label (e.g. 'SLEEP') */
  label: string;
  /** share, in percent (drives the % caption + zone coloring) */
  value: number;
  /** tile hue (token; used by `coloring="time"`) */
  color?: string;
}

/** One `horizon-rows` metric band (CM-03). */
export interface CompositeHorizonRow {
  /** row label at the left (e.g. 'ENERGY') */
  label: string;
  /** band hue (token; default mint) */
  color?: string;
  /** daily values 0–1, oldest → newest */
  values: number[];
}

/** One ring of the `goal-tree` (CM-07) — the root or a child habit. */
export interface CompositeGoalNode {
  /** chip label (root above, children below) */
  label: string;
  /** ring fill 0–100 — also the center readout */
  value: number;
  /** ring hue (token; root defaults mint) */
  color?: string;
}

export interface CompositeChartProps {
  /** chart form (default `'treemap'`, CM-01) */
  variant?: CompositeChartVariant;
  /** `treemap` — the tiles (default: the catalog's 6-way week split) */
  items?: CompositeTreemapItem[];
  /** `treemap` — SELECT COLORING: own `time`-share hues / `zone` verdicts
   *  (> 20% high · > 10% mid · else low) — default `'time'` */
  coloring?: 'time' | 'zone';
  /** `horizon-rows` — the metric bands (default: the catalog's 4 × 40 days) */
  rows?: CompositeHorizonRow[];
  /** `horizon-rows` — SELECT MODE: `absolute` values / folded `deviation`
   *  (|v − 0.5|·2 vs baseline) — default `'absolute'` */
  mode?: 'absolute' | 'deviation';
  /** `calendar-micro` — one series per day, 0–1 (7 per row; default: the
   *  catalog's 28 seeded days) */
  days?: number[][];
  /** `calendar-micro` — SELECT CELL: `spark`line / `bars` — default `'spark'` */
  cell?: 'spark' | 'bars';
  /** `calendar-micro` — weekday letters under the columns (default 'MTWTFSS') */
  weekLabels?: string;
  /** `goal-tree` — the root goal ring (default: the catalog's ENERGY 74) */
  root?: CompositeGoalNode;
  /** `goal-tree` — the child habit rings (default: the catalog's 3) */
  branches?: CompositeGoalNode[];
  /** `horizon-rows` — faint caption at the bottom-right (per-mode default) */
  legend?: string;
  /** faint mono caption at the top-left (per-variant catalog default) */
  title?: string;
  /** glow underlay — wider faint duplicate shapes on native, never filters */
  shine?: boolean;
  /** rendered width in px — the 320×150 viewBox scales to fit */
  width?: number;
  /** rendered height in px */
  height?: number;
  /** optional wrapper style */
  style?: StyleProp<ViewStyle>;
}

/* --------------------------------------------------------------- geometry
 * The catalog canvas: 320×150, pad l10 r12 t16 b14 (catalog.js). */
const W = 320;
const H = 150;
const P = { l: 10, r: 12, t: 16, b: 14 };
const plotW = W - P.l - P.r;
const plotH = H - P.t - P.b;

/* ------------------------------------------- catalog deterministic data
 * mulberry32 + genData ported from catalog.js so the defaults reproduce the
 * catalog cards exactly (horizon rows: wave 11/22/33/44 × 40 · calendar:
 * seed r·7+c+5, spark wave×10 / bars noisy×6). */
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

function genWave(seed: number, n: number): number[] {
  const r = mulberry32(seed);
  const ph = r() * 6;
  const f = 1.15 + r() * 0.5;
  const amp = 0.2 + r() * 0.08;
  const base = 0.48 + r() * 0.12;
  const v: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    v.push(clamp01(base + Math.sin(t * Math.PI * 2 * f + ph) * amp + (r() - 0.5) * 0.08));
  }
  return v;
}

function genNoisy(seed: number, n: number): number[] {
  const r = mulberry32(seed);
  const b = 0.5 + (r() - 0.5) * 0.1;
  const v: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    v.push(clamp01(b + Math.sin(t * Math.PI * 2.2 + r()) * 0.12 + (r() - 0.5) * 0.3));
  }
  return v;
}

/** the catalog's `TREE` — where the week went, 6 tiles */
const DEFAULT_ITEMS: CompositeTreemapItem[] = [
  { label: 'SLEEP', value: 34, color: colors.violet },
  { label: 'WORK', value: 26, color: colors.indigo },
  { label: 'TRAIN', value: 14, color: colors.cyan },
  { label: 'MEALS', value: 10, color: colors.lime },
  { label: 'SOCIAL', value: 9, color: colors.mint },
  { label: 'OTHER', value: 7, color: colors.magenta },
];

const DEFAULT_ROWS: CompositeHorizonRow[] = [
  { label: 'ENERGY', color: colors.mint, values: genWave(11, 40) },
  { label: 'HRV', color: colors.cyan, values: genWave(22, 40) },
  { label: 'SLEEP', color: colors.violet, values: genWave(33, 40) },
  { label: 'STRAIN', color: colors.zoneMid, values: genWave(44, 40) },
];

const DEFAULT_ROOT: CompositeGoalNode = { label: 'ENERGY 80 BY DAY 90', value: 74, color: colors.mint };

const DEFAULT_BRANCHES: CompositeGoalNode[] = [
  { label: 'SLEEP 8H', value: 80, color: colors.violet },
  { label: 'TRAIN 4×WK', value: 55, color: colors.cyan },
  { label: 'NO LATE CAFF', value: 90, color: colors.zoneMid },
];

const DEFAULT_TITLES: Record<CompositeChartVariant, string> = {
  treemap: 'WHERE THE WEEK WENT',
  'horizon-rows': '4 METRICS · 40 DAYS',
  'calendar-micro': 'MONTH OF DAYS',
  'goal-tree': 'GOAL → HABITS',
};

/* the catalog's 6-slot slice-and-dice template — [x, y, w, h] fractions,
 * ordered by slot area desc so the k-th largest item fills the k-th slot */
const TREE_SLOTS: [number, number, number, number][] = [
  [0, 0, 0.42, 0.62],
  [0.42, 0, 0.58, 0.44],
  [0.42, 0.44, 0.3, 0.56],
  [0, 0.62, 0.42, 0.38],
  [0.72, 0.44, 0.28, 0.3],
  [0.72, 0.74, 0.28, 0.26],
];

/** zone verdict for a treemap % share (catalog CM-01 thresholds) */
function shareZone(v: number): string {
  return v > 20 ? colors.zoneHigh : v > 10 ? colors.zoneMid : colors.zoneLow;
}

/** zone verdict for a 0–1 value (catalog `zoneOf`) */
function zoneOf(v: number): string {
  return v >= 0.62 ? colors.zoneHigh : v >= 0.38 ? colors.zoneMid : colors.zoneLow;
}

/** open arc — 0° at 12 o'clock, clockwise (catalog `arcPath`) */
function arcPath(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const pol = (aDeg: number) => {
    const a = ((aDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  };
  const p0 = pol(a0);
  const p1 = pol(a1);
  const lg = (a1 - a0) % 360 > 180 ? 1 : 0;
  return `M${p0.x.toFixed(1)} ${p0.y.toFixed(1)}A${r} ${r} 0 ${lg} 1 ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
}

/** Fritsch–Carlson monotone cubic — the catalog's `smoothPath` (no overshoot). */
function smoothPath(p: { x: number; y: number }[]): string {
  const n = p.length;
  if (n < 3) return p.map((q, i) => `${i ? 'L' : 'M'}${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join('');
  const dx: number[] = [];
  const m: number[] = [];
  const tg: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx[i] = p[i + 1]!.x - p[i]!.x;
    m[i] = (p[i + 1]!.y - p[i]!.y) / dx[i]!;
  }
  tg[0] = m[0]!;
  tg[n - 1] = m[n - 2]!;
  for (let i = 1; i < n - 1; i++) tg[i] = m[i - 1]! * m[i]! <= 0 ? 0 : (m[i - 1]! + m[i]!) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) {
      tg[i] = 0;
      tg[i + 1] = 0;
    } else {
      const a = tg[i]! / m[i]!;
      const b = tg[i + 1]! / m[i]!;
      const s = a * a + b * b;
      if (s > 9) {
        const tau = 3 / Math.sqrt(s);
        tg[i] = tau * a * m[i]!;
        tg[i + 1] = tau * b * m[i]!;
      }
    }
  }
  let d = `M${p[0]!.x.toFixed(1)} ${p[0]!.y.toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i]! / 3;
    d += `C${(p[i]!.x + h).toFixed(1)} ${(p[i]!.y + h * tg[i]!).toFixed(1)} ${(p[i + 1]!.x - h).toFixed(1)} ${(p[i + 1]!.y - h * tg[i + 1]!).toFixed(1)} ${p[i + 1]!.x.toFixed(1)} ${p[i + 1]!.y.toFixed(1)}`;
  }
  return d;
}

/** generic alternating slice-and-dice for non-6 tile counts (the catalog
 *  template only covers its 6-tile card) */
function sliceAndDice(
  items: CompositeTreemapItem[],
): { item: CompositeTreemapItem; x: number; y: number; w: number; h: number }[] {
  const out: { item: CompositeTreemapItem; x: number; y: number; w: number; h: number }[] = [];
  const sorted = [...items].sort((a, b) => b.value - a.value);
  let x = 0;
  let y = 0;
  let w = 1;
  let h = 1;
  let rest = sorted.reduce((s, it) => s + Math.max(0, it.value), 0) || 1;
  sorted.forEach((it, i) => {
    const f = i === sorted.length - 1 ? 1 : Math.max(0, it.value) / rest;
    rest -= Math.max(0, it.value);
    if (w >= h) {
      out.push({ item: it, x, y, w: w * f, h });
      x += w * f;
      w *= 1 - f;
    } else {
      out.push({ item: it, x, y, w, h: h * f });
      y += h * f;
      h *= 1 - f;
    }
  });
  return out;
}

function Label({
  x,
  y,
  text,
  color = colors.textFaint,
  anchor = 'middle',
  size = 8.5,
}: {
  x: number;
  y: number;
  text: string;
  color?: string;
  anchor?: 'start' | 'middle' | 'end';
  size?: number;
}) {
  return (
    <SvgText x={x} y={y} fill={color} fontSize={size} textAnchor={anchor} fontFamily={fonts.mono} letterSpacing={0.5}>
      {text}
    </SvgText>
  );
}

/** chip-pill label (dark rect + tinted hairline) — `y` = pill center */
function Tag({
  x,
  y,
  text,
  color,
  anchor = 'middle',
}: {
  x: number;
  y: number;
  text: string;
  color: string;
  anchor?: 'start' | 'middle' | 'end';
}) {
  const w = text.length * 5.35 + 12;
  let xa = anchor === 'end' ? x - w : anchor === 'start' ? x : x - w / 2;
  xa = Math.max(P.l - 4, Math.min(xa, W - P.r - w + 4));
  return (
    <G>
      <Rect
        x={xa.toFixed(1)}
        y={(y - 6.5).toFixed(1)}
        width={w.toFixed(1)}
        height={13}
        rx={6.5}
        fill="rgba(8,10,18,0.78)"
        stroke={color}
        strokeOpacity={0.35}
        strokeWidth={0.8}
      />
      <SvgText
        x={(xa + w / 2).toFixed(1)}
        y={(y + 2.8).toFixed(1)}
        fill={color}
        fontSize={8}
        textAnchor="middle"
        fontFamily={fonts.mono}
        letterSpacing={0.4}
      >
        {text}
      </SvgText>
    </G>
  );
}

/**
 * CompositeChart — the kit's density/structure composite (catalog family
 * `composite-charts`, CM-01/03/05/07): many numbers in one compact canvas.
 * Native twin of `@lockin90/ui` CompositeChart — same prop API + geometry;
 * `shine` glows are real Gaussian-blurred duplicate shapes.
 *
 * - `treemap` (CM-01, default) — nested rounded rects, 28% fills + tinted
 *   borders; SELECT `coloring`: `time` hues / `zone` verdicts.
 * - `horizon-rows` (CM-03) — folded 2-layer opacity bands; SELECT `mode`:
 *   `absolute` / `deviation` vs baseline.
 * - `calendar-micro` (CM-05) — month grid of zone-colored micro-charts;
 *   SELECT `cell`: `spark` / `bars`.
 * - `goal-tree` (CM-07) — root goal ring + child habit rings + connectors.
 */
export function CompositeChart({
  variant = 'treemap',
  items = DEFAULT_ITEMS,
  coloring = 'time',
  rows = DEFAULT_ROWS,
  mode = 'absolute',
  days,
  cell = 'spark',
  weekLabels = 'MTWTFSS',
  root = DEFAULT_ROOT,
  branches = DEFAULT_BRANCHES,
  legend,
  title,
  shine = false,
  width = W,
  height = H,
  style,
}: CompositeChartProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const blurId = `lk-cm-blur-${uid}`;
  const heading = title ?? DEFAULT_TITLES[variant];

  let accessibilityLabel: string;
  let content: ReactNode;

  if (variant === 'treemap') {
    /* ------------------------------------------------------ CM-01 treemap */
    const bx = P.l + 4;
    const by = P.t + 2;
    const bw = plotW - 8;
    const bh = plotH - 2;
    const sorted = [...items].sort((a, b) => b.value - a.value);
    const tiles =
      items.length === 6
        ? sorted.map((item, i) => {
            const [sx, sy, sw, sh] = TREE_SLOTS[i]!;
            return { item, x: sx, y: sy, w: sw, h: sh };
          })
        : sliceAndDice(items);
    accessibilityLabel = `${heading}: ${items.length} tiles`;
    content = (
      <>
        {tiles.map(({ item, x, y, w, h }, i) => {
          const col = coloring === 'zone' ? shareZone(item.value) : item.color ?? colors.mint;
          const rx2 = bx + x * bw + 1.5;
          const ry = by + y * bh + 1.5;
          const rw = w * bw - 3;
          const rh = h * bh - 3;
          return (
            <G key={i}>
              {/* hero-tile glow — a Gaussian-blurred duplicate behind the tile
                  (the web tile's `blur(6px)` underlay) */}
              {shine && item.value > 20 ? (
                <Rect
                  x={rx2.toFixed(1)}
                  y={ry.toFixed(1)}
                  width={rw.toFixed(1)}
                  height={rh.toFixed(1)}
                  rx={6}
                  fill={col}
                  opacity={0.5}
                  filter={`url(#${blurId})`}
                />
              ) : null}
              <Rect
                x={rx2.toFixed(1)}
                y={ry.toFixed(1)}
                width={rw.toFixed(1)}
                height={rh.toFixed(1)}
                rx={6}
                fill={col}
                opacity={0.28}
                stroke={col}
                strokeWidth={1.2}
                strokeOpacity={0.8}
              />
              {rw > 52 && rh > 24 ? (
                <G>
                  <Label x={rx2 + 7} y={ry + 13} text={item.label} color={col} anchor="start" />
                  <Label x={rx2 + 7} y={ry + 24} text={`${item.value}%`} color={colors.textDim} anchor="start" />
                </G>
              ) : rw > 34 ? (
                <Label x={rx2 + rw / 2} y={ry + rh / 2 + 3} text={item.label.slice(0, 4)} color={col} />
              ) : null}
            </G>
          );
        })}
      </>
    );
  } else if (variant === 'horizon-rows') {
    /* ------------------------------------------------- CM-03 horizon-rows */
    const rh = plotH / Math.max(1, rows.length);
    const legendText =
      legend ??
      (mode === 'deviation'
        ? 'FOLDED |DEVIATION| · DARKER = FURTHER FROM BASELINE'
        : `DARKER = HIGHER · ${rows[0]?.values.length ?? 0} DAYS`);
    accessibilityLabel = `${heading}: ${rows.length} horizon bands`;
    content = (
      <>
        {rows.map((rw, ri) => {
          const y0 = P.t + 4 + ri * rh;
          const bandH = rh - 8;
          const col = rw.color ?? colors.mint;
          const vals = rw.values;
          const layers = [0, 1].map((layer) => {
            let d = `M${P.l + 46} ${y0 + bandH}`;
            vals.forEach((v, i) => {
              const base = mode === 'deviation' ? Math.abs(v - 0.5) * 2 : v;
              const lv = Math.max(0, Math.min(0.5, base - layer * 0.5)) * 2;
              d += `L${(P.l + 46 + ((plotW - 52) * i) / Math.max(1, vals.length - 1)).toFixed(1)} ${(y0 + bandH - lv * bandH).toFixed(1)}`;
            });
            d += `L${W - P.r - 6} ${y0 + bandH}Z`;
            return d;
          });
          return (
            <G key={ri}>
              <Label x={P.l + 40} y={y0 + bandH / 2 + 3} text={rw.label} color={col} anchor="end" />
              {layers.map((d, li) => (
                <Path key={li} d={d} fill={col} opacity={0.22 + li * 0.35} />
              ))}
              <Line x1={P.l + 46} x2={W - P.r - 6} y1={y0 + bandH} y2={y0 + bandH} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
            </G>
          );
        })}
        {legendText ? <Label x={W - P.r - 6} y={H - 2} text={legendText} anchor="end" /> : null}
      </>
    );
  } else if (variant === 'calendar-micro') {
    /* ----------------------------------------------- CM-05 calendar-micro */
    const series =
      days ??
      Array.from({ length: 28 }, (_, i) =>
        cell === 'bars' ? genNoisy(i + 5, 6) : genWave(i + 5, 10),
      );
    const cols = 7;
    const rows2 = Math.max(1, Math.ceil(series.length / cols));
    const gap = 4;
    const cw = (plotW - 12 - gap * (cols - 1)) / cols;
    const ch = (plotH - 16 - gap * (rows2 - 1)) / rows2;
    accessibilityLabel = `${heading}: ${series.length} day micro-charts`;
    content = (
      <>
        {series.map((vals, i) => {
          const c2 = i % cols;
          const r2 = Math.floor(i / cols);
          const x = P.l + 6 + c2 * (cw + gap);
          const y = P.t + 10 + r2 * (ch + gap);
          return (
            <G key={i}>
              <Rect x={x.toFixed(1)} y={y.toFixed(1)} width={cw.toFixed(1)} height={ch.toFixed(1)} rx={5} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
              <SvgText x={x + 4} y={y + 9} fill="rgba(255,255,255,0.4)" fontSize={6.5} fontFamily={fonts.mono}>
                {String(i + 1)}
              </SvgText>
              {cell === 'bars'
                ? vals.map((v, bi) => (
                    <Rect
                      key={bi}
                      x={(x + 4 + (bi * (cw - 8)) / vals.length).toFixed(1)}
                      y={(y + ch - 4 - v * (ch - 16)).toFixed(1)}
                      width={(((cw - 8) / vals.length) * 0.6).toFixed(1)}
                      height={(v * (ch - 16)).toFixed(1)}
                      rx={1}
                      fill={zoneOf(v)}
                      opacity={0.85}
                    />
                  ))
                : vals.length > 1
                  ? (() => {
                      const pts = vals.map((v, pi) => ({
                        x: x + 4 + ((cw - 8) * pi) / (vals.length - 1),
                        y: y + ch - 5 - v * (ch - 16),
                      }));
                      return (
                        <Path
                          d={smoothPath(pts)}
                          fill="none"
                          stroke={zoneOf(vals[vals.length - 1]!)}
                          strokeWidth={1.4}
                          strokeLinecap="round"
                        />
                      );
                    })()
                  : null}
            </G>
          );
        })}
        {Array.from({ length: cols }, (_, d3) => (
          <Label key={d3} x={P.l + 6 + d3 * (cw + gap) + cw / 2} y={H - 1} text={weekLabels[d3] ?? ''} />
        ))}
      </>
    );
  } else {
    /* --------------------------------------------------- CM-07 goal-tree */
    const rootPos = { x: W / 2, y: 38 };
    const kidY = 92;
    const rootCol = root.color ?? colors.mint;
    const rootFrac = Math.max(0, Math.min(100, root.value)) / 100;
    accessibilityLabel = `${heading}: ${root.label}, ${branches.length} habits`;
    content = (
      <>
        {branches.map((_, i) => {
          const kx = branches.length === 1 ? W / 2 : 70 + (i * (W - 140)) / (branches.length - 1);
          return (
            <Path
              key={i}
              d={`M${rootPos.x} ${rootPos.y + 14}C${rootPos.x} 68 ${kx} 62 ${kx} ${kidY - 14}`}
              fill="none"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth={1.4}
            />
          );
        })}
        {/* root glow — a Gaussian-blurred duplicate circle (the web root's
            `blur(6px)` underlay) */}
        {shine ? (
          <Circle cx={rootPos.x} cy={rootPos.y} r={15} fill={rootCol} opacity={0.5} filter={`url(#${blurId})`} />
        ) : null}
        <Path d={arcPath(rootPos.x, rootPos.y, 14, 0, 359.99)} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={4.5} />
        <Path d={arcPath(rootPos.x, rootPos.y, 14, 0, rootFrac * 360)} fill="none" stroke={rootCol} strokeWidth={4.5} strokeLinecap="round" />
        <SvgText x={rootPos.x} y={rootPos.y + 4} fill={colors.text} fontSize={10} textAnchor="middle" fontWeight="700" fontFamily={fonts.display}>
          {String(Math.round(root.value))}
        </SvgText>
        {root.label ? <Tag x={rootPos.x} y={rootPos.y - 24} text={root.label} color={rootCol} /> : null}
        {branches.map((k, i) => {
          const kx = branches.length === 1 ? W / 2 : 70 + (i * (W - 140)) / (branches.length - 1);
          const kCol = k.color ?? colors.cyan;
          const kFrac = Math.max(0, Math.min(100, k.value)) / 100;
          return (
            <G key={i}>
              <Path d={arcPath(kx, kidY, 12, 0, 359.99)} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={4} />
              <Path d={arcPath(kx, kidY, 12, 0, kFrac * 360)} fill="none" stroke={kCol} strokeWidth={4} strokeLinecap="round" />
              <SvgText x={kx} y={kidY + 3.5} fill={colors.text} fontSize={8.5} textAnchor="middle" fontFamily={fonts.mono}>
                {String(Math.round(k.value))}
              </SvgText>
              <Tag x={kx} y={kidY + 24} text={k.label} color={kCol} />
            </G>
          );
        })}
      </>
    );
  }

  return (
    <View accessibilityRole="image" accessibilityLabel={accessibilityLabel} style={[{ width, height }, style]}>
      <Svg width={width} height={height} viewBox={`0 0 ${W} ${H}`}>
        {shine ? (
          /* real Gaussian blur for the glows (Fabric-native in react-native-svg
             15) — the native twin of the web `blur(6px)` underlays. Region in
             user space over the full canvas so flat tiles never clip the blur. */
          <Defs>
            <Filter id={blurId} filterUnits="userSpaceOnUse" x={-12} y={-12} width={W + 24} height={H + 24}>
              <FeGaussianBlur stdDeviation={3} />
            </Filter>
          </Defs>
        ) : null}
        <Label x={P.l + 2} y={11} text={heading} anchor="start" />
        {content}
      </Svg>
    </View>
  );
}
