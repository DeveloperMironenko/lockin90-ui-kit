import { useId } from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Defs, G, Line, LinearGradient, Path, Rect, Stop, Text as SvgText } from 'react-native-svg';
import { colors, fonts } from '@lockin90/tokens';

/* DistributionChart — the shared catalog distribution family (DS-01/02/03/04/
   05/07, lockin90-design/charts/distribution-charts.html): histogram bins,
   percentile bells, cohort overlays, box-whisker rows, a KDE violin and a
   ridgeline drawn in a fixed 320×150 viewBox with mono labels + chip pills.
   Native twin of `@lockin90/ui` DistributionChart — same prop API; shine is a
   wider faint duplicate stroke and the YOU pulse is a static dot + halo ring
   (never SVG filters / SMIL on native). The page's dead `candles` renderer
   has no CFG card (no DS-06) — unported. */

export type DistributionChartVariant =
  | 'histogram' /* DS-01 — binned bars, opacity scales with count */
  | 'bell-percentile' /* DS-02 — bell + veil fill + mint YOU rule + pill */
  | 'cohort-bells' /* DS-03 — your curve vs dashed cohort curve + pills */
  | 'box-rows' /* DS-04 — horizontal box-whisker rows */
  | 'violin' /* DS-05 — symmetric KDE violin + MEDIAN rule + pill */
  | 'ridgeline'; /* DS-07 — stacked week-curves, opacity ramps to newest */

/** Parametric bell. `mu`/`sigma` are in normalized x units (0–1 across the
 *  plot); `amp` = peak height as a fraction of the plot height (default 0.85). */
export interface DistributionBell {
  mu: number;
  sigma: number;
  amp?: number;
}

/** One box-whisker row (DS-04). All five stats are on a 0–1 scale. */
export interface BoxRow {
  name: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  /** Row color token override (e.g. `colors.violet`); defaults cycle the
   *  catalog palette mint → cyan → violet → zone-mid. */
  color?: string;
}

/** One ridgeline row (DS-07), oldest first. Give raw `values` (KDE-shaped) or
 *  a parametric `bell`; the peak is normalized, so `amp` is ignored here. */
export interface RidgeRow {
  label: string;
  values?: number[];
  bell?: DistributionBell;
}

export interface DistributionChartProps {
  /** Catalog variant (DS-01 / DS-02 / DS-03 / DS-04 / DS-05 / DS-07). */
  variant?: DistributionChartVariant;
  /** Raw samples — `histogram` bins them; `bell-percentile`/`cohort-bells`
   *  derive the YOUR bell (mean/std) and `violin` derives its KDE shape from
   *  them when no explicit `bell` is given. */
  values?: number[];
  /** Histogram bin count. */
  bins?: number;
  /** Sample domain `[lo, hi]`. Defaults to the data min…max (the bare default
   *  sample uses the catalog's 40…100 energy domain). */
  xRange?: [number, number];
  /** Histogram x-end captions; defaults to the rounded `xRange` ends. */
  axisLabels?: [string, string];
  /** Parametric YOUR curve (`bell-percentile` / `cohort-bells`); when omitted
   *  it is derived from `values` (mu = mean, sigma = std, normalized into
   *  `xRange`), else falls back to the catalog card's bell. */
  bell?: DistributionBell;
  /** Cohort reference curve for `cohort-bells` (dashed). */
  cohortBell?: DistributionBell;
  /** `bell-percentile` YOU-rule x position, 0–1 across the plot. */
  percentile?: number;
  /** YOU pill text — default `'YOU · P82'` (`bell-percentile`) /
   *  `'YOU · SHIFTED RIGHT'` (`cohort-bells`). */
  youLabel?: string;
  /** Cohort pill text (`cohort-bells`). */
  cohortLabel?: string;
  /** Bottom-center faint caption (`bell-percentile`, e.g.
   *  `'HRV DISTRIBUTION · YOUR 90 DAYS'`). */
  caption?: string;
  /** Box-whisker rows (`box-rows`). */
  rows?: BoxRow[];
  /** Ridgeline rows, oldest first (`ridgeline`). */
  ridge?: RidgeRow[];
  /** `violin` MEDIAN pill — default `'MEDIAN {median(values) rounded}'`. */
  medianLabel?: string;
  /** `ridgeline` top-right pill. */
  driftLabel?: string;
  /** Main hue override (defaults: histogram `colors.mint` · bell `colors.cyan`
   *  · cohort-bells YOU `colors.violet` · violin `colors.violet`→`colors.cyan`
   *  gradient · ridgeline `colors.mint`). */
  color?: string;
  /** Top-left mono caption (e.g. 'ENERGY SCORES · 90 DAYS'). */
  title?: string;
  /** Catalog glow modifier — wider faint duplicate stroke behind the bell
   *  line + a static mint dot/halo on the YOU rule (`bell-percentile`). */
  shine?: boolean;
  /** Faint catalog grid (histogram / bell / cohort / violin only). */
  grid?: boolean;
  /** Accessible description of the chart. */
  ariaLabel?: string;
  /** Optional container style. */
  style?: StyleProp<ViewStyle>;
}

