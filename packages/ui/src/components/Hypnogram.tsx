import { Fragment, useId, type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../cn';

/** A sleep stage. Ordered top → bottom on the plot: awake, rem, light, deep. */
export type SleepStage = 'awake' | 'rem' | 'light' | 'deep';

/** One contiguous stretch of sleep in a single stage. Segment widths are drawn
 *  proportional to `minutes`. */
export interface HypnogramSegment {
  /** the sleep stage for this stretch */
  stage: SleepStage;
  /** duration in minutes — drives the segment's drawn width */
  minutes: number;
}

/** Catalog sleep-chart variants (`lockin90-design/charts/sleep-charts.html`).
 *  SL-01 `hypnogram` (default) · SL-04 `efficiency-bars` · SL-05 `sleep-week` ·
 *  SL-06 `bedtime-drift` · SL-07 `night-coach`. SL-02 stage-summary maps to
 *  `StackedBar`, SL-03 sleep-score maps to `Ring` (see the Hypnogram SDD). */
export type HypnogramVariant =
  | 'hypnogram'
  | 'efficiency-bars'
  | 'sleep-week'
  | 'bedtime-drift'
  | 'night-coach';

/** One time bucket of the night for `variant="efficiency-bars"`: minutes asleep
 *  draw a violet bar UP from the midline, minutes awake an amber bar DOWN. */
export interface EfficiencyInterval {
  asleepMinutes: number;
  awakeMinutes: number;
}

/** One night for `variant="bedtime-drift"` — clock hours; values < 12 are read
 *  as next-morning (e.g. `bed: 22.5` = 10:30pm, `bed: 0.5` = 12:30am,
 *  `wake: 6.9` = 6:54am). */
export interface SleepNight {
  bed: number;
  wake: number;
}

export interface HypnogramProps extends HTMLAttributes<HTMLDivElement> {
  /** which sleep chart to draw (catalog SL-01/04/05/06/07) */
  variant?: HypnogramVariant;
  /** chronological sleep segments; widths are proportional to `minutes`
   *  (`hypnogram` + `night-coach`) */
  segments?: HypnogramSegment[];
  /** plot height in px (also the viewBox height) */
  height?: number;
  /** x-axis time labels under the chart. Defaults per variant: the night span
   *  for `hypnogram`/`night-coach`, `11PM/3AM/7AM` for `efficiency-bars`, none
   *  for `sleep-week`/`bedtime-drift` (those label days via `days`). */
  axis?: string[];
  /** show the left-gutter stage labels (`hypnogram` + `night-coach` only) */
  showStageLabels?: boolean;
  /** glow underlay behind the colored marks (the catalog's shine modifier) */
  shine?: boolean;
  /** `efficiency-bars`: chronological night buckets */
  intervals?: EfficiencyInterval[];
  /** `efficiency-bars`: top-right violet tag */
  asleepLabel?: string;
  /** `efficiency-bars`: bottom-right amber tag */
  awakeLabel?: string;
  /** `sleep-week`: hours slept per day (one bar each) */
  week?: number[];
  /** `sleep-week`: dashed mint target rule; bars ≥ target − 0.5h are violet,
   *  under are amber */
  targetHours?: number;
  /** `sleep-week` + `bedtime-drift`: day letters under the columns */
  days?: string[];
  /** `bedtime-drift`: per-day bed/wake clock hours */
  nights?: SleepNight[];
  /** `bedtime-drift`: [from, to] bed-time clock hours of the mint band */
  consistencyWindow?: [number, number];
  /** `bedtime-drift`: bed later than this clock hour renders coral (late) */
  lateBedAfter?: number;
  /** `bedtime-drift`: right-edge mint tag over the band */
  windowLabel?: string;
  /** `night-coach`: 0–1 fraction of the night where the wake window opens
   *  (dashed amber rule) */
  wakeWindowAt?: number;
  /** `night-coach`: tag on the wake-window rule */
  wakeWindowLabel?: string;
  /** `night-coach`: mint recommendation pill (bottom-right); omit for the
   *  data-only night */
  recommendation?: string;
  /** accessible description of the chart */
  ariaLabel?: string;
}

const VB_W = 560;
/** vertical inset (viewBox units) so the top/bottom bands never touch the edge */
const PAD_Y = 14;
/** gap between consecutive segment capsules (viewBox units) */
const GAP = 4;
/** capsule bar thickness (viewBox units) */
const BAR_H = 12;

/** Stages top → bottom — the classic hypnogram order (deep at the bottom). */
const STAGES: SleepStage[] = ['awake', 'rem', 'light', 'deep'];
const STAGE_LABELS: Record<SleepStage, string> = {
  awake: 'Awake',
  rem: 'REM',
  light: 'Light',
  deep: 'Deep',
};
const STAGE_COLORS: Record<SleepStage, string> = {
  awake: 'var(--warn)',
  rem: 'var(--violet)',
  light: 'var(--cyan)',
  deep: 'var(--indigo)',
};

const DEFAULT_SEGMENTS: HypnogramSegment[] = [
  { stage: 'awake', minutes: 8 },
  { stage: 'light', minutes: 42 },
  { stage: 'deep', minutes: 55 },
  { stage: 'light', minutes: 28 },
  { stage: 'rem', minutes: 22 },
  { stage: 'light', minutes: 35 },
  { stage: 'deep', minutes: 30 },
  { stage: 'rem', minutes: 26 },
  { stage: 'light', minutes: 38 },
  { stage: 'awake', minutes: 6 },
  { stage: 'rem', minutes: 34 },
  { stage: 'light', minutes: 30 },
];
const DEFAULT_AXIS = ['11p', '1a', '3a', '5a', '7a'];
/** SL-04's clock axis (fractions 0 / 0.5 / 1 of the night). */
const DEFAULT_CLOCK_AXIS = ['11PM', '3AM', '7AM'];
const DEFAULT_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

/** SL-04 default night — the catalog card's deterministic buckets (32 × ~15min;
 *  3 brief awakenings). */
const DEFAULT_INTERVALS: EfficiencyInterval[] = [
  { asleepMinutes: 0, awakeMinutes: 2 },
  { asleepMinutes: 12, awakeMinutes: 0 },
  { asleepMinutes: 10, awakeMinutes: 0 },
  { asleepMinutes: 9, awakeMinutes: 0 },
  { asleepMinutes: 12, awakeMinutes: 0 },
  { asleepMinutes: 9, awakeMinutes: 0 },
  { asleepMinutes: 11, awakeMinutes: 0 },
  { asleepMinutes: 10, awakeMinutes: 0 },
  { asleepMinutes: 11, awakeMinutes: 0 },
  { asleepMinutes: 14, awakeMinutes: 0 },
  { asleepMinutes: 13, awakeMinutes: 0 },
  { asleepMinutes: 8, awakeMinutes: 0 },
  { asleepMinutes: 9, awakeMinutes: 0 },
  { asleepMinutes: 13, awakeMinutes: 0 },
  { asleepMinutes: 0, awakeMinutes: 5 },
  { asleepMinutes: 12, awakeMinutes: 0 },
  { asleepMinutes: 14, awakeMinutes: 0 },
  { asleepMinutes: 14, awakeMinutes: 0 },
  { asleepMinutes: 8, awakeMinutes: 0 },
  { asleepMinutes: 10, awakeMinutes: 0 },
  { asleepMinutes: 8, awakeMinutes: 0 },
  { asleepMinutes: 0, awakeMinutes: 5 },
  { asleepMinutes: 10, awakeMinutes: 0 },
  { asleepMinutes: 14, awakeMinutes: 0 },
  { asleepMinutes: 12, awakeMinutes: 0 },
  { asleepMinutes: 10, awakeMinutes: 0 },
  { asleepMinutes: 8, awakeMinutes: 0 },
  { asleepMinutes: 10, awakeMinutes: 0 },
  { asleepMinutes: 12, awakeMinutes: 0 },
  { asleepMinutes: 8, awakeMinutes: 0 },
  { asleepMinutes: 14, awakeMinutes: 0 },
  { asleepMinutes: 13, awakeMinutes: 0 },
];
/** SL-05 default week (hours). */
const DEFAULT_WEEK = [7.4, 6.1, 7.9, 8.2, 5.8, 8.6, 7.7];
/** SL-06 default nights — weekday-consistent, Fri/Sat drift late. */
const DEFAULT_NIGHTS: SleepNight[] = [
  { bed: 22.6, wake: 6.9 },
  { bed: 22.9, wake: 6.7 },
  { bed: 22.4, wake: 7.0 },
  { bed: 22.7, wake: 6.8 },
  { bed: 24.5, wake: 7.6 },
  { bed: 25.0, wake: 7.9 },
  { bed: 22.9, wake: 7.0 },
];
const DEFAULT_WINDOW: [number, number] = [22.3, 23.5];

/** SL-06 column geometry — fractions of the drawable width (catalog: dots run
 *  x = P.l+34 … plot right − 4; the mint band starts a hair earlier). */
const DRIFT_X0 = 0.114;
const DRIFT_X1 = 0.9866;
const DRIFT_BAND_X = 0.1;
const DRIFT_BAND_W = 0.87;

/** Round a number for compact attribute strings. */
const r = (n: number) => Math.round(n * 100) / 100;

/** y-center (viewBox units) of a stage's band. */
function bandY(stage: SleepStage, height: number): number {
  const top = PAD_Y;
  const bottom = height - PAD_Y;
  const i = STAGES.indexOf(stage);
  if (STAGES.length === 1) return (top + bottom) / 2;
  return top + (i / (STAGES.length - 1)) * (bottom - top);
}

/** Clock hour → continuous night-axis hour (values < 12 read as next morning). */
const nightHour = (h: number) => (h < 12 ? h + 24 : h);

/** Floating pill tag over the plot (mirrors the catalog's `C.tag`). Positioned
 *  by inline % offsets so it never distorts with the stretched SVG. */
function HypTag({
  text,
  color,
  mid,
  above,
  style,
}: {
  text: string;
  color: string;
  /** center horizontally on `style.left` */
  mid?: boolean;
  /** sit fully above `style.top` */
  above?: boolean;
  style?: CSSProperties;
}) {
  return (
    <span
      className={cn('lk-hyp-tag', mid && 'lk-hyp-tag--mid', above && 'lk-hyp-tag--above')}
      style={{ color, ...style }}
    >
      {text}
    </span>
  );
}

/**
 * Hypnogram — the sleep-chart family. The default variant is a sleep-stage
 * timeline: four horizontal bands (Awake / REM / Light / Deep, top → bottom)
 * each hold rounded capsule bars whose widths are proportional to each
 * segment's minutes; thin vertical connectors link consecutive stage
 * transitions so the eye follows the descent/ascent like a stepped line.
 * Catalog variants add: `efficiency-bars` (asleep up / awake down from the
 * midline), `sleep-week` (7 duration bars vs a dashed target rule),
 * `bedtime-drift` (bed/wake dots per day + consistency band) and `night-coach`
 * (the hypnogram + wake-window rule + optional recommendation pill). The SVG
 * uses `preserveAspectRatio="none"` so it stretches to any width; text, tags
 * and dots are HTML overlays positioned by % so they stay crisp and round.
 */
export function Hypnogram({
  variant = 'hypnogram',
  segments = DEFAULT_SEGMENTS,
  height = 160,
  axis,
  showStageLabels = true,
  shine = false,
  intervals = DEFAULT_INTERVALS,
  asleepLabel = 'ASLEEP 94%',
  awakeLabel = 'AWAKE 22 MIN',
  week = DEFAULT_WEEK,
  targetHours = 8,
  days = DEFAULT_DAYS,
  nights = DEFAULT_NIGHTS,
  consistencyWindow = DEFAULT_WINDOW,
  lateBedAfter = 24,
  windowLabel = 'CONSISTENT WINDOW',
  wakeWindowAt = 0.62,
  wakeWindowLabel = 'WAKE WINDOW OPENS',
  recommendation,
  ariaLabel,
  className,
  ...rest
}: HypnogramProps) {
  const uid = useId();

  const staged = variant === 'hypnogram' || variant === 'night-coach';
  const resolvedAxis =
    axis ?? (staged ? DEFAULT_AXIS : variant === 'efficiency-bars' ? DEFAULT_CLOCK_AXIS : []);
  const glowVar = (color: string) =>
    shine ? ({ ['--lk-hyp-glow']: color } as CSSProperties) : undefined;

  /* ---- SL-01 / SL-07 · stage bands + capsules (+ coach overlays) ---- */
  let bars: Array<{ x: number; w: number; cy: number; stage: SleepStage; x0: number; x1: number; key: number }> = [];
  let connectors: Array<{ cx: number; y1: number; y2: number; key: number }> = [];
  if (staged) {
    const total = segments.reduce((s, seg) => s + Math.max(0, seg.minutes), 0) || 1;
    const gaps = Math.max(0, segments.length - 1) * GAP;
    const drawable = Math.max(0, VB_W - gaps);
    // lay segments left → right, width ∝ minutes, with a GAP between each
    let x = 0;
    bars = segments.map((seg, i) => {
      const w = (Math.max(0, seg.minutes) / total) * drawable;
      const y = bandY(seg.stage, height);
      const bar = { x, w, cy: y, stage: seg.stage, x0: x, x1: x + w, key: i };
      x += w + GAP;
      return bar;
    });
    // vertical connectors: link the end-y of one segment to the start-y of the next
    connectors = bars.slice(1).map((b, i) => {
      const prev = bars[i];
      const cx = (prev.x1 + b.x0) / 2;
      return { cx, y1: prev.cy, y2: b.cy, key: i };
    });
  }
  const wwX = Math.max(0, Math.min(1, wakeWindowAt)) * VB_W;

  /* ---- SL-04 · efficiency bars (asleep up / awake down from the midline) ---- */
  const effMid = height / 2;
  const effAmp = height / 2 - 10;
  const effUnit = Math.max(
    1,
    ...intervals.map((iv) => Math.max(0, iv.asleepMinutes) + Math.max(0, iv.awakeMinutes)),
  );
  const effStep = VB_W / Math.max(1, intervals.length);

  /* ---- SL-05 · week bars vs target ---- */
  const weekMax = Math.max(targetHours + 1.5, Math.max(0, ...week) + 0.9);
  const weekY = (v: number) => 4 + (1 - v / weekMax) * (height - 5);
  const weekStep = VB_W / Math.max(1, week.length);
  const targetY = weekY(targetHours);

  /* ---- SL-06 · bedtime drift (earlier at the top, later at the bottom) ---- */
  const winLo = nightHour(Math.min(consistencyWindow[0], consistencyWindow[1]));
  const winHi = nightHour(Math.max(consistencyWindow[0], consistencyWindow[1]));
  const driftHours = nights.flatMap((n) => [nightHour(n.bed), nightHour(n.wake)]).concat(winLo, winHi);
  const driftLo = Math.min(...driftHours) - 0.6;
  const driftSpan = Math.max(...driftHours) + 0.6 - driftLo || 1;
  // 24px reserved at the top so the window tag sits above the band (catalog P.t)
  const driftY = (h: number) => 24 + ((nightHour(h) - driftLo) / driftSpan) * (height - 32);
  const driftX = (i: number) =>
    VB_W * (nights.length > 1 ? DRIFT_X0 + (i * (DRIFT_X1 - DRIFT_X0)) / (nights.length - 1) : 0.5);
  const bedMeanY = nights.length ? nights.reduce((s, n) => s + driftY(n.bed), 0) / nights.length : 0;
  const wakeMeanY = nights.length ? nights.reduce((s, n) => s + driftY(n.wake), 0) / nights.length : 0;

  const pct = (v: number, of: number) => `${(v / of) * 100}%`;

  return (
    <div
      className={cn(
        'lk-hyp',
        `lk-hyp--${variant}`,
        staged && showStageLabels && 'lk-hyp--labels',
        shine && 'lk-hyp--shine',
        className,
      )}
      {...rest}
    >
      <div className="lk-hyp-plot" style={{ height }}>
        {staged && showStageLabels && (
          <div className="lk-hyp-stages" aria-hidden="true">
            {STAGES.map((stage) => (
              <span
                key={stage}
                className="lk-hyp-stage"
                style={{ top: `${(bandY(stage, height) / height) * 100}%` }}
              >
                {STAGE_LABELS[stage]}
              </span>
            ))}
          </div>
        )}

        <div className="lk-hyp-canvas">
          <svg
            className="lk-hyp-svg"
            viewBox={`0 0 ${VB_W} ${height}`}
            preserveAspectRatio="none"
            role="img"
            aria-label={ariaLabel}
          >
            {staged && (
              <defs>
                {STAGES.map((stage) => (
                  <linearGradient
                    key={stage}
                    id={`lk-hyp-${stage}-${uid}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2={height}
                  >
                    <stop offset="0" stopColor={STAGE_COLORS[stage]} stopOpacity="0.95" />
                    <stop offset="1" stopColor={STAGE_COLORS[stage]} stopOpacity="0.6" />
                  </linearGradient>
                ))}
              </defs>
            )}

            {/* faint violet night canvas behind the marks (SL-04/06) */}
            {(variant === 'efficiency-bars' || variant === 'bedtime-drift') && (
              <rect className="lk-hyp-night" x="0.5" y="0.5" width={VB_W - 1} height={height - 1} rx="8" />
            )}

            {staged && (
              <>
                {/* thin vertical connectors between consecutive stage bands */}
                <g className="lk-hyp-links">
                  {connectors.map((c) => (
                    <line key={c.key} x1={r(c.cx)} y1={r(c.y1)} x2={r(c.cx)} y2={r(c.y2)} />
                  ))}
                </g>

                {/* rounded capsule bars, one per segment, on its stage band */}
                <g className="lk-hyp-bars">
                  {bars.map((b) => (
                    <rect
                      key={b.key}
                      x={r(b.x)}
                      y={r(b.cy - BAR_H / 2)}
                      width={r(Math.max(0, b.w))}
                      height={BAR_H}
                      rx={BAR_H / 2}
                      ry={BAR_H / 2}
                      fill={`url(#lk-hyp-${b.stage}-${uid})`}
                      style={glowVar(STAGE_COLORS[b.stage])}
                    />
                  ))}
                </g>

                {/* SL-07: dashed wake-window rule across the night */}
                {variant === 'night-coach' && (
                  <line
                    className="lk-hyp-rule"
                    x1={r(wwX)}
                    y1={2}
                    x2={r(wwX)}
                    y2={height - 2}
                    strokeDasharray="3 4"
                  />
                )}
              </>
            )}

            {/* SL-04: asleep bars up / awake bars down from the midline */}
            {variant === 'efficiency-bars' &&
              intervals.map((iv, i) => {
                const x = r(i * effStep + effStep * 0.18);
                const w = r(effStep * 0.64);
                const up = (Math.max(0, iv.asleepMinutes) / effUnit) * effAmp;
                const down = (Math.max(0, iv.awakeMinutes) / effUnit) * effAmp;
                return (
                  <g key={i}>
                    {up > 0 && (
                      <rect
                        className="lk-hyp-eff-up"
                        x={x}
                        y={r(effMid - up)}
                        width={w}
                        height={r(up)}
                        rx="2"
                        style={glowVar('var(--violet)')}
                      />
                    )}
                    {down > 0 && (
                      <rect
                        className="lk-hyp-eff-down"
                        x={x}
                        y={r(effMid)}
                        width={w}
                        height={r(down)}
                        rx="2"
                        style={glowVar('var(--zone-mid)')}
                      />
                    )}
                  </g>
                );
              })}

            {/* SL-05: gridlines + baseline + duration bars + dashed target rule */}
            {variant === 'sleep-week' && (
              <>
                <g className="lk-hyp-grid">
                  {[0.25, 0.5, 0.75].map((f) => (
                    <line key={f} x1="0" x2={VB_W} y1={r(4 + (height - 5) * f)} y2={r(4 + (height - 5) * f)} />
                  ))}
                </g>
                <line className="lk-hyp-base" x1="0" x2={VB_W} y1={height - 1} y2={height - 1} />
                {week.map((d, i) => {
                  const under = d < targetHours - 0.5;
                  const color = under ? 'var(--zone-mid)' : 'var(--violet)';
                  const y = weekY(Math.max(0, d));
                  return (
                    <rect
                      key={i}
                      className="lk-hyp-week-bar"
                      x={r(i * weekStep + weekStep * 0.22)}
                      y={r(y)}
                      width={r(weekStep * 0.56)}
                      height={r(Math.max(0, height - 1 - y))}
                      rx="4"
                      fill={color}
                      style={glowVar(color)}
                    />
                  );
                })}
                <line
                  className="lk-hyp-target"
                  x1="0"
                  x2={VB_W}
                  y1={r(targetY)}
                  y2={r(targetY)}
                  strokeDasharray="5 4"
                />
              </>
            )}

            {/* SL-06: consistency band + per-day bed↔wake joins (dots are HTML) */}
            {variant === 'bedtime-drift' && (
              <>
                <rect
                  className="lk-hyp-window"
                  x={r(VB_W * DRIFT_BAND_X)}
                  y={r(driftY(winLo))}
                  width={r(VB_W * DRIFT_BAND_W)}
                  height={r(Math.max(0, driftY(winHi) - driftY(winLo)))}
                  rx="3"
                />
                {nights.map((n, i) => (
                  <line
                    key={i}
                    className="lk-hyp-join"
                    x1={r(driftX(i))}
                    x2={r(driftX(i))}
                    y1={r(driftY(n.bed))}
                    y2={r(driftY(n.wake))}
                  />
                ))}
              </>
            )}
          </svg>

          {/* SL-04 tags */}
          {variant === 'efficiency-bars' && (
            <>
              <HypTag text={asleepLabel} color="var(--violet)" style={{ top: 4, right: 2 }} />
              <HypTag text={awakeLabel} color="var(--zone-mid)" style={{ bottom: 4, right: 2 }} />
            </>
          )}

          {/* SL-05 target tag, above the rule at the right edge */}
          {variant === 'sleep-week' && (
            <HypTag
              text={`TARGET ${targetHours}H`}
              color="var(--mint)"
              above
              style={{ top: pct(targetY, height), right: 2 }}
            />
          )}

          {/* SL-06 overlays: window tag, round dots, BED/WAKE side labels */}
          {variant === 'bedtime-drift' && (
            <>
              <HypTag
                text={windowLabel}
                color="var(--mint)"
                above
                style={{ top: pct(driftY(winLo), height), right: 2 }}
              />
              {nights.map((n, i) => {
                const late = nightHour(n.bed) > nightHour(lateBedAfter);
                const bedColor = late ? 'var(--zone-low)' : 'var(--violet)';
                return (
                  <Fragment key={i}>
                    <span
                      className="lk-hyp-dot"
                      style={{
                        left: pct(driftX(i), VB_W),
                        top: pct(driftY(n.bed), height),
                        background: bedColor,
                        ...glowVar(bedColor),
                      }}
                    />
                    <span
                      className="lk-hyp-dot"
                      style={{
                        left: pct(driftX(i), VB_W),
                        top: pct(driftY(n.wake), height),
                        background: 'var(--zone-mid)',
                        ...glowVar('var(--zone-mid)'),
                      }}
                    />
                  </Fragment>
                );
              })}
              <span
                className="lk-hyp-side"
                style={{ top: pct(bedMeanY, height), color: 'var(--violet)' }}
              >
                BED
              </span>
              <span
                className="lk-hyp-side"
                style={{ top: pct(wakeMeanY, height), color: 'var(--zone-mid)' }}
              >
                WAKE
              </span>
            </>
          )}

          {/* SL-07 tags: wake-window + optional mint recommendation pill */}
          {variant === 'night-coach' && (
            <>
              <HypTag
                text={wakeWindowLabel}
                color="var(--zone-mid)"
                mid
                style={{ top: 2, left: pct(wwX, VB_W) }}
              />
              {recommendation && (
                <HypTag text={recommendation} color="var(--mint)" style={{ bottom: 2, right: 2 }} />
              )}
            </>
          )}
        </div>
      </div>

      {/* SL-05/06: day letters centered under each column */}
      {(variant === 'sleep-week' || variant === 'bedtime-drift') && days.length > 0 && (
        <div className="lk-hyp-days" aria-hidden="true">
          {days.slice(0, variant === 'bedtime-drift' ? nights.length : week.length).map((d, i) => (
            <span
              key={i}
              className="lk-hyp-day"
              style={{
                left:
                  variant === 'bedtime-drift'
                    ? pct(driftX(i), VB_W)
                    : pct(i * weekStep + weekStep * 0.5, VB_W),
              }}
            >
              {d}
            </span>
          ))}
        </div>
      )}

      {resolvedAxis.length > 0 && (
        <div className="lk-hyp-axis">
          {resolvedAxis.map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}
