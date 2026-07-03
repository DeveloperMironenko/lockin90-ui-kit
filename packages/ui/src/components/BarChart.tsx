import { useId, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';

/** One bar in the chart. */
export interface BarItem {
  /** the bar's value — its height is `value / max` of the chart area */
  value: number;
  /** label shown below the bar (mono, uppercase, faint) */
  label?: string;
  /** override fill — a token var() or any CSS background; defaults to `gradient` */
  color?: string;
  /** highlight this bar (brighter mint gradient + glow; `today-pulse` pulses it) */
  highlight?: boolean;
}

/**
 * Catalog SVG variants (design catalog `bar-charts.html`, BC-01…BC-24).
 * Omit `variant` for the classic flex-column bars.
 */
export type BarChartVariant =
  | 'bars' // BC-01
  | 'spectrum-bars' // BC-04
  | 'zone-bars' // BC-05
  | 'lollipop' // BC-08
  | 'diverging-tide' // BC-11
  | 'stacked' // BC-12
  | 'grouped-pair' // BC-14
  | 'value-caps' // BC-15
  | 'fade-history' // BC-16
  | 'today-pulse' // BC-17
  | 'rank-rows' // BC-18
  | 'waterfall' // BC-19
  | 'goal-bars' // BC-20
  | 'sparkbar-micro' // BC-22
  | 'forecast-bars'; // BC-24

/** One dot-legend entry (rendered top-right inside the plot). */
export interface BarChartLegendItem {
  label: string;
  /** dot color — a token var() (web) */
  color: string;
}

export interface BarChartProps extends HTMLAttributes<HTMLDivElement> {
  /** the bars, drawn left → right */
  bars?: BarItem[];
  /** the value that maps to full chart height (100%); defaults to the max bar value */
  max?: number;
  /** chart area height in px (classic mode only — variants keep the 320×150 catalog aspect) */
  height?: number;
  /** show the value above each bar */
  showValues?: boolean;
  /** default bar fill when an item has no `color` (classic mode) */
  gradient?: string;
  /** render one of the catalog SVG chart forms; omit → the classic flex bars */
  variant?: BarChartVariant;
  /** variant solid fill — any token var() (default `--mint`; `lollipop` defaults `--cyan`) */
  color?: string;
  /** variant vertical fill-gradient stops, top → bottom (overrides `color`) — the BC-01 gradient SELECT */
  gradientStops?: string[];
  /** variant glass fill (white 14%) — the BC-01 glass SELECT */
  glass?: boolean;
  /**
   * Multi-series data for `stacked` (2–3 series = the segment SELECT) and
   * `grouped-pair` (2 series). `series[k][i]` = series `k`, bar `i`. Segment /
   * pair colors come from `legend` colors when given, else mint/violet/cyan.
   */
  series?: number[][];
  /** dot legend rendered top-right inside the plot */
  legend?: BarChartLegendItem[];
  /** mono context label top-left inside the plot (catalog card title) */
  title?: string;
  /** dashed `--zone-mid` GOAL rule at this value (on the `max` scale) — BC-20 */
  goal?: number;
  /** `forecast-bars`: index of the first projected bar (outlined dashed; NOW rule before it) */
  forecastFrom?: number;
  /** `waterfall`: starting level (on the `max` scale); defaults to the first bar's value */
  waterfallStart?: number;
  /** glow underlay behind the bars (blurred duplicate) */
  shine?: boolean;
  /** faint horizontal gridlines (default true; `sparkbar-micro` defaults false) */
  grid?: boolean;
}

/** Faithful reproduction of the design's weekday-style bars. */
const DEFAULT_BARS: BarItem[] = [
  { value: 71, label: 'M' },
  { value: 76, label: 'T' },
  { value: 79, label: 'W', highlight: true },
  { value: 74, label: 'T' },
  { value: 68, label: 'F' },
  { value: 61, label: 'S', color: 'var(--zone-mid)' },
  { value: 70, label: 'S' },
];

const DEFAULT_GRADIENT = 'linear-gradient(180deg, var(--cyan), var(--accent))';

/** brighter mint gradient used for highlighted bars (when they have no `color`) */
const HIGHLIGHT_GRADIENT = 'var(--grad-mint)';

/* ----------------------------------------------------------------------------
   Variant SVG geometry — ported from the design catalog runtime (catalog.js):
   320×150 viewBox, plot inset l10 r12 t16 b14. The SVG scales uniformly to the
   container width so the render matches the catalog card at any size.
   -------------------------------------------------------------------------- */
const VB_W = 320;
const VB_H = 150;
const PAD = { l: 10, r: 12, t: 16, b: 14 } as const;
const PLOT_W = VB_W - PAD.l - PAD.r; // 298
const PLOT_H = VB_H - PAD.t - PAD.b; // 120
const BASE_Y = VB_H - PAD.b; // 136

/** x-position spectrum (BC-04) + rank-row palette (BC-18) — lime→magenta. */
const SPECTRUM = [
  'var(--lime)',
  'var(--mint)',
  'var(--cyan)',
  'var(--indigo)',
  'var(--violet)',
  'var(--magenta)',
];

/** default stacked-segment / grouped-pair palette (bottom→top / left→right) */
const SERIES_COLORS = ['var(--mint)', 'var(--violet)', 'var(--cyan)'];

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
/** catalog zone thresholds: ≥0.62 high · ≥0.38 mid · else low */
const zoneOf = (f: number) =>
  f >= 0.62 ? 'var(--zone-high)' : f >= 0.38 ? 'var(--zone-mid)' : 'var(--zone-low)';
const fx = (n: number) => Math.round(n * 10) / 10;
const yOf = (f: number) => PAD.t + (1 - f) * PLOT_H;

/**
 * Stacked-segment path (BC-12): round ONLY the outer corners — `rTop` on the
 * top segment, `rBottom` on the bottom one — internal seams stay square.
 * Ported verbatim from the catalog path math.
 */
function stackSegPath(x: number, yTop: number, w: number, h: number, rTop: number, rBottom: number) {
  const rt = Math.min(rTop, h / 2);
  const rb = Math.min(rBottom, h / 2);
  return (
    `M${fx(x)} ${fx(yTop + rt)}` +
    `a${rt} ${rt} 0 0 1 ${rt} ${-rt}` +
    `h${fx(w - 2 * rt)}` +
    `a${rt} ${rt} 0 0 1 ${rt} ${rt}` +
    `v${fx(h - rt - rb)}` +
    `a${rb} ${rb} 0 0 1 ${-rb} ${rb}` +
    `h${fx(-(w - 2 * rb))}` +
    `a${rb} ${rb} 0 0 1 ${-rb} ${-rb}z`
  );
}

/** mono in-plot label (catalog `C.label`) */
function PlotLabel({
  x,
  y,
  children,
  color = 'var(--text-faint)',
  anchor = 'middle',
}: {
  x: number;
  y: number;
  children: string;
  color?: string;
  anchor?: 'start' | 'middle' | 'end';
}) {
  return (
    <text className="lk-bcv-label" x={fx(x)} y={fx(y)} fill={color} textAnchor={anchor}>
      {children}
    </text>
  );
}

interface VariantChartProps extends BarChartProps {
  variant: BarChartVariant;
}

/** The catalog-variant SVG renderer (internal). */
function VariantChart({
  variant,
  bars = DEFAULT_BARS,
  max,
  showValues,
  color,
  gradientStops,
  glass,
  series,
  legend,
  title,
  goal,
  forecastFrom,
  waterfallStart,
  shine,
  grid,
  className,
  style,
  // classic-only props, consumed so they don't leak onto the DOM node
  height: _height,
  gradient: _gradient,
  ...rest
}: VariantChartProps) {
  const uid = useId();
  const gid = `lk-bcv-g-${uid.replace(/[^a-zA-Z0-9]/g, '')}`;

  const hasSeries = (series?.length ?? 0) > 0 && (series![0]?.length ?? 0) > 0;
  const n = hasSeries ? series![0].length : bars.length;
  const values = hasSeries ? [] : bars.map((b) => b.value);

  // denominator: `max` wins; else the largest visible value (stacked → bar totals)
  let denom: number;
  if (max != null) {
    denom = max;
  } else if (hasSeries && variant === 'stacked') {
    const totals = series![0].map((_, i) => series!.reduce((acc, s) => acc + (s[i] > 0 ? s[i] : 0), 0));
    denom = Math.max(0, ...totals);
  } else if (hasSeries) {
    denom = Math.max(0, ...series!.flat());
  } else {
    denom = Math.max(0, ...values);
  }
  if (!(denom > 0)) denom = 1;

  const showGrid = grid ?? variant !== 'sparkbar-micro';
  const bwFrac = variant === 'sparkbar-micro' ? 0.5 : 0.62;
  const rx = variant === 'sparkbar-micro' ? 1 : 3;
  const step = PLOT_W / Math.max(1, n);
  const bw = step * bwFrac;
  const bx = (i: number) => PAD.l + i * step + (step - bw) / 2;

  const fillFor = (f: number, i: number): string => {
    if (gradientStops && gradientStops.length >= 2) return `url(#${gid})`;
    if (variant === 'zone-bars') return zoneOf(f);
    if (variant === 'spectrum-bars')
      return SPECTRUM[Math.min(SPECTRUM.length - 1, Math.floor((i / n) * SPECTRUM.length))];
    if (glass) return 'rgba(255,255,255,0.14)';
    return color ?? (variant === 'lollipop' ? 'var(--cyan)' : 'var(--mint)');
  };

  const seriesColor = (k: number) => legend?.[k]?.color ?? SERIES_COLORS[k] ?? 'var(--accent)';

  // today-pulse: the flagged bar (last `highlight: true`), else the newest bar
  let hlIdx = n - 1;
  for (let i = bars.length - 1; i >= 0; i--) {
    if (bars[i]?.highlight) {
      hlIdx = i;
      break;
    }
  }

  const els: ReactNode[] = [];

  if (variant === 'rank-rows') {
    /* ---- horizontal ranked pills (BC-18) ---- */
    const rows = [...bars].sort((a, b) => b.value - a.value).slice(0, 6);
    const rh = PLOT_H / Math.max(1, rows.length);
    rows.forEach((b, i) => {
      const f = clamp01(b.value / denom);
      const y = PAD.t + i * rh + rh * 0.22;
      const hh = rh * 0.52;
      els.push(
        <rect key={`r${i}`} x={78} y={fx(y)} width={fx((PLOT_W - 72) * f)} height={fx(hh)} rx={fx(hh / 2)} fill={SPECTRUM[i % SPECTRUM.length]} />,
      );
      if (b.label)
        els.push(
          <PlotLabel key={`rl${i}`} x={74} y={y + hh / 2 + 3} color="var(--text-dim)" anchor="end">
            {b.label}
          </PlotLabel>,
        );
    });
  } else if (variant === 'waterfall') {
    /* ---- floating ± steps (BC-19): values are the running LEVEL ---- */
    let lvl = clamp01((waterfallStart ?? values[0] ?? 0) / denom);
    values.forEach((val, i) => {
      const nl = clamp01(val / denom);
      const y0 = yOf(Math.max(lvl, nl));
      const hh = Math.abs(yOf(lvl) - yOf(nl));
      els.push(
        <rect
          key={`w${i}`}
          x={fx(bx(i))}
          y={fx(y0)}
          width={fx(bw)}
          height={fx(Math.max(2, hh))}
          rx={2}
          fill={nl >= lvl ? 'var(--mint)' : 'var(--zone-low)'}
          opacity={0.9}
        />,
        <line
          key={`wc${i}`}
          x1={fx(bx(i) + bw)}
          x2={fx(bx(i) + bw + (step - bw))}
          y1={fx(yOf(nl))}
          y2={fx(yOf(nl))}
          stroke="rgba(255,255,255,0.25)"
          strokeWidth={1}
        />,
      );
      lvl = nl;
    });
  } else if (variant === 'stacked' && hasSeries) {
    /* ---- stacked segments (BC-12): outer corners rounded, seams square ---- */
    for (let i = 0; i < n; i++) {
      const segs = series!.map((s) => (s[i] > 0 ? s[i] : 0)).filter((v) => v > 0);
      const sum = segs.reduce((acc, v) => acc + v, 0);
      if (sum <= 0) continue;
      const tot = clamp01(sum / denom) * PLOT_H;
      let yCur = BASE_Y;
      segs.forEach((segVal, si) => {
        const sh = tot * (segVal / sum) - 1;
        yCur -= sh + 1;
        if (sh <= 0) return;
        const rt = si === segs.length - 1 ? 3 : 0;
        const rb = si === 0 ? 3 : 0;
        els.push(
          <path key={`s${i}-${si}`} d={stackSegPath(bx(i), yCur, bw, sh, rt, rb)} fill={seriesColor(si)} opacity={0.9} />,
        );
      });
    }
  } else if (variant === 'grouped-pair' && hasSeries) {
    /* ---- two series side-by-side (BC-14) ---- */
    const gw = bw / 2 - 1;
    for (let i = 0; i < n; i++) {
      const fa = clamp01((series![0][i] ?? 0) / denom);
      const fb = clamp01((series![1]?.[i] ?? 0) / denom);
      els.push(
        <rect key={`ga${i}`} x={fx(bx(i))} y={fx(yOf(fa))} width={fx(gw)} height={fx(BASE_Y - yOf(fa))} rx={2} fill={seriesColor(0)} />,
        <rect key={`gb${i}`} x={fx(bx(i) + gw + 2)} y={fx(yOf(fb))} width={fx(gw)} height={fx(BASE_Y - yOf(fb))} rx={2} fill={seriesColor(1)} opacity={0.85} />,
      );
    }
  } else {
    /* ---- the standard per-bar loop (BC-01/04/05/08/11/15/16/17/20/22/24) ---- */
    values.forEach((val, i) => {
      const f = clamp01(val / denom);
      const x = bx(i);
      if (variant === 'diverging-tide') {
        const mid = yOf(0.5);
        const dv = f - 0.5;
        const hh = Math.abs(dv) * PLOT_H;
        els.push(
          <rect
            key={`b${i}`}
            x={fx(x)}
            y={fx(dv >= 0 ? mid - hh : mid)}
            width={fx(bw)}
            height={fx(Math.max(2, hh))}
            rx={rx}
            fill={dv >= 0 ? 'var(--mint)' : 'var(--zone-low)'}
            opacity={0.92}
          />,
        );
        return;
      }
      if (variant === 'lollipop') {
        els.push(
          <line key={`ls${i}`} x1={fx(x + bw / 2)} x2={fx(x + bw / 2)} y1={BASE_Y} y2={fx(yOf(f))} stroke={fillFor(f, i)} strokeWidth={2} />,
          <circle key={`lh${i}`} cx={fx(x + bw / 2)} cy={fx(yOf(f))} r={3.4} fill={fillFor(f, i)} />,
        );
        return;
      }
      let op = 1;
      if (variant === 'fade-history') op = 0.25 + 0.75 * (n > 1 ? i / (n - 1) : 1);
      if (variant === 'today-pulse') op = i === hlIdx ? 1 : 0.3;
      if (variant === 'forecast-bars' && forecastFrom != null && i >= forecastFrom) {
        els.push(
          <rect
            key={`b${i}`}
            x={fx(x)}
            y={fx(yOf(f))}
            width={fx(bw)}
            height={fx(BASE_Y - yOf(f))}
            rx={rx}
            fill="none"
            stroke={fillFor(f, i)}
            strokeWidth={1.4}
            strokeDasharray="4 3"
            opacity={0.8}
          />,
        );
        return;
      }
      if (shine)
        els.push(
          <rect
            key={`sh${i}`}
            className="lk-bcv-shine"
            x={fx(x)}
            y={fx(yOf(f))}
            width={fx(bw)}
            height={fx(BASE_Y - yOf(f))}
            rx={4}
            fill={fillFor(f, i)}
            opacity={0.5}
          />,
        );
      els.push(
        <rect
          key={`b${i}`}
          x={fx(x)}
          y={fx(yOf(f))}
          width={fx(bw)}
          height={fx(Math.max(2, BASE_Y - yOf(f)))}
          rx={rx}
          fill={fillFor(f, i)}
          opacity={op}
        />,
      );
      if ((variant === 'value-caps' || showValues === true) && i % 2 === 0)
        els.push(
          <PlotLabel key={`v${i}`} x={x + bw / 2} y={yOf(f) - 5}>
            {String(Math.round(val))}
          </PlotLabel>,
        );
      const lab = bars[i]?.label;
      if (lab != null && variant !== 'sparkbar-micro')
        els.push(
          <PlotLabel key={`l${i}`} x={x + bw / 2} y={BASE_Y + 10}>
            {lab}
          </PlotLabel>,
        );
    });
  }

  /* ---- context rules & markers ---- */
  if (goal != null) {
    const ty = yOf(clamp01(goal / denom));
    els.push(
      <line key="goal" x1={PAD.l} x2={VB_W - PAD.r} y1={fx(ty)} y2={fx(ty)} stroke="var(--zone-mid)" strokeWidth={1} strokeDasharray="5 4" opacity={0.85} />,
      <PlotLabel key="goal-l" x={VB_W - PAD.r} y={ty - 4} color="var(--zone-mid)" anchor="end">
        GOAL
      </PlotLabel>,
    );
  }
  if (variant === 'today-pulse' && values.length > 0) {
    const f = clamp01((values[hlIdx] ?? 0) / denom);
    const c = fillFor(f, hlIdx);
    const cx = fx(bx(hlIdx) + bw / 2);
    const cy = fx(yOf(f) - 6);
    els.push(
      <circle key="pd" className="lk-bcv-pulse-dot" cx={cx} cy={cy} r={3.6} fill={c} style={{ ['--c']: c } as CSSProperties} />,
      <circle key="pr" className="lk-bcv-pulse-ring" cx={cx} cy={cy} r={3.6} fill="none" stroke={c} strokeWidth={1.4} />,
    );
  }
  if (variant === 'forecast-bars' && forecastFrom != null) {
    const fxx = PAD.l + forecastFrom * step;
    els.push(
      <line key="now" x1={fx(fxx)} x2={fx(fxx)} y1={PAD.t - 2} y2={BASE_Y} stroke="rgba(255,255,255,0.22)" strokeWidth={1} />,
      <PlotLabel key="now-l" x={fxx} y={PAD.t - 5} color="var(--text-dim)">
        NOW
      </PlotLabel>,
    );
  }

  /* ---- legend (top-right, right→left like the catalog) ---- */
  const legendEls: ReactNode[] = [];
  if (legend && legend.length > 0) {
    let lx = VB_W - PAD.r - 2;
    [...legend].reverse().forEach((item, i) => {
      legendEls.push(
        <PlotLabel key={`lg${i}`} x={lx} y={11} color="var(--text-dim)" anchor="end">
          {item.label}
        </PlotLabel>,
      );
      lx -= item.label.length * 5.6 + 8;
      legendEls.push(<circle key={`lgd${i}`} cx={fx(lx)} cy={8.2} r={3} fill={item.color} />);
      lx -= 8;
    });
  }

  return (
    <div className={cn('lk-bcv', className)} style={style} {...rest}>
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} aria-hidden={rest['aria-label'] == null || undefined} role="img">
        {gradientStops && gradientStops.length >= 2 && (
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              {gradientStops.map((stop, i) => (
                <stop key={i} offset={i / (gradientStops.length - 1)} stopColor={stop} />
              ))}
            </linearGradient>
          </defs>
        )}
        {showGrid && (
          <g>
            {[0.25, 0.5, 0.75].map((f) => (
              <line key={f} x1={PAD.l} x2={VB_W - PAD.r} y1={fx(PAD.t + PLOT_H * f)} y2={fx(PAD.t + PLOT_H * f)} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
            ))}
            <line x1={PAD.l} x2={VB_W - PAD.r} y1={BASE_Y} y2={BASE_Y} stroke="rgba(255,255,255,0.09)" strokeWidth={1} />
          </g>
        )}
        {title && (
          <PlotLabel x={PAD.l + 2} y={11} anchor="start">
            {title}
          </PlotLabel>
        )}
        {legendEls}
        {els}
      </svg>
    </div>
  );
}

