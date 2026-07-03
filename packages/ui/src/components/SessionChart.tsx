import { useEffect, useId, useState, type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../cn';

/** Catalog variant names — one per session form in
 *  `lockin90-design/charts/session-charts.html` (SN-01 … SN-10). */
export type SessionChartVariant =
  | 'hr-zones-session' // SN-01
  | 'hr-intervals' // SN-02
  | 'time-in-zones' // SN-03
  | 'hr-recovery' // SN-04
  | 'sauna-rounds' // SN-05
  | 'sauna-heat-ramp' // SN-06
  | 'night-recovery' // SN-07
  | 'glucose-response' // SN-09
  | 'response-overlay'; // SN-10

/** One HR zone band: label + color + its 0–1 slice of the intensity scale
 *  (Z1 at the bottom → Z5 at the top). */
export interface SessionZone {
  label: string;
  color: string;
  from: number;
  to: number;
}

/** One sauna heat round (0–1 fractions of the session window). */
export interface SessionRound {
  from: number;
  to: number;
  /** chip over the block; default `ROUND <n> · 15 MIN` */
  label?: string;
}

/** A small chip anchored at a 0–1 fraction of the window (PLUNGE / REST tags). */
export interface SessionTag {
  at: number;
  label: string;
}

/** An x-axis caption at a 0–1 fraction of the window. */
export interface SessionAxisLabel {
  at: number;
  label: string;
}

/** SN-04 recovery annotation — peak pulse + dashed bracket + recovery tag. */
export interface SessionRecovery {
  /** index into `hrSamples` where the peak pulse sits (default 52) */
  peakIndex?: number;
  /** index into `hrSamples` where the 60s bracket ends (default 62) */
  dropIndex?: number;
  /** mint recovery tag (default `'−32 BPM · 60S'`) */
  label?: string;
}

export interface SessionChartProps extends HTMLAttributes<HTMLDivElement> {
  /** catalog variant (SN-01 … SN-10); default `hr-zones-session` */
  variant?: SessionChartVariant;
  /** HR trace, 0–1 of the intensity scale (Z1 bottom → Z5 top). Deterministic
   *  catalog session by default. On `sauna-rounds` this is the coral dotted HR
   *  trace next to `tempSamples`. */
  hrSamples?: number[];
  /** zone band config — catalog default Z1 indigo → Z5 coral */
  zones?: SessionZone[];
  /** right-edge Z labels on the bands (default true) */
  showZoneLabels?: boolean;
  /** `hr-intervals`: number of coral work blocks (default 5) */
  intervals?: number;
  /** `hr-recovery`: peak/bracket/tag config (catalog defaults) */
  recovery?: SessionRecovery;
  /** `time-in-zones`: minutes per zone, Z1 → Z5 (default `[4,12,18,14,4]`) */
  minutes?: number[];
  /** `sauna-rounds`: amber heat blocks */
  rounds?: SessionRound[];
  /** `sauna-rounds`: PLUNGE/REST chips along the bottom */
  plunges?: SessionTag[];
  /** temperature trace 0–1 (`sauna-rounds` amber solid · `sauna-heat-ramp` ramp) */
  tempSamples?: number[];
  /** `sauna-rounds` legend chips */
  tempLabel?: string;
  hrLabel?: string;
  /** `sauna-heat-ramp`: target temperature on the 0–1 scale (default 0.85) */
  target?: number;
  /** chip on the target rule (default `'TARGET 90°C'`) */
  targetLabel?: string;
  /** live state chip at the trace head (default `'87°C · HEATING'`) */
  stateLabel?: string;
  /** `night-recovery`: HRV (mint, rising) + RHR (violet dashed, falling) traces */
  hrvSamples?: number[];
  rhrSamples?: number[];
  /** `night-recovery` delta tags */
  hrvLabel?: string;
  rhrLabel?: string;
  /** glucose curve 0–1 (`glucose-response`; the bold mean on `response-overlay`) */
  glucoseSamples?: number[];
  /** `response-overlay`: the faint single-meal curves behind the mean */
  overlays?: number[][];
  /** mint baseline band, `[low, high]` on the 0–1 scale (default `[0.36, 0.5]`) */
  baselineBand?: [number, number];
  baselineLabel?: string;
  /** meal anchor, 0–1 of the window (default 0.2) */
  mealAt?: number;
  mealLabel?: string;
  /** `glucose-response`: peak dot index into the curve (default 17) */
  peakIndex?: number;
  peakLabel?: string;
  returnLabel?: string;
  /** `response-overlay` legend chip */
  meanLabel?: string;
  /** top-left mono caption — per-variant catalog default; `''` hides */
  title?: string;
  /** top-right bold stat — per-variant catalog default; `''` hides */
  stat?: string;
  statColor?: string;
  /** x-axis captions; catalog defaults per variant */
  axisLabels?: SessionAxisLabel[];
  /** main trace stroke width (defaults: 2.5 · sauna temp 2.6 · heat ramp 3) */
  weight?: number;
  /** glow underlay — a wider blurred duplicate of the main trace */
  shine?: boolean;
  /** plot height in px (also the viewBox height); default 150 */
  height?: number;
  /** accessible description of the chart */
  ariaLabel?: string;
}

/* ---------------- catalog geometry (session-charts.html) ---------------- */

const W = 320;
const P = { l: 10, r: 12, t: 16, b: 14 } as const;
const PLOT_W = W - P.l - P.r;

const TEXT = 'var(--text)';
const DIM = 'var(--text-dim)';
const FAINT = 'var(--text-faint)';
const MINT = 'var(--mint)';

/** round for compact attribute strings */
const r = (n: number) => Math.round(n * 100) / 100;

/** HR zones Z1 (bottom) → Z5 (top) — indigo → coral, like the catalog. */
export const DEFAULT_SESSION_ZONES: SessionZone[] = [
  { label: 'Z1', color: 'var(--indigo)', from: 0, to: 0.2 },
  { label: 'Z2', color: 'var(--cyan)', from: 0.2, to: 0.4 },
  { label: 'Z3', color: 'var(--mint)', from: 0.4, to: 0.6 },
  { label: 'Z4', color: 'var(--zone-mid)', from: 0.6, to: 0.8 },
  { label: 'Z5', color: 'var(--zone-low)', from: 0.8, to: 1 },
];

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

/** session HR trace: warmup rise → work oscillation → cooldown fall. */
function hrSession(seed: number, n: number, intervals?: number): number[] {
  const rand = mulberry32(seed);
  const v: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    let base: number;
    if (t < 0.14) base = 0.22 + (t / 0.14) * 0.36;
    else if (t > 0.86) base = 0.62 - ((t - 0.86) / 0.14) * 0.34;
    else if (intervals) {
      const ph = ((t - 0.14) / 0.72) * intervals;
      base = ph % 1 < 0.55 ? 0.82 : 0.45;
    } else base = 0.62 + Math.sin((t - 0.14) * 9) * 0.1;
    v.push(clamp01(base + (rand() - 0.5) * 0.05));
  }
  return v;
}

