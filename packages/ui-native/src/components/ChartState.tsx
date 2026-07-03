import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import { colors, fonts } from '@lockin90/tokens';

/* ChartState — the catalog chart-states family (SV-01…SV-06,
   lockin90-design/charts/state-charts.html): the non-data states every chart
   card needs — loading, syncing, empty, locked, error and partial-sync —
   drawn at real chart geometry (fixed 320×150 viewBox) so data can land with
   no layout shift. Native twin of `@lockin90/ui` ChartState — same prop API +
   geometry; the partial-sync SMIL pulse is a static dot + faint halo ring and
   every glow is a wider faint duplicate shape (never SVG filters), like
   `Ring`. The CTA/RETRY pill takes `onCtaPress` (react-native-svg `onPress`). */

/** Catalog variant names (`lockin90-design/charts/state-charts.html`). */
export type ChartStateVariant =
  | 'skeleton-chart' /* SV-01 — placeholder bars + title/legend stubs */
  | 'loading-ring' /* SV-02 — spinner arc + what is actually syncing */
  | 'empty-cta' /* SV-03 — ghost bars + reason + filled mint CTA pill */
  | 'locked-forecast' /* SV-04 — ghost curve + unlocks-at-N + progress dots */
  | 'error-retry' /* SV-05 — coral triangle + reason + RETRY pill */
  | 'partial-sync'; /* SV-06 — solid to last synced point, dashed after */

