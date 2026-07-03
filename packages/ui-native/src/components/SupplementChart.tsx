import { useId, type ReactNode } from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, {
  Circle,
  ClipPath,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { colors, fonts } from '@lockin90/tokens';

/* SupplementChart — the catalog supplement-level family (SP-01…SP-10,
   lockin90-design/charts/supplement-charts.html): saturation, decay and
   adherence — what's actually in the system. Nine variants drawn in a fixed
   320×150 viewBox: the creatine saturation story, active-stack rows,
   half-life decay, dose-vs-level, depletion forecast, adherence strip,
   multi-supplement kinetics and the liquid battery vessels (glass body +
   battery cap + wavy two-Q liquid surface + clipped bubbles + zone-colored
   fill + a % readout that inverts when submerged). Native twin of
   `@lockin90/ui` SupplementChart — same prop API; glows are wider faint
   duplicate shapes (never SVG filters).
   (SP-08 does not exist — a numbering gap in the catalog.) */

export type SupplementChartVariant =
  | 'saturation-story' /* SP-01 — level builds to SATURATED → MISSED window → rebuilds */
  | 'active-stack' /* SP-02 — 4 rows: name + level bar + % + status pill */
  | 'half-life' /* SP-03 — exponential decay from the dose tag + NOW pulse */
  | 'dose-level' /* SP-04 — dose dots + faint intake stems + level line */
  | 'depletion-forecast' /* SP-05 — solid past · dashed projection · LOW pulse */
  | 'adherence-level' /* SP-06 — taken/missed cells strip + resulting level line */
  | 'stack-levels' /* SP-07 — 3 level curves with different kinetics + pills */
  | 'liquid-batteries' /* SP-09 — 5 battery vessels in a bar-chart row */
  | 'battery-hero'; /* SP-10 — one large 56px vessel + FULL/LOW ticks + stats */

/** One `active-stack` row (SP-02). */
export interface SupplementRow {
  /** Row label (e.g. 'CREATINE'). */
  name: string;
  /** Level 0–1 — bar fill + % readout. */
  level: number;
  /** Bar/pill color token (e.g. `colors.cyan`); defaults to the level's zone. */
  color?: string;
  /** Status pill text; defaults by level (SATURATED / OK / TAKE TODAY / DEPLETED). */
  status?: string;
}

/** One `stack-levels` curve (SP-07). */
export interface SupplementSeries {
  /** Series name — the right-side chip pill. */
  name: string;
  /** Level samples 0–1, oldest → newest. */
  levels: number[];
  /** Line color token; defaults to mint → cyan → amber by position. */
  color?: string;
  /** Dashed `4 3` line (the caffeine sawtooth look). */
  dash?: boolean;
}

/** One liquid vessel (SP-09). */
export interface SupplementVessel {
  /** Name under the vessel (e.g. 'CREATINE'). */
  name: string;
  /** Fill level 0–1 — drives the liquid height and the zone color. */
  level: number;
}

export interface SupplementChartProps {
  /** Catalog variant (SP-01…SP-07 / SP-09 / SP-10). */
  variant?: SupplementChartVariant;
  /** Per-day dose adherence, oldest → newest (`true` = taken) — drives the
   *  saturation model, dose dots and adherence cells (SP-01/04/06). */
  doses?: boolean[];
  /** Explicit 0–1 level series — overrides the doses-driven model; the PAST
   *  levels for `depletion-forecast` (SP-05). */
  levels?: number[];
  /** Saturation model: per-dose build rate toward 1 (catalog `kUp`). */
  kUp?: number;
  /** Saturation model: per-missed-day decay rate (catalog `kDown`). */
  kDown?: number;
  /** `active-stack` rows (SP-02) — the first four are drawn. */
  rows?: SupplementRow[];
  /** `stack-levels` curves (SP-07) — the first three are drawn. */
  series?: SupplementSeries[];
  /** `liquid-batteries` vessels (SP-09) — the first five are drawn. */
  vessels?: SupplementVessel[];
  /** `battery-hero` vessel level 0–1 (SP-10) — also the big % readout. */
  level?: number;
  /** Half-life in hours (SP-03 decay: `0.5^(t/halfLifeH)`). */
  halfLifeH?: number;
  /** `half-life` x-window in hours (0h → +windowH). */
  windowH?: number;
  /** `half-life` NOW rule position, hours since the dose. */
  nowH?: number;
  /** `half-life` dose size in mg — derives the default dose/now labels. */
  doseMg?: number;
  /** `half-life` dose tag (default `DOSE ${doseMg} MG`). */
  doseLabel?: string;
  /** `half-life` NOW pill (default `STILL ACTIVE · ${remaining} MG`). */
  nowNote?: string;
  /** `depletion-forecast` total days (past + projection). */
  projectDays?: number;
  /** `depletion-forecast` per-day retention (level × rate per day). */
  decayRate?: number;
  /** LOW crossing threshold 0–1 (the catalog low band edge). */
  lowThreshold?: number;
  /** `depletion-forecast` pill (default `LOW IN ${n} DAYS — RESTOCK`). */
  restockNote?: string;
  /** Variant annotation pill — SP-01 rebuild note (default derived
   *  `STILL n% · REBUILDING`), SP-04 key (default `DOTS = DOSES · LINE = LEVEL`),
   *  SP-06 level pill (default `LEVEL n%`). */
  note?: string;
  /** Data index the SP-01 `note` anchors to (default: last missed day). */
  noteAt?: number;
  /** Level-line color token; defaults per variant (mint; cyan for
   *  `depletion-forecast` / `adherence-level`). */
  color?: string;
  /** `battery-hero` caption under the big % (e.g. 'CREATINE · 5G DAILY'). */
  heroCaption?: string;
  /** `battery-hero` status pill (e.g. 'SATURATED'). */
  heroStatus?: string;
  /** `battery-hero` status pill color token. */
  heroStatusColor?: string;
  /** `battery-hero` bottom note (e.g. 'HOLDS ~9 DAYS OFF'). */
  heroNote?: string;
  /** `battery-hero` LOW side-tick position 0–1. */
  lowAt?: number;
  /** Top-left mono caption (e.g. 'CREATINE · 5G DAILY'). */
  title?: string;
  /** Top-right display stat (e.g. 'LVL 78%'). */
  stat?: string;
  /** `stat` color token. */
  statColor?: string;
  /** SATURATED / LOW zone level bands behind the plot (level variants only;
   *  default on — `adherence-level` and the row/vessel variants never draw them). */
  bands?: boolean;
  /** Bottom-left axis caption (default 'DAY 1'; `half-life` → '0H'). */
  startLabel?: string;
  /** Bottom-right axis caption (default 'TODAY'; `half-life` → `+${windowH}H`). */
  endLabel?: string;
  /** Glow underlay (the catalog `cfg.shine`) — a wider faint duplicate on native. */
  shine?: boolean;
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

/** Round for compact attribute values. */
const rd = (n: number) => Math.round(n * 100) / 100;

/** y of a 0–1 plot fraction. */
const yAt = (v: number) => PAD.t + (1 - v) * PLOT_H;
/** the supplement page's inset day x-scale. */
const dayX = (i: number, n: number) => PAD.l + 14 + ((PLOT_W - 22) * i) / Math.max(1, n - 1);
/** the supplement page's level y-scale (levels ride 6%…92% of the plot). */
const lvlY = (v: number) => yAt(0.06 + v * 0.86);

/** zone verdict for a 0–1 level (the catalog vessel/zoneOf thresholds). */
const zoneOf = (v: number) => (v >= 0.62 ? colors.zoneHigh : v >= 0.38 ? colors.zoneMid : colors.zoneLow);

/** the catalog saturation model: doses build toward 1, missed days decay. */
function satLevels(taken: boolean[], kUp: number, kDown: number): number[] {
  let lvl = 0;
  return taken.map((t) => {
    lvl = t ? lvl + (1 - lvl) * kUp : lvl * (1 - kDown);
    return lvl;
  });
}

type Pt = [number, number];

/** Straight polyline through the points. */
function linePath(pts: Pt[]): string {
  if (pts.length === 0) return '';
  return pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${rd(x)},${rd(y)}`).join(' ');
}

/** Fritsch–Carlson monotone cubic — the catalog's `smoothPath` (no overshoot). */
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
    <SvgText x={rd(x)} y={rd(y)} fill={fill} textAnchor={anchor} fontSize={8.5} fontFamily={fonts.mono} letterSpacing={0.5}>
      {children}
    </SvgText>
  );
}

/** Chip-pill tag (the catalog `tag()`): dark bg-0 pill + tinted hairline. */
function Tag({
  x,
  y,
  color,
  anchor = 'middle',
  text,
}: {
  x: number;
  y: number;
  color: string;
  anchor?: 'start' | 'middle' | 'end';
  text: string;
}) {
  const wpx = text.length * 5.35 + 12;
  let xa = anchor === 'end' ? x - wpx : anchor === 'start' ? x : x - wpx / 2;
  xa = Math.max(PAD.l - 4, Math.min(xa, W - PAD.r - wpx + 4));
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

/** Glowing dot + static halo ring — the catalog `pulseDot`. Native draws a
 *  wider faint duplicate for the glow and a static ring for the pulse (no
 *  SMIL/JS animation — the Ring precedent). */
function PulseDot({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <G>
      <Circle cx={rd(x)} cy={rd(y)} r={6.6} fill={color} opacity={0.35} />
      <Circle cx={rd(x)} cy={rd(y)} r={3.6} fill={color} />
      <Circle cx={rd(x)} cy={rd(y)} r={7} fill="none" stroke={color} strokeWidth={1.4} opacity={0.4} />
    </G>
  );
}

/** SATURATED / LOW zone level bands (5% washes + right-edge band labels). */
function LevelBands() {
  const bands: Array<[number, number, string, string]> = [
    [0.72, 1, colors.zoneHigh, 'SATURATED'],
    [0.35, 0.72, colors.zoneMid, ''],
    [0, 0.35, colors.zoneLow, 'LOW'],
  ];
  return (
    <G>
      {bands.map(([lo, hi, color, text], i) => (
        <G key={i}>
          <Rect
            x={PAD.l}
            y={rd(lvlY(hi))}
            width={PLOT_W}
            height={rd(lvlY(lo) - lvlY(hi))}
            fill={color}
            opacity={0.05}
          />
          {text ? (
            <Label x={W - PAD.r - 2} y={lvlY(hi) + 9} fill={color} anchor="end">
              {text}
            </Label>
          ) : null}
        </G>
      ))}
    </G>
  );
}

/** Dose dots under the plot — filled mint = taken, dashed coral = missed. */
function DoseDots({ taken, y }: { taken: boolean[]; y: number }) {
  const n = taken.length;
  return (
    <G>
      {taken.map((t, i) =>
        t ? (
          <Circle key={i} cx={rd(dayX(i, n))} cy={y} r={3} fill={colors.mint} />
        ) : (
          <Circle
            key={i}
            cx={rd(dayX(i, n))}
            cy={y}
            r={3}
            fill="none"
            stroke={colors.zoneLow}
            strokeWidth={1.3}
            strokeDasharray={[1.5, 1.5]}
          />
        ),
      )}
    </G>
  );
}

/** One liquid battery vessel: cap + glass body + clipped wavy liquid +
 *  surface highlight + bubbles + a % that inverts when submerged. */
function VesselGlyph({
  x,
  y,
  w,
  h,
  level,
  vid,
  bubbles,
  shine,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  level: number;
  vid: string;
  bubbles: boolean;
  shine: boolean;
}) {
  const lv = Math.max(0, Math.min(1, level));
  const col = zoneOf(lv);
  const lt = y + h - 2 - lv * (h - 6);
  const amp = 2.6;
  const xw = x + 1.5;
  const ww = w - 3;
  // wavy liquid surface — TWO Q-curves (the signature), then close to the base
  const surface =
    `M${rd(xw)} ${rd(lt)}` +
    `Q${rd(xw + ww * 0.25)} ${rd(lt - amp)} ${rd(xw + ww * 0.5)} ${rd(lt)}` +
    `Q${rd(xw + ww * 0.75)} ${rd(lt + amp)} ${rd(xw + ww)} ${rd(lt)}`;
  const wave = `${surface}L${rd(xw + ww)} ${rd(y + h)}L${rd(xw)} ${rd(y + h)}Z`;
  const inLiquid = lt < y + h / 2;
  const bubbleSpec: Array<[number, number, number]> = [
    [0.3, 0.35, 2],
    [0.62, 0.55, 1.4],
    [0.45, 0.75, 1.8],
    [0.72, 0.3, 1.2],
  ];
  return (
    <G>
      <Defs>
        <ClipPath id={`${vid}-c`}>
          <Rect x={rd(x + 1.5)} y={rd(y + 1.5)} width={rd(w - 3)} height={rd(h - 3)} rx={7.5} />
        </ClipPath>
        <LinearGradient id={`${vid}-l`} x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor={col} stopOpacity={0.9} />
          <Stop offset="100%" stopColor={col} stopOpacity={0.45} />
        </LinearGradient>
      </Defs>
      {/* battery cap */}
      <Rect
        x={rd(x + w / 2 - w * 0.2)}
        y={y - 5}
        width={rd(w * 0.4)}
        height={5}
        rx={2}
        fill={colors.text}
        opacity={0.28}
      />
      {/* glass body */}
      <Rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={9}
        fill={colors.glass}
        stroke={colors.text}
        strokeOpacity={0.22}
        strokeWidth={1.4}
      />
      {/* liquid shine — a wider faint duplicate of the surface highlight
          (no blur filters on native; the web blurs the liquid instead) */}
      {shine ? <Path d={surface} fill="none" stroke={col} strokeWidth={7} opacity={0.35} /> : null}
      {/* liquid, clipped to the body */}
      <Path d={wave} fill={`url(#${vid}-l)`} clipPath={`url(#${vid}-c)`} />
      {/* liquid surface highlight */}
      <Path d={surface} fill="none" stroke={col} strokeWidth={1.6} opacity={0.95} clipPath={`url(#${vid}-c)`} />
      {/* bubbles */}
      {bubbles
        ? bubbleSpec.map(([fx, fy, r], i) => (
            <Circle
              key={i}
              cx={rd(x + w * fx)}
              cy={rd(y + h - (h - 6) * lv * fy)}
              r={r}
              fill="none"
              stroke={colors.text}
              strokeOpacity={0.4}
              strokeWidth={0.8}
              clipPath={`url(#${vid}-c)`}
            />
          ))
        : null}
      {/* % centered in the vessel — inverts when the liquid covers it */}
      <SvgText
        x={rd(x + w / 2)}
        y={rd(y + h / 2 + 3)}
        fill={inLiquid ? colors.bg0 : colors.text}
        textAnchor="middle"
        fontSize={10.5}
        fontWeight="600"
        fontFamily={fonts.mono}
      >
        {String(Math.round(lv * 100))}
      </SvgText>
    </G>
  );
}

/* the catalog's creatine story — 5 doses · 3 missed · rebuild */
const CREATINE_DOSES = [
  true, true, true, true, true, false, false, false, true, true, true, true, true, true,
];

const DEFAULT_ROWS: SupplementRow[] = [
  { name: 'CREATINE', level: 0.82, color: colors.mint, status: 'SATURATED' },
  { name: 'MAGNESIUM', level: 0.64, color: colors.cyan, status: 'OK' },
  { name: 'VITAMIN D', level: 0.31, color: colors.zoneMid, status: 'TAKE TODAY' },
  { name: 'OMEGA-3', level: 0.12, color: colors.zoneLow, status: 'DEPLETED' },
];

const DEFAULT_VESSELS: SupplementVessel[] = [
  { name: 'CREATINE', level: 0.82 },
  { name: 'MAGNES.', level: 0.64 },
  { name: 'VIT D', level: 0.31 },
  { name: 'OMEGA-3', level: 0.12 },
  { name: 'ZINC', level: 0.55 },
];

const DEFAULT_FORECAST_PAST = [0.2, 0.44, 0.62, 0.75, 0.84, 0.9];
const DOSE_LEVEL_DOSES = [
  true, true, false, true, true, true, false, true, true, false, false, true, true, true,
];
const ADHERENCE_DOSES = [
  true, true, true, false, true, true, true, true, false, false, true, true, true, true,
];

/** derive an SP-02 status pill from the level. */
const statusOf = (v: number) =>
  v >= 0.72 ? 'SATURATED' : v >= 0.38 ? 'OK' : v >= 0.2 ? 'TAKE TODAY' : 'DEPLETED';

/**
 * SupplementChart — the supplement-level family (catalog SP-01…SP-10):
 * saturation, decay, adherence and the liquid tank view. Level variants share
 * the zone level-band frame (SATURATED ≥ 0.72 / LOW < 0.35) and the catalog
 * saturation model (`kUp`/`kDown`) so real dose logs drive the story; the
 * battery variants render the signature glass vessels with a wavy clipped
 * liquid, bubbles and zone-colored fill. All levels are 0–1.
 */
export function SupplementChart({
  variant = 'saturation-story',
  doses,
  levels,
  kUp = 0.32,
  kDown = 0.18,
  rows = DEFAULT_ROWS,
  series,
  vessels = DEFAULT_VESSELS,
  level = 0.78,
  halfLifeH = 5,
  windowH = 12,
  nowH = 6.5,
  doseMg = 200,
  doseLabel,
  nowNote,
  projectDays = 14,
  decayRate = 0.82,
  lowThreshold = 0.35,
  restockNote,
  note,
  noteAt,
  color,
  heroCaption = 'CREATINE · 5G DAILY',
  heroStatus = 'SATURATED',
  heroStatusColor = colors.zoneHigh,
  heroNote = 'HOLDS ~9 DAYS OFF',
  lowAt = 0.35,
  title,
  stat,
  statColor = colors.text,
  bands,
  startLabel,
  endLabel,
  shine = false,
  ariaLabel = 'Supplement level chart',
  style,
}: SupplementChartProps) {
  const uid = useId().replace(/[^a-zA-Z0-9-]/g, '');

  const lineColor =
    color ?? (variant === 'depletion-forecast' || variant === 'adherence-level' ? colors.cyan : colors.mint);

  /** level line + optional glow underlay (wider faint duplicate on native). */
  const levelLine = (
    pts: Pt[],
    opts: { stroke?: string; w?: number; dash?: [number, number]; opacity?: number; glow?: boolean } = {},
  ) => {
    const d = monotonePath(pts);
    const stroke = opts.stroke ?? lineColor;
    const sw = opts.w ?? 2.5;
    return (
      <G>
        {opts.glow ? (
          <Path d={d} fill="none" stroke={stroke} strokeWidth={sw + 5} strokeLinecap="round" opacity={0.45} />
        ) : null}
        <Path
          d={d}
          fill="none"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={opts.dash}
          opacity={opts.opacity}
        />
      </G>
    );
  };

  let body: ReactNode = null;
  let showBands = false;
  let axis: [string, string] | null = null;

  if (variant === 'saturation-story') {
    /* SP-01 — the creatine story */
    const taken = doses ?? CREATINE_DOSES;
    const n = taken.length;
    const lv = levels ?? satLevels(taken, kUp, kDown);
    const pts: Pt[] = lv.map((v, i) => [dayX(i, n), lvlY(v)]);
    showBands = bands ?? true;
    axis = [startLabel ?? 'DAY 1', endLabel ?? 'TODAY'];
    // the missed window: first run of ≥2 consecutive misses
    let m0 = -1;
    let m1 = -1;
    for (let i = 0; i < n; i++) {
      if (!taken[i]) {
        if (m0 === -1) {
          m0 = i;
          m1 = i;
        } else if (m1 === i - 1) {
          m1 = i;
        }
      } else if (m0 !== -1 && m1 >= m0 + 1) break;
      else if (m0 !== -1 && m1 === m0) {
        m0 = -1;
        m1 = -1;
      }
    }
    const hasMiss = m0 !== -1 && m1 > m0;
    // SATURATED pill: the peak before the missed window, else first level ≥ 0.72
    const satIdx = hasMiss ? m0 - 1 : lv.findIndex((v) => v >= 0.72);
    const nAt = noteAt ?? (hasMiss ? m1 : -1);
    const noteText = note ?? (nAt >= 0 ? `STILL ${Math.round((lv[nAt] ?? 0) * 100)}% · REBUILDING` : undefined);
    body = n === 0 ? null : (
      <G>
        <DoseDots taken={taken} y={H - PAD.b - 4} />
        {levelLine(pts, { glow: shine })}
        {hasMiss ? (
          <G>
            <Rect
              x={rd(dayX(m0, n) - 6)}
              y={PAD.t}
              width={rd(dayX(m1, n) - dayX(m0, n) + 12)}
              height={PLOT_H - 10}
              rx={5}
              fill={colors.zoneLow}
              opacity={0.07}
            />
            <Tag x={(dayX(m0, n) + dayX(m1, n)) / 2} y={PAD.t + 8} color={colors.zoneLow} text={`MISSED × ${m1 - m0 + 1}`} />
          </G>
        ) : null}
        {satIdx >= 0 && lv[satIdx] >= 0.72 ? (
          <Tag x={dayX(satIdx, n)} y={pts[satIdx][1] - 13} color={colors.mint} text="SATURATED" />
        ) : null}
        {noteText && nAt >= 0 && nAt < n ? (
          <Tag x={dayX(nAt, n) + 10} y={pts[nAt][1] + 15} color={colors.zoneMid} anchor="start" text={noteText} />
        ) : null}
        <PulseDot x={pts[n - 1][0]} y={pts[n - 1][1]} color={colors.mint} />
      </G>
    );
  } else if (variant === 'active-stack') {
    /* SP-02 — 4 rows: name + level bar + % + status pill */
    const rws = rows.slice(0, 4);
    const rh = PLOT_H / 4;
    const barW = PLOT_W - 150;
    body = (
      <G>
        {rws.map((r, ri) => {
          const y = PAD.t + 8 + ri * rh + rh / 2;
          const c = r.color ?? zoneOf(r.level);
          return (
            <G key={ri}>
              <Label x={PAD.l + 66} y={y - 8} fill={colors.textDim} anchor="end">
                {r.name}
              </Label>
              <Rect x={PAD.l + 74} y={rd(y - 13)} width={barW} height={10} rx={5} fill={colors.glass2} />
              <Rect
                x={PAD.l + 74}
                y={rd(y - 13)}
                width={rd(Math.max(10, barW * Math.max(0, Math.min(1, r.level))))}
                height={10}
                rx={5}
                fill={c}
                opacity={0.92}
              />
              <Label x={PAD.l + 80 + barW} y={y - 5} fill={c} anchor="start">
                {`${Math.round(r.level * 100)}%`}
              </Label>
              <Tag x={PAD.l + 74 + barW} y={y + 6} color={c} anchor="end" text={r.status ?? statusOf(r.level)} />
            </G>
          );
        })}
      </G>
    );
  } else if (variant === 'half-life') {
    /* SP-03 — exponential decay from the dose */
    const n = 25;
    const pts: Pt[] = [];
    for (let i = 0; i < n; i++) {
      const t = (i / (n - 1)) * windowH;
      pts.push([dayX(i, n), lvlY(Math.pow(0.5, t / halfLifeH))]);
    }
    showBands = bands ?? true;
    axis = [startLabel ?? '0H', endLabel ?? `+${windowH}H`];
    const remain = Math.pow(0.5, nowH / halfLifeH);
    const nowX = PAD.l + 14 + (PLOT_W - 22) * Math.max(0, Math.min(1, nowH / windowH));
    const nowY = lvlY(remain);
    body = (
      <G>
        {levelLine(pts, { stroke: color ?? colors.zoneMid, glow: shine })}
        <Line x1={rd(nowX)} x2={rd(nowX)} y1={PAD.t - 2} y2={H - PAD.b} stroke={colors.text} strokeOpacity={0.22} strokeWidth={1} />
        <Label x={nowX} y={PAD.t - 5} fill={colors.textDim}>
          NOW
        </Label>
        <PulseDot x={nowX} y={nowY} color={colors.zoneMid} />
        <Tag
          x={nowX + 10}
          y={nowY - 14}
          color={colors.zoneMid}
          anchor="start"
          text={nowNote ?? `STILL ACTIVE · ${Math.round(doseMg * remain)} MG`}
        />
        <Tag
          x={dayX(2, n) + 16}
          y={lvlY(0.97) + 12}
          color={colors.textDim}
          anchor="start"
          text={doseLabel ?? `DOSE ${doseMg} MG`}
        />
      </G>
    );
  } else if (variant === 'dose-level') {
    /* SP-04 — dose dots + faint intake stems + resulting level line */
    const taken = doses ?? DOSE_LEVEL_DOSES;
    const n = taken.length;
    const lv = levels ?? satLevels(taken, kUp, kDown);
    const pts: Pt[] = lv.map((v, i) => [dayX(i, n), lvlY(v)]);
    showBands = bands ?? true;
    body = n === 0 ? null : (
      <G>
        {taken.map((t, i) =>
          t ? (
            <Line
              key={i}
              x1={rd(dayX(i, n))}
              x2={rd(dayX(i, n))}
              y1={H - PAD.b}
              y2={rd(lvlY(lv[i]))}
              stroke={colors.mint}
              strokeWidth={3}
              strokeLinecap="round"
              opacity={0.22}
            />
          ) : null,
        )}
        <DoseDots taken={taken} y={H - PAD.b - 4} />
        {levelLine(pts, { glow: shine })}
        <Tag x={W - PAD.r - 4} y={PAD.t + 10} color={colors.textDim} anchor="end" text={note ?? 'DOTS = DOSES · LINE = LEVEL'} />
      </G>
    );
  } else if (variant === 'depletion-forecast') {
    /* SP-05 — solid past · dashed decay projection · LOW crossing pulse */
    const past = levels ?? DEFAULT_FORECAST_PAST;
    const n = Math.max(projectDays, past.length + 1);
    const all = past.slice();
    for (let i = past.length; i < n; i++) all.push(all[i - 1] * decayRate);
    const pts: Pt[] = all.map((v, i) => [dayX(i, n), lvlY(v)]);
    showBands = bands ?? true;
    const nowPt = past.length > 0 ? pts[past.length - 1] : null;
    let crossI = -1;
    for (let i = past.length; i < n; i++)
      if (all[i] < lowThreshold) {
        crossI = i;
        break;
      }
    body = nowPt == null ? null : (
      <G>
        {levelLine(pts.slice(0, past.length), { stroke: lineColor, glow: shine })}
        {levelLine(pts.slice(past.length - 1), { stroke: lineColor, dash: [5, 5], opacity: 0.75 })}
        <Line x1={rd(nowPt[0])} x2={rd(nowPt[0])} y1={PAD.t - 2} y2={H - PAD.b} stroke={colors.text} strokeOpacity={0.22} strokeWidth={1} />
        <Label x={nowPt[0]} y={PAD.t - 5} fill={colors.textDim}>
          NOW
        </Label>
        {crossI >= 0 ? (
          <G>
            <PulseDot x={pts[crossI][0]} y={pts[crossI][1]} color={colors.zoneLow} />
            <Tag
              x={pts[crossI][0] - 6}
              y={pts[crossI][1] - 15}
              color={colors.zoneLow}
              anchor="end"
              text={restockNote ?? `LOW IN ${crossI - past.length + 1} DAYS — RESTOCK`}
            />
          </G>
        ) : null}
      </G>
    );
  } else if (variant === 'adherence-level') {
    /* SP-06 — taken/missed day cells + the resulting level line under */
    const taken = doses ?? ADHERENCE_DOSES;
    const n = taken.length;
    const lv = levels ?? satLevels(taken, kUp, kDown);
    // the line rides at 62% of the model level so it clears the cells strip
    const pts: Pt[] = lv.map((v, i) => [dayX(i, n), lvlY(v * 0.62)]);
    const cw = (PLOT_W - 26) / Math.max(1, n);
    body = n === 0 ? null : (
      <G>
        {taken.map((t, i) => (
          <Rect
            key={i}
            x={rd(dayX(i, n) - cw / 2 + 1)}
            y={PAD.t + 4}
            width={rd(cw - 2)}
            height={12}
            rx={3}
            fill={t ? colors.mint : 'none'}
            stroke={t ? 'none' : colors.zoneLow}
            strokeWidth={t ? 0 : 1}
            strokeDasharray={t ? undefined : [2, 2]}
            opacity={t ? 0.75 : 1}
          />
        ))}
        <Label x={PAD.l + 14} y={PAD.t + 26} fill={colors.textFaint} anchor="start">
          TAKEN / MISSED
        </Label>
        {levelLine(pts, { stroke: lineColor, glow: shine })}
        <Tag
          x={W - PAD.r - 4}
          y={lvlY(0.62 * lv[n - 1]) - 13}
          color={lineColor}
          anchor="end"
          text={note ?? `LEVEL ${Math.round(lv[n - 1] * 100)}%`}
        />
      </G>
    );
  } else if (variant === 'stack-levels') {
    /* SP-07 — 3 level curves with different kinetics + right pills */
    const trio = (series ?? DEFAULT_STACK_SERIES).slice(0, 3);
    const widths = [2.5, 2, 1.8];
    const opacities = [1, 0.85, 0.8];
    const colorsBy = [colors.mint, colors.cyan, colors.zoneMid];
    showBands = bands ?? true;
    body = (
      <G>
        {trio.map((s, si) => {
          const n = s.levels.length;
          const pts: Pt[] = s.levels.map((v, i) => [dayX(i, n), lvlY(v)]);
          return (
            <G key={si}>
              {levelLine(pts, {
                stroke: s.color ?? colorsBy[si],
                w: widths[si],
                dash: s.dash ? [4, 3] : undefined,
                opacity: opacities[si] === 1 ? undefined : opacities[si],
                glow: shine && si === 0,
              })}
            </G>
          );
        })}
        {trio.map((s, si) => (
          <Tag key={si} x={W - PAD.r - 4} y={26 + si * 16} color={s.color ?? colorsBy[si]} anchor="end" text={s.name} />
        ))}
      </G>
    );
  } else if (variant === 'liquid-batteries') {
    /* SP-09 — 5 battery vessels in a bar-chart row */
    const vs = vessels.slice(0, 5);
    const n = vs.length;
    const slot = PLOT_W / n;
    const bw = 34;
    const bh = PLOT_H - 26;
    body = (
      <G>
        {vs.map((v, i) => {
          const x = PAD.l + i * slot + (slot - bw) / 2;
          const y = PAD.t + 10;
          return (
            <G key={i}>
              <VesselGlyph
                x={x}
                y={y}
                w={bw}
                h={bh}
                level={v.level}
                vid={`lk-supp-${uid}-${i}`}
                bubbles={v.level > 0.3}
                shine={shine}
              />
              <Label x={x + bw / 2} y={H - 2} fill={zoneOf(v.level)}>
                {v.name}
              </Label>
            </G>
          );
        })}
      </G>
    );
  } else {
    /* SP-10 — battery-hero: one large 56px vessel + side ticks + stats */
    const bx = 78;
    const by = PAD.t + 12;
    const bw = 56;
    const bh = PLOT_H - 20;
    const lowY = by + bh - (bh - 6) * lowAt;
    body = (
      <G>
        <VesselGlyph x={bx} y={by} w={bw} h={bh} level={level} vid={`lk-supp-${uid}-hero`} bubbles shine={shine} />
        {/* FULL / LOW ticks */}
        <Line x1={bx + bw + 4} x2={bx + bw + 10} y1={by + 4} y2={by + 4} stroke={colors.text} strokeOpacity={0.35} strokeWidth={1} />
        <Label x={bx + bw + 14} y={by + 7} fill={colors.textFaint} anchor="start">
          FULL
        </Label>
        <Line x1={bx + bw + 4} x2={bx + bw + 10} y1={rd(lowY)} y2={rd(lowY)} stroke={colors.zoneLow} strokeWidth={1} />
        <Label x={bx + bw + 14} y={lowY + 3} fill={colors.zoneLow} anchor="start">
          LOW
        </Label>
        {/* right-side stats */}
        <SvgText x={196} y={56} fill={colors.text} fontSize={24} fontFamily={fonts.display} fontWeight="700">
          {`${Math.round(Math.max(0, Math.min(1, level)) * 100)}%`}
        </SvgText>
        {heroCaption ? (
          <Label x={196} y={72} fill={colors.textDim} anchor="start">
            {heroCaption}
          </Label>
        ) : null}
        {heroStatus ? <Tag x={196 + 34} y={92} color={heroStatusColor} text={heroStatus} /> : null}
        {heroNote ? (
          <Label x={196} y={112} fill={colors.textFaint} anchor="start">
            {heroNote}
          </Label>
        ) : null}
      </G>
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
        {stat ? (
          <SvgText x={W - PAD.r - 2} y={12} fill={statColor} textAnchor="end" fontSize={12} fontFamily={fonts.display} fontWeight="700">
            {stat}
          </SvgText>
        ) : null}
        {showBands ? <LevelBands /> : null}
        {body}
        {axis ? (
          <G>
            <Label x={PAD.l + 14} y={H - 2} fill={colors.textFaint} anchor="start">
              {axis[0]}
            </Label>
            <Label x={W - PAD.r - 2} y={H - 2} fill={colors.textFaint} anchor="end">
              {axis[1]}
            </Label>
          </G>
        ) : null}
      </Svg>
    </View>
  );
}

/* SP-07 default — the catalog's three kinetics (slow build · mid · sawtooth) */
const DEFAULT_STACK_SERIES: SupplementSeries[] = [
  { name: 'CREATINE', levels: satLevels(CREATINE_DOSES, 0.3, 0.12), color: colors.mint },
  {
    name: 'MAGNESIUM',
    levels: satLevels(
      [true, false, true, true, false, true, true, false, true, true, true, false, true, true],
      0.45,
      0.35,
    ),
    color: colors.cyan,
  },
  {
    name: 'CAFFEINE',
    levels: Array.from({ length: 14 }, (_, i) => 0.15 + 0.5 * Math.abs(Math.sin(i * 1.7)) * Math.pow(0.9, i % 3)),
    color: colors.zoneMid,
    dash: true,
  },
];

const styles = StyleSheet.create({
  /* fixed catalog aspect (320×150); the Svg scales the viewBox to fit */
  root: { width: '100%', aspectRatio: W / H },
});