/** sauna trace: heat rounds ramp up, cold plunge drops between. */
function saunaTrace(seed: number, n: number, rounds: number): number[] {
  const rand = mulberry32(seed);
  const v: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const f = (t * rounds) % 1;
    const base = f < 0.7 ? 0.3 + (f / 0.7) * 0.55 : 0.85 - ((f - 0.7) / 0.3) * 0.65;
    v.push(clamp01(base + (rand() - 0.5) * 0.04));
  }
  return v;
}

/** SN-06 heat-up: exponential approach toward the target. */
function heatRampData(): number[] {
  const out: number[] = [];
  for (let i = 0; i < 40; i++) {
    const t = i / 39;
    out.push(clamp01(0.15 + (1 - Math.exp(-t * 4)) * 0.75));
  }
  return out;
}

/** SN-07 overnight traces — HRV rises, RHR falls. */
function nightTraces(seed: number, n: number): { hrv: number[]; rhr: number[] } {
  const hrv: number[] = [];
  const rhr: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const rr = mulberry32(seed + i)();
    hrv.push(clamp01(0.3 + t * 0.45 + Math.sin(t * 12) * 0.06 + (rr - 0.5) * 0.05));
    rhr.push(clamp01(0.62 - t * 0.3 + Math.sin(t * 10) * 0.04));
  }
  return { hrv, rhr };
}

