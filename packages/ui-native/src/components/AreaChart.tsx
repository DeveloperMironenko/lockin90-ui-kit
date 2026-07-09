import { useId } from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Defs, FeGaussianBlur, Filter, G, Line, LinearGradient, Path, Rect, Stop, Text as SvgText } from 'react-native-svg';
import { colors, fonts } from '@lockin90/tokens';

/* AreaChart — the shared catalog stacked-area family (AR-01/03/04/05/06/07,
   lockin90-design/charts/area-charts.html): composition-over-time bands drawn
   in a fixed 320×150 viewBox — plain / percent / centered-stream stacks, the
   chip-labeled effect stack with a NOW rule, per-band fade gradients and
   three mini duo-stack multiples — with mono labels and a top-right dot
   legend. Native twin of `@lockin90/ui` AreaChart — same prop API; shine is a
   real Gaussian-blurred duplicate stroke (Fabric-native SVG filters in
   react-native-svg 15). (AR-02 does not exist —
   a numbering gap in the catalog.) */

export type AreaChartVariant =
  | 'stack' /* AR-01 — stacked areas + edge strokes + legend (SELECT 2–4 series) */
  | 'percent-stack' /* AR-03 — every column normalized to a full column (shares) */
  | 'stream-center' /* AR-04 — streamgraph, stack centered on the midline */
  | 'effect-stack' /* AR-05 — chip labels INSIDE the bands + NOW rule */
  | 'fade-stack' /* AR-06 — each band fades 55%→12% vertically */
  | 'mini-multiples'; /* AR-07 — 3 small duo-stacks side by side + day captions */

/** One stacked layer, bottom layer first. */
export interface AreaSeries {
  /** Series name — legend entry / `effect-stack` chip text (e.g. "SLEEP CREDIT"). */
  name: string;
  /** Raw positive values, one per time step (series should share a length). */
  data: number[];
  /** Color token override (e.g. `colors.lime`); defaults to mint→cyan→violet→lime. */
  color?: string;
}

/** One `mini-multiples` panel — a small duo-stack + its day caption (AR-07). */
export interface AreaMultiple {
  /** Caption centered under the panel (e.g. 'MON'). */
  caption: string;
  /** The panel's duo stack, bottom layer first (first two series are drawn). */
  series: AreaSeries[];
}

