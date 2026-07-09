import { useEffect, useId, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';

/* BodyBattery — the catalog body-battery family (BB-01/02/05/06/07,
   lockin90-design/charts/body-battery-charts.html): charges while you sleep,
   drains through the day. Five variants drawn in a fixed 320×150 viewBox:
   the zone-gradient day curve (violet sleep shading + CHARGING bolt + NOW
   pulse), the glanceable battery glyph (level / charging / low SELECT
   states), drain-event attribution pills, the 7-battery week row and the
   today-vs-yesterday compare. (BB-03/04 do not exist — numbering gaps.) */

export type BodyBatteryVariant =
  | 'battery-day' /* BB-01 — zone-stroked % curve over 24h + NOW pulse */
  | 'battery-glyph' /* BB-02 — big battery glyph · SELECT STATE level/charging/low */
  | 'drain-events' /* BB-05 — day curve + coral event pills at the dips */
  | 'battery-week' /* BB-06 — 7 mini vertical batteries + % + day letters */
  | 'battery-vs'; /* BB-07 — today zone curve + dashed yesterday + pills */

/** One `drain-events` attribution pill (BB-05). */
export interface BatteryDrainEvent {
  /** Position as a fraction of the day (0 = midnight → 1 = midnight). */
  at: number;
  /** Pill text (e.g. 'MEETING −8%'). */
  label: string;
}

export interface BodyBatteryProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  /** Catalog variant (BB-01 / BB-02 / BB-05 / BB-06 / BB-07). */
  variant?: BodyBatteryVariant;
  /** Battery samples 0–1, midnight → midnight (the day curves; any length). */
  levels?: number[];
  /** Yesterday's samples 0–1 — the dashed compare curve (`battery-vs`). */
  compareLevels?: number[];
  /** NOW position as a fraction of the day → pulse + `% NOW` pill (BB-01). */
  now?: number;
  /** Drain attribution pills (`drain-events`). */
  events?: BatteryDrainEvent[];
  /** `battery-glyph` fill 0–1 — also the big % readout (BB-02). */
  level?: number;
  /** `battery-glyph` SELECT STATE: level + empty-ETA / charging bolt +
   *  full-ETA / low warning + advice pill. */
  state?: 'level' | 'charging' | 'low';
  /** `battery-glyph` rate/ETA caption (default per state). */
  eta?: string;
  /** `battery-glyph` low-state advice pill. */
  advice?: string;
  /** Caption above the glyph. */
  glyphLabel?: string;
  /** `battery-week` end-of-day levels 0–1 — the first seven are drawn. */
  days?: number[];
  /** `battery-week` day letters, one per battery. */
  dayLabels?: string;
  /** Sleep shading: asleep until this hour (violet wash from midnight). */
  sleepUntilH?: number;
  /** Sleep shading: asleep from this hour (violet wash to midnight). */
  sleepFromH?: number;
  /** CHARGING bolt + caption on the day curves (default on, the catalog look). */
  charging?: boolean;
  /** Bolt caption. */
  chargingLabel?: string;
  /** `battery-vs` series pills. */
  todayLabel?: string;
  compareLabel?: string;
  /** Top-left mono caption (e.g. 'BODY BATTERY · TODAY'). */
  title?: string;
  /** Top-right display stat. */
  stat?: string;
  /** `stat` color token. */
  statColor?: string;
  /** Interior gridlines + baseline on the day curves (the catalog grid). */
  grid?: boolean;
  /** Glow underlay along the curve / glyph fill (the catalog `cfg.shine`). */
  shine?: boolean;
  /** Accessible description of the chart. */
  ariaLabel?: string;
}

/* ---- catalog geometry (viewBox units — charts/catalog.js) ---- */
const W = 320;
const H = 150;
const PAD = { l: 10, r: 12, t: 16, b: 14 };
const PLOT_W = W - PAD.l - PAD.r; // 298
const PLOT_H = H - PAD.t - PAD.b; // 120
const GRID_ROWS = [0.25, 0.5, 0.75] as const;