/** SN-09/10 meal-response curve (gaussian spike + small dip). */
function glCurve(amp: number, w2: number): number[] {
  const out: number[] = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    out.push(
      clamp01(
        0.42 +
          amp * Math.exp(-(((t - 0.42) / w2) ** 2)) -
          0.05 * Math.exp(-(((t - 0.72) / 0.1) ** 2)),
      ),
    );
  }
  return out;
}

const DEFAULT_HR_TEMPO = hrSession(11, 70);
const DEFAULT_HR_RECOVERY = hrSession(44, 70);
const DEFAULT_SAUNA_TEMP = saunaTrace(55, 60, 3);
const DEFAULT_SAUNA_HR = saunaTrace(60, 60, 3).map((v) => clamp01(v * 0.75 + 0.08));
const DEFAULT_HEAT_RAMP = heatRampData();
const DEFAULT_NIGHT = nightTraces(77, 48);
const DEFAULT_GLUC = glCurve(0.46, 0.15);
const DEFAULT_GLUC_MEAN = glCurve(0.42, 0.15);
const DEFAULT_OVERLAYS = [glCurve(0.3, 0.14), glCurve(0.44, 0.17), glCurve(0.52, 0.13)];
const DEFAULT_MINUTES = [4, 12, 18, 14, 4];
const DEFAULT_ROUNDS: SessionRound[] = [
  { from: 0, to: 0.24 },
  { from: 0.33, to: 0.57 },
  { from: 0.66, to: 0.9 },
];
const DEFAULT_PLUNGES: SessionTag[] = [
  { at: 0.27, label: 'PLUNGE' },
  { at: 0.6, label: 'PLUNGE' },
  { at: 0.93, label: 'REST' },
];

const HR_AXIS: SessionAxisLabel[] = [
  { at: 0, label: '0' },
  { at: 0.5, label: '26 MIN' },
  { at: 1, label: '52 MIN' },
];
const DEFAULT_AXES: Record<SessionChartVariant, SessionAxisLabel[]> = {
  'hr-zones-session': HR_AXIS,
  'hr-intervals': HR_AXIS,
  'time-in-zones': [],
  'hr-recovery': HR_AXIS,
  'sauna-rounds': [
    { at: 0, label: '0' },
    { at: 0.5, label: '45 MIN' },
    { at: 1, label: '90 MIN' },
  ],
  'sauna-heat-ramp': [
    { at: 0, label: '0' },
    { at: 1, label: '18 MIN' },
  ],
  'night-recovery': [
    { at: 0, label: '11PM' },
    { at: 0.5, label: '3AM' },
    { at: 1, label: '7AM' },
  ],
  'glucose-response': [
    { at: 0, label: '-30M' },
    { at: 1, label: '+2H' },
  ],
  'response-overlay': [
    { at: 0, label: '-30M' },
    { at: 1, label: '+2H' },
  ],
};

/** catalog card header defaults (title · stat · stat tint) — demo copy; pass
 *  real data / `''` to hide */
const CFG_DEFAULTS: Record<SessionChartVariant, { title: string; stat?: string; statColor?: string }> = {
  'hr-zones-session': { title: 'TRAINING · TEMPO RUN', stat: '148 AVG BPM', statColor: 'var(--zone-mid)' },
  'hr-intervals': { title: 'TRAINING · 5× INTERVALS', stat: '172 PEAK', statColor: 'var(--zone-low)' },
  'time-in-zones': { title: 'TIME IN ZONES · 52 MIN' },
  'hr-recovery': { title: 'TRAINING + RECOVERY CHECK', stat: '−32 IN 60S', statColor: 'var(--mint)' },
  'sauna-rounds': { title: 'SAUNA · 3 ROUNDS', stat: '90°C', statColor: 'var(--zone-mid)' },
  'sauna-heat-ramp': { title: 'SAUNA · WARMING UP' },
  'night-recovery': { title: 'OVERNIGHT RECOVERY', stat: '7H 40M' },
  'glucose-response': { title: 'MEAL RESPONSE · CGM', stat: '+62 PEAK', statColor: 'var(--zone-mid)' },
  'response-overlay': { title: 'SAME MEAL × 3' },
};