/* ---- catalog geometry (viewBox units — charts/catalog.js) ---- */
const W = 320;
const H = 150;
const PAD = { l: 10, r: 12, t: 16, b: 14 };
const PLOT_W = W - PAD.l - PAD.r; // 298
const PLOT_H = H - PAD.t - PAD.b; // 120

/* DS-04 fallback row palette (catalog rows), cycles for longer lists */
const BOX_COLORS = [colors.mint, colors.cyan, colors.violet, colors.zoneMid] as const;

/* chip-pill fill — the catalog's bg-0 at 78% (web color-mix equivalent) */
const TAG_FILL = `${colors.bg0}C7`;

/** Round for compact attribute values. */
const rd = (n: number) => Math.round(n * 100) / 100;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const mean = (v: number[]) => v.reduce((a, b) => a + b, 0) / v.length;
const std = (v: number[]) => {
  const m = mean(v);
  return Math.sqrt(v.reduce((a, b) => a + (b - m) * (b - m), 0) / v.length);
};
const median = (v: number[]) => {
  const s = [...v].sort((a, b) => a - b);
  const mid = s.length >> 1;
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
};

/** mulberry32 PRNG — the catalog's deterministic seed (charts/catalog.js). */
function mulberry32(a: number): () => number {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** DS-01 default sample — the page's 200 avg-of-4 draws (seed 11) scaled into
 *  the card's 40–100 energy domain. */
const DEFAULT_VALUES = (() => {
  const r = mulberry32(11);
  return Array.from({ length: 200 }, () => 40 + ((r() + r() + r() + r()) / 4) * 60);
})();

/** DS-05 default sample — deterministic bimodal mix (main mode ~67 + secondary
 *  ~85 in the 40–100 domain ≈ the catalog's 0.45 / 0.75 peaks). */
const DEFAULT_VIOLIN_VALUES = (() => {
  const r = mulberry32(21);
  return Array.from({ length: 140 }, () => {
    const second = r() < 0.28;
    const g = (r() + r() + r() - 1.5) * (second ? 0.09 : 0.16);
    return 40 + Math.max(0.02, Math.min(0.98, (second ? 0.75 : 0.45) + g)) * 60;
  });
})();

/* DS-04 default rows — the catalog card's four metric ranges */
const DEFAULT_BOX_ROWS: BoxRow[] = [
  { name: 'ENERGY', min: 0.3, q1: 0.45, median: 0.58, q3: 0.7, max: 0.88, color: colors.mint },
  { name: 'HRV', min: 0.2, q1: 0.38, median: 0.5, q3: 0.62, max: 0.8, color: colors.cyan },
  { name: 'SLEEP', min: 0.35, q1: 0.5, median: 0.62, q3: 0.72, max: 0.85, color: colors.violet },
  { name: 'STRAIN', min: 0.1, q1: 0.3, median: 0.42, q3: 0.58, max: 0.9, color: colors.zoneMid },
];

/* DS-07 default rows — the catalog's four drifting week-gaussians */
const DEFAULT_RIDGE: RidgeRow[] = [
  { label: 'W1', bell: { mu: 0.4, sigma: 0.16 } },
  { label: 'W2', bell: { mu: 0.47, sigma: 0.16 } },
  { label: 'W3', bell: { mu: 0.54, sigma: 0.16 } },
  { label: 'W4', bell: { mu: 0.61, sigma: 0.16 } },
];

/** Straight polyline through the points. */
function linePath(pts: Array<[number, number]>): string {
  if (pts.length === 0) return '';
  return pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${rd(x)},${rd(y)}`).join(' ');
}

/** Fritsch–Carlson monotone cubic — the catalog's `smoothPath` (no overshoot).
 *  Copied from the web LineChart (module-private there); faithful port. */
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
  let d = `M${rd(pts[0][0])},${rd(pts[0][1])}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += ` C${rd(pts[i][0] + h)},${rd(pts[i][1] + h * tg[i])} ${rd(pts[i + 1][0] - h)},${rd(
      pts[i + 1][1] - h * tg[i + 1],
    )} ${rd(pts[i + 1][0])},${rd(pts[i + 1][1])}`;
  }
  return d;
}

