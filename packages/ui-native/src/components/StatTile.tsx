import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import { colors, fonts } from '@lockin90/tokens';

/* StatTile — the catalog stat-tile (chartlet) family (ST-01/06/07/10,
   lockin90-design/charts/stat-tiles.html): KPI chartlets — big number + delta
   + micro-chart, drawn in the fixed 320×150 catalog viewBox. Native twin of
   `@lockin90/ui` StatTile — same prop API + geometry; the hero `shine` blur
   and the verdict-dot drop-shadow are wider faint duplicate shapes here
   (never SVG filters), like `Ring`. */

/** Catalog variant names (`lockin90-design/charts/stat-tiles.html`). */
export type StatTileVariant =
  | 'stat-tile' /* ST-01 — big number + delta · SELECT accessory */
  | 'hero-number' /* ST-06 — centered 52px number + delta + insight line */
  | 'duo-tile' /* ST-07 — two stats split by a hairline */
  | 'stat-list'; /* ST-10 — 3 rows: label + bold value + mini-spark */

/** ST-01 SELECT accessory — the micro-chart next to the number. */
export type StatTileAccessory = 'none' | 'spark' | 'bars' | 'ring' | 'progress';

/** One half of the `duo-tile` (ST-07). */
export interface StatTileStat {
  /** bold 26px value (e.g. '7:42') */
  value: string;
  /** faint label under the value (e.g. 'SLEEP') */
  label: string;
  /** delta line under the label (e.g. '+22 MIN'; omit to hide) */
  delta?: string;
  /** delta direction — up = mint chevron, down = coral (default true) */
  deltaUp?: boolean;
}

/** One row of the `stat-list` (ST-10). */
export interface StatTileRow {
  /** faint row label (e.g. 'ENERGY') */
  label: string;
  /** bold 16px value (e.g. '74') */
  value: string;
  /** mini-spark hue (token; default mint) */
  color?: string;
  /** mini-spark series (auto-normalized; default: a catalog wave) */
  data?: number[];
}

