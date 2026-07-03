import { useId, type SVGProps } from 'react';
import { cn } from '../cn';

/* MetaphorWidget — the catalog metaphor-widget family (MT-01…MT-12,
   lockin90-design/charts/metaphor-charts.html): objects that tell the story —
   thermometers, hourglasses, gardens, mountains, bottles, plates and breath
   orbs, all drawn in the fixed 320×150 catalog viewBox. (MT-02/04/08 do not
   exist — numbering gaps.) */

/** Catalog variant names (`lockin90-design/charts/metaphor-charts.html`). */
export type MetaphorWidgetVariant =
  | 'thermometer' /* MT-01 — glass tube + bulb, liquid column = value */
  | 'fasting-hourglass' /* MT-03 — sand remaining/elapsed + falling stream */
  | 'habit-garden' /* MT-05 — plants grow with streaks, wilt when broken */
  | 'plant-stages' /* MT-06 — the garden legend: 5 growth stages in a row */
  | 'mountain-route' /* MT-07 — mountain profile + camp flags + YOU pulse */
  | 'hydration-bottle' /* MT-09 — bottle fills UP: wave + bubbles + glass ticks */
  | 'meal-plates' /* MT-10 — day strip of mini macro-donut plates */
  | 'breath-pacer' /* MT-11 — orb grows on inhale (SVG animate loop) */
  | 'breath-session'; /* MT-12 — breaths/min curve into the shaded calm zone */

/** One plant in the `habit-garden` (MT-05). */
export interface MetaphorHabit {
  /** name under the plant (e.g. 'MEDITATE') */
  name: string;
  /** streak length in weeks — growth stage is `min(4, weeks)`; `0` = wilted sprout */
  weeks: number;
  /** plant hue (token; wilted/broken habits pass `var(--zone-low)`) */
  color?: string;
}

/** One plate on the `meal-plates` day strip (MT-10). */
export interface MetaphorMeal {
  /** time caption under the plate (e.g. '12:30') */
  time: string;
  /** position along the day strip, 0–1 */
  at: number;
  /** macro shares `[protein, carbs, fat]`, fractions summing to 1 */
  macros: [number, number, number];
  /** kcal readout above the plate (number or preformatted string) */
  kcal: string | number;
}

/** One flag on the `mountain-route` profile (MT-07). */
export interface MetaphorCamp {
  /** position along the route, 0–1 */
  at: number;
  /** flag chip text (e.g. 'CAMP 1 · D30') */
  label: string;
  /** lime summit flag instead of the cyan camp flag */
  summit?: boolean;
}

export interface MetaphorWidgetProps
  extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height' | 'children' | 'target'> {
  /** chart form (default `'thermometer'`, MT-01) */
  variant?: MetaphorWidgetVariant;
  /** `thermometer` liquid 0–1 (default 0.62) · `hydration-bottle` fill 0–1 (default 0.6) */
  level?: number;
  /** `fasting-hourglass` — sand remaining 0–1 (default 0.35) */
  remaining?: number;
  /** big readout next to the vessel (per-variant catalog default) */
  reading?: string;
  /** dim line under the reading (per-variant catalog default) */
  sub?: string;
  /** chip-pill text (per-variant catalog default; `''` hides) */
  pill?: string;
  /** pill tint (per-variant catalog default) */
  pillColor?: string;
  /** `thermometer` — TARGET tick 0–1 on the tube scale (default none) */
  target?: number | null;
  /** `thermometer` — label next to the target tick */
  targetLabel?: string;
  /** `hydration-bottle` — glass tick count (default 8) */
  glasses?: number;
  /** `habit-garden` — the plants (default: the catalog's 6 habits) */
  habits?: MetaphorHabit[];
  /** `plant-stages` — stage captions, sprout → bloom (default catalog 5) */
  stages?: string[];
  /** `mountain-route` — profile points `[x 0–1, y 0–1]`, left → summit */
  route?: [number, number][];
  /** `mountain-route` — camp/summit flags on the profile */
  camps?: MetaphorCamp[];
  /** `mountain-route` — YOU position along the route 0–1 (default 0.62) */
  progress?: number;
  /** `mountain-route` — YOU chip text (default 'YOU · DAY 56') */
  progressLabel?: string;
  /** `meal-plates` — the plates (default: the catalog's 4 meals) */
  meals?: MetaphorMeal[];
  /** `meal-plates` — show the FAT/CARB/PRO legend (default true) */
  legend?: boolean;
  /** `breath-pacer` — `[inhale, hold, exhale]` seconds (default `[4, 7, 8]`) */
  pattern?: [number, number, number];
  /** `breath-pacer` — orb label (default 'BREATHE') */
  centerLabel?: string;
  /** `breath-session` — breaths-per-minute series (default: the catalog's 14→7) */
  bpm?: number[];
  /** `breath-session` — calm-zone threshold in breaths/min (default 8) */
  calmThreshold?: number;
  /** `breath-session` — index of the calm-reached dot (default 7; `null` hides) */
  markerAt?: number | null;
  /** `breath-session` — marker chip text (default 'CALM REACHED · 6:40') */
  markerLabel?: string;
  /** `breath-session` — x-axis captions, spread evenly (default 0:00/5:00/10:00) */
  axisLabels?: string[];
  /** faint note line — garden top-center / pacer bottom / session top-right
   *  legend (per-variant catalog default, some derived from the data) */
  caption?: string;
  /** faint mono caption at the top-left (per-variant catalog default) */
  title?: string;
  /** glow underlay (thermometer bulb / mountain line / treected marks) */
  shine?: boolean;
  /** rendered width in px — the 320×150 viewBox scales to fit */
  width?: number;
  /** rendered height in px */
  height?: number;
}