/** Catalog bell points: y(t) = (H−P.b) − amp·plotH·exp(−((t−mu)/sigma)²),
 *  sampled `n` times across the plot. */
function bellPts(mu: number, sigma: number, amp: number, n = 40): Array<[number, number]> {
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    pts.push([PAD.l + PLOT_W * t, H - PAD.b - amp * PLOT_H * Math.exp(-(((t - mu) / sigma) ** 2))]);
  }
  return pts;
}

/** Gaussian KDE over normalized 0–1 positions (Silverman bandwidth
 *  1.06·σ·n^−0.2), evaluated at `nSamples` even t's, peak-normalized to 1. */
function kdeProfile(ts: number[], nSamples: number): number[] {
  const n = ts.length;
  if (n === 0) return new Array<number>(nSamples).fill(0);
  const m = mean(ts);
  const sd = Math.sqrt(ts.reduce((a, b) => a + (b - m) * (b - m), 0) / n);
  const h = Math.max(0.02, 1.06 * (sd || 0.1) * Math.pow(n, -0.2));
  const out: number[] = [];
  let peak = 0;
  for (let i = 0; i < nSamples; i++) {
    const t = i / (nSamples - 1);
    let dens = 0;
    for (const ti of ts) {
      const u = (t - ti) / h;
      dens += Math.exp(-0.5 * u * u);
    }
    out.push(dens);
    if (dens > peak) peak = dens;
  }
  return peak > 0 ? out.map((d) => d / peak) : out;
}

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

/** Chip-pill label (the catalog `tag()`): dark rounded rect + tinted hairline
 *  + centered 8px mono text; clamped inside the padded box. `y` = pill center. */
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
  xa = Math.max(PAD.l - 4, Math.min(xa, W - PAD.r - w + 4));
  return (
    <G>
      <Rect
        x={rd(xa)}
        y={rd(y - 6.5)}
        width={rd(w)}
        height={13}
        rx={6.5}
        fill={TAG_FILL}
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
        {text}
      </SvgText>
    </G>
  );
}

/** The catalog grid: 3 interior hairlines at 25/50/75% + a stronger baseline. */
function GridLines() {
  return (
    <G>
      {[0.25, 0.5, 0.75].map((f) => (
        <Line
          key={f}
          x1={PAD.l}
          x2={W - PAD.r}
          y1={rd(PAD.t + PLOT_H * f)}
          y2={rd(PAD.t + PLOT_H * f)}
          stroke={colors.border}
          strokeOpacity={0.55}
          strokeWidth={1}
        />
      ))}
      <Line x1={PAD.l} x2={W - PAD.r} y1={H - PAD.b} y2={H - PAD.b} stroke={colors.border} strokeWidth={1} />
    </G>
  );
}

/**
 * DistributionChart — where you sit in the spread (catalog family
 * DS-01…DS-07). `histogram` bins raw samples into opacity-ramped bars;
 * `bell-percentile` draws THE percentile chart (bell + veil fill + mint YOU
 * rule + pill); `cohort-bells` overlays your curve on a dashed cohort curve;
 * `box-rows` stacks horizontal box-whisker rows; `violin` shapes a symmetric
 * KDE violin (two-peak days visible); `ridgeline` stacks drifting week-curves.
 * Curves can be parametric (`bell` / `ridge[].bell`) or derived from raw
 * `values` normalized into `xRange`.
 */