export interface ChartStateProps {
  /** state form (default `'skeleton-chart'`, SV-01) */
  variant?: ChartStateVariant;
  /** faint mono caption at the top-left (per-variant catalog default:
   *  LOADING / SYNCING / NO DATA / NOT ENOUGH DATA / ERROR / PARTIAL DATA) */
  title?: string;
  /** the main dim line — the plain-words reason (per-variant default, e.g.
   *  `'NO MEALS LOGGED YET'`, `"COULDN'T LOAD ENERGY DATA"`) */
  message?: string;
  /** `loading-ring` — the second, fainter line: what is actually syncing
   *  (default 'SYNCING WHOOP + OURA') */
  detail?: string;
  /** faint bottom note (skeleton + partial-sync catalog defaults; `''` hides) */
  caption?: string;
  /** CTA pill text — `empty-cta` (filled, default 'LOG YOUR FIRST MEAL') and
   *  `error-retry` (outline, default 'RETRY'); `''` hides the pill */
  cta?: string;
  /** pill tint (defaults: empty-cta mint · error-retry coral) */
  ctaColor?: string;
  /** press handler for the CTA/RETRY pill — makes it an accessible button */
  onCtaPress?: () => void;
  /** `skeleton-chart` — placeholder bar heights 0–1 (default: the catalog 9) */
  bars?: number[];
  /** `empty-cta` — dashed ghost-bar heights 0–1 (default `[0.35, 0.55, 0.45]`) */
  ghostBars?: number[];
  /** `locked-forecast` ghost curve / `partial-sync` line — values 0–1
   *  (defaults: the catalog's seeded waves) */
  data?: number[];
  /** `locked-forecast` — days of data collected so far (default 3) */
  progress?: number;
  /** `locked-forecast` — days required to unlock (default 7) */
  total?: number;
  /** `partial-sync` — index of the last synced point (default 8); the line
   *  is solid through it, dashed ghost after */
  syncedIndex?: number;
  /** `partial-sync` — chip at the sync boundary (default 'SYNC PENDING') */
  pendingLabel?: string;
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
 * mulberry32 + genData('wave') ported from catalog.js so the default curves
 * reproduce the catalog cards exactly (locked seed 5 ×12 · partial seed 9 ×14). */
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

const DEFAULT_SKELETON_BARS = [0.45, 0.6, 0.35, 0.7, 0.5, 0.65, 0.4, 0.75, 0.55];
const DEFAULT_GHOST_BARS = [0.35, 0.55, 0.45];
const DEFAULT_LOCKED_DATA = genWave(5, 12);
const DEFAULT_PARTIAL_DATA = genWave(9, 14);

const DEFAULT_TITLES: Record<ChartStateVariant, string> = {
  'skeleton-chart': 'LOADING',
  'loading-ring': 'SYNCING',
  'empty-cta': 'NO DATA',
  'locked-forecast': 'NOT ENOUGH DATA',
  'error-retry': 'ERROR',
  'partial-sync': 'PARTIAL DATA',
};

/** y for a 0–1 value in the plot box (catalog `Y`) */
function Yv(v: number): number {
  return P.t + (1 - v) * plotH;
}

/** evenly-spread plot points for a 0–1 series (catalog `pts`) */
function seriesPts(data: number[]): { x: number; y: number }[] {
  return data.map((v, i) => ({
    x: P.l + (data.length <= 1 ? plotW / 2 : (i * plotW) / (data.length - 1)),
    y: Yv(v),
  }));
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

/** the action pill (catalog `pill()`) — filled (CTA) or outline (RETRY);
 *  with `onPress` it becomes an accessible SVG button */
function Pill({
  cx,
  cy,
  text,
  color,
  filled,
  onPress,
  shine,
}: {
  cx: number;
  cy: number;
  text: string;
  color: string;
  filled: boolean;
  onPress?: () => void;
  shine?: boolean;
}) {
  const w = text.length * 5 + 58;
  return (
    <G onPress={onPress} accessible={!!onPress} accessibilityRole={onPress ? 'button' : undefined} accessibilityLabel={onPress ? text : undefined}>
      {/* glow — wider faint duplicate pill (web: blurred) */}
      {shine ? <Rect x={cx - w / 2 - 3} y={cy - 15} width={w + 6} height={30} rx={15} fill={color} opacity={0.18} /> : null}
      <Rect
        x={cx - w / 2}
        y={cy - 12}
        width={w}
        height={24}
        rx={12}
        fill={filled ? color : 'rgba(255,255,255,0.04)'}
        fillOpacity={filled ? 0.14 : 1}
        stroke={color}
        strokeOpacity={0.55}
        strokeWidth={1}
      />
      <SvgText x={cx} y={cy + 3} fill={color} fontSize={9} textAnchor="middle" fontFamily={fonts.mono} letterSpacing={0.7}>
        {text}
      </SvgText>
    </G>
  );
}

function Grid() {
  return (
    <G>
      {[0.25, 0.5, 0.75].map((f) => (
        <Line key={f} x1={P.l} x2={W - P.r} y1={P.t + plotH * f} y2={P.t + plotH * f} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
      ))}
      <Line x1={P.l} x2={W - P.r} y1={H - P.b} y2={H - P.b} stroke="rgba(255,255,255,0.09)" strokeWidth={1} />
    </G>
  );
}

/**
 * ChartState — the kit's chart non-data state (catalog family `state-charts`,
 * SV-01…SV-06): loading, empty, locked, error and partial-sync rendered at
 * REAL chart geometry so the card doesn't shift when data lands. Native twin
 * of `@lockin90/ui` ChartState — same prop API + geometry; the partial-sync
 * pulse is a static dot + halo and glows are wider faint duplicates.
 */
export function ChartState({
  variant = 'skeleton-chart',
  title,
  message,
  detail,
  caption,
  cta,
  ctaColor,
  onCtaPress,
  bars = DEFAULT_SKELETON_BARS,
  ghostBars = DEFAULT_GHOST_BARS,
  data,
  progress = 3,
  total = 7,
  syncedIndex = 8,
  pendingLabel = 'SYNC PENDING',
  shine = false,
  width = W,
  height = H,
  style,
}: ChartStateProps) {
  const heading = title ?? DEFAULT_TITLES[variant];

  let accessibilityLabel: string;
  let content: ReactNode;

  if (variant === 'skeleton-chart') {
    /* ----------------------------------------------- SV-01 skeleton-chart */
    const note = caption ?? 'SKELETON · NO SHIMMER IN REDUCED MOTION';
    accessibilityLabel = `${heading}: chart loading placeholder`;
    content = (
      <>
        <Grid />
        <Rect x={P.l + 2} y={22} width={64} height={8} rx={4} fill="rgba(255,255,255,0.07)" />
        <Rect x={W - P.r - 54} y={22} width={54} height={8} rx={4} fill="rgba(255,255,255,0.05)" />
        {bars.map((v, i) => {
          const x = P.l + 14 + i * 32;
          const y = Yv(v * 0.8);
          return (
            <Rect
              key={i}
              x={x}
              y={y.toFixed(1)}
              width={20}
              height={(H - P.b - y).toFixed(1)}
              rx={3}
              fill={`rgba(255,255,255,${i === 4 ? 0.1 : 0.065})`}
            />
          );
        })}
        {note ? <Label x={160} y={142} text={note} /> : null}
      </>
    );
  } else if (variant === 'loading-ring') {
    /* ------------------------------------------------- SV-02 loading-ring */
    accessibilityLabel = `${heading}: ${message ?? 'loading data'}`;
    content = (
      <>
        {/* arc glow — wider faint duplicate (web: blurred) */}
        {shine ? <Path d={arcPath(160, 70, 22, 0, 70)} fill="none" stroke={colors.mint} strokeWidth={8} strokeLinecap="round" opacity={0.3} /> : null}
        <Path d={arcPath(160, 70, 22, 0, 300)} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={3.5} strokeLinecap="round" />
        <Path d={arcPath(160, 70, 22, 0, 70)} fill="none" stroke={colors.mint} strokeWidth={3.5} strokeLinecap="round" />
        <Label x={160} y={112} text={message ?? 'LOADING DATA…'} color={colors.textDim} />
        {(detail ?? 'SYNCING WHOOP + OURA') ? <Label x={160} y={128} text={detail ?? 'SYNCING WHOOP + OURA'} /> : null}
      </>
    );
  } else if (variant === 'empty-cta') {
    /* ---------------------------------------------------- SV-03 empty-cta */
    const ctaText = cta ?? 'LOG YOUR FIRST MEAL';
    accessibilityLabel = `${heading}: ${message ?? 'no data yet'}`;
    content = (
      <>
        {ghostBars.map((v, i) => {
          const y = 76 - v * 42;
          return (
            <Rect
              key={i}
              x={138 + i * 16}
              y={y.toFixed(1)}
              width={11}
              height={(76 - y).toFixed(1)}
              rx={2.5}
              fill="none"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth={1.2}
              strokeDasharray="3 3"
            />
          );
        })}
        <Label x={160} y={96} text={message ?? 'NO MEALS LOGGED YET'} color={colors.textDim} />
        {ctaText ? <Pill cx={160} cy={120} text={ctaText} color={ctaColor ?? colors.mint} filled onPress={onCtaPress} shine={shine} /> : null}
      </>
    );
  } else if (variant === 'locked-forecast') {
    /* ---------------------------------------------- SV-04 locked-forecast */
    const vals = data ?? DEFAULT_LOCKED_DATA;
    const pts = seriesPts(vals);
    const done = Math.max(0, Math.min(total, progress));
    const dotsX0 = 160 - (total - 1) * 5;
    accessibilityLabel = `${heading}: ${done} of ${total} days collected`;
    content = (
      <>
        <Grid />
        {pts.length > 0 ? <Path d={smoothPath(pts)} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth={2} strokeDasharray="4 5" /> : null}
        <Label x={160} y={58} text={message ?? `FORECAST UNLOCKS AT ${total} DAYS OF DATA`} color={colors.textDim} />
        {Array.from({ length: total }, (_, i) => (
          <Circle key={i} cx={dotsX0 + i * 10} cy={74} r={3} fill={i < done ? colors.mint : 'rgba(255,255,255,0.12)'} />
        ))}
        <Label x={160 + (total - 1) * 5 + 12} y={77} text={`${done}/${total}`} color={colors.mint} anchor="start" />
      </>
    );
  } else if (variant === 'error-retry') {
    /* -------------------------------------------------- SV-05 error-retry */
    const ctaText = cta ?? 'RETRY';
    accessibilityLabel = `${heading}: ${message ?? "couldn't load data"}`;
    content = (
      <>
        {/* triangle glow — filled faint duplicate (web: blurred) */}
        {shine ? <Path d="M160 41l19 33h-38z" fill={colors.zoneLow} opacity={0.18} /> : null}
        <Path d="M160 44l16 27h-32z" fill="none" stroke={colors.zoneLow} strokeWidth={1.6} strokeLinejoin="round" />
        <Line x1={160} x2={160} y1={54} y2={62} stroke={colors.zoneLow} strokeWidth={1.6} />
        <Circle cx={160} cy={66.5} r={0.9} fill={colors.zoneLow} />
        <Label x={160} y={92} text={message ?? "COULDN'T LOAD ENERGY DATA"} color={colors.textDim} />
        {ctaText ? <Pill cx={160} cy={116} text={ctaText} color={ctaColor ?? colors.zoneLow} filled={false} onPress={onCtaPress} shine={shine} /> : null}
      </>
    );
  } else {
    /* ------------------------------------------------- SV-06 partial-sync */
    const vals = data ?? DEFAULT_PARTIAL_DATA;
    const pts = seriesPts(vals);
    const cut = Math.max(0, Math.min(pts.length - 1, syncedIndex));
    const cp = pts[cut];
    const note = caption ?? 'SOLID = SYNCED · DASHED = AWAITING DEVICE';
    accessibilityLabel = `${heading}: synced through point ${cut + 1} of ${pts.length}`;
    content = (
      <>
        <Grid />
        {pts.length > 0 ? <Path d={smoothPath(pts.slice(0, cut + 1))} fill="none" stroke={colors.mint} strokeWidth={2.2} strokeLinecap="round" /> : null}
        {cut < pts.length - 1 ? (
          <Path d={smoothPath(pts.slice(cut))} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={1.6} strokeDasharray="3 4" />
        ) : null}
        {cp ? (
          <G>
            <Rect x={cp.x.toFixed(1)} y={P.t + 4} width={(W - P.r - cp.x).toFixed(1)} height={plotH - 8} fill="rgba(255,255,255,0.03)" />
            {/* pulse — static dot + faint halo ring (no SMIL on native) */}
            {shine ? <Circle cx={cp.x.toFixed(1)} cy={cp.y.toFixed(1)} r={9} fill={colors.zoneMid} opacity={0.25} /> : null}
            <Circle cx={cp.x.toFixed(1)} cy={cp.y.toFixed(1)} r={7} fill="none" stroke={colors.zoneMid} strokeWidth={1.4} strokeOpacity={0.4} />
            <Circle cx={cp.x.toFixed(1)} cy={cp.y.toFixed(1)} r={3.6} fill={colors.zoneMid} />
            {pendingLabel ? <Tag x={cp.x + 10} y={P.t + 14} text={pendingLabel} color={colors.zoneMid} anchor="start" /> : null}
          </G>
        ) : null}
        {note ? <Label x={160} y={144} text={note} /> : null}
      </>
    );
  }

  return (
    <View accessibilityRole="image" accessibilityLabel={accessibilityLabel} style={[{ width, height }, style]}>
      <Svg width={width} height={height} viewBox={`0 0 ${W} ${H}`}>
        <Label x={P.l + 2} y={11} text={heading} anchor="start" />
        {content}
      </Svg>
    </View>
  );
}