/** Fritsch–Carlson monotone cubic — the catalog's `smoothPath`. */
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
    }
  | { k: 'rect'; x: number; y: number; w: number; h: number; rx: number; fill: string; opacity?: number }
  | { k: 'path'; d: string; stroke: string; w: number; opacity?: number; dash?: string; cap?: boolean; blur?: number };

interface ODot {
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
  stat?: boolean;
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

/** track `prefers-reduced-motion` — pulses stay static until motion is allowed */
function useMotionOK(): boolean {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) setOk(true);
  }, []);
  return ok;
}

/**
 * SessionChart — the session family: one recorded session as a story (catalog
 * SN-01…SN-10). `variant` covers HR training over the 5 zone bands (Z1 indigo
 * → Z5 coral) with the trace stroked by zone height, interval work blocks, the
 * time-in-zones summary rows, HR recovery (peak pulse + 60s bracket + drop
 * tag), sauna rounds (heat blocks + plunge tags + TEMP/HR traces) and heat
 * ramp vs target, overnight recovery (HRV up / RHR down on a violet canvas)
 * and CGM meal-response curves (baseline band + MEAL rule + peak/return, or a
 * 3-curve overlay with the bold mean). The SVG uses
 * `preserveAspectRatio="none"` so it stretches to any width; dots, chips and
 * text are HTML overlays positioned by percentage so they stay round and
 * legible.
 */