/** Round for compact attribute strings. */
const rd = (n: number) => Math.round(n * 100) / 100;
/** y of a 0–1 battery fraction. */
const yAt = (v: number) => PAD.t + (1 - v) * PLOT_H;

/** battery zone verdict — the catalog batteryIcon thresholds (0.55 / 0.25). */
const batteryZone = (v: number) =>
  v >= 0.55 ? 'var(--zone-high)' : v >= 0.25 ? 'var(--zone-mid)' : 'var(--zone-low)';

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

/** track `prefers-reduced-motion` — pulses stay static until motion is allowed */
function useMotionOK(): boolean {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) setOk(true);
  }, []);
  return ok;
}

/** Mono catalog label (8.5px JetBrains Mono, .06em) — styling in bodybattery.css. */
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
    <text className="lk-bb-label" x={rd(x)} y={rd(y)} fill={fill} textAnchor={anchor}>
      {children}
    </text>
  );
}

/** Chip-pill tag (the catalog `tag()`): dark bg-0 pill + tinted hairline. */
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
  const wpx = children.length * 5.35 + 12;
  let xa = anchor === 'end' ? x - wpx : anchor === 'start' ? x : x - wpx / 2;
  xa = Math.max(PAD.l - 4, Math.min(xa, W - PAD.r - wpx + 4));
  return (
    <g>
      <rect
        x={rd(xa)}
        y={rd(y - 6.5)}
        width={rd(wpx)}
        height={13}
        rx={6.5}
        fill="color-mix(in srgb, var(--bg-0) 78%, transparent)"
        stroke={color}
        strokeOpacity={0.35}
        strokeWidth={0.8}
      />
      <text className="lk-bb-tag-text" x={rd(xa + wpx / 2)} y={rd(y + 2.8)} fill={color} textAnchor="middle">
        {children}
      </text>
    </g>
  );
}

/** Glowing dot + SMIL pulse ring (the catalog `pulseDot`), reduced-motion safe. */
function PulseDot({ x, y, color, motionOK }: { x: number; y: number; color: string; motionOK: boolean }) {
  return (
    <g>
      <circle className="lk-bb-glowdot" cx={rd(x)} cy={rd(y)} r={3.6} fill={color} style={{ color }} />
      {motionOK ? (
        <circle cx={rd(x)} cy={rd(y)} r={3.6} fill="none" stroke={color} strokeWidth={1.4}>
          <animate attributeName="r" values="3.6;11" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0" dur="1.8s" repeatCount="indefinite" />
        </circle>
      ) : (
        <circle cx={rd(x)} cy={rd(y)} r={7} fill="none" stroke={color} strokeWidth={1.4} opacity={0.4} />
      )}
    </g>
  );
}

/** The catalog lightning bolt (glowing via drop-shadow). */
function Bolt({ x, y, s, color = 'var(--lime)' }: { x: number; y: number; s: number; color?: string }) {
  const d =
    `M${rd(x + 2 * s)} ${rd(y)}` +
    `l${rd(-3 * s)} ${rd(4.4 * s)}` +
    `h${rd(2.4 * s)}` +
    `l${rd(-1.6 * s)} ${rd(3.6 * s)}` +
    `l${rd(4 * s)} ${rd(-4.8 * s)}` +
    `h${rd(-2.4 * s)}z`;
  return <path className="lk-bb-bolt" d={d} fill={color} stroke="none" style={{ color }} />;
}

/* BB-01 default day — the catalog's charge-at-night / drain-by-day shape
   (48 half-hour samples, seed 11 of the page's bbDay generator) */