export function DistributionChart({
  variant = 'histogram',
  values,
  bins = 14,
  xRange,
  axisLabels,
  bell,
  cohortBell,
  percentile = 0.72,
  youLabel,
  cohortLabel = 'COHORT',
  caption,
  rows,
  ridge,
  medianLabel,
  driftLabel = 'PEAK SHIFTING RIGHT',
  color,
  title,
  shine = false,
  grid = true,
  ariaLabel = 'Distribution chart',
  style,
}: DistributionChartProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');

  /* sample + domain: explicit values > per-variant catalog default sample;
     xRange > data min…max > the default sample's 40…100 energy domain */
  const sample = values ?? (variant === 'violin' ? DEFAULT_VIOLIN_VALUES : DEFAULT_VALUES);
  const range: [number, number] = (() => {
    if (xRange) return xRange;
    if (values && values.length) return [Math.min(...values), Math.max(...values)];
    if (variant === 'ridgeline' && ridge) {
      const all = ridge.flatMap((row) => row.values ?? []);
      if (all.length) return [Math.min(...all), Math.max(...all)];
    }
    return [40, 100];
  })();
  const [lo, hi] = range;
  const span = hi - lo || 1;
  const norm = (v: number) => (v - lo) / span;

  /* main hue per variant (catalog); violin keeps its violet→cyan gradient
     unless `color` overrides it into a solid tint */
  const col =
    color ??
    (variant === 'bell-percentile'
      ? colors.cyan
      : variant === 'cohort-bells' || variant === 'violin'
        ? colors.violet
        : colors.mint);

  /* YOUR bell: explicit prop > derived from values (mean/std) > catalog card */
  const resolveBell = (fallback: DistributionBell): Required<DistributionBell> => {
    const b =
      bell ??
      (values && values.length
        ? { mu: norm(mean(values)), sigma: Math.max(std(values) / span, 0.04) }
        : fallback);
    return { mu: b.mu, sigma: b.sigma, amp: b.amp ?? 0.85 };
  };

  const you = youLabel ?? (variant === 'cohort-bells' ? 'YOU · SHIFTED RIGHT' : 'YOU · P82');
  const showGrid =
    grid &&
    (variant === 'histogram' ||
      variant === 'bell-percentile' ||
      variant === 'cohort-bells' ||
      variant === 'violin');

  const body = () => {
    /* ---- DS-01 · histogram ---- */
    if (variant === 'histogram') {
      const counts = new Array<number>(Math.max(1, Math.round(bins))).fill(0);
      for (const v of sample) {
        const bi = Math.max(0, Math.min(counts.length - 1, Math.floor(norm(v) * counts.length)));
        counts[bi]++;
      }
      const mb = Math.max(1, ...counts);
      const step = PLOT_W / counts.length;
      const [a0, a1] = axisLabels ?? [String(Math.round(lo)), String(Math.round(hi))];
      return (
        <G>
          {counts.map((b, bi) => {
            if (b <= 0) return null;
            const hpx = (b / mb) * (PLOT_H - 8);
            return (
              <Rect
                key={bi}
                x={rd(PAD.l + bi * step + 2)}
                y={rd(H - PAD.b - hpx)}
                width={rd(step - 4)}
                height={rd(hpx)}
                rx={3}
                fill={col}
                opacity={rd(0.35 + 0.6 * (b / mb))}
              />
            );
          })}
          <Label x={PAD.l + 2} y={H - 2} fill={colors.textFaint} anchor="start">
            {a0}
          </Label>
          <Label x={W - PAD.r - 2} y={H - 2} fill={colors.textFaint} anchor="end">
            {a1}
          </Label>
        </G>
      );
    }

    /* ---- DS-02 · bell + your percentile ---- */
    if (variant === 'bell-percentile') {
      const b = resolveBell({ mu: 0.5, sigma: 0.2 });
      const d = monotonePath(bellPts(b.mu, b.sigma, b.amp));
      const px = rd(PAD.l + PLOT_W * clamp01(percentile));
      const gradId = `lk-dst-${uid}-veil`;
      return (
        <G>
          <Defs>
            <LinearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={col} stopOpacity={0.22} />
              <Stop offset="100%" stopColor={col} stopOpacity={0.02} />
            </LinearGradient>
          </Defs>
          {/* veil — the area under the curve, closed to the baseline */}
          <Path d={`${d}L${W - PAD.r} ${H - PAD.b}L${PAD.l} ${H - PAD.b}Z`} fill={`url(#${gradId})`} />
          {/* shine — wider faint duplicate stroke behind (never SVG filters) */}
          {shine ? (
            <Path
              d={d}
              fill="none"
              stroke={col}
              strokeWidth={7.5}
              strokeLinecap="round"
              strokeOpacity={0.45}
            />
          ) : null}
          <Path d={d} fill="none" stroke={col} strokeWidth={2.5} strokeLinecap="round" />
          <Line x1={px} x2={px} y1={PAD.t + 6} y2={H - PAD.b} stroke={colors.mint} strokeWidth={1.6} />
          {/* pulse marker — static dot + faint halo ring (no animation on
              native; the web pulse tween is a documented substrate diff) */}
          {shine ? (
            <>
              <Circle
                cx={px}
                cy={PAD.t + 30}
                r={7}
                fill="none"
                stroke={colors.mint}
                strokeWidth={1.4}
                strokeOpacity={0.4}
              />
              <Circle cx={px} cy={PAD.t + 30} r={3.6} fill={colors.mint} />
            </>
          ) : null}
          <Tag x={px} y={PAD.t + 12} text={you} color={colors.mint} />
          {caption ? (
            <Label x={W / 2} y={H - 2} fill={colors.textFaint}>
              {caption}
            </Label>
          ) : null}
        </G>
      );
    }

    /* ---- DS-03 · you vs cohort overlay ---- */
    if (variant === 'cohort-bells') {
      const cb = cohortBell ?? { mu: 0.42, sigma: 0.22, amp: 0.7 };
      const yb = resolveBell({ mu: 0.6, sigma: 0.16 });
      const d1 = monotonePath(bellPts(cb.mu, cb.sigma, cb.amp ?? 0.85));
      const d2 = monotonePath(bellPts(yb.mu, yb.sigma, yb.amp));
      return (
        <G>
          <Path
            d={d1}
            fill="none"
            stroke={colors.text}
            strokeOpacity={0.35}
            strokeWidth={1.8}
            strokeDasharray="5 4"
          />
          {shine ? (
            <Path
              d={d2}
              fill="none"
              stroke={col}
              strokeWidth={7.5}
              strokeLinecap="round"
              strokeOpacity={0.45}
            />
          ) : null}
          <Path d={d2} fill="none" stroke={col} strokeWidth={2.5} strokeLinecap="round" />
          <Tag x={PAD.l + PLOT_W * 0.32} y={PAD.t + 22} text={cohortLabel} color={colors.textDim} />
          <Tag x={PAD.l + PLOT_W * 0.68} y={PAD.t + 12} text={you} color={col} />
        </G>
      );
    }

    /* ---- DS-04 · box-whisker rows ---- */
    if (variant === 'box-rows') {
      const rws = rows ?? DEFAULT_BOX_ROWS;
      const rh = PLOT_H / Math.max(1, rws.length);
      const xh = (f: number) => PAD.l + 46 + (PLOT_W - 52) * f;
      return (
        <G>
          {rws.map((rw, ri) => {
            const y = PAD.t + 8 + ri * rh;
            const c = rw.color ?? BOX_COLORS[ri % BOX_COLORS.length];
            return (
              <G key={ri}>
                <Label x={PAD.l + 42} y={y + 4} fill={c} anchor="end">
                  {rw.name}
                </Label>
                <Line
                  x1={rd(xh(rw.min))}
                  x2={rd(xh(rw.max))}
                  y1={rd(y)}
                  y2={rd(y)}
                  stroke={colors.text}
                  strokeOpacity={0.25}
                  strokeWidth={1.2}
                />
                {[rw.min, rw.max].map((f, i) => (
                  <Line
                    key={i}
                    x1={rd(xh(f))}
                    x2={rd(xh(f))}
                    y1={rd(y - 4)}
                    y2={rd(y + 4)}
                    stroke={colors.text}
                    strokeOpacity={0.35}
                    strokeWidth={1.2}
                  />
                ))}
                <Rect
                  x={rd(xh(rw.q1))}
                  y={rd(y - 7)}
                  width={rd(xh(rw.q3) - xh(rw.q1))}
                  height={14}
                  rx={4}
                  fill={c}
                  opacity={0.3}
                  stroke={c}
                  strokeWidth={1.2}
                />
                <Line
                  x1={rd(xh(rw.median))}
                  x2={rd(xh(rw.median))}
                  y1={rd(y - 7)}
                  y2={rd(y + 7)}
                  stroke={c}
                  strokeWidth={2}
                />
              </G>
            );
          })}
        </G>
      );
    }

    /* ---- DS-05 · violin ---- */
    if (variant === 'violin') {
      const prof = kdeProfile(sample.map(norm), 41);
      const cy = PAD.t + PLOT_H / 2;
      const maxHalf = PLOT_H / 2 - 8; // 52
      const vx = (t: number) => PAD.l + 8 + (PLOT_W - 16) * t;
      const pts = prof.map((dens, i) => ({ x: vx(i / 40), w: dens * maxHalf }));
      const top = pts.map((p, i) => `${i ? 'L' : 'M'}${rd(p.x)} ${rd(cy - p.w)}`).join('');
      const bot = [...pts]
        .reverse()
        .map((p) => `L${rd(p.x)} ${rd(cy + p.w)}`)
        .join('');
      const med = sample.length ? median(sample) : (lo + hi) / 2;
      const mx = rd(vx(clamp01(norm(med))));
      const gradId = `lk-dst-${uid}-vio`;
      const stops: [string, string] = color ? [color, color] : [colors.violet, colors.cyan];
      return (
        <G>
          <Defs>
            <LinearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0%" stopColor={stops[0]} stopOpacity={0.35} />
              <Stop offset="100%" stopColor={stops[1]} stopOpacity={0.35} />
            </LinearGradient>
          </Defs>
          <Path d={`${top}${bot}Z`} fill={`url(#${gradId})`} stroke={col} strokeWidth={1.4} />
          <Line x1={mx} x2={mx} y1={rd(cy - 26)} y2={rd(cy + 26)} stroke={colors.text} strokeWidth={1.6} />
          <Tag x={mx} y={cy - 36} text={medianLabel ?? `MEDIAN ${Math.round(med)}`} color={colors.textDim} />
        </G>
      );
    }

    /* ---- DS-07 · ridgeline ---- */
    const rws = ridge ?? DEFAULT_RIDGE;
    const rx0 = PAD.l + 30;
    const rx1 = PAD.l + PLOT_W - 6;
    return (
      <G>
        <Defs>
          {rws.map((_, ri) => (
            <LinearGradient key={ri} id={`lk-dst-${uid}-r${ri}`} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={col} stopOpacity={0.02} />
              <Stop offset="100%" stopColor={col} stopOpacity={0.2} />
            </LinearGradient>
          ))}
        </Defs>
        {rws.map((row, ri) => {
          const base = PAD.t + 26 + ri * 28;
          const prof =
            row.values && row.values.length
              ? kdeProfile(row.values.map(norm), 37)
              : (() => {
                  const b = row.bell ?? { mu: 0.5, sigma: 0.16 };
                  return Array.from({ length: 37 }, (_, i) =>
                    Math.exp(-(((i / 36 - b.mu) / b.sigma) ** 2)),
                  );
                })();
          const pts: Array<[number, number]> = prof.map((dens, i) => [
            rx0 + ((PLOT_W - 36) * i) / 36,
            base - 30 * dens,
          ]);
          const d = monotonePath(pts);
          return (
            <G key={ri}>
              <Path d={`${d}L${rx1} ${base}L${rx0} ${base}Z`} fill={`url(#lk-dst-${uid}-r${ri})`} />
              <Path d={d} fill="none" stroke={col} strokeWidth={1.5} opacity={rd(0.5 + ri * 0.16)} />
              <Label x={PAD.l + 24} y={base - 2} fill={colors.textFaint} anchor="end">
                {row.label}
              </Label>
            </G>
          );
        })}
        {driftLabel ? <Tag x={W - PAD.r - 4} y={PAD.t + 14} text={driftLabel} color={col} anchor="end" /> : null}
      </G>
    );
  };

  return (
    <View accessibilityRole="image" accessibilityLabel={ariaLabel} style={[styles.root, style]}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
        {showGrid ? <GridLines /> : null}
        {title ? (
          <Label x={PAD.l + 2} y={11} fill={colors.textFaint} anchor="start">
            {title}
          </Label>
        ) : null}
        {body()}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  /* fixed catalog aspect (320×150); the Svg scales the viewBox to fit */
  root: { width: '100%', aspectRatio: W / H },
});