export function SessionChart({
  variant = 'hr-zones-session',
  hrSamples,
  zones = DEFAULT_SESSION_ZONES,
  showZoneLabels = true,
  intervals = 5,
  recovery,
  minutes = DEFAULT_MINUTES,
  rounds = DEFAULT_ROUNDS,
  plunges = DEFAULT_PLUNGES,
  tempSamples,
  tempLabel = 'TEMP',
  hrLabel = 'HR',
  target = 0.85,
  targetLabel = 'TARGET 90°C',
  stateLabel = '87°C · HEATING',
  hrvSamples = DEFAULT_NIGHT.hrv,
  rhrSamples = DEFAULT_NIGHT.rhr,
  hrvLabel = 'HRV +38%',
  rhrLabel = 'RHR −12',
  glucoseSamples,
  overlays = DEFAULT_OVERLAYS,
  baselineBand = [0.36, 0.5],
  baselineLabel = 'BASELINE 80-110',
  mealAt = 0.2,
  mealLabel = 'MEAL 12:40',
  peakIndex = 17,
  peakLabel = '+62 MG/DL PEAK',
  returnLabel = 'BACK TO BASE · 1H 40M',
  meanLabel = 'MEAN OF 3 MEALS',
  title,
  stat,
  statColor,
  axisLabels,
  weight,
  shine = false,
  height = 150,
  ariaLabel,
  className,
  style,
  ...rest
}: SessionChartProps) {
  const uid = useId();
  const zoneId = `lk-snc-zone-${uid.replace(/[^a-zA-Z0-9]/g, '')}`;
  const heatId = `lk-snc-heat-${uid.replace(/[^a-zA-Z0-9]/g, '')}`;
  const motionOK = useMotionOK();

  const h = height;
  const plotH = h - P.t - P.b;
  const X = (i: number, n: number) => P.l + (n > 1 ? (i * PLOT_W) / (n - 1) : PLOT_W / 2);
  const Y = (v: number) => P.t + (1 - v) * plotH;
  const toPts = (data: number[]) => data.map((v, i) => [X(i, data.length), Y(v)] as [number, number]);

  const marks: SvgMark[] = [];
  const oDots: ODot[] = [];
  const oNotes: ONote[] = [];
  const oChips: OChip[] = [];
  const oPulses: OPulse[] = [];
  let needZoneGrad = false;
  let needHeatGrad = false;

  const cfg = CFG_DEFAULTS[variant];
  const resolvedTitle = title ?? cfg.title;
  const resolvedStat = stat ?? cfg.stat;
  const resolvedStatColor = statColor ?? cfg.statColor ?? TEXT;
  if (resolvedTitle) oNotes.push({ x: P.l + 2, y: 11, text: resolvedTitle, color: FAINT, anchor: 'start' });
  if (resolvedStat)
    oNotes.push({ x: W - P.r - 2, y: 12, text: resolvedStat, color: resolvedStatColor, anchor: 'end', stat: true });

  /** main-trace glow underlay + stroke (the catalog's `hrPath`) */
  const drawTrace = (d: string, stroke: string, w: number, dash?: string) => {
    if (!dash && shine) marks.push({ k: 'path', d, stroke, w: w + 5, opacity: 0.45, cap: true, blur: 5 });
    marks.push({ k: 'path', d, stroke, w, dash, cap: true });
  };
  const timeAxis = () =>
    (axisLabels ?? DEFAULT_AXES[variant]).forEach((L) =>
      oNotes.push({
        x: P.l + PLOT_W * L.at,
        y: h - 2,
        text: L.label,
        color: FAINT,
        anchor: L.at === 0 ? 'start' : L.at === 1 ? 'end' : 'middle',
      }),
    );

  /* ---------- SN-03 · time in zones — horizontal zone rows ---------- */
  if (variant === 'time-in-zones') {
    const rows = zones.slice().reverse(); // Z5 top → Z1 bottom
    const rh = plotH / Math.max(1, rows.length);
    const maxM = Math.max(1, ...minutes);
    rows.forEach((z, i) => {
      const m = minutes[zones.length - 1 - i] ?? 0;
      const rowY = P.t + 6 + i * rh;
      const wpx = Math.max(6, (PLOT_W - 92) * (m / maxM));
      oNotes.push({ x: P.l + 4, y: rowY + rh / 2, text: z.label, color: z.color, anchor: 'start' });
      marks.push({ k: 'rect', x: P.l + 26, y: rowY + rh / 2 - 5.5, w: wpx, h: 11, rx: 5.5, fill: z.color, opacity: 0.9 });
      oNotes.push({ x: P.l + 32 + wpx, y: rowY + rh / 2 + 3, text: `${m} MIN`, color: DIM, anchor: 'start' });
    });
  }

  /* ---------- SN-05 · sauna rounds — heat blocks + plunges + two traces ---------- */
  if (variant === 'sauna-rounds') {
    rounds.forEach((rd, i) => {
      const x0 = P.l + PLOT_W * rd.from;
      const wpx = PLOT_W * (rd.to - rd.from);
      marks.push({ k: 'rect', x: x0, y: P.t, w: wpx, h: plotH, rx: 6, fill: 'var(--zone-mid)', opacity: 0.1 });
      oChips.push({
        x: x0 + wpx / 2,
        y: P.t + 8,
        text: rd.label ?? `ROUND ${i + 1} · 15 MIN`,
        color: 'var(--zone-mid)',
        anchor: 'middle',
      });
    });
    plunges.forEach((pl) =>
      oChips.push({ x: P.l + PLOT_W * pl.at + 8, y: h - P.b - 10, text: pl.label, color: 'var(--cyan)', anchor: 'middle' }),
    );
    drawTrace(monotonePath(toPts(tempSamples ?? DEFAULT_SAUNA_TEMP)), 'var(--zone-mid)', weight ?? 2.6);
    drawTrace(monotonePath(toPts(hrSamples ?? DEFAULT_SAUNA_HR)), 'var(--zone-low)', 1.8, '2 4');
    oChips.push({ x: W - P.r - 4, y: 42, text: tempLabel, color: 'var(--zone-mid)', anchor: 'end' });
    oChips.push({ x: W - P.r - 4, y: 58, text: hrLabel, color: 'var(--zone-low)', anchor: 'end' });
    timeAxis();
  }

  /* ---------- SN-06 · sauna heat ramp — temp vs target ---------- */
  if (variant === 'sauna-heat-ramp') {
    marks.push({
      k: 'line',
      x1: P.l,
      y1: Y(target),
      x2: W - P.r,
      y2: Y(target),
      stroke: 'var(--zone-low)',
      w: 1,
      dash: '5 4',
      opacity: 0.85,
    });
    oChips.push({ x: W - P.r - 4, y: Y(target) - 10, text: targetLabel, color: 'var(--zone-low)', anchor: 'end' });
    needHeatGrad = true;
    const temp = tempSamples ?? DEFAULT_HEAT_RAMP;
    const pts = toPts(temp);
    drawTrace(monotonePath(pts), `url(#${heatId})`, weight ?? 3);
    const last = pts[pts.length - 1];
    if (last) {
      oPulses.push({ x: last[0], y: last[1], color: 'var(--zone-low)' });
      if (stateLabel) oChips.push({ x: last[0] - 8, y: last[1] + 16, text: stateLabel, color: 'var(--zone-mid)', anchor: 'end' });
    }
    timeAxis();
  }

  /* ---------- SN-07 · overnight recovery — HRV up, RHR down ---------- */
  if (variant === 'night-recovery') {
    marks.push({ k: 'rect', x: P.l, y: P.t, w: PLOT_W, h: plotH, rx: 6, fill: 'var(--violet)', opacity: 0.05 });
    drawTrace(monotonePath(toPts(hrvSamples)), MINT, weight ?? 2.5);
    drawTrace(monotonePath(toPts(rhrSamples)), 'var(--violet)', 2, '5 4');
    const hi = Math.round(0.72 * (hrvSamples.length - 1));
    const ri = Math.round(0.72 * (rhrSamples.length - 1));
    if (hrvSamples[hi] != null)
      oChips.push({ x: P.l + PLOT_W * 0.72, y: Y(hrvSamples[hi]) - 13, text: hrvLabel, color: MINT, anchor: 'middle' });
    if (rhrSamples[ri] != null)
      oChips.push({ x: P.l + PLOT_W * 0.72, y: Y(rhrSamples[ri]) + 14, text: rhrLabel, color: 'var(--violet)', anchor: 'middle' });
    timeAxis();
  }

  /* ---------- SN-09/10 · glucose meal-response curves ---------- */
  if (variant === 'glucose-response' || variant === 'response-overlay') {
    const [bandLo, bandHi] = baselineBand;
    marks.push({
      k: 'rect',
      x: P.l,
      y: Y(bandHi),
      w: PLOT_W,
      h: Y(bandLo) - Y(bandHi),
      rx: 4,
      fill: MINT,
      opacity: 0.07,
    });
    oNotes.push({ x: W - P.r - 2, y: Y(bandHi) + 9, text: baselineLabel, color: MINT, anchor: 'end' });
    const gx = (i: number, n: number) => P.l + 8 + (n > 1 ? ((PLOT_W - 14) * i) / (n - 1) : (PLOT_W - 14) / 2);
    const gPath = (vals: number[]) => monotonePath(vals.map((v, i) => [gx(i, vals.length), Y(v)] as [number, number]));
    const mealX = P.l + 8 + (PLOT_W - 14) * mealAt;
    marks.push({ k: 'line', x1: mealX, y1: P.t, x2: mealX, y2: h - P.b, stroke: TEXT, w: 1, opacity: 0.22, dash: '2 3' });
    oChips.push({ x: mealX, y: P.t + 8, text: mealLabel, color: 'var(--lime)', anchor: 'middle' });
    if (variant === 'response-overlay') {
      overlays.forEach((c) => marks.push({ k: 'path', d: gPath(c), stroke: TEXT, w: 1.4, opacity: 0.18 }));
      drawTrace(gPath(glucoseSamples ?? DEFAULT_GLUC_MEAN), 'var(--cyan)', weight ?? 2.5);
      oChips.push({ x: W - P.r - 4, y: P.t + 24, text: meanLabel, color: 'var(--cyan)', anchor: 'end' });
    } else {
      const vals = glucoseSamples ?? DEFAULT_GLUC;
      drawTrace(gPath(vals), 'var(--cyan)', weight ?? 2.5);
      const pi = Math.max(0, Math.min(vals.length - 1, peakIndex));
      const pkv = vals[pi];
      if (pkv != null) {
        const px = gx(pi, vals.length);
        const py = Y(pkv);
        oDots.push({ x: px, y: py, d: 6.4, color: 'var(--zone-mid)' });
        if (peakLabel) oChips.push({ x: px + 8, y: py - 12, text: peakLabel, color: 'var(--zone-mid)', anchor: 'start' });
      }
      if (returnLabel) oChips.push({ x: W - P.r - 4, y: Y(0.44) + 22, text: returnLabel, color: MINT, anchor: 'end' });
    }
    timeAxis();
  }

  /* ---------- SN-01/02/04 · HR session over the zone bands ---------- */
  if (variant === 'hr-zones-session' || variant === 'hr-intervals' || variant === 'hr-recovery') {
    zones.forEach((z) => {
      marks.push({ k: 'rect', x: P.l, y: Y(z.to), w: PLOT_W, h: Y(z.from) - Y(z.to), rx: 0, fill: z.color, opacity: 0.06 });
      marks.push({ k: 'line', x1: P.l, y1: Y(z.to), x2: W - P.r, y2: Y(z.to), stroke: z.color, w: 1, opacity: 0.18 });
      if (showZoneLabels)
        oNotes.push({ x: W - P.r - 2, y: Y((z.from + z.to) / 2) + 3, text: z.label, color: z.color, anchor: 'end' });
    });
    const ivals = variant === 'hr-intervals' ? Math.max(1, intervals) : 0;
    const hr =
      hrSamples ??
      (variant === 'hr-intervals'
        ? hrSession(22, 70, ivals)
        : variant === 'hr-recovery'
          ? DEFAULT_HR_RECOVERY
          : DEFAULT_HR_TEMPO);
    if (ivals > 0) {
      for (let b = 0; b < ivals; b++) {
        const s = 0.14 + (b / ivals) * 0.72;
        const e = s + (0.72 / ivals) * 0.55;
        marks.push({ k: 'rect', x: P.l + PLOT_W * s, y: P.t, w: PLOT_W * (e - s), h: plotH, rx: 0, fill: 'var(--zone-low)', opacity: 0.07 });
      }
    }
    needZoneGrad = true;
    const pts = toPts(hr);
    drawTrace(monotonePath(pts), `url(#${zoneId})`, weight ?? 2.5);
    if (variant === 'hr-recovery') {
      const pk = Math.max(0, Math.min(pts.length - 1, recovery?.peakIndex ?? 52));
      const dp = Math.max(0, Math.min(pts.length - 1, recovery?.dropIndex ?? 62));
      const pkPt = pts[pk];
      const dpPt = pts[dp];
      if (pkPt && dpPt) {
        oPulses.push({ x: pkPt[0], y: pkPt[1], color: 'var(--zone-low)' });
        marks.push({
          k: 'line',
          x1: pkPt[0],
          y1: pkPt[1] - 14,
          x2: dpPt[0],
          y2: dpPt[1] - 14,
          stroke: TEXT,
          w: 1,
          opacity: 0.35,
          dash: '2 3',
        });
        oChips.push({
          x: (pkPt[0] + dpPt[0]) / 2,
          y: dpPt[1] - 26,
          text: recovery?.label ?? '−32 BPM · 60S',
          color: MINT,
          anchor: 'middle',
        });
      }
    }
    timeAxis();
  }

  /* ---------------- render ---------------- */

  // zone-height stroke: value gradient down the plot (coral top → indigo floor)
  const zoneStops =
    zones.length === 5
      ? ([0, 0.3, 0.55, 0.78, 1] as const).map((off, i) => ({ offset: off, color: zones[zones.length - 1 - i].color }))
      : zones
          .slice()
          .reverse()
          .map((z, i, arr) => ({ offset: arr.length > 1 ? i / (arr.length - 1) : 0, color: z.color }));

  const pctX = (x: number) => `${r((x / W) * 100)}%`;
  const noteTf = (a: Anchor) =>
    a === 'start' ? undefined : a === 'middle' ? 'translateX(-50%)' : 'translateX(-100%)';
  const chipTf = (a: Anchor) =>
    a === 'start' ? 'translateY(-50%)' : a === 'middle' ? 'translate(-50%,-50%)' : 'translate(-100%,-50%)';

  const noteStyle: CSSProperties = {
    position: 'absolute',
    fontFamily: 'var(--font-mono)',
    fontSize: 8.5,
    lineHeight: '9px',
    letterSpacing: '0.06em',
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
  };
  const statStyle: CSSProperties = {
    position: 'absolute',
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: 12,
    lineHeight: '12px',
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
  };
  const chipStyle: CSSProperties = {
    position: 'absolute',
    padding: '2px 6px',
    borderRadius: 999,
    background: 'color-mix(in srgb, var(--bg-0) 78%, transparent)',
    fontFamily: 'var(--font-mono)',
    fontSize: 8,
    lineHeight: '9px',
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
  };

  return (
    <div
      className={cn('lk-snc', `lk-snc--${variant}`, className)}
      style={{ position: 'relative', width: '100%', ...style }}
      {...rest}
    >
      <div style={{ position: 'relative', height: h }}>
        <svg
          viewBox={`0 0 ${W} ${h}`}
          preserveAspectRatio="none"
          role="img"
          aria-label={ariaLabel}
          aria-hidden={ariaLabel ? undefined : true}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', overflow: 'visible' }}
        >
          <defs>
            {needZoneGrad && (
              <linearGradient id={zoneId} gradientUnits="userSpaceOnUse" x1="0" y1={P.t} x2="0" y2={h - P.b}>
                {zoneStops.map((s, i) => (
                  <stop key={i} offset={s.offset} stopColor={s.color} />
                ))}
              </linearGradient>
            )}
            {needHeatGrad && (
              <linearGradient id={heatId} gradientUnits="userSpaceOnUse" x1="0" y1={h - P.b} x2="0" y2={P.t}>
                <stop offset="0" stopColor="var(--cyan)" />
                <stop offset="0.55" stopColor="var(--zone-mid)" />
                <stop offset="1" stopColor="var(--zone-low)" />
              </linearGradient>
            )}
          </defs>
          {marks.map((mk, i) =>
            mk.k === 'rect' ? (
              <rect
                key={i}
                x={r(mk.x)}
                y={r(mk.y)}
                width={r(Math.max(0, mk.w))}
                height={r(Math.max(0, mk.h))}
                rx={mk.rx}
                fill={mk.fill}
                opacity={mk.opacity}
              />
            ) : mk.k === 'line' ? (
              <line
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
              />
            ) : (
              <path
                key={i}
                d={mk.d}
                fill="none"
                stroke={mk.stroke}
                strokeWidth={mk.w}
                strokeOpacity={mk.opacity}
                strokeDasharray={mk.dash}
                strokeLinecap={mk.cap ? 'round' : undefined}
                style={mk.blur ? { filter: `blur(${mk.blur}px)` } : undefined}
              />
            ),
          )}
        </svg>

        {/* round marks + text — HTML overlays so they never distort with the stretch */}
        {oDots.map((d, i) => (
          <span
            key={`d-${i}`}
            style={{
              position: 'absolute',
              left: pctX(d.x),
              top: d.y,
              width: d.d,
              height: d.d,
              borderRadius: '50%',
              background: d.color,
              transform: 'translate(-50%,-50%)',
              pointerEvents: 'none',
            }}
          />
        ))}
        {oPulses.map((p, i) => (
          <span
            key={`p-${i}`}
            style={{ position: 'absolute', left: pctX(p.x), top: p.y, transform: 'translate(-50%,-50%)', pointerEvents: 'none' }}
          >
            <svg width={22} height={22} viewBox="0 0 22 22" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
              <circle cx={11} cy={11} r={3.6} fill={p.color} style={{ filter: `drop-shadow(0 0 5px ${p.color})` }} />
              {motionOK ? (
                <circle cx={11} cy={11} r={3.6} fill="none" stroke={p.color} strokeWidth={1.4}>
                  <animate attributeName="r" values="3.6;11" dur="1.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0" dur="1.8s" repeatCount="indefinite" />
                </circle>
              ) : (
                <circle cx={11} cy={11} r={7} fill="none" stroke={p.color} strokeWidth={1.4} opacity={0.4} />
              )}
            </svg>
          </span>
        ))}
        {oNotes.map((nte, i) => (
          <span
            key={`n-${i}`}
            style={{
              ...(nte.stat ? statStyle : noteStyle),
              left: pctX(nte.x),
              top: nte.y - (nte.stat ? 12 : 9),
              transform: noteTf(nte.anchor),
              color: nte.color,
            }}
          >
            {nte.text}
          </span>
        ))}
        {oChips.map((c, i) => (
          <span
            key={`c-${i}`}
            style={{
              ...chipStyle,
              left: pctX(c.x),
              top: c.y,
              transform: chipTf(c.anchor),
              color: c.color,
              border: `1px solid color-mix(in srgb, ${c.color} 35%, transparent)`,
            }}
          >
            {c.text}
          </span>
        ))}
      </div>
    </div>
  );
}