const DEFAULT_LEVELS = [
  0.33, 0.37, 0.42, 0.46, 0.51, 0.55, 0.6, 0.64, 0.69, 0.73, 0.78, 0.82, 0.87, 0.91, 0.94, 0.95,
  0.93, 0.91, 0.89, 0.87, 0.86, 0.84, 0.82, 0.8, 0.78, 0.76, 0.75, 0.73, 0.66, 0.64, 0.62, 0.6,
  0.59, 0.57, 0.55, 0.53, 0.46, 0.45, 0.43, 0.41, 0.39, 0.37, 0.36, 0.34, 0.32, 0.3, 0.29, 0.33,
];

const DEFAULT_EVENTS: BatteryDrainEvent[] = [
  { at: 0.38, label: 'MEETING −8%' },
  { at: 0.58, label: 'NO LUNCH −6%' },
  { at: 0.8, label: 'TRAINING −12%' },
];

const DEFAULT_DAYS = [0.82, 0.64, 0.71, 0.45, 0.3, 0.88, 0.76];

/** day-axis ticks (the catalog dayAxis). */
const DAY_TICKS: Array<[string, number]> = [
  ['12A', 0],
  ['7A', 7 / 24],
  ['NOON', 0.5],
  ['6P', 0.75],
  ['11P', 23 / 24],
];

/**
 * BodyBattery — the body-battery family (catalog BB-01…BB-07): the % charge
 * curve over the day with a zone-gradient stroke (mint up high → amber →
 * coral down low), violet sleep shading and a CHARGING bolt; the battery
 * glyph status widget; drain attribution; the week of batteries; and the
 * day-over-day compare. All levels are 0–1 fractions of a full charge.
 */