export interface StatTileProps {
  /** tile form (default `'stat-tile'`, ST-01) */
  variant?: StatTileVariant;
  /** faint mono caption at the top-left (per-variant catalog default) */
  title?: string;
  /** the big number (default '74'; hero renders it at 52px) */
  value?: string;
  /** delta text next to the chevron (e.g. '+6 VS YESTERDAY'; `''` hides) */
  delta?: string;
  /** delta direction — up = mint chevron, down = coral (default true) */
  deltaUp?: boolean;
  /** dim line under the number (e.g. 'ENERGY · UPDATED 14:36') */
  label?: string;
  /** ST-01 SELECT accessory: none / 16-pt spark / micro bars / goal ring /
   *  progress bar (default `'none'`) */
  accessory?: StatTileAccessory;
  /** `spark` (16 pts) / `bars` (8 pts) series, auto-normalized to the box */
  data?: number[];
  /** accessory hue (defaults: spark cyan · bars/ring/progress mint) */
  accessoryColor?: string;
  /** `ring` fill / `progress` fill, 0–1 (default 0.72) */
  progress?: number;
  /** `ring` center readout (default `${round(progress·100)}%`) */
  ringLabel?: string;
  /** verdict glow-dot color (e.g. `colors.zoneMid`) — draws the dot and
   *  colors the number; the zone verdict at a glance */
  verdictColor?: string;
  /** chip-pill (verdict tag / trend note, e.g. 'RECOVERY DAY'; `''` hides) */
  pill?: string;
  /** pill tint (default `accessoryColor` → mint) */
  pillColor?: string;
  /** number color override (hero: `shine` turns it mint like the catalog) */
  color?: string;
  /** `duo-tile` — the two stats (default: the catalog's SLEEP + HRV pair) */
  stats?: [StatTileStat, StatTileStat];
  /** `stat-list` — the rows (default: the catalog's 3) */
  rows?: StatTileRow[];
  /** hero glow — a wider faint duplicate number behind (no blur on native) */
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

/* ------------------------------------------- catalog deterministic data
 * mulberry32 + genData ported from catalog.js so the default accessories
 * reproduce the catalog cards exactly (seeds: spark 21 · bars 31 · list
 * rows 11/12/13). */
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

const DEFAULT_SPARK = genWave(21, 16);
const DEFAULT_BARS = genNoisy(31, 8);

const DEFAULT_STATS: [StatTileStat, StatTileStat] = [
  { value: '7:42', label: 'SLEEP', delta: '+22 MIN', deltaUp: true },
  { value: '58', label: 'HRV MS', delta: '−4', deltaUp: false },
];

const DEFAULT_ROWS: StatTileRow[] = [
  { label: 'ENERGY', value: '74', color: colors.mint, data: genWave(11, 16) },
  { label: 'SLEEP', value: '7:42', color: colors.violet, data: genWave(12, 16) },
  { label: 'STRAIN', value: '14.2', color: colors.zoneMid, data: genWave(13, 16) },
];

const DEFAULT_TITLES: Record<StatTileVariant, string> = {
  'stat-tile': 'ENERGY',
  'hero-number': 'ENERGY · NOW',
  'duo-tile': 'LAST NIGHT',
  'stat-list': 'TODAY · GLANCE',
};

/** approximate Space Grotesk 700 advance for the delta-x heuristic */
function numWidth(text: string, size: number): number {
  let w = 0;
  for (const ch of text) w += /[.,:'’]/.test(ch) ? 0.32 : 0.62;
  return w * size;
}

/** normalize a series to 0–1 (already-normalized data passes through) */
function normalize(data: number[]): number[] {
  if (data.length === 0) return data;
  const min = Math.min(...data);
  const max = Math.max(...data);
  if (min >= 0 && max <= 1) return data;
  const span = max - min || 1;
  return data.map((v) => (v - min) / span);
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

function Label({
  x,
  y,
  text,
  color = colors.textFaint,
  anchor = 'middle',
}: {
  x: number;
  y: number;
  text: string;
  color?: string;
  anchor?: 'start' | 'middle' | 'end';
}) {
  return (
    <SvgText x={x} y={y} fill={color} fontSize={8.5} textAnchor={anchor} fontFamily={fonts.mono} letterSpacing={0.5}>
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

/** the big display number (catalog `bigNum`) */
function BigNum({
  x,
  y,
  text,
  size = 34,
  color = colors.text,
  anchor = 'start',
  opacity,
}: {
  x: number;
  y: number;
  text: string;
  size?: number;
  color?: string;
  anchor?: 'start' | 'middle' | 'end';
  opacity?: number;
}) {
  return (
    <SvgText
      x={x}
      y={y}
      fill={color}
      fontSize={size}
      fontWeight="700"
      textAnchor={anchor}
      fontFamily={fonts.display}
      letterSpacing={-size * 0.03}
      opacity={opacity}
    >
      {text}
    </SvgText>
  );
}

/** delta chevron + mono label — up = mint, down = coral (catalog `delta`) */
function Delta({ x, y, text, up }: { x: number; y: number; text: string; up: boolean }) {
  const col = up ? colors.zoneHigh : colors.zoneLow;
  return (
    <G>
      <Path
        d={`M${x} ${up ? y : y - 6}l4 ${up ? -6 : 6}l4 ${up ? 6 : -6}`}
        fill="none"
        stroke={col}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Label x={x + 12} y={y - 1} text={text} color={col} anchor="start" />
    </G>
  );
}

/** 16-pt micro sparkline + end dot (catalog `microSpark`) */
function MicroSpark({
  x,
  y,
  w,
  h,
  data,
  color,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  data: number[];
  color: string;
}) {
  const vals = normalize(data);
  if (vals.length === 0) return null;
  const pts = vals.map((v, i) => ({
    x: x + (vals.length <= 1 ? w / 2 : (w * i) / (vals.length - 1)),
    y: y + h - v * h,
  }));
  const last = pts[pts.length - 1]!;
  return (
    <G>
      <Path d={smoothPath(pts)} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Circle cx={last.x.toFixed(1)} cy={last.y.toFixed(1)} r={2.4} fill={color} />
    </G>
  );
}

/**
 * StatTile — the kit's KPI chartlet (catalog family `stat-tiles`,
 * ST-01/06/07/10): the big-number widgets that carry every dashboard.
 * Native twin of `@lockin90/ui` StatTile — same prop API + geometry; the
 * hero `shine` blur becomes a wider faint duplicate number and the verdict
 * dot's drop-shadow a faint halo circle (RN SVG filters are unreliable).
 *
 * - `stat-tile` (ST-01, default) — big 34px number + delta chevron + dim
 *   caption; SELECT `accessory`: none / spark / bars / ring / progress,
 *   plus an optional `verdictColor` glow-dot.
 * - `hero-number` (ST-06) — centered 52px number + delta + insight line.
 * - `duo-tile` (ST-07) — two stats split by a hairline.
 * - `stat-list` (ST-10) — 3 rows of label + bold value + colored mini-spark.
 */
export function StatTile({
  variant = 'stat-tile',
  title,
  value,
  delta,
  deltaUp = true,
  label,
  accessory = 'none',
  data,
  accessoryColor,
  progress = 0.72,
  ringLabel,
  verdictColor,
  pill,
  pillColor,
  color,
  stats = DEFAULT_STATS,
  rows = DEFAULT_ROWS,
  shine = false,
  width = W,
  height = H,
  style,
}: StatTileProps) {
  const heading = title ?? DEFAULT_TITLES[variant];
  const head = <Label x={P.l + 8} y={26} text={heading} anchor="start" />;

  let accessibilityLabel: string;
  let content: ReactNode;

  if (variant === 'hero-number') {
    /* --------------------------------------------------- ST-06 hero-number */
    const val = value ?? '74';
    const col = color ?? (shine ? colors.mint : colors.text);
    const deltaText = delta ?? '+6';
    accessibilityLabel = `${heading}: ${val}${deltaText ? `, ${deltaText}` : ''}`;
    content = (
      <>
        {/* glow — a wider faint duplicate number (web: blurred copy) */}
        {shine ? <BigNum x={W / 2} y={83} text={val} size={56} color={colors.mint} anchor="middle" opacity={0.28} /> : null}
        <BigNum x={W / 2} y={82} text={val} size={52} color={col} anchor="middle" />
        {deltaText ? <Delta x={W / 2 + 40} y={60} text={deltaText} up={deltaUp} /> : null}
        <Label x={W / 2} y={102} text={label ?? 'ENERGY · PEAK IN 40 MIN'} color={colors.textDim} />
      </>
    );
  } else if (variant === 'duo-tile') {
    /* ------------------------------------------------------ ST-07 duo-tile */
    const [a, b] = stats;
    accessibilityLabel = `${heading}: ${a.label} ${a.value}, ${b.label} ${b.value}`;
    content = (
      <>
        <BigNum x={P.l + 8} y={70} text={a.value} size={26} />
        <Label x={P.l + 8} y={88} text={a.label} anchor="start" />
        {a.delta ? <Delta x={P.l + 8} y={106} text={a.delta} up={a.deltaUp ?? true} /> : null}
        <Line x1={W / 2} x2={W / 2} y1={38} y2={112} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
        <BigNum x={W / 2 + 16} y={70} text={b.value} size={26} />
        <Label x={W / 2 + 16} y={88} text={b.label} anchor="start" />
        {b.delta ? <Delta x={W / 2 + 16} y={106} text={b.delta} up={b.deltaUp ?? true} /> : null}
      </>
    );
  } else if (variant === 'stat-list') {
    /* ----------------------------------------------------- ST-10 stat-list */
    accessibilityLabel = `${heading}: ${rows.map((r) => `${r.label} ${r.value}`).join(', ')}`;
    content = (
      <>
        {rows.map((rw, i) => {
          const y = 44 + i * 30;
          return (
            <G key={i}>
              <Label x={P.l + 8} y={y + 4} text={rw.label} anchor="start" />
              <SvgText x={P.l + 76} y={y + 7} fill={colors.text} fontSize={16} fontWeight="700" fontFamily={fonts.display}>
                {rw.value}
              </SvgText>
              <MicroSpark x={170} y={y - 8} w={122} h={20} data={rw.data ?? DEFAULT_SPARK} color={rw.color ?? colors.mint} />
            </G>
          );
        })}
      </>
    );
  } else {
    /* ----------------------------------------------------- ST-01 stat-tile */
    const val = value ?? '74';
    const numSize = accessory === 'progress' ? 30 : 34;
    const numY = accessory === 'progress' ? 70 : 76;
    const numX = verdictColor ? P.l + 30 : P.l + 8;
    const numColor = verdictColor ?? colors.text;
    const labY = accessory === 'progress' ? 90 : 96;
    const deltaX = numX + numWidth(val, numSize) + 14;
    const aColor = accessoryColor ?? (accessory === 'spark' ? colors.cyan : colors.mint);
    const frac = Math.max(0, Math.min(1, progress));
    const trackW = W - P.l - P.r - 16;
    accessibilityLabel = `${heading}: ${val}${delta ? `, ${delta}` : ''}`;
    content = (
      <>
        {/* verdict glow-dot — halo = wider faint duplicate (web: drop-shadow) */}
        {verdictColor ? (
          <>
            <Circle cx={P.l + 14} cy={66} r={10} fill={verdictColor} opacity={0.3} />
            <Circle cx={P.l + 14} cy={66} r={6} fill={verdictColor} />
          </>
        ) : null}
        <BigNum x={numX} y={numY} text={val} size={numSize} color={color ?? numColor} />
        {delta ? <Delta x={deltaX} y={numY - 4} text={delta} up={deltaUp} /> : null}
        {label ? <Label x={numX} y={labY} text={label} color={colors.textDim} anchor="start" /> : null}
        {accessory === 'spark' ? <MicroSpark x={176} y={46} w={118} h={44} data={data ?? DEFAULT_SPARK} color={aColor} /> : null}
        {accessory === 'bars'
          ? (() => {
              const vals = normalize(data ?? DEFAULT_BARS);
              const bw = (108 / vals.length) * 0.6;
              return vals.map((v, i) => (
                <Rect
                  key={i}
                  x={(186 + (i * 108) / vals.length).toFixed(1)}
                  y={(44 + 46 - v * 46).toFixed(1)}
                  width={bw.toFixed(1)}
                  height={(v * 46).toFixed(1)}
                  rx={1.5}
                  fill={aColor}
                  opacity={0.5 + v * 0.5}
                />
              ));
            })()
          : null}
        {accessory === 'ring' ? (
          <G>
            <Path d={arcPath(236, 70, 26, 0, 359.99)} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={5} />
            {shine ? (
              <Path d={arcPath(236, 70, 26, 0, frac * 360)} fill="none" stroke={aColor} strokeWidth={9} strokeLinecap="round" opacity={0.3} />
            ) : null}
            <Path d={arcPath(236, 70, 26, 0, frac * 360)} fill="none" stroke={aColor} strokeWidth={5} strokeLinecap="round" />
            <SvgText x={236} y={74} fill={colors.text} fontSize={13} fontWeight="700" textAnchor="middle" fontFamily={fonts.display}>
              {ringLabel ?? `${Math.round(frac * 100)}%`}
            </SvgText>
          </G>
        ) : null}
        {accessory === 'progress' ? (
          <G>
            <Rect x={P.l + 8} y={100} width={trackW} height={8} rx={4} fill="rgba(255,255,255,0.08)" />
            <Rect x={P.l + 8} y={100} width={(trackW * frac).toFixed(1)} height={8} rx={4} fill={aColor} />
          </G>
        ) : null}
        {pill ? (
          <Tag x={W - P.r - 8} y={verdictColor ? 66 : 104} text={pill} color={pillColor ?? verdictColor ?? aColor} anchor="end" />
        ) : null}
      </>
    );
  }

  return (
    <View accessibilityRole="image" accessibilityLabel={accessibilityLabel} style={[{ width, height }, style]}>
      <Svg width={width} height={height} viewBox={`0 0 ${W} ${H}`}>
        {head}
        {content}
      </Svg>
    </View>
  );
}
