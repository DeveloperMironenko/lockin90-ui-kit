import { useEffect, useId, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';

/* CaffeineClock — the catalog caffeine family (CF-01…CF-03,
   lockin90-design/charts/caffeine-charts.html): half-life decay vs your
   bedtime — when the last safe coffee is. Three variants in a fixed 320×150
   viewBox: the signature exponential decay curve with the amber sleep
   threshold and the violet bedtime rule + verdict pill, stacked per-dose
   curves under a bold total, and the actionable mint→amber→magenta safe
   window strip with the computed LAST SAFE COFFEE tick. */

export type CaffeineClockVariant =
  | 'decay-curve' /* CF-01 — decay + 50MG threshold crossing + bed verdict */
  | 'stacked-doses' /* CF-02 — faint per-dose curves + bold TOTAL curve */
  | 'safe-window'; /* CF-03 — gradient day strip + LAST SAFE COFFEE tick */

/** One caffeine dose. */
export interface CaffeineDose {
  /** Hour of day, 0–24 (e.g. `8.5` = 8:30). */
  atH: number;
  /** Dose size in mg. */
  mg: number;
  /** Marker/curve color token; defaults by position (violet → cyan → amber). */
  color?: string;
}

export interface CaffeineClockProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  /** Catalog variant (CF-01 / CF-02 / CF-03). */
  variant?: CaffeineClockVariant;
  /** The day's doses, in time order (default per variant reproduces the card). */
  doses?: CaffeineDose[];
  /** Caffeine half-life in hours (the catalog t½ 5.7h). */
  halfLifeH?: number;
  /** Bedtime hour → violet dashed rule + verdict pill / safe-window anchor. */
  bedH?: number;
  /** Sleep threshold in mg (the amber dashed rule; verdicts compare to it). */
  thresholdMg?: number;
  /** y-scale ceiling in mg. */
  maxMg?: number;
  /** x-axis day window, hours. */
  dayStartH?: number;
  dayEndH?: number;
  /** `safe-window` NOW position, hour of day. */
  nowH?: number;
  /** Decay-curve color token (CF-01). */
  color?: string;
  /** Bed verdict pill override (default derived `BED · ${mg}MG ✓/⚠`). */
  bedLabel?: string;
  /** Threshold-crossing pill override (default `UNDER ${mg}MG · ${time}`). */
  crossLabel?: string;
  /** `stacked-doses` key note. */
  note?: string;
  /** `safe-window` tick pill override (default `LAST SAFE COFFEE · ${time}`,
   *  one half-life before bed). */
  safeLabel?: string;
  /** `safe-window` past-cups caption (default `${n} COFFEES SO FAR`). */
  cupsNote?: string;
  /** `safe-window` bottom legend (default derived from `bedH`). */
  legendNote?: string;
  /** Top-left mono caption (e.g. 'COFFEE 8:30 · 120MG'). */
  title?: string;
  /** Interior gridlines + baseline (the catalog grid). */
  grid?: boolean;
  /** Glow underlay along the decay curve (the catalog `cfg.shine`). */
  shine?: boolean;
  /** Accessible description of the chart. */
  ariaLabel?: string;
}

/* ---- catalog geometry (viewBox units — charts/catalog.js + caffeine page) ---- */
const W = 320;
const H = 150;
const PAD = { l: 10, r: 12, t: 16, b: 14 };
const PLOT_H = H - PAD.t - PAD.b; // 120
const GRID_ROWS = [0.25, 0.5, 0.75] as const;
const X0 = PAD.l + 10;
const X1 = W - PAD.r - 10;

/** Round for compact attribute strings. */
const rd = (n: number) => Math.round(n * 100) / 100;

/** `h:mm` from a fractional hour (17.3 → '17:18'). */
function fmtH(h: number): string {
  let hh = Math.floor(h);
  let mm = Math.round((h - hh) * 60);
  if (mm === 60) {
    hh += 1;
    mm = 0;
  }
  return `${hh}:${String(mm).padStart(2, '0')}`;
}

/** track `prefers-reduced-motion` — pulses stay static until motion is allowed */
function useMotionOK(): boolean {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) setOk(true);
  }, []);
  return ok;
}

/** Mono catalog label (8.5px JetBrains Mono, .06em) — styling in caffeineclock.css. */
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
    <text className="lk-caff-label" x={rd(x)} y={rd(y)} fill={fill} textAnchor={anchor}>
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
      <text className="lk-caff-tag-text" x={rd(xa + wpx / 2)} y={rd(y + 2.8)} fill={color} textAnchor="middle">
        {children}
      </text>
    </g>
  );
}