/* --------------------------------------------------------------- geometry
 * The catalog canvas: 320×150, pad l10 r12 t16 b14 (catalog.js). */
const W = 320;
const H = 150;
const P = { l: 10, r: 12, t: 16, b: 14 };
const plotW = W - P.l - P.r;
const plotH = H - P.t - P.b;

const MONO = 'var(--font-mono)';
const DISPLAY = 'var(--font-display)';

/** y for a 0–1 value in the plot box (catalog `Y`) */
function Y(v: number): number {
  return P.t + (1 - v) * plotH;
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

/** piecewise-linear y (0–1) along the route at x (0–1) */
function routeY(route: [number, number][], x: number): number {
  if (route.length === 0) return 0;
  if (x <= route[0]![0]) return route[0]![1];
  for (let i = 1; i < route.length; i++) {
    if (x <= route[i]![0]) {
      const [x0, y0] = route[i - 1]!;
      const [x1, y1] = route[i]!;
      const t = x1 === x0 ? 0 : (x - x0) / (x1 - x0);
      return y0 + t * (y1 - y0);
    }
  }
  return route[route.length - 1]![1];
}

/* ----------------------------------------------------- catalog defaults */

const DEFAULT_HABITS: MetaphorHabit[] = [
  { name: 'MEDITATE', weeks: 4, color: 'var(--mint)' },
  { name: 'LIFT', weeks: 3, color: 'var(--cyan)' },
  { name: 'SUNLIGHT', weeks: 5, color: 'var(--lime)' },
  { name: 'NO-CAFF', weeks: 1, color: 'var(--zone-mid)' },
  { name: 'JOURNAL', weeks: 2, color: 'var(--violet)' },
  { name: 'WALK', weeks: 0, color: 'var(--zone-low)' },
];

const DEFAULT_STAGES = ['SPROUT', 'WK 1', 'WK 2', 'WK 4', 'WK 8+'];

const DEFAULT_ROUTE: [number, number][] = [
  [0, 0.1],
  [0.14, 0.22],
  [0.3, 0.34],
  [0.42, 0.3],
  [0.58, 0.55],
  [0.72, 0.68],
  [0.86, 0.8],
  [1, 0.95],
];

const DEFAULT_CAMPS: MetaphorCamp[] = [
  { at: 0.3, label: 'CAMP 1 · D30' },
  { at: 0.58, label: 'CAMP 2 · D60' },
  { at: 1, label: 'SUMMIT · D90', summit: true },
];

const DEFAULT_MEALS: MetaphorMeal[] = [
  { time: '7:40', at: 0.1, macros: [0.4, 0.35, 0.25], kcal: '420' },
  { time: '12:30', at: 0.42, macros: [0.45, 0.3, 0.25], kcal: '680' },
  { time: '16:00', at: 0.62, macros: [0.3, 0.5, 0.2], kcal: '210' },
  { time: '19:30', at: 0.86, macros: [0.42, 0.3, 0.28], kcal: '740' },
];

/** the catalog's MT-12 session curve — breaths/min slowing 14 → 7 */
const DEFAULT_BPM = [14, 13.5, 12.5, 11.5, 10.5, 9.5, 8.5, 8, 7.5, 7.2, 7, 7];

const DEFAULT_TITLES: Record<MetaphorWidgetVariant, string> = {
  thermometer: 'STRAIN METER',
  'fasting-hourglass': 'FASTING',
  'habit-garden': 'YOUR GARDEN · 6 HABITS',
  'plant-stages': 'HOW PLANTS GROW',
  'mountain-route': '90-DAY ASCENT',
  'hydration-bottle': 'WATER · TODAY',
  'meal-plates': 'MEALS · TODAY',
  'breath-pacer': 'BREATHE · 4-7-8',
  'breath-session': 'SESSION · 10 MIN',
};

/* macro colors — [protein, carbs, fat], catalog `cols` + legend order */
const MACRO_COLORS = ['var(--mint)', 'var(--cyan)', 'var(--violet)'];
const MACRO_LEGEND: [string, string][] = [
  ['FAT', 'var(--violet)'],
  ['CARB', 'var(--cyan)'],
  ['PRO', 'var(--mint)'],
];

function Label({
  x,
  y,
  text,
  color = 'var(--text-faint)',
  anchor = 'middle',
}: {
  x: number;
  y: number;
  text: string;
  color?: string;
  anchor?: 'start' | 'middle' | 'end';
}) {
  return (
    <text
      x={x}
      y={y}
      fill={color}
      fontSize={8.5}
      textAnchor={anchor}
      style={{ fontFamily: MONO, letterSpacing: '0.06em' }}
    >
      {text}
    </text>
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
    <g>
      <rect
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
      <text
        x={(xa + w / 2).toFixed(1)}
        y={(y + 2.8).toFixed(1)}
        fill={color}
        fontSize={8}
        textAnchor="middle"
        style={{ fontFamily: MONO, letterSpacing: '0.05em' }}
      >
        {text}
      </text>
    </g>
  );
}

/** big display readout next to a vessel (thermo 26px / hourglass + bottle 24px) */
function Reading({ x, y, text, size, color }: { x: number; y: number; text: string; size: number; color: string }) {
  return (
    <text x={x} y={y} fill={color} fontSize={size} fontWeight={700} style={{ fontFamily: DISPLAY }}>
      {text}
    </text>
  );
}

/** one garden plant — stage 0 (sprout dot) … 4 (bloom), catalog `plant()` */
function Plant({ x, baseY, stage, color }: { x: number; baseY: number; stage: number; color: string }) {
  const mound = <path d={`M${x - 9} ${baseY}q9 8 18 0z`} fill="rgba(255,255,255,0.12)" />;
  if (stage === 0) {
    return (
      <g>
        {mound}
        <circle cx={x} cy={baseY - 3} r={2} fill={color} opacity={0.7} />
      </g>
    );
  }
  const hgt = 8 + stage * 8;
  const leaves = [];
  for (let li = 1; li <= Math.min(3, stage); li++) {
    const ly = baseY - (hgt * li) / (stage + 1);
    const dir = li % 2 ? -1 : 1;
    leaves.push(
      <path
        key={li}
        d={`M${x} ${ly.toFixed(1)}q${7 * dir} -2 ${9 * dir} -7q${-7 * dir} 0 ${-9 * dir} 7z`}
        fill={color}
        opacity={0.85}
      />,
    );
  }
  return (
    <g>
      {mound}
      <path
        d={`M${x} ${baseY}q2 ${-hgt / 2} 0 ${-hgt}`}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      {leaves}
      {stage >= 4 ? (
        <circle
          cx={x}
          cy={baseY - hgt - 3}
          r={3.2}
          fill="var(--lime)"
          style={{ filter: 'drop-shadow(0 0 4px var(--lime))' }}
        />
      ) : null}
    </g>
  );
}

/** glowing pulse marker (dot + SMIL expanding ring) — catalog `pulseDot` */
function PulseDot({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r={3.6} fill={color} style={{ filter: `drop-shadow(0 0 5px ${color})` }} />
      <circle cx={x} cy={y} r={3.6} fill="none" stroke={color} strokeWidth={1.4}>
        <animate attributeName="r" values="3.6;11" dur="1.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values=".8;0" dur="1.8s" repeatCount="indefinite" />
      </circle>
    </g>
  );
}

/**
 * MetaphorWidget — the kit's object-metaphor widget (catalog family
 * `metaphor-charts`, MT-01…MT-12): a value drawn as the thing it measures.
 *
 * - `thermometer` (MT-01, default) — glass tube + bulb, liquid column = value,
 *   colored cyan → amber → coral as it heats; optional TARGET tick, `shine`
 *   glows the bulb.
 * - `fasting-hourglass` (MT-03) — amber sand: top = remaining, bottom =
 *   elapsed, falling stream between; countdown reading + pill.
 * - `habit-garden` (MT-05) — one plant per habit, growth stage = streak weeks
 *   (bloom glows lime at 4+), wilted coral = broken.
 * - `plant-stages` (MT-06) — the garden legend: 5 stages sprout → bloom.
 * - `mountain-route` (MT-07) — indigo mountain profile + veil fill, camp
 *   flags + lime summit, YOU pulse at `progress`.
 * - `hydration-bottle` (MT-09) — the bottle fills UP: cyan liquid + wave +
 *   bubbles, glass ticks light up as you drink.
 * - `meal-plates` (MT-10) — a day strip of mini macro-donut plates (kcal
 *   above, time under, FAT/CARB/PRO legend).
 * - `breath-pacer` (MT-11) — guide rings + a cyan orb that grows on inhale
 *   (SMIL loop timed by `pattern`).
 * - `breath-session` (MT-12) — breaths/min curve slowing into the shaded
 *   CALM ZONE + calm-reached pill.
 *
 * Geometry is the catalog's 320×150 canvas (scaled via `width`/`height`);
 * tokens only. With no data props each variant renders its catalog card.
 */
export function MetaphorWidget({
  variant = 'thermometer',
  level,
  remaining = 0.35,
  reading,
  sub,
  pill,
  pillColor,
  target = null,
  targetLabel = 'TARGET',
  glasses = 8,
  habits = DEFAULT_HABITS,
  stages = DEFAULT_STAGES,
  route = DEFAULT_ROUTE,
  camps = DEFAULT_CAMPS,
  progress = 0.62,
  progressLabel = 'YOU · DAY 56',
  meals = DEFAULT_MEALS,
  legend = true,
  pattern = [4, 7, 8],
  centerLabel = 'BREATHE',
  bpm = DEFAULT_BPM,
  calmThreshold = 8,
  markerAt = 7,
  markerLabel = 'CALM REACHED · 6:40',
  axisLabels = ['0:00', '5:00', '10:00'],
  caption,
  title,
  shine = false,
  width = W,
  height = H,
  className,
  ...rest
}: MetaphorWidgetProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const heading = title ?? DEFAULT_TITLES[variant];
  const svgProps = {
    className: cn('lk-metaphor', className),
    width,
    height,
    viewBox: `0 0 ${W} ${H}`,
    role: 'img',
    ...rest,
  };
  const head = <Label x={P.l + 2} y={11} text={heading} anchor="start" />;

  /* --------------------------------------------------- MT-01 thermometer */
  if (variant === 'thermometer') {
    const lvl = Math.max(0, Math.min(1, level ?? 0.62));
    const col = lvl >= 0.72 ? 'var(--zone-low)' : lvl >= 0.4 ? 'var(--zone-mid)' : 'var(--cyan)';
    const x = 86;
    const yTop = P.t + 12;
    const hgt = 84;
    const tubeW = 12;
    const bulbY = yTop + hgt + 10;
    const lh = lvl * (hgt - 6);
    const read = reading ?? '14.2';
    const pillText = pill ?? 'APPROACHING LIMIT';
    return (
      <svg {...svgProps} aria-label={`${heading}: ${read}, level ${Math.round(lvl * 100)}%`}>
        {head}
        <rect
          x={x - tubeW / 2}
          y={yTop}
          width={tubeW}
          height={hgt + 8}
          rx={tubeW / 2}
          fill="rgba(255,255,255,0.05)"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth={1.4}
        />
        <circle cx={x} cy={bulbY} r={11} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.25)" strokeWidth={1.4} />
        {shine ? <circle cx={x} cy={bulbY} r={9} fill={col} opacity={0.6} style={{ filter: 'blur(5px)' }} /> : null}
        <circle cx={x} cy={bulbY} r={8} fill={col} opacity={0.95} />
        <rect
          x={x - 3.5}
          y={(yTop + hgt - lh).toFixed(1)}
          width={7}
          height={(lh + 14).toFixed(1)}
          rx={3.5}
          fill={col}
          opacity={0.95}
        />
        {Array.from({ length: 5 }, (_, t) => {
          const ty = yTop + 4 + ((hgt - 8) * t) / 4;
          return (
            <line
              key={t}
              x1={x + tubeW / 2 + 3}
              x2={x + tubeW / 2 + 8}
              y1={ty}
              y2={ty}
              stroke="rgba(255,255,255,0.25)"
              strokeWidth={1}
            />
          );
        })}
        {target != null ? (
          <g>
            <line
              x1={100}
              x2={112}
              y1={P.t + 16 + (hgt - 8) * (1 - target)}
              y2={P.t + 16 + (hgt - 8) * (1 - target)}
              stroke="var(--zone-low)"
              strokeWidth={1.4}
            />
            <Label x={116} y={P.t + 16 + (hgt - 8) * (1 - target) + 3} text={targetLabel} color="var(--zone-low)" anchor="start" />
          </g>
        ) : null}
        <Reading x={170} y={78} text={read} size={26} color={col} />
        <Label x={170} y={94} text={sub ?? 'STRAIN · DAY LOAD'} color="var(--text-dim)" anchor="start" />
        {pillText ? <Tag x={210} y={112} text={pillText} color={pillColor ?? 'var(--zone-mid)'} /> : null}
      </svg>
    );
  }

  /* --------------------------------------------- MT-03 fasting-hourglass */
  if (variant === 'fasting-hourglass') {
    const frac = Math.max(0, Math.min(1, remaining));
    const cx = 88;
    const top = P.t + 14;
    const hgt = 92;
    const w2 = 46;
    const topH = (hgt / 2 - 6) * frac;
    const read = reading ?? '4H 20M';
    const pillText = pill ?? 'EATING OPENS 12:30';
    return (
      <svg {...svgProps} aria-label={`${heading}: ${read} remaining`}>
        {head}
        <path
          d={`M${cx - w2 / 2} ${top}h${w2}l${-w2 / 2 + 3} ${hgt / 2 - 4}v8l${w2 / 2 - 3} ${hgt / 2 - 4}h${-w2}l${w2 / 2 - 3} ${-hgt / 2 + 4}v-8z`}
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth={1.4}
        />
        <path
          d={`M${cx - (w2 / 2 - 3) * frac} ${top + hgt / 2 - 4 - topH}L${cx + (w2 / 2 - 3) * frac} ${top + hgt / 2 - 4 - topH}L${cx} ${top + hgt / 2 - 2}Z`}
          fill="var(--zone-mid)"
          opacity={0.85}
        />
        <path
          d={`M${cx} ${top + hgt / 2 + 4}L${cx - (w2 / 2 - 4) * (1 - frac)} ${top + hgt - 3}H${cx + (w2 / 2 - 4) * (1 - frac)}Z`}
          fill="var(--zone-mid)"
          opacity={0.55}
        />
        {frac > 0.03 ? (
          <line
            x1={cx}
            x2={cx}
            y1={top + hgt / 2 - 2}
            y2={top + hgt - 4}
            stroke="var(--zone-mid)"
            strokeWidth={1.2}
            strokeDasharray="2 3"
            opacity={0.7}
          />
        ) : null}
        <Reading x={170} y={74} text={read} size={24} color="var(--text)" />
        <Label x={170} y={90} text={sub ?? 'FAST · 16:8 WINDOW'} color="var(--text-dim)" anchor="start" />
        {pillText ? <Tag x={212} y={108} text={pillText} color={pillColor ?? 'var(--zone-mid)'} /> : null}
      </svg>
    );
  }

  /* -------------------------------------------------- MT-05 habit-garden */
  if (variant === 'habit-garden') {
    const baseY = H - P.b - 22;
    const note = caption ?? 'EACH PLANT GROWS WITH ITS STREAK · WILTS WHEN SKIPPED';
    return (
      <svg {...svgProps} aria-label={`${heading}: ${habits.length} habit plants`}>
        {head}
        {habits.map((hb, i) => {
          const x = P.l + 30 + (i * (plotW - 50)) / Math.max(1, habits.length - 1);
          const col = hb.color ?? 'var(--mint)';
          return (
            <g key={i}>
              <Plant x={x} baseY={baseY} stage={Math.min(4, hb.weeks)} color={col} />
              <Label x={x} y={baseY + 12} text={hb.name} color={col} />
              <Label x={x} y={baseY + 22} text={`${hb.weeks * 7}D`} />
            </g>
          );
        })}
        {note ? <Label x={W / 2} y={P.t + 8} text={note} /> : null}
      </svg>
    );
  }

  /* -------------------------------------------------- MT-06 plant-stages */
  if (variant === 'plant-stages') {
    const baseY = H - P.b - 24;
    const pillText = pill ?? 'YOUR MEDITATE PLANT · WEEK 4';
    return (
      <svg {...svgProps} aria-label={`${heading}: ${stages.length} growth stages`}>
        {head}
        {stages.map((lb, i) => {
          const x = P.l + 34 + (i * (plotW - 60)) / Math.max(1, stages.length - 1);
          const last = i === stages.length - 1;
          const col = last ? 'var(--mint)' : `rgba(52,245,197,${0.4 + i * 0.15})`;
          return (
            <g key={i}>
              <Plant x={x} baseY={baseY} stage={Math.min(4, i)} color={col} />
              <Label x={x} y={H - P.b - 10} text={lb} color={last ? 'var(--mint)' : 'var(--text-faint)'} />
            </g>
          );
        })}
        {pillText ? <Tag x={W / 2} y={P.t + 12} text={pillText} color={pillColor ?? 'var(--mint)'} /> : null}
      </svg>
    );
  }

  /* ------------------------------------------------ MT-07 mountain-route */
  if (variant === 'mountain-route') {
    const pts = route.map(([px, py]) => ({ x: P.l + 6 + (plotW - 12) * px, y: Y(py) }));
    const d = pts.map((q, i) => `${i ? 'L' : 'M'}${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join('');
    const gradId = `lk-metaphor-m-${uid}`;
    const cq = { x: P.l + 6 + (plotW - 12) * progress, y: Y(routeY(route, progress)) };
    return (
      <svg {...svgProps} aria-label={`${heading}: ${camps.length} camps, you at ${Math.round(progress * 100)}%`}>
        {head}
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--indigo)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--indigo)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <path d={`${d}L${W - P.r} ${H - P.b}L${P.l} ${H - P.b}Z`} fill={`url(#${gradId})`} />
        {shine ? (
          <path d={d} fill="none" stroke="var(--indigo)" strokeWidth={7} strokeLinecap="round" opacity={0.45} style={{ filter: 'blur(5px)' }} />
        ) : null}
        <path d={d} fill="none" stroke="var(--indigo)" strokeWidth={2.2} strokeLinecap="round" />
        {camps.map((cp, i) => {
          const q = { x: P.l + 6 + (plotW - 12) * cp.at, y: Y(routeY(route, cp.at)) };
          const c = cp.summit ? 'var(--lime)' : 'var(--cyan)';
          return (
            <g key={i}>
              <line x1={q.x.toFixed(1)} x2={q.x.toFixed(1)} y1={q.y.toFixed(1)} y2={(q.y - 14).toFixed(1)} stroke="rgba(255,255,255,0.35)" strokeWidth={1.2} />
              <path d={`M${q.x.toFixed(1)} ${(q.y - 14).toFixed(1)}l9 3.5-9 3.5z`} fill={c} />
              <Tag x={q.x} y={q.y + 13} text={cp.label} color={c} />
            </g>
          );
        })}
        <PulseDot x={cq.x} y={cq.y} color="var(--mint)" />
        {progressLabel ? <Tag x={cq.x - 8} y={cq.y - 16} text={progressLabel} color="var(--mint)" anchor="end" /> : null}
      </svg>
    );
  }

  /* --------------------------------------------- MT-09 hydration-bottle */
  if (variant === 'hydration-bottle') {
    const lvl = Math.max(0, Math.min(1, level ?? 0.6));
    const bx = 80;
    const by = P.t + 10;
    const bw = 42;
    const bh = 96;
    const lt = by + bh - 2 - lvl * (bh - 6);
    const clipId = `lk-metaphor-b-${uid}`;
    const gradId = `lk-metaphor-w-${uid}`;
    const wave = `M${bx + 1.5} ${lt.toFixed(1)}Q${bx + bw * 0.3} ${(lt - 2.6).toFixed(1)} ${bx + bw / 2} ${lt.toFixed(1)}Q${bx + bw * 0.72} ${(lt + 2.6).toFixed(1)} ${bx + bw - 1.5} ${lt.toFixed(1)}L${bx + bw - 1.5} ${by + bh}L${bx + 1.5} ${by + bh}Z`;
    const read = reading ?? '1.6 L';
    const pillText = pill ?? 'NEXT GLASS · 15:30';
    const bubbles: [number, number, number][] = [
      [0.35, 0.4, 1.6],
      [0.6, 0.2, 1.2],
      [0.5, 0.65, 2],
    ];
    return (
      <svg {...svgProps} aria-label={`${heading}: ${read}, ${Math.round(lvl * glasses)} of ${glasses} glasses`}>
        {head}
        <defs>
          <clipPath id={clipId}>
            <rect x={bx + 1.5} y={by + 1.5} width={bw - 3} height={bh - 3} rx={10.5} />
          </clipPath>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--cyan)" stopOpacity={0.85} />
            <stop offset="100%" stopColor="var(--cyan)" stopOpacity={0.4} />
          </linearGradient>
        </defs>
        <rect x={bx + bw / 2 - 7} y={by - 8} width={14} height={10} rx={3} fill="rgba(255,255,255,0.18)" />
        <rect x={bx} y={by} width={bw} height={bh} rx={12} fill="rgba(255,255,255,0.045)" stroke="rgba(255,255,255,0.24)" strokeWidth={1.4} />
        <path d={wave} fill={`url(#${gradId})`} clipPath={`url(#${clipId})`} />
        {bubbles.map((b, i) => (
          <circle
            key={i}
            cx={bx + bw * b[0]}
            cy={by + bh - (bh - 6) * lvl * b[1]}
            r={b[2]}
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth={0.8}
            clipPath={`url(#${clipId})`}
          />
        ))}
        {Array.from({ length: glasses }, (_, gi) => {
          const g = gi + 1;
          const gy = by + bh - ((bh - 6) * g) / glasses;
          return (
            <line
              key={g}
              x1={bx + bw + 4}
              x2={bx + bw + (g % 4 === 0 ? 12 : 8)}
              y1={gy}
              y2={gy}
              stroke={g <= Math.round(lvl * glasses) ? 'var(--cyan)' : 'rgba(255,255,255,0.2)'}
              strokeWidth={1.2}
            />
          );
        })}
        <Reading x={176} y={70} text={read} size={24} color="var(--cyan)" />
        <Label x={176} y={86} text={sub ?? 'OF 2.6 L · 5 OF 8 GLASSES'} color="var(--text-dim)" anchor="start" />
        {pillText ? <Tag x={218} y={104} text={pillText} color={pillColor ?? 'var(--cyan)'} /> : null}
      </svg>
    );
  }

  /* ---------------------------------------------------- MT-10 meal-plates */
  if (variant === 'meal-plates') {
    const y = H / 2 + 10;
    let lx = W - P.r - 2;
    return (
      <svg {...svgProps} aria-label={`${heading}: ${meals.length} meals on the day strip`}>
        {head}
        <line x1={P.l + 6} x2={W - P.r - 6} y1={y} y2={y} stroke="rgba(255,255,255,0.14)" strokeWidth={1.5} strokeLinecap="round" />
        {meals.map((ml, i) => {
          const x = P.l + 6 + (plotW - 12) * ml.at;
          let a = 0;
          return (
            <g key={i}>
              <circle cx={x.toFixed(1)} cy={y - 22} r={13} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
              {ml.macros.map((f, fi) => {
                const a1 = a + f * 360;
                const d = arcPath(x, y - 22, 9, a + 2, a1 - 2);
                a = a1;
                return <path key={fi} d={d} fill="none" stroke={MACRO_COLORS[fi]} strokeWidth={5} strokeLinecap="butt" />;
              })}
              <line x1={x.toFixed(1)} x2={x.toFixed(1)} y1={y - 9} y2={y} stroke="rgba(255,255,255,0.25)" strokeWidth={1} />
              <circle cx={x.toFixed(1)} cy={y} r={2.4} fill="var(--text)" />
              <Label x={x} y={y + 14} text={ml.time} />
              <Label x={x} y={y - 42} text={`${ml.kcal} KCAL`} color="var(--text-dim)" />
            </g>
          );
        })}
        {legend
          ? MACRO_LEGEND.map(([name, col]) => {
              const tx = lx;
              lx -= name.length * 5.6 + 8;
              const dx = lx;
              lx -= 8;
              return (
                <g key={name}>
                  <Label x={tx} y={11} text={name} color="var(--text-dim)" anchor="end" />
                  <circle cx={dx} cy={8.2} r={3} fill={col} />
                </g>
              );
            })
          : null}
      </svg>
    );
  }

  /* --------------------------------------------------- MT-11 breath-pacer */
  if (variant === 'breath-pacer') {
    const bx = 118;
    const by = 78;
    const [tIn, tHold, tOut] = pattern;
    const T = tIn + tHold + tOut;
    const k1 = (tIn / T).toFixed(2);
    const k2 = ((tIn + tHold) / T).toFixed(2);
    const anim = { values: '18;44;44;18;18', keyTimes: `0;${k1};${k2};0.95;1`, dur: `${T}s` };
    const note = caption ?? `${tIn}-${tHold}-${tOut} · RING GROWS ON INHALE`;
    const derivedTitle = title ?? `BREATHE · ${tIn}-${tHold}-${tOut}`;
    return (
      <svg {...svgProps} aria-label={`${derivedTitle}: in ${tIn}s, hold ${tHold}s, out ${tOut}s`}>
        <Label x={P.l + 2} y={11} text={derivedTitle} anchor="start" />
        {[24, 34, 44].map((r) => (
          <circle key={r} cx={bx} cy={by} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={1} />
        ))}
        <circle cx={bx} cy={by} r={24} fill="var(--cyan)" opacity={0.22}>
          <animate attributeName="r" values={anim.values} keyTimes={anim.keyTimes} dur={anim.dur} repeatCount="indefinite" />
        </circle>
        <circle cx={bx} cy={by} r={24} fill="none" stroke="var(--cyan)" strokeWidth={2}>
          <animate attributeName="r" values={anim.values} keyTimes={anim.keyTimes} dur={anim.dur} repeatCount="indefinite" />
        </circle>
        <Label x={bx} y={by + 3} text={centerLabel} color="var(--text)" />
        <Label x={236} y={56} text={`IN · ${tIn}S`} color="var(--cyan)" anchor="start" />
        <Label x={236} y={74} text={`HOLD · ${tHold}S`} color="var(--text-dim)" anchor="start" />
        <Label x={236} y={92} text={`OUT · ${tOut}S`} color="var(--violet)" anchor="start" />
        {note ? <Label x={bx} y={140} text={note} /> : null}
      </svg>
    );
  }

  /* ------------------------------------------------- MT-12 breath-session */
  const norm = (v: number) => (v - 5) / 11;
  const bp = bpm.map((v, i) => ({
    x: P.l + (bpm.length <= 1 ? plotW / 2 : (i * plotW) / (bpm.length - 1)),
    y: Y(Math.max(0, Math.min(1, norm(v)))),
  }));
  const zoneY = Y(Math.max(0, Math.min(1, norm(calmThreshold))));
  const cz = markerAt != null ? bp[Math.max(0, Math.min(bp.length - 1, markerAt))] : undefined;
  const first = bpm[0] ?? 0;
  const last = bpm[bpm.length - 1] ?? 0;
  const legendText = caption ?? `BREATHS/MIN ${Math.round(first)} → ${Math.round(last)}`;
  return (
    <svg {...svgProps} aria-label={`${heading}: breaths per minute ${Math.round(first)} to ${Math.round(last)}`}>
      {head}
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1={P.l} x2={W - P.r} y1={P.t + plotH * f} y2={P.t + plotH * f} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
      ))}
      <line x1={P.l} x2={W - P.r} y1={H - P.b} y2={H - P.b} stroke="rgba(255,255,255,0.09)" strokeWidth={1} />
      <rect x={P.l} y={zoneY} width={plotW} height={Math.max(0, Y(0) - zoneY)} fill="var(--cyan)" opacity={0.07} />
      <Label x={P.l + 4} y={zoneY + 10} text={`CALM ZONE <${calmThreshold}/MIN`} color="var(--cyan)" anchor="start" />
      {bp.length > 0 ? <path d={smoothPath(bp)} fill="none" stroke="var(--cyan)" strokeWidth={2.2} strokeLinecap="round" /> : null}
      {cz ? (
        <g>
          <circle cx={cz.x.toFixed(1)} cy={cz.y.toFixed(1)} r={3.4} fill="var(--cyan)" />
          {markerLabel ? <Tag x={cz.x} y={cz.y - 14} text={markerLabel} color="var(--cyan)" /> : null}
        </g>
      ) : null}
      {axisLabels.map((tk, i) => {
        const f = axisLabels.length <= 1 ? 0.5 : i / (axisLabels.length - 1);
        const anchor = i === 0 ? 'start' : i === axisLabels.length - 1 ? 'end' : 'middle';
        return <Label key={i} x={P.l + plotW * f} y={H - 3} text={tk} anchor={anchor} />;
      })}
      {legendText ? <Label x={W - P.r - 4} y={26} text={legendText} color="var(--text-dim)" anchor="end" /> : null}
    </svg>
  );
}
