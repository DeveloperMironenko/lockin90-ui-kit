import type { SVGProps } from 'react';
import { cn } from '../cn';

/** Catalog variant names (`lockin90-design/charts/environment-charts.html`, EN-01…EN-04). */
export type EnvironmentChartVariant = 'sun-uv-arc' | 'pollen-rows' | 'aqi-day' | 'outdoor-window';

export interface EnvironmentChartProps
  extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height' | 'children'> {
  /** chart form (default `'sun-uv-arc'`, EN-01) */
  variant?: EnvironmentChartVariant;
  /** `sun-uv-arc` — sunrise, fractional hours (default 5.78 → '05:47') */
  sunrise?: number;
  /** `sun-uv-arc` — sunset, fractional hours (default 21.2 → '21:12') */
  sunset?: number;
  /** `sun-uv-arc` + `aqi-day` — the NOW hour, 0–24 (default 14). The pulse on
   *  the sun arc / the AQI curve (nearest hourly point). `null` hides it. */
  now?: number | null;
  /** `sun-uv-arc` — the day's max UV index (default 7); the arc's UV curve is
   *  `sin(t·π)·peakUv`, segment color cyan < 3 / amber < 6 / coral ≥ 6 */
  peakUv?: number;
  /** `sun-uv-arc` — NOW caption override (default computed 'NOW · UV n') */
  nowLabel?: string;
  /** `sun-uv-arc` — top-right peak pill override (default computed
   *  'UV {peakUv} PEAK · {solar noon}') */
  peak?: string;
  /** `pollen-rows` — 16 hourly 0–1 loads per kind, `startHour` first */
  tree?: number[];
  grass?: number[];
  weed?: number[];
  /** `pollen-rows` — top-right worst-window pill (default 'GRASS HIGH 10–14');
   *  computing the worst window is the caller's job. `''` hides it. */
  flag?: string;
  /** `aqi-day` — 16 hourly 0–1 values (AQI/100), `startHour` first */
  aqi?: number[];
  /** `aqi-day` — the dashed rule position, 0–1 (default 0.5 = AQI 50) */
  threshold?: number;
  /** `aqi-day` — the rule's caption (default 'MODERATE >50') */
  thresholdLabel?: string;
  /** `aqi-day` — NOW verdict pill override (default computed
   *  'AQI {value} · GOOD/MODERATE' at the `now` point) */
  verdict?: string;
  /** `outdoor-window` — 16 hourly 0–1 rows, `startHour` first */
  uv?: number[];
  pollen?: number[];
  air?: number[];
  /** `outdoor-window` — the best-window bounds, fractional hours
   *  (defaults 17 → 19.5); computing the window is the caller's job */
  windowStart?: number;
  windowEnd?: number;
  /** `outdoor-window` — window pill override (default computed
   *  'BEST WINDOW · {start}–{end}') */
  windowLabel?: string;
  /** first hour of the 16 hourly cells (default 6 → cells 6:00–22:00) */
  startHour?: number;
  /** faint mono caption at the top-left (per-variant catalog default) */
  title?: string;
  /** bottom hint — `pollen-rows` 'CELL BRIGHTNESS = POLLEN LOAD' /
   *  `outdoor-window` 'ALL THREE LOW = GO OUTSIDE'. `''` hides it. */
  caption?: string;
  /** glow underlay behind the sun arc (catalog shine — `sun-uv-arc` only;
   *  no-op on the cell/curve variants, like the catalog) */
  shine?: boolean;
  /** rendered width in px — the 320×150 viewBox scales to fit */
  width?: number;
  /** rendered height in px */
  height?: number;
}

/* --------------------------------------------------------------- geometry
 * The catalog canvas: 320×150, pad l10 r12 t16 b14. Sun arc: horizon y 112,
 * amplitude 70, x 30→288. Hourly cells: x0 84, cell width 13, 16 cells
 * (startHour 6 → 22:00). AQI curve: x 30 + i·17.2, half-step 8.6. */
const W = 320;
const H = 150;
const P = { l: 10, r: 12, t: 16, b: 14 };
const PLOT_H = H - P.t - P.b;

const HORIZON = 112;
const AMP = 70;
const SUN_X0 = 30;
const SUN_SPAN = 258;
const SEGMENTS = 40;