export function BodyBattery({
  variant = 'battery-day',
  levels = DEFAULT_LEVELS,
  compareLevels,
  now,
  events = DEFAULT_EVENTS,
  level = 0.64,
  state = 'level',
  eta,
  advice = 'LOW — SKIP THE 6PM SESSION',
  glyphLabel = 'BODY BATTERY',
  days = DEFAULT_DAYS,
  dayLabels = 'MTWTFSS',
  sleepUntilH = 7,
  sleepFromH = 23,
  charging,
  chargingLabel = 'CHARGING',
  todayLabel = 'TODAY',
  compareLabel = 'YESTERDAY',
  title,
  stat,
  statColor = 'var(--text)',
  grid = true,
  shine = false,
  ariaLabel = 'Body battery chart',
  className,
  ...rest
}: BodyBatteryProps) {
  const uid = useId().replace(/[^a-zA-Z0-9-]/g, '');
  const motionOK = useMotionOK();
  const gradId = `lk-bb-z-${uid}`;

  const isCurve = variant === 'battery-day' || variant === 'drain-events' || variant === 'battery-vs';
  const showBolt = charging ?? isCurve; // the catalog day curve always shows it

  let body: ReactNode = null;

  if (isCurve) {
    const n = levels.length;
    const pts: Pt[] = levels.map((v, i) => [PAD.l + (PLOT_W * i) / Math.max(1, n - 1), yAt(v)]);
    const d = monotonePath(pts);
    const nowI = now != null && n > 0 ? Math.max(0, Math.min(n - 1, Math.round(now * (n - 1)))) : null;
    body = (
      <g>
        {/* violet sleep shading (asleep until sleepUntilH · after sleepFromH) */}
        <rect
          x={PAD.l}
          y={PAD.t}
          width={rd(PLOT_W * (sleepUntilH / 24))}
          height={PLOT_H}
          fill="var(--violet)"
          opacity={0.08}
        />
        <rect
          x={rd(PAD.l + PLOT_W * (sleepFromH / 24))}
          y={PAD.t}
          width={rd(PLOT_W * ((24 - sleepFromH) / 24))}
          height={PLOT_H}
          fill="var(--violet)"
          opacity={0.08}
        />
        {/* dashed yesterday under today (battery-vs) */}
        {variant === 'battery-vs' && compareLevels && compareLevels.length >= 2 ? (
          <path
            d={monotonePath(
              compareLevels.map((v, i) => [
                PAD.l + (PLOT_W * i) / Math.max(1, compareLevels.length - 1),
                yAt(v),
              ]),
            )}
            fill="none"
            stroke="var(--text)"
            strokeOpacity={0.3}
            strokeWidth={1.6}
            strokeDasharray="4 4"
          />
        ) : null}
        {/* zone-gradient % curve (+ blurred glow underlay) */}
        {shine ? (
          <path
            className="lk-bb-shine"
            d={d}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={7.5}
            strokeLinecap="round"
            opacity={0.45}
          />
        ) : null}
        <path d={d} fill="none" stroke={`url(#${gradId})`} strokeWidth={2.5} strokeLinecap="round" />
        {showBolt ? (
          <g>
            <Bolt x={PAD.l + PLOT_W * 0.06} y={PAD.t + 14} s={1.6} />
            <Label x={PAD.l + PLOT_W * 0.06 + 12} y={PAD.t + 26} fill="var(--lime)" anchor="start">
              {chargingLabel}
            </Label>
          </g>
        ) : null}
        {/* NOW pulse + % pill (BB-01) */}
        {nowI != null ? (
          <g>
            <PulseDot x={pts[nowI][0]} y={pts[nowI][1]} color="var(--zone-high)" motionOK={motionOK} />
            <Tag x={pts[nowI][0]} y={pts[nowI][1] - 15} color="var(--zone-high)">
              {`${Math.round(levels[nowI] * 100)}% NOW`}
            </Tag>
          </g>
        ) : null}
        {/* coral drain pills at the dips (BB-05) */}
        {variant === 'drain-events' && n > 0
          ? events.map((ev, di) => {
              const xi = Math.max(0, Math.min(n - 1, Math.round(ev.at * (n - 1))));
              return (
                <Tag key={di} x={pts[xi][0]} y={pts[xi][1] + 16 + (di % 2) * 16} color="var(--zone-low)">
                  {ev.label}
                </Tag>
              );
            })
          : null}
        {/* series pills (BB-07) */}
        {variant === 'battery-vs' ? (
          <g>
            <Tag x={W - PAD.r - 4} y={26} color="var(--zone-high)" anchor="end">
              {todayLabel}
            </Tag>
            <Tag x={W - PAD.r - 4} y={42} color="var(--text-dim)" anchor="end">
              {compareLabel}
            </Tag>
          </g>
        ) : null}
        {/* day axis */}
        {DAY_TICKS.map(([t, f]) => (
          <Label key={t} x={PAD.l + PLOT_W * f} y={H - 2} fill="var(--text-faint)" anchor={f === 0 ? 'start' : 'middle'}>
            {t}
          </Label>
        ))}
      </g>
    );
  } else if (variant === 'battery-glyph') {
    /* BB-02 — big battery glyph + state readout */
    const lv = Math.max(0, Math.min(1, level));
    const col = batteryZone(lv);
    const bx = 42;
    const by = 52;
    const bw = 130;
    const bh = 46;
    const fillW = Math.max(4, (bw - 6) * lv);
    const isCharging = state === 'charging';
    const etaText = eta ?? (isCharging ? '+9%/H · FULL BY 6:40' : '−4%/H · EMPTY 21:20');
    body = (
      <g>
        <rect
          x={bx}
          y={by}
          width={bw}
          height={bh}
          rx={rd(bh * 0.22)}
          fill="var(--glass)"
          stroke="var(--text)"
          strokeOpacity={0.25}
          strokeWidth={1.5}
        />
        <rect
          x={bx + bw}
          y={rd(by + bh * 0.3)}
          width={4}
          height={rd(bh * 0.4)}
          rx={2}
          fill="var(--text)"
          opacity={0.25}
        />
        {shine ? (
          <rect
            className="lk-bb-shine"
            x={bx + 3}
            y={by + 3}
            width={rd(fillW)}
            height={bh - 6}
            rx={rd(bh * 0.16)}
            fill={col}
            opacity={0.6}
          />
        ) : null}
        <rect x={bx + 3} y={by + 3} width={rd(fillW)} height={bh - 6} rx={rd(bh * 0.16)} fill={col} opacity={0.9} />
        {/* charging is conveyed by the ETA caption alone — the in-glyph bolt was
            dropped (too large at this scale, and black-on-black below ~50% fill). */}
        <text className="lk-bb-big" x={206} y={84} fill={col}>
          {`${Math.round(lv * 100)}%`}
        </text>
        <Label x={206} y={100} fill="var(--text-dim)" anchor="start">
          {etaText}
        </Label>
        <Label x={bx + 65} y={40} fill="var(--text-faint)">
          {glyphLabel}
        </Label>
        {state === 'low' ? (
          <Tag x={bx + 65} y={118} color="var(--zone-low)">
            {advice}
          </Tag>
        ) : null}
      </g>
    );
  } else {
    /* BB-06 — 7 mini vertical batteries */
    const week = days.slice(0, 7);
    body = (
      <g>
        {week.map((v, i) => {
          const x = PAD.l + 14 + (i * (PLOT_W - 20)) / 7;
          const col = batteryZone(v);
          return (
            <g key={i}>
              <rect
                x={rd(x)}
                y={PAD.t + 14}
                width={22}
                height={74}
                rx={6}
                fill="var(--glass)"
                stroke="var(--text)"
                strokeOpacity={0.22}
                strokeWidth={1.2}
              />
              <rect x={rd(x + 7)} y={PAD.t + 10} width={8} height={4} rx={1.5} fill="var(--text)" opacity={0.22} />
              <rect
                x={rd(x + 2.5)}
                y={rd(PAD.t + 14 + 71 - 68 * v)}
                width={17}
                height={rd(68 * v)}
                rx={4}
                fill={col}
                opacity={0.9}
              />
              <Label x={x + 11} y={H - 12} fill={col}>
                {String(Math.round(v * 100))}
              </Label>
              <Label x={x + 11} y={H - 2} fill="var(--text-faint)">
                {dayLabels[i] ?? ''}
              </Label>
            </g>
          );
        })}
      </g>
    );
  }

  return (
    <div className={cn('lk-bb', className)} role="img" aria-label={ariaLabel} {...rest}>
      <svg className="lk-bb-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        {isCurve ? (
          <defs>
            {/* zone stroke: mint up high → amber → coral down low, fixed to the plot */}
            <linearGradient id={gradId} gradientUnits="userSpaceOnUse" x1="0" y1={PAD.t} x2="0" y2={H - PAD.b}>
              <stop offset="0%" stopColor="var(--zone-high)" />
              <stop offset="55%" stopColor="var(--zone-mid)" />
              <stop offset="100%" stopColor="var(--zone-low)" />
            </linearGradient>
          </defs>
        ) : null}
        {/* catalog grid: 3 interior rows + solid baseline (day curves only) */}
        {isCurve && grid ? (
          <g>
            {GRID_ROWS.map((f) => (
              <line
                key={f}
                x1={PAD.l}
                x2={W - PAD.r}
                y1={rd(PAD.t + PLOT_H * f)}
                y2={rd(PAD.t + PLOT_H * f)}
                stroke="var(--border)"
                strokeOpacity={0.55}
                strokeWidth={1}
              />
            ))}
            <line x1={PAD.l} x2={W - PAD.r} y1={H - PAD.b} y2={H - PAD.b} stroke="var(--border)" strokeWidth={1} />
          </g>
        ) : null}
        {title ? (
          <Label x={PAD.l + 2} y={11} fill="var(--text-faint)" anchor="start">
            {title}
          </Label>
        ) : null}
        {stat ? (
          <text className="lk-bb-stat" x={W - PAD.r - 2} y={12} fill={statColor} textAnchor="end">
            {stat}
          </text>
        ) : null}
        {body}
      </svg>
    </div>
  );
}