/** Glowing dot + SMIL pulse ring (the catalog `pulseDot`), reduced-motion safe. */
function PulseDot({ x, y, color, motionOK }: { x: number; y: number; color: string; motionOK: boolean }) {
  return (
    <g>
      <circle className="lk-caff-glowdot" cx={rd(x)} cy={rd(y)} r={3.6} fill={color} style={{ color }} />
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

/* per-dose curve colors, in dose order (the catalog stacked trio) */
const DOSE_COLORS = ['var(--violet)', 'var(--cyan)', 'var(--zone-mid)'] as const;

const DEFAULT_DECAY: CaffeineDose[] = [{ atH: 8.5, mg: 120, color: 'var(--mint)' }];
const DEFAULT_STACK: CaffeineDose[] = [
  { atH: 7.5, mg: 90 },
  { atH: 10.5, mg: 60 },
  { atH: 14, mg: 80 },
];
const DEFAULT_WINDOW: CaffeineDose[] = [
  { atH: 7.5, mg: 90 },
  { atH: 10.5, mg: 60 },
];

/**
 * CaffeineClock — the caffeine-clock family (catalog CF-01…CF-03): mg in the
 * system over the day, computed from the doses with the exponential half-life
 * model `mg · 0.5^((h − atH)/t½)`. The bed verdict, threshold crossing and
 * LAST SAFE COFFEE tick are all derived from the data — pass real doses and
 * the answers are real.
 */
export function CaffeineClock({
  variant = 'decay-curve',
  doses,
  halfLifeH = 5.7,
  bedH = 23,
  thresholdMg = 50,
  maxMg = 200,
  dayStartH = 6,
  dayEndH = 24,
  nowH = 14,
  color = 'var(--mint)',
  bedLabel,
  crossLabel,
  note = 'BOLD = TOTAL',
  safeLabel,
  cupsNote,
  legendNote,
  title,
  grid = true,
  shine = false,
  ariaLabel = 'Caffeine decay chart',
  className,
  ...rest
}: CaffeineClockProps) {
  const uid = useId().replace(/[^a-zA-Z0-9-]/g, '');
  const motionOK = useMotionOK();

  const ds =
    doses ??
    (variant === 'stacked-doses' ? DEFAULT_STACK : variant === 'safe-window' ? DEFAULT_WINDOW : DEFAULT_DECAY);

  /** hour → x (the page's `xh`, generalized to the day window). */
  const xh = (h: number) => X0 + ((h - dayStartH) / (dayEndH - dayStartH)) * (X1 - X0);
  /** mg → y (the page's `ymg`). */
  const ymg = (mg: number) => H - PAD.b - 6 - (mg / maxMg) * (PLOT_H - 18);
  /** total mg in the system at hour `h` (each dose decays independently). */
  const lvl = (dd: CaffeineDose[], h: number) =>
    dd.reduce((s, d) => (h < d.atH ? s : s + d.mg * Math.pow(0.5, (h - d.atH) / halfLifeH)), 0);
  /** decay path sampled every 0.25h from `h0` to the end of the window. */
  const curve = (dd: CaffeineDose[], h0: number) => {
    let d = '';
    for (let h = h0; h <= dayEndH + 0.01; h += 0.25) d += `${d ? 'L' : 'M'}${rd(xh(h))} ${rd(ymg(lvl(dd, h)))}`;
    return d;
  };

  /** dashed-stem cup marker + mg caption (the page's `cup`). */
  const cupMarker = (d: CaffeineDose, i: number) => {
    const c = d.color ?? DOSE_COLORS[i % DOSE_COLORS.length];
    const x = xh(d.atH);
    return (
      <g key={i}>
        <line
          x1={rd(x)}
          x2={rd(x)}
          y1={rd(ymg(0))}
          y2={rd(ymg(d.mg))}
          stroke={c}
          strokeWidth={1}
          strokeDasharray="2 3"
          opacity={0.7}
        />
        <circle cx={rd(x)} cy={rd(ymg(d.mg))} r={3} fill={c} />
        <Label x={x} y={ymg(d.mg) - 8} fill={c}>
          {`${d.mg}MG`}
        </Label>
      </g>
    );
  };

  /* bed verdict — derived from the model */
  const mgAtBed = Math.round(lvl(ds, bedH));
  const bedOK = mgAtBed < thresholdMg;
  const bedText = bedLabel ?? `BED · ${mgAtBed}MG ${bedOK ? '✓' : '⚠'}`;
  const bedColor = bedOK ? 'var(--mint)' : 'var(--zone-low)';
  const bedRule = (
    <g>
      <line
        x1={rd(xh(bedH))}
        x2={rd(xh(bedH))}
        y1={PAD.t + 6}
        y2={H - PAD.b}
        stroke="var(--violet)"
        strokeWidth={1.2}
        strokeDasharray="4 4"
      />
      <Tag x={xh(bedH) - 4} y={PAD.t + 12} color={bedColor} anchor="end">
        {bedText}
      </Tag>
    </g>
  );

  /* hour ticks every 3h across the window */
  const ticks: number[] = [];
  for (let h = Math.ceil(dayStartH / 3) * 3; h <= dayEndH; h += 3) ticks.push(h);
  const hourTicks = (
    <g>
      {ticks.map((h) => (
        <Label key={h} x={xh(h)} y={H - 3} fill="var(--text-faint)">
          {`${h}:00`}
        </Label>
      ))}
    </g>
  );

  let body: ReactNode = null;

  if (variant === 'stacked-doses') {
    /* CF-02 — faint per-dose curves + bold white TOTAL */
    const first = Math.min(...ds.map((d) => d.atH));
    body = (
      <g>
        {ds.map((d, i) => (
          <path
            key={i}
            d={curve([d], d.atH)}
            fill="none"
            stroke={d.color ?? DOSE_COLORS[i % DOSE_COLORS.length]}
            strokeWidth={1.2}
            opacity={0.55}
          />
        ))}
        <path d={curve(ds, first)} fill="none" stroke="var(--text)" strokeWidth={2.2} strokeLinecap="round" />
        {ds.map((d, i) => cupMarker(d, i))}
        {bedRule}
        {hourTicks}
        <Label x={xh(dayStartH + (dayEndH - dayStartH) * 0.44) + 8} y={ymg(maxMg * 0.75)} fill="var(--text-dim)" anchor="start">
          {note}
        </Label>
      </g>
    );
  } else if (variant === 'safe-window') {
    /* CF-03 — gradient day strip + computed LAST SAFE COFFEE tick */
    const y = 74;
    const cut = bedH - halfLifeH; // one half-life before bed
    const gradId = `lk-caff-w-${uid}`;
    const avgH = ds.length > 0 ? ds.reduce((s, d) => s + d.atH, 0) / ds.length : dayStartH;
    body = (
      <g>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--mint)" />
            <stop offset="55%" stopColor="var(--mint)" />
            <stop offset="75%" stopColor="var(--zone-mid)" />
            <stop offset="100%" stopColor="var(--magenta)" />
          </linearGradient>
        </defs>
        <rect x={X0} y={y - 9} width={X1 - X0} height={18} rx={9} fill={`url(#${gradId})`} opacity={0.75} />
        <line x1={rd(xh(cut))} x2={rd(xh(cut))} y1={y - 17} y2={y + 17} stroke="var(--text)" strokeWidth={2} />
        <Tag x={xh(cut)} y={y - 26} color="var(--mint)">
          {safeLabel ?? `LAST SAFE COFFEE · ${fmtH(cut)}`}
        </Tag>
        <PulseDot x={xh(nowH)} y={y} color="var(--text)" motionOK={motionOK} />
        <Label x={xh(nowH)} y={y + 26} fill="var(--text-dim)">
          {`NOW · ${fmtH(nowH)}`}
        </Label>
        {ds.map((d, i) => (
          <circle
            key={i}
            cx={rd(xh(d.atH))}
            cy={y}
            r={3}
            fill="color-mix(in srgb, var(--bg-0) 80%, transparent)"
            stroke="var(--text)"
            strokeOpacity={0.8}
            strokeWidth={1.2}
          />
        ))}
        <Label x={xh(avgH)} y={y - 22} fill="var(--text-faint)">
          {cupsNote ?? `${ds.length} COFFEES SO FAR`}
        </Label>
        <Label x={W / 2} y={128} fill="var(--text-faint)">
          {legendNote ?? `GREEN = SAFE FOR ${fmtH(bedH)} BED · RED = HITS SLEEP`}
        </Label>
        {hourTicks}
      </g>
    );
  } else {
    /* CF-01 — the signature decay curve + threshold + bed verdict */
    const first = Math.min(...ds.map((d) => d.atH));
    const d = curve(ds, first);
    // first time the (post-last-dose) total dips under the threshold
    let t50: number | null = null;
    if (ds.length > 0) {
      const lastDose = Math.max(...ds.map((dd) => dd.atH));
      for (let h = Math.max(lastDose, dayStartH); h <= dayEndH; h += 0.05) {
        if (lvl(ds, h) < thresholdMg) {
          t50 = h;
          break;
        }
      }
    }
    body = (
      <g>
        {shine ? (
          <path className="lk-caff-shine" d={d} fill="none" stroke={color} strokeWidth={7} opacity={0.45} />
        ) : null}
        <line
          x1={X0}
          x2={X1}
          y1={rd(ymg(thresholdMg))}
          y2={rd(ymg(thresholdMg))}
          stroke="var(--zone-mid)"
          strokeWidth={1.1}
          strokeDasharray="4 4"
        />
        <Label x={X0 + 2} y={ymg(thresholdMg) - 6} fill="var(--zone-mid)" anchor="start">
          {`SLEEP THRESHOLD ${thresholdMg}MG`}
        </Label>
        <path d={d} fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
        {ds.map((dd, i) => cupMarker(dd, i))}
        {t50 != null ? (
          <g>
            <circle cx={rd(xh(t50))} cy={rd(ymg(thresholdMg))} r={3.4} fill="var(--zone-mid)" />
            <Tag x={xh(t50) + 6} y={ymg(thresholdMg) + 16} color="var(--zone-mid)" anchor="start">
              {crossLabel ?? `UNDER ${thresholdMg}MG · ${fmtH(t50)}`}
            </Tag>
          </g>
        ) : null}
        {bedRule}
        {hourTicks}
      </g>
    );
  }

  return (
    <div className={cn('lk-caff', className)} role="img" aria-label={ariaLabel} {...rest}>
      <svg className="lk-caff-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        {/* catalog grid: 3 interior rows + solid baseline */}
        {grid ? (
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
        {body}
      </svg>
    </div>
  );
}