const CELL_X0 = 84;
const CELL_W = 13;
const CELLS = 16;

const AQI_X0 = 30;
const AQI_STEP = 17.2;

const MONO = 'var(--font-mono)';

/* chip-pill fill — the catalog tag()'s rgba(8,10,18,0.78) = --bg-0 @ 78% */
const TAG_FILL = 'color-mix(in srgb, var(--bg-0) 78%, transparent)';
/* horizon — the catalog's rgba(255,255,255,0.12) = --text @ 12% */
const HORIZON_STROKE = 'color-mix(in srgb, var(--text) 12%, transparent)';
/* inner grid lines — the catalog grid()'s rgba(255,255,255,0.05) = --text @ 5% */
const GRID_FAINT = 'color-mix(in srgb, var(--text) 5%, transparent)';

/* the catalog's hourly demo arrays (6:00 → 22:00) */
const UV16 = [0, 0.05, 0.15, 0.3, 0.5, 0.75, 0.9, 1, 0.95, 0.8, 0.6, 0.4, 0.22, 0.1, 0.02, 0];
const POL16 = [0.2, 0.3, 0.45, 0.7, 0.9, 0.95, 0.9, 0.8, 0.6, 0.5, 0.4, 0.3, 0.25, 0.2, 0.15, 0.1];
const AQI16 = [0.3, 0.35, 0.5, 0.6, 0.55, 0.5, 0.45, 0.4, 0.42, 0.38, 0.3, 0.25, 0.2, 0.2, 0.25, 0.3];
const TREE16 = [0.5, 0.6, 0.7, 0.75, 0.7, 0.6, 0.5, 0.45, 0.4, 0.3, 0.25, 0.2, 0.2, 0.15, 0.1, 0.1];
const GRASS16 = [0.3, 0.4, 0.55, 0.75, 0.9, 1, 0.95, 0.85, 0.6, 0.45, 0.35, 0.3, 0.25, 0.2, 0.15, 0.1];
const WEED16 = [0.15, 0.2, 0.2, 0.3, 0.35, 0.4, 0.4, 0.35, 0.3, 0.3, 0.25, 0.2, 0.15, 0.15, 0.1, 0.1];

const DEFAULT_TITLES: Record<EnvironmentChartVariant, string> = {
  'sun-uv-arc': 'SUN · TODAY',
  'pollen-rows': 'POLLEN · HOURLY',
  'aqi-day': 'AIR QUALITY',
  'outdoor-window': 'TRAIN OUTSIDE?',
};

const DEFAULT_CAPTIONS: Record<EnvironmentChartVariant, string> = {
  'sun-uv-arc': '',
  'pollen-rows': 'CELL BRIGHTNESS = POLLEN LOAD',
  'aqi-day': '',
  'outdoor-window': 'ALL THREE LOW = GO OUTSIDE',
};

/** value → plot y (the catalog's `Y`) */
function Y(v: number): number {
  return P.t + (1 - v) * PLOT_H;
}

/** UV index → segment color (the catalog's `uvCol`) */
function uvColor(uv: number): string {
  return uv < 3 ? 'var(--cyan)' : uv < 6 ? 'var(--zone-mid)' : 'var(--zone-low)';
}

/** pollen/air load → cell color (the catalog's `cellRow` scale — LOW is good) */
function loadColor(v: number): string {
  return v < 0.34 ? 'var(--mint)' : v < 0.67 ? 'var(--zone-mid)' : 'var(--zone-low)';
}

/** point on the sun path at day-fraction t (the catalog's `sunPt`) */
function sunPt(t: number): { x: number; y: number } {
  return { x: SUN_X0 + t * SUN_SPAN, y: HORIZON - Math.sin(t * Math.PI) * AMP };
}