/**
 * Generic vertical bar chart. Two modes:
 *
 * - **Classic (no `variant`)** — a flex row of columns, each a gradient-filled
 *   bar sized by `value / max` of the chart area, with an optional value label
 *   above and a mono/uppercase label below. Highlighted bars get a brighter
 *   mint gradient + glow. Per-bar `color` overrides the shared `gradient`.
 *   Defaults reproduce the weekday example.
 * - **Catalog variant (`variant="…"`)** — an SVG chart on the design catalog's
 *   320×150 geometry implementing the named BC-xx form (spectrum/zone fills,
 *   lollipop, diverging, stacked with outer-corner-only rounding, grouped,
 *   fade, today-pulse, rank rows, waterfall, goal rule, sparkbar, forecast).
 *   BC-01's density SELECT is simply the number of bars passed (7 / 12 / 24).
 *
 * Tokens-driven, no Tailwind.
 */
export function BarChart(props: BarChartProps) {
  if (props.variant) {
    return <VariantChart {...(props as VariantChartProps)} />;
  }

  const {
    bars = DEFAULT_BARS,
    max,
    height = 150,
    showValues = true,
    gradient = DEFAULT_GRADIENT,
    className,
    style,
    title,
    // consume variant-only props so they don't leak onto the DOM node
    variant: _variant,
    color: _color,
    gradientStops: _gs,
    glass: _glass,
    series: _series,
    legend: _legend,
    goal: _goal,
    forecastFrom: _ff,
    waterfallStart: _ws,
    shine: _shine,
    grid: _grid,
    ...divRest
  } = props;

  const ref = max ?? Math.max(0, ...bars.map((b) => b.value));
  const denom = ref > 0 ? ref : 1;

  return (
    <div
      className={cn('lk-bc', className)}
      style={{ ['--bc-h']: `${height}px`, ...style } as CSSProperties}
      title={title}
      {...divRest}
    >
      {bars.map((b, i) => {
        const pct = Math.max(0, Math.min(1, b.value / denom));
        const fill = b.color ?? (b.highlight ? HIGHLIGHT_GRADIENT : gradient);
        return (
          <div key={i} className={cn('lk-bc-col', b.highlight && 'lk-bc-hl')}>
            {showValues && (
              <span className="lk-bc-val lk-mono lk-tnum">{b.value}</span>
            )}
            <div
              className="lk-bc-bar"
              style={
                {
                  '--bc-pct': pct,
                  background: fill,
                } as CSSProperties
              }
            />
            {b.label != null && <span className="lk-bc-label lk-mono">{b.label}</span>}
          </div>
        );
      })}
    </div>
  );
}