export interface AreaChartProps {
  /** Catalog variant (AR-01 / AR-03 / AR-04 / AR-05 / AR-06 / AR-07). */
  variant?: AreaChartVariant;
  /** Stacked layers, bottom first — 2–4 layers (the AR-01 SELECT); the first
   *  four are drawn. Ignored by `mini-multiples`. */
  series?: AreaSeries[];
  /** `mini-multiples` panels (AR-07) — the first three are drawn. */
  multiples?: AreaMultiple[];
  /** Top-left mono caption (e.g. 'ENERGY SOURCES · TODAY'). */
  title?: string;
  /** Data index → vertical NOW rule + caption above the plot (AR-05). */
  now?: number;
  /** NOW rule caption. */
  nowLabel?: string;
  /** Top-right dot legend (first word of each series name). Defaults on;
   *  `effect-stack` defaults off (chips carry the names); `mini-multiples`
   *  never draws one. */
  legend?: boolean;
  /** Mint glow along the stack's top edge (the catalog `cfg.shine`). */
  shine?: boolean;
  /** Interior gridlines + baseline (the catalog grid). */
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
/** the max column TOTAL occupies 94% of the plot height (catalog headroom) */
const HEADROOM = 0.94;
/** `percent-stack` normalizes EVERY column to 92% of the plot height */
const PERCENT_FILL = 0.92;
/** interior gridline rows, as fractions of the plot height */
const GRID_ROWS = [0.25, 0.5, 0.75] as const;

/* catalog trio (area-charts.html TRIO) + lime for a 4th layer */
const LAYER_COLORS = [colors.mint, colors.cyan, colors.violet, colors.lime] as const;
/* the mini-multiples duo fills, straight from the page's multiples branch */
const DUO_COLORS = [colors.mint, colors.violet] as const;

/* default demo trio — the catalog series names with a small pleasant wave,
   so `<AreaChart />` renders alone */
const DEFAULT_SERIES: AreaSeries[] = [
  {
    name: 'SLEEP CREDIT',
    data: [0.3, 0.34, 0.38, 0.4, 0.38, 0.34, 0.3, 0.27, 0.26, 0.28, 0.32, 0.36, 0.38, 0.37, 0.33, 0.3],
  },
  {
    name: 'FOOD',
    data: [0.18, 0.16, 0.15, 0.17, 0.22, 0.28, 0.32, 0.33, 0.3, 0.25, 0.2, 0.17, 0.16, 0.18, 0.22, 0.26],
  },
  {
    name: 'CAFFEINE',
    data: [0.1, 0.12, 0.16, 0.22, 0.26, 0.28, 0.26, 0.22, 0.18, 0.14, 0.12, 0.14, 0.18, 0.22, 0.24, 0.22],
  },
];

/* default AR-07 panels — three catalog-like duo stacks + day captions */
const DEFAULT_MULTIPLES: AreaMultiple[] = [
  {
    caption: 'MON',
    series: [
      { name: 'SLEEP CREDIT', data: [0.34, 0.38, 0.4, 0.37, 0.32, 0.3, 0.33, 0.36] },
      { name: 'FOOD', data: [0.16, 0.18, 0.22, 0.26, 0.24, 0.2, 0.18, 0.17] },
    ],
  },
  {
    caption: 'TUE',
    series: [
      { name: 'SLEEP CREDIT', data: [0.3, 0.28, 0.31, 0.36, 0.4, 0.38, 0.34, 0.31] },
      { name: 'FOOD', data: [0.22, 0.24, 0.22, 0.18, 0.16, 0.18, 0.22, 0.25] },
    ],
  },
  {
    caption: 'WED',
    series: [
      { name: 'SLEEP CREDIT', data: [0.38, 0.36, 0.32, 0.28, 0.3, 0.35, 0.39, 0.4] },
      { name: 'FOOD', data: [0.14, 0.17, 0.21, 0.25, 0.27, 0.24, 0.19, 0.15] },
    ],
  },
];

type Pt = [number, number];

/** Round for compact attribute values. */
const rd = (n: number) => Math.round(n * 100) / 100;

/** x position of data index `i` across `n` columns. */
const xAt = (i: number, n: number) => PAD.l + (i * PLOT_W) / (n - 1);
/** y position of a plot-height fraction `v` (0 = baseline, 1 = plot top). */
const yAt = (v: number) => PAD.t + (1 - v) * PLOT_H;

/** Straight polyline through the points. */
function linePath(pts: Pt[]): string {
  if (pts.length === 0) return '';
  return pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${rd(x)},${rd(y)}`).join(' ');
}

/** Fritsch–Carlson monotone cubic — the catalog's `smoothPath` (no overshoot).
 *  Faithful port; module-private copy (LineChart keeps its own — not exported). */
function monotonePath(pts: Pt[]): string {
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

/** Closed band: smooth (monotone) top edge + straight reversed bottom edge —
 *  the area page's `bandPath`. */
function bandPath(top: Pt[], bot: Pt[]): string {
  const back = bot
    .slice()
    .reverse()
    .map(([x, y]) => `L${rd(x)},${rd(y)}`)
    .join(' ');
  return `${monotonePath(top)} ${back} Z`;
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

/** Chip-pill series tag (the catalog `tag()`): dark bg-0 pill + tinted hairline
 *  + centered 8px mono text, x clamped inside the padded box. */
function Tag({ x, y, color, text }: { x: number; y: number; color: string; text: string }) {
  const wpx = text.length * 5.35 + 12;
  const xa = Math.max(PAD.l - 4, Math.min(x - wpx / 2, W - PAD.r - wpx + 4));
  return (
    <G>
      <Rect
        x={rd(xa)}
        y={rd(y - 6.5)}
        width={rd(wpx)}
        height={13}
        rx={6.5}
        fill={`${colors.bg0}C7`}
        stroke={color}
        strokeOpacity={0.35}
        strokeWidth={0.8}
      />
      <SvgText
        x={rd(xa + wpx / 2)}
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

interface Band {
  d: string;
  topPts: Pt[];
  color: string;
  name: string;
  tag: { x: number; y: number } | null;
}

interface Panel {
  caption: string;
  cx: number;
  paths: Array<{ d: string; color: string }>;
}

/**
 * AreaChart — stacked-area / stream chart for product surfaces (catalog family
 * AR-01…AR-07): composition over time — what the energy is made of. `stack`
 * (default) draws 2–4 cumulative bands with edge strokes and a dot legend;
 * `percent-stack` normalizes every column to a full column (shares, not
 * amounts); `stream-center` centers the stack on the midline (streamgraph);
 * `effect-stack` puts chip-pill series names INSIDE the bands and supports the
 * NOW rule; `fade-stack` fades each band vertically; `mini-multiples` draws
 * three small duo-stacks side by side with day captions. Values are raw
 * positive numbers — the max column total is normalized to 94% of the plot.
 */
export function AreaChart({
  variant = 'stack',
  series = DEFAULT_SERIES,
  multiples = DEFAULT_MULTIPLES,
  title,
  now,
  nowLabel = 'NOW',
  legend,
  shine = false,
  grid = true,
  ariaLabel = 'Stacked area chart',
  style,
}: AreaChartProps) {
  const uid = useId().replace(/[^a-zA-Z0-9-]/g, '');
  const isMultiples = variant === 'mini-multiples';
  const isPercent = variant === 'percent-stack';
  const isStream = variant === 'stream-center';
  const inlineLabels = variant === 'effect-stack';
  const fade = variant === 'fade-stack';

  /* ---- stacked variants: layers → plot-height fractions ---- */
  const layers = isMultiples ? [] : series.slice(0, 4);
  const n = layers.length > 0 ? Math.min(...layers.map((s) => s.data.length)) : 0;
  const colorOf = (li: number): string => layers[li].color ?? LAYER_COLORS[li % LAYER_COLORS.length];

  const frac: number[][] = [];
  if (n >= 2) {
    if (isPercent) {
      // AR-03 — every column fills PERCENT_FILL of the plot (shares, not amounts)
      const totals = Array.from({ length: n }, (_, i) =>
        layers.reduce((s, L) => s + Math.max(0, L.data[i]), 0),
      );
      for (const L of layers) {
        frac.push(
          L.data.slice(0, n).map((v, i) => (totals[i] > 0 ? (Math.max(0, v) / totals[i]) * PERCENT_FILL : 0)),
        );
      }
    } else {
      // normalize so the max column TOTAL occupies HEADROOM of the plot height
      let maxTot = 0;
      for (let i = 0; i < n; i++) {
        let s = 0;
        for (const L of layers) s += Math.max(0, L.data[i]);
        if (s > maxTot) maxTot = s;
      }
      const scale = maxTot > 0 ? HEADROOM / maxTot : 0;
      for (const L of layers) frac.push(L.data.slice(0, n).map((v) => Math.max(0, v) * scale));
    }
  }

  // AR-04 — per-column offset centers the stack on the midline
  const offset: number[] = new Array(n).fill(0);
  if (isStream) {
    for (let i = 0; i < n; i++) {
      let tot = 0;
      for (const f of frac) tot += f[i];
      offset[i] = (HEADROOM - tot) / 2;
    }
  }

  /* ---- cumulative bands, bottom layer first ---- */
  const ptsOf = (vals: number[]): Pt[] => vals.map((v, i) => [xAt(i, n), yAt(v)]);
  const bands: Band[] = [];
  let base = offset.slice();
  frac.forEach((f, li) => {
    const top = base.map((b, i) => b + f[i]);
    let tag: Band['tag'] = null;
    if (inlineLabels) {
      // chip anchored inside the band at the catalog's per-band index
      const mi = Math.min(n - 1, Math.floor(n * (0.25 + li * 0.22)));
      tag = { x: xAt(mi, n), y: yAt((top[mi] + base[mi]) / 2) };
    }
    bands.push({ d: bandPath(ptsOf(top), ptsOf(base)), topPts: ptsOf(top), color: colorOf(li), name: layers[li].name, tag });
    base = top;
  });

  /* ---- shine: the LAST band's smooth top edge ---- */
  const shineD = shine && bands.length > 0 ? monotonePath(bands[bands.length - 1].topPts) : null;

  /* ---- NOW rule (AR-05) ---- */
  const nowX = !isMultiples && now != null && n >= 2 ? xAt(Math.max(0, Math.min(n - 1, Math.round(now))), n) : null;

  /* ---- top-right dot legend, laid right-to-left (the page's legendTop) ---- */
  const showLegend = !isMultiples && (legend ?? !inlineLabels) && bands.length > 0;
  const legendItems: Array<{ text: string; color: string; tx: number; cx: number }> = [];
  if (showLegend) {
    let lx = W - PAD.r - 2;
    for (const b of bands.slice().reverse()) {
      const text = b.name.split(' ')[0];
      const tx = lx;
      lx -= text.length * 5.6 + 8;
      legendItems.push({ text, color: b.color, tx, cx: lx });
      lx -= 8;
    }
  }

  /* ---- AR-07 mini duo-stack panels, on a SHARED scale across the days ---- */
  const panels: Panel[] = [];
  if (isMultiples) {
    const trio = multiples.slice(0, 3);
    let maxTot = 0;
    for (const m of trio) {
      const duo = m.series.slice(0, 2);
      const nm = duo.length > 0 ? Math.min(...duo.map((s) => s.data.length)) : 0;
      for (let i = 0; i < nm; i++) {
        let s = 0;
        for (const sr of duo) s += Math.max(0, sr.data[i]);
        if (s > maxTot) maxTot = s;
      }
    }
    const scale = maxTot > 0 ? HEADROOM / maxTot : 0;
    trio.forEach((m, mi) => {
      const ox = PAD.l + mi * (PLOT_W / 3 + 2);
      const ow = PLOT_W / 3 - 10;
      const duo = m.series.slice(0, 2);
      const nm = duo.length > 0 ? Math.min(...duo.map((s) => s.data.length)) : 0;
      const paths: Panel['paths'] = [];
      if (nm >= 2) {
        const mPts = (vals: number[]): Pt[] =>
          vals.map((v, i) => [ox + (i * ow) / (nm - 1), H - PAD.b - v * (PLOT_H - 20)]);
        let mBase: number[] = new Array(nm).fill(0);
        duo.forEach((sr, li) => {
          const top = mBase.map((b, i) => b + Math.max(0, sr.data[i]) * scale);
          paths.push({ d: bandPath(mPts(top), mPts(mBase)), color: sr.color ?? DUO_COLORS[li] });
          mBase = top;
        });
      }
      panels.push({ caption: m.caption, cx: ox + ow / 2, paths });
    });
  }

  return (
    <View accessibilityRole="image" accessibilityLabel={ariaLabel} style={[styles.root, style]}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
        {fade && bands.length > 0 ? (
          <Defs>
            {bands.map((band, bi) => (
              <LinearGradient key={bi} id={`lk-area-fade-${uid}-${bi}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor={band.color} stopOpacity={0.55} />
                <Stop offset="100%" stopColor={band.color} stopOpacity={0.12} />
              </LinearGradient>
            ))}
          </Defs>
        ) : null}

        {/* catalog grid: 3 interior rows + solid baseline */}
        {grid ? (
          <G>
            {GRID_ROWS.map((f) => (
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
        ) : null}

        {title ? (
          <Label x={PAD.l + 2} y={11} fill={colors.textFaint} anchor="start">
            {title}
          </Label>
        ) : null}

        {isMultiples
          ? /* ---- AR-07 · three mini duo-stacks + day captions ---- */
            panels.map((p, mi) => (
              <G key={mi}>
                {p.paths.map((lay, li) => (
                  <Path key={li} d={lay.d} fill={lay.color} opacity={0.45} />
                ))}
                <Label x={p.cx} y={H - 2} fill={colors.textFaint}>
                  {p.caption}
                </Label>
              </G>
            ))
          : /* ---- AR-01/03/04/05/06 · cumulative bands, bottom first ---- */
            bands.map((band, bi) => (
              <G key={bi}>
                <Path
                  d={band.d}
                  fill={fade ? `url(#lk-area-fade-${uid}-${bi})` : band.color}
                  opacity={fade ? 1 : 0.5}
                  stroke={band.color}
                  strokeWidth={1}
                  strokeOpacity={0.5}
                />
                {band.tag ? <Tag x={band.tag.x} y={band.tag.y} color={band.color} text={band.name} /> : null}
              </G>
            ))}

        {/* shine — a Gaussian-blurred mint duplicate under a crisp mint edge
            line: the native twin of the web `.lk-area-shine` blur(5px) underlay */}
        {shineD ? (
          <>
            <Defs>
              {/* region in user space over the full canvas so the flat edge
                  never clips the blur to its bounding box */}
              <Filter
                id={`lk-area-blur-${uid}`}
                filterUnits="userSpaceOnUse"
                x={-10}
                y={-10}
                width={W + 20}
                height={H + 20}
              >
                <FeGaussianBlur stdDeviation={2.5} />
              </Filter>
            </Defs>
            <Path
              d={shineD}
              fill="none"
              stroke={colors.mint}
              strokeWidth={7.5}
              strokeLinecap="round"
              strokeOpacity={0.45}
              filter={`url(#lk-area-blur-${uid})`}
            />
            <Path d={shineD} fill="none" stroke={colors.mint} strokeWidth={2.2} strokeLinecap="round" />
          </>
        ) : null}

        {/* NOW rule + caption above the plot (AR-05) */}
        {nowX != null ? (
          <>
            <Line
              x1={rd(nowX)}
              x2={rd(nowX)}
              y1={PAD.t - 2}
              y2={H - PAD.b}
              stroke={colors.text}
              strokeOpacity={0.25}
              strokeWidth={1}
            />
            <Label x={nowX} y={PAD.t - 5} fill={colors.textDim}>
              {nowLabel}
            </Label>
          </>
        ) : null}

        {legendItems.map((it, i) => (
          <G key={i}>
            <Label x={it.tx} y={11} fill={colors.textDim} anchor="end">
              {it.text}
            </Label>
            <Circle cx={rd(it.cx)} cy={8.2} r={3} fill={it.color} />
          </G>
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  /* fixed catalog aspect (320×150); the Svg scales the viewBox to fit */
  root: { width: '100%', aspectRatio: W / H },
});