/** fractional hours → zero-padded 'HH:MM' (5.78 → '05:47') */
function fmtTime(h: number): string {
  const norm = ((h % 24) + 24) % 24;
  let hr = Math.floor(norm);
  let min = Math.round((norm - hr) * 60);
  if (min === 60) {
    hr = (hr + 1) % 24;
    min = 0;
  }
  return `${String(hr).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
}

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
        fill={TAG_FILL}
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

/** pulsing NOW dot (the catalog's `pulseDot` — SMIL ring, like DayWheel) */
function PulseDot({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g>
      <circle
        cx={x.toFixed(1)}
        cy={y.toFixed(1)}
        r={3.6}
        fill={color}
        style={{ filter: `drop-shadow(0 0 5px ${color})` }}
      />
      <circle cx={x.toFixed(1)} cy={y.toFixed(1)} r={3.6} fill="none" stroke={color} strokeWidth={1.4}>
        <animate attributeName="r" values="3.6;11" dur="1.8s" repeatCount="indefinite" />
        <animate attributeName="opacity" values=".8;0" dur="1.8s" repeatCount="indefinite" />
      </circle>
    </g>
  );
}

/** one hourly cell row (the catalog's `cellRow`) */
function CellRow({ y, name, vals }: { y: number; name: string; vals: number[] }) {
  return (
    <g>
      <Label x={CELL_X0 - 8} y={y + 3.5} text={name} color="var(--text-dim)" anchor="end" />
      {vals.slice(0, CELLS).map((v, i) => (
        <rect
          key={i}
          x={CELL_X0 + i * CELL_W}
          y={y - 4.5}
          width={CELL_W - 1.5}
          height={9}
          rx={2.5}
          fill={loadColor(v)}
          opacity={0.16 + v * 0.62}
        />
      ))}
    </g>
  );
}

/** hour captions under a cell strip (the catalog's `hoursUnder`) */
function HoursUnder({ x0, cw, y, startHour }: { x0: number; cw: number; y: number; startHour: number }) {
  return (
    <g>
      {[0, 4, 8, 12, 16].map((k) => (
        <Label key={k} x={x0 + (k / CELLS) * (CELLS * cw)} y={y} text={`${startHour + k}:00`} />
      ))}
    </g>
  );
}

/**
 * EnvironmentChart — the catalog environment family (`environment-charts`,
 * EN-01…EN-04): UV, pollen, air — when to train outside.
 *
 * - `sun-uv-arc` (EN-01, default) — the sun path sunrise→sunset, 40 segments
 *   colored by UV (cyan low / amber mid / coral high) + NOW pulse on the arc +
 *   horizon with times + PEAK pill. THE daylight/UV widget.
 * - `pollen-rows` (EN-02) — 3 hourly cell rows (tree/grass/weed),
 *   brightness + color = load, worst window flagged.
 * - `aqi-day` (EN-03) — stepped AQI curve + area, dashed MODERATE rule + NOW
 *   pulse with verdict pill.
 * - `outdoor-window` (EN-04) — UV + pollen + air rows stacked + the computed
 *   mint BEST WINDOW box where all three are low.
 *
 * Hourly values are 0–1 (`aqi` = AQI/100), 16 cells from `startHour`; times
 * are fractional hours. Geometry is the catalog's 320×150 canvas (scaled via
 * `width`/`height`); tokens only.
 */
export function EnvironmentChart({
  variant = 'sun-uv-arc',
  sunrise = 5.78,
  sunset = 21.2,
  now = 14,
  peakUv = 7,
  nowLabel,
  peak,
  tree = TREE16,
  grass = GRASS16,
  weed = WEED16,
  flag = 'GRASS HIGH 10–14',
  aqi = AQI16,
  threshold = 0.5,
  thresholdLabel = 'MODERATE >50',
  verdict,
  uv = UV16,
  pollen = POL16,
  air = AQI16,
  windowStart = 17,
  windowEnd = 19.5,
  windowLabel,
  startHour = 6,
  title,
  caption,
  shine = false,
  width = W,
  height = H,
  className,
  ...rest
}: EnvironmentChartProps) {
  const heading = title ?? DEFAULT_TITLES[variant];
  const hint = caption ?? DEFAULT_CAPTIONS[variant];
  const svgProps = {
    className: cn('lk-envchart', className),
    width,
    height,
    viewBox: `0 0 ${W} ${H}`,
    role: 'img',
    ...rest,
  };

  /* ----------------------------------------------------- EN-01 sun-uv-arc */
  if (variant === 'sun-uv-arc') {
    const tNow = now != null ? (now - sunrise) / (sunset - sunrise) : null;
    const np = tNow != null && tNow >= 0 && tNow <= 1 ? sunPt(tNow) : null;
    const uvNow = tNow != null ? Math.sin(Math.max(0, Math.min(1, tNow)) * Math.PI) * peakUv : 0;
    const nowText = nowLabel ?? `NOW · UV ${Math.round(uvNow)}`;
    const peakText = peak ?? `UV ${Math.round(peakUv)} PEAK · ${fmtTime((sunrise + sunset) / 2)}`;
    return (
      <svg
        {...svgProps}
        aria-label={`${heading}: sun path ${fmtTime(sunrise)}–${fmtTime(sunset)}${
          now != null ? `, ${nowText.toLowerCase()}` : ''
        }`}
      >
        <Label x={P.l + 2} y={11} text={heading} anchor="start" />
        <line x1={P.l} x2={W - P.r} y1={HORIZON} y2={HORIZON} stroke={HORIZON_STROKE} strokeWidth={1} />
        {Array.from({ length: SEGMENTS }, (_, i) => {
          const t0 = i / SEGMENTS;
          const t1 = (i + 1) / SEGMENTS;
          const a = sunPt(t0);
          const b = sunPt(t1);
          const c = uvColor(Math.sin(((t0 + t1) / 2) * Math.PI) * peakUv);
          return (
            <g key={i}>
              {shine ? (
                <line
                  x1={a.x.toFixed(1)}
                  y1={a.y.toFixed(1)}
                  x2={b.x.toFixed(1)}
                  y2={b.y.toFixed(1)}
                  stroke={c}
                  strokeWidth={8}
                  strokeLinecap="round"
                  opacity={0.4}
                  style={{ filter: 'blur(5px)' }}
                />
              ) : null}
              <line
                x1={a.x.toFixed(1)}
                y1={a.y.toFixed(1)}
                x2={b.x.toFixed(1)}
                y2={b.y.toFixed(1)}
                stroke={c}
                strokeWidth={3.2}
                strokeLinecap="round"
              />
            </g>
          );
        })}
        {np ? (
          <g>
            <PulseDot x={np.x} y={np.y} color="var(--text)" />
            <Label x={np.x} y={np.y - 12} text={nowText} color="var(--text-dim)" />
          </g>
        ) : null}
        <Label x={SUN_X0} y={HORIZON + 12} text={fmtTime(sunrise)} />
        <Label x={SUN_X0 + SUN_SPAN} y={HORIZON + 12} text={fmtTime(sunset)} />
        <Label x={SUN_X0} y={HORIZON + 24} text="SUNRISE" />
        <Label x={SUN_X0 + SUN_SPAN} y={HORIZON + 24} text="SUNSET" />
        {peakText ? <Tag x={W - P.r - 6} y={26} text={peakText} color="var(--zone-low)" anchor="end" /> : null}
      </svg>
    );
  }

  /* ---------------------------------------------------- EN-02 pollen-rows */
  if (variant === 'pollen-rows') {
    return (
      <svg {...svgProps} aria-label={`${heading}: hourly tree, grass and weed pollen loads${flag ? ` — ${flag.toLowerCase()}` : ''}`}>
        <Label x={P.l + 2} y={11} text={heading} anchor="start" />
        <CellRow y={48} name="TREE" vals={tree} />
        <CellRow y={74} name="GRASS" vals={grass} />
        <CellRow y={100} name="WEED" vals={weed} />
        <HoursUnder x0={CELL_X0} cw={CELL_W} y={124} startHour={startHour} />
        {flag ? <Tag x={W - P.r - 6} y={26} text={flag} color="var(--zone-low)" anchor="end" /> : null}
        {hint ? <Label x={160} y={142} text={hint} /> : null}
      </svg>
    );
  }

  /* -------------------------------------------------------- EN-03 aqi-day */
  if (variant === 'aqi-day') {
    const vals = aqi.slice(0, CELLS);
    const pts = vals.map((v, i) => ({ x: AQI_X0 + i * AQI_STEP, y: Y(v) }));
    let d = '';
    pts.forEach((q, i) => {
      d +=
        (i ? `L${(q.x - 8.6).toFixed(1)} ${q.y.toFixed(1)}` : `M${(q.x - 8.6).toFixed(1)} ${q.y.toFixed(1)}`) +
        `L${(q.x + 8.6).toFixed(1)} ${q.y.toFixed(1)}`;
    });
    const idx =
      now != null && pts.length > 0
        ? Math.max(0, Math.min(pts.length - 1, Math.round(now - startHour)))
        : null;
    const nowPt = idx != null ? pts[idx] : null;
    const nowVal = idx != null ? vals[idx] : 0;
    const good = nowVal < threshold;
    const verdictText =
      verdict ?? `AQI ${Math.round(nowVal * 100)} · ${good ? 'GOOD' : 'MODERATE'}`;
    return (
      <svg {...svgProps} aria-label={`${heading}: hourly air quality${nowPt ? ` — ${verdictText.toLowerCase()}` : ''}`}>
        <Label x={P.l + 2} y={11} text={heading} anchor="start" />
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={P.l}
            x2={W - P.r}
            y1={P.t + PLOT_H * f}
            y2={P.t + PLOT_H * f}
            stroke={GRID_FAINT}
            strokeWidth={1}
          />
        ))}
        <line x1={P.l} x2={W - P.r} y1={H - P.b} y2={H - P.b} stroke="var(--border)" strokeWidth={1} />
        {pts.length > 0 ? (
          <>
            <path
              d={`${d}L${(pts[pts.length - 1].x + 8.6).toFixed(1)} ${H - P.b}L${(pts[0].x - 8.6).toFixed(1)} ${
                H - P.b
              }Z`}
              fill="var(--cyan)"
              opacity={0.12}
            />
            <path d={d} fill="none" stroke="var(--cyan)" strokeWidth={2} />
          </>
        ) : null}
        <line
          x1={P.l}
          x2={W - P.r}
          y1={Y(threshold)}
          y2={Y(threshold)}
          stroke="var(--zone-mid)"
          strokeWidth={1}
          strokeDasharray="4 4"
          opacity={0.7}
        />
        {thresholdLabel ? (
          <Label x={P.l + 2} y={Y(threshold) - 5} text={thresholdLabel} color="var(--zone-mid)" anchor="start" />
        ) : null}
        {nowPt ? (
          <g>
            <PulseDot x={nowPt.x} y={nowPt.y} color="var(--cyan)" />
            <Tag
              x={nowPt.x + 6}
              y={nowPt.y - 14}
              text={verdictText}
              color={good ? 'var(--mint)' : 'var(--zone-mid)'}
              anchor="start"
            />
          </g>
        ) : null}
        <HoursUnder x0={AQI_X0} cw={AQI_STEP} y={H - 3} startHour={startHour} />
      </svg>
    );
  }

  /* --------------------------------------------------- EN-04 outdoor-window */
  const bx = CELL_X0 + (windowStart - startHour) * CELL_W;
  const bw = (windowEnd - windowStart) * CELL_W;
  const windowText = windowLabel ?? `BEST WINDOW · ${fmtTime(windowStart)}–${fmtTime(windowEnd)}`;
  return (
    <svg {...svgProps} aria-label={`${heading}: UV, pollen and air rows — ${windowText.toLowerCase()}`}>
      <Label x={P.l + 2} y={11} text={heading} anchor="start" />
      <CellRow y={44} name="UV" vals={uv} />
      <CellRow y={64} name="POLLEN" vals={pollen} />
      <CellRow y={84} name="AIR" vals={air} />
      <rect x={(bx - 3).toFixed(1)} y={30} width={(bw + 6).toFixed(1)} height={64} rx={8} fill="var(--mint)" opacity={0.08} />
      <rect
        x={(bx - 3).toFixed(1)}
        y={30}
        width={(bw + 6).toFixed(1)}
        height={64}
        rx={8}
        fill="none"
        stroke="var(--mint)"
        strokeWidth={1.2}
      />
      <Tag x={bx + bw / 2} y={110} text={windowText} color="var(--mint)" />
      <HoursUnder x0={CELL_X0} cw={CELL_W} y={130} startHour={startHour} />
      {hint ? <Label x={160} y={146} text={hint} /> : null}
    </svg>
  );
}
