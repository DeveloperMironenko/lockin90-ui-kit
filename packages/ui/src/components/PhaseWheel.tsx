import { useId, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';

/** A colored phase band on the 24h ring, drawn CLOCKWISE from `from` to `to`
 *  (hours 0..24). When `from > to` the band wraps through midnight (e.g. 23→7). */
export interface PhaseArc {
  /** band start hour, 0..24 */
  from: number;
  /** band end hour, 0..24 (clockwise from `from`; wraps midnight when < `from`) */
  to: number;
  /** the band color — a token var() or hex */
  color: string;
  /** optional label (for accessibility / external legends) */
  label?: string;
}

/** A point marker sitting ON the ring at a given hour. */
export interface PhaseMarker {
  /** the hour, 0..24 */
  at: number;
  /** the dot color — a token var() or hex (default var(--accent)) */
  color?: string;
  /** optional tiny label, placed just outside the ring */
  label?: string;
}

/** One phase of a cycle (the cycle variants) — phases run consecutively from
 *  day 1, each `days` long, so the wheel/strip total is the sum of `days`. */
export interface CyclePhase {
  /** phase name — legend, center readout + coach pill (rendered UPPERCASE) */
  name: string;
  /** phase length in days */
  days: number;
  /** the phase color — a token var() or hex */
  color: string;
}

/** Chart form. `'circadian'` (default) is the original 24h clock; the cycle
 *  variants are the CW catalog forms (28-day cycle wheel / coach wheel / strip). */
export type PhaseWheelVariant = 'circadian' | 'phase-wheel' | 'coach-wheel' | 'phase-strip';

export interface PhaseWheelProps extends HTMLAttributes<HTMLDivElement> {
  /** chart form (default `'circadian'` — the 24h clock, unchanged) */
  variant?: PhaseWheelVariant;
  /** [circadian] colored phase bands on the ring */
  arcs?: PhaseArc[];
  /** [circadian] point markers on the ring */
  markers?: PhaseMarker[];
  /** [circadian] the "now" hour, 0..24 → draws a hand from center to the ring + a tip dot.
   *  Pass `null` to hide the hand (omitting it keeps the default). */
  now?: number | null;
  /** overall diameter in px (default 200; ignored by `phase-strip`) */
  size?: number;
  /** ring stroke width in px (default 16; ignored by `phase-strip`) */
  thickness?: number;
  /** [circadian] hour tick marks around the ring, longer + brighter at 0/6/12/18 (default true) */
  hourTicks?: boolean;
  /** [cycle] consecutive cycle phases (default: Menstrual 5 coral / Follicular 8
   *  cyan / Ovulation 3 lime / Luteal 12 violet — the 28-day catalog cycle) */
  phases?: CyclePhase[];
  /** [cycle] current cycle day, 1-based → today pulse dot (wheels) / TODAY rule
   *  (strip) + center readout. Pass `null` to hide (center falls back to the
   *  cycle length, e.g. '28d'). Default 21. */
  day?: number | null;
  /** [phase-wheel · coach-wheel] FOCUS state: the named phase stays full-strength,
   *  the others dim to 20% and the center shows days left in it (needs `day`).
   *  Matched case-insensitively against `phases[].name`. */
  focusPhase?: string;
  /** [coach-wheel] recommendation text — the pill reads "<PHASE> — <TIP>"
   *  (default 'lower intensity, more sleep') */
  tip?: string;
  /** [phase-wheel · coach-wheel] phase legend beside the wheel
   *  (default: true for `'phase-wheel'`, false otherwise) */
  legend?: boolean;
  /** [phase-wheel · coach-wheel] soft glow behind the phase arcs (default false) */
  shine?: boolean;
  /** [phase-strip] total strip width in px (default 300) */
  width?: number;
  /** center content — defaults to the formatted `now` clock / cycle-day readout */
  children?: ReactNode;
}

/** Default circadian phases. */
const DEFAULT_ARCS: PhaseArc[] = [
  { from: 23, to: 7, color: '#6E7BFF', label: 'Sleep' }, // indigo, wraps midnight
  { from: 9, to: 12, color: '#34F5C5', label: 'Peak focus' }, // mint
  { from: 14, to: 16, color: '#FFB020', label: 'Afternoon dip' }, // warn
  { from: 21, to: 23, color: '#A855F7', label: 'Wind-down' }, // violet
];

const DEFAULT_MARKERS: PhaseMarker[] = [
  { at: 7, color: '#22D3EE', label: 'Wake' },
  { at: 21, color: '#A855F7', label: 'Melatonin' },
];

/** Default 28-day cycle (the catalog's PH table). */
const DEFAULT_PHASES: CyclePhase[] = [
  { name: 'Menstrual', days: 5, color: 'var(--zone-low)' }, // coral
  { name: 'Follicular', days: 8, color: 'var(--cyan)' },
  { name: 'Ovulation', days: 3, color: 'var(--lime)' },
  { name: 'Luteal', days: 12, color: 'var(--violet)' },
];

const DEFAULT_TIP = 'lower intensity, more sleep';

/** angular gap (deg) trimmed off EACH end of a cycle phase arc */
const ARC_GAP_DEG = 2.5;

/** clockwise span of an arc in hours, wrap-aware (from > to wraps midnight). */
function arcSpanHours(from: number, to: number) {
  return ((to - from + 24) % 24) || 24;
}

/** point on a circle at center `c` radius `r` for hour `h` (0..24), with hour 0
 *  at the top (12 o'clock) and growing clockwise. */
function hourPoint(c: number, r: number, h: number) {
  const deg = (h / 24) * 360 - 90;
  const a = (deg * Math.PI) / 180;
  return { x: c + r * Math.cos(a), y: c + r * Math.sin(a) };
}

/** point on a circle for an angle in degrees, 0° at 12 o'clock, clockwise. */
function polarPoint(cx: number, cy: number, r: number, aDeg: number) {
  const a = ((aDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

/** SVG arc path from `a0` to `a1` degrees (0° at top, clockwise). */
function arcPath(cx: number, cy: number, r: number, a0: number, a1: number) {
  const p0 = polarPoint(cx, cy, r, a0);
  const p1 = polarPoint(cx, cy, r, a1);
  const large = (a1 - a0) % 360 > 180 ? 1 : 0;
  return `M${p0.x.toFixed(2)} ${p0.y.toFixed(2)}A${r} ${r} 0 ${large} 1 ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`;
}

/** A cycle phase resolved to its 1-based inclusive day range. */
interface PhaseRange extends CyclePhase {
  start: number;
  end: number;
}

/** Lay the phases end-to-end from day 1 → `{ ranges, total }`. */
function phaseRanges(phases: CyclePhase[]): { ranges: PhaseRange[]; total: number } {
  let start = 1;
  const ranges = phases.map((p) => {
    const r = { ...p, start, end: start + p.days - 1 };
    start += p.days;
    return r;
  });
  return { ranges, total: Math.max(1, start - 1) };
}

/** angle (deg, 0° at top, clockwise) where cycle day `d` STARTS */
function dayAngle(d: number, total: number) {
  return ((d - 1) / total) * 360;
}

/** the D-tick days of a strip: D1, every 7th day, and the last day. */
function stripTicks(total: number): number[] {
  const ticks = [1];
  for (let d = 7; d <= total; d += 7) ticks.push(d);
  if (ticks[ticks.length - 1] !== total) ticks.push(total);
  return ticks;
}

/** Format an hour (0..24, may be fractional) as a 12h clock like '2:30p'
 *  (a/p suffix, drops ':00'). */
function formatHour(h: number): string {
  const norm = ((h % 24) + 24) % 24;
  const totalMin = Math.round(norm * 60) % (24 * 60);
  let hr = Math.floor(totalMin / 60);
  const min = totalMin % 60;
  const suffix = hr >= 12 ? 'p' : 'a';
  let h12 = hr % 12;
  if (h12 === 0) h12 = 12;
  return min === 0 ? `${h12}${suffix}` : `${h12}:${String(min).padStart(2, '0')}${suffix}`;
}

/** The four cardinal hour labels at 0/6/12/18. */
const CARDINALS: { h: number; label: string }[] = [
  { h: 0, label: '12a' },
  { h: 6, label: '6a' },
  { h: 12, label: '12p' },
  { h: 18, label: '6p' },
];

/**
 * PhaseWheel — the kit's phase-cycle chart.
 *
 * Default (`variant="circadian"`): a circular 24-hour circadian clock — a faint
 * full track ring with colored phase bands (sleep / focus / dip / wind-down),
 * hour ticks (longer + brighter at the quarters with cardinal labels), point
 * markers on the ring, an optional "now" hand from center to the ring, and
 * centered content (the formatted current time or '24h'). Hour 0 (midnight)
 * sits at the top and time runs clockwise.
 *
 * Cycle variants (the CW catalog):
 * - `'phase-wheel'` (CW-01) — 4 menstrual-cycle phase arcs (coral/cyan/lime/
 *   violet, round caps, gaps), D-labels, a today pulse dot, center day/phase
 *   readout + legend; `focusPhase` dims the other phases to 20% and the center
 *   shows the days left in the focused phase.
 * - `'coach-wheel'` (CW-04) — the wheel + a phase-tinted recommendation pill
 *   under it ("LUTEAL — LOWER INTENSITY, MORE SLEEP").
 * - `'phase-strip'` (CW-05) — the wheel unrolled: phase pills on a linear
 *   28-day strip + TODAY rule + D-ticks.
 *
 * Tokens-driven, no Tailwind.
 */
export function PhaseWheel({
  variant = 'circadian',
  arcs = DEFAULT_ARCS,
  markers = DEFAULT_MARKERS,
  now = 14.5,
  size = 200,
  thickness = 16,
  hourTicks = true,
  phases = DEFAULT_PHASES,
  day = 21,
  focusPhase,
  tip = DEFAULT_TIP,
  legend,
  shine = false,
  width = 300,
  children,
  className,
  ...rest
}: PhaseWheelProps) {
  const uid = useId();
  void uid; // reserved for future gradient ids; keeps parity with sibling primitives

  /* ---------------------------------------------------------------- cycle */
  if (variant !== 'circadian') {
    const { ranges, total } = phaseRanges(phases);
    const cday = day == null ? null : Math.min(Math.max(Math.round(day), 1), total);
    const currentPhase =
      cday !== null ? ranges.find((r) => cday >= r.start && cday <= r.end) : undefined;
    const phasesLabel = ranges.map((r) => `${r.name} D${r.start}–${r.end}`).join(', ');

    /* ------------------------------------------------------ CW-05 strip */
    if (variant === 'phase-strip') {
      const stripH = 76;
      const y = 44; // pill row center
      const x0 = 8;
      const ww = width - 16;
      const tagLabel = cday !== null ? `TODAY · D${cday}` : null;
      const tagW = tagLabel ? tagLabel.length * 5.35 + 12 : 0;
      const tx = cday !== null ? x0 + (ww * (cday - 0.5)) / total : 0;
      const tagX = tagLabel ? Math.max(2, Math.min(tx - tagW / 2, width - tagW - 2)) : 0;
      const todayColor = currentPhase?.color ?? 'var(--violet)';
      const ariaLabel = `${total}-day cycle strip${
        cday !== null ? `, day ${cday}${currentPhase ? ` (${currentPhase.name})` : ''}` : ''
      }: ${phasesLabel}.`;

      return (
        <div
          className={cn('lk-pw', 'lk-pw-strip', className)}
          role="img"
          aria-label={ariaLabel}
          {...rest}
        >
          <svg
            className="lk-pw-svg"
            width={width}
            height={stripH}
            viewBox={`0 0 ${width} ${stripH}`}
            aria-hidden="true"
          >
            {/* phase pills */}
            {ranges.map((r) => {
              const xs = x0 + (ww * (r.start - 1)) / total;
              const xe = x0 + (ww * r.end) / total;
              const w = xe - xs - 2;
              if (w <= 0) return null;
              return (
                <g key={r.name}>
                  <rect
                    x={xs.toFixed(1)}
                    y={y - 8}
                    width={w.toFixed(1)}
                    height={16}
                    rx={8}
                    fill={r.color}
                    opacity={0.8}
                  />
                  {w > 52 ? (
                    <text
                      className="lk-pw-strip-name"
                      x={((xs + xe) / 2).toFixed(1)}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      {r.name.toUpperCase()}
                    </text>
                  ) : null}
                </g>
              );
            })}

            {/* D-ticks under the strip */}
            {stripTicks(total).map((d) => (
              <text
                key={`tick-${d}`}
                className="lk-pw-strip-tick"
                x={(x0 + (ww * (d - 0.5)) / total).toFixed(1)}
                y={y + 21}
                textAnchor="middle"
                dominantBaseline="central"
              >
                {`D${d}`}
              </text>
            ))}

            {/* TODAY rule + tag */}
            {tagLabel ? (
              <g>
                <line
                  className="lk-pw-strip-rule"
                  x1={tx.toFixed(1)}
                  x2={tx.toFixed(1)}
                  y1={y - 18}
                  y2={y + 12}
                />
                <rect
                  className="lk-pw-tag-box"
                  x={tagX.toFixed(1)}
                  y={y - 26 - 6.5}
                  width={tagW.toFixed(1)}
                  height={13}
                  rx={6.5}
                  stroke={todayColor}
                />
                <text
                  className="lk-pw-tag-text"
                  x={(tagX + tagW / 2).toFixed(1)}
                  y={y - 26}
                  fill={todayColor}
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {tagLabel}
                </text>
              </g>
            ) : null}
          </svg>
        </div>
      );
    }

    /* --------------------------------------- CW-01 / CW-04 cycle wheels */
    const showLegend = legend ?? variant === 'phase-wheel';
    const c = size / 2;
    const r = (size - thickness) / 2;
    const dLabelRadius = r + thickness / 2 + 6;

    const focus =
      focusPhase != null
        ? ranges.find((p) => p.name.toLowerCase() === focusPhase.toLowerCase())
        : undefined;
    const daysLeft = focus && cday !== null ? Math.max(0, focus.end - cday) : null;

    const big =
      daysLeft !== null
        ? `${daysLeft}d`
        : cday !== null
          ? variant === 'coach-wheel'
            ? `D${cday}`
            : `DAY ${cday}`
          : `${total}d`;
    const sub =
      daysLeft !== null && focus
        ? `LEFT · ${focus.name.toUpperCase()}`
        : currentPhase
          ? currentPhase.name.toUpperCase()
          : null;

    const tipText = variant === 'coach-wheel'
      ? `${currentPhase ? `${currentPhase.name} — ` : ''}${tip}`.toUpperCase()
      : null;
    const tipColor = currentPhase?.color ?? 'var(--violet)';

    const todayPt = cday !== null ? polarPoint(c, c, r, dayAngle(cday, total)) : null;

    const ariaLabel = `${total}-day cycle wheel${
      cday !== null ? `, day ${cday}${currentPhase ? ` (${currentPhase.name})` : ''}` : ''
    }: ${phasesLabel}.${
      focus && daysLeft !== null ? ` Focus ${focus.name}, ${daysLeft} days left.` : ''
    }${tipText ? ` Coach: ${tipText}.` : ''}`;

    return (
      <div className={cn('lk-pw', 'lk-pw-cycle', className)} {...rest}>
        <div className="lk-pw-cycle-row">
          <div
            className="lk-pw-dial"
            style={{ width: size, height: size }}
            role="img"
            aria-label={ariaLabel}
          >
            <svg
              className="lk-pw-svg"
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              aria-hidden="true"
            >
              {/* phase arcs — round caps, 2.5° gap trimmed off each end */}
              {ranges.map((p) => {
                const a0 = dayAngle(p.start, total) + ARC_GAP_DEG;
                const a1 = dayAngle(p.end + 1, total) - ARC_GAP_DEG;
                if (a1 <= a0) return null;
                const dimmed = focus != null && focus.name !== p.name;
                return (
                  <path
                    key={p.name}
                    className={cn('lk-pw-cycle-arc', shine && 'lk-pw-arc-shine')}
                    d={arcPath(c, c, r, a0, a1)}
                    fill="none"
                    stroke={p.color}
                    strokeWidth={thickness}
                    strokeLinecap="round"
                    opacity={dimmed ? 0.2 : 0.9}
                    style={shine ? { color: p.color } : undefined}
                  />
                );
              })}

              {/* D-labels every 7 days (D1, D8, …) just outside the ring */}
              {Array.from({ length: Math.ceil(total / 7) }, (_, i) => 1 + i * 7).map((d) => {
                const p = polarPoint(c, c, dLabelRadius, dayAngle(d, total));
                return (
                  <text
                    key={`d-${d}`}
                    className="lk-pw-dlabel"
                    x={p.x.toFixed(2)}
                    y={p.y.toFixed(2)}
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {`D${d}`}
                  </text>
                );
              })}

              {/* today — pulse dot ON the ring */}
              {todayPt ? (
                <g>
                  <circle
                    className="lk-pw-today"
                    cx={todayPt.x.toFixed(2)}
                    cy={todayPt.y.toFixed(2)}
                    r={4}
                  />
                  <circle
                    className="lk-pw-today-pulse"
                    cx={todayPt.x.toFixed(2)}
                    cy={todayPt.y.toFixed(2)}
                    r={4}
                  />
                </g>
              ) : null}
            </svg>

            <div className="lk-pw-center">
              {children ?? (
                <>
                  <span className="lk-pw-day lk-display lk-tnum">{big}</span>
                  {sub ? <span className="lk-pw-daysub">{sub}</span> : null}
                </>
              )}
            </div>
          </div>

          {showLegend ? (
            <div className="lk-pw-legend">
              {ranges.map((p) => (
                <div key={p.name} className="lk-pw-legend-item">
                  <span className="lk-pw-legend-dot" style={{ background: p.color }} />
                  <span className="lk-pw-legend-label">
                    {`${p.name.toUpperCase()} · D${p.start}-${p.end}`}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {tipText ? (
          <span
            className="lk-pw-tip"
            style={{ ['--lk-pw-tip']: tipColor } as CSSProperties}
          >
            {tipText}
          </span>
        ) : null}
      </div>
    );
  }

  /* ------------------------------------------------------------ circadian */
  const c = size / 2;
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;

  // tick geometry (just outside the ring)
  const tickBase = r + thickness / 2 + 2;
  const tickMinor = tickBase + 3;
  const tickMajor = tickBase + 6;
  const labelRadius = tickMajor + 16;
  // marker label radius (outside the ring)
  const markerLabelRadius = r + thickness / 2 + 20;

  // `now` is hidden when null/undefined; precompute the hand tip + clock label
  // (narrowed here so the render guards stay simple)
  const nowTip = now != null ? hourPoint(c, r, now) : null;
  const nowLabel = now != null ? formatHour(now) : null;

  const ariaLabel = `24-hour phase wheel${
    nowLabel ? `, now ${nowLabel}` : ''
  }: ${arcs.map((a) => a.label ?? 'phase').join(', ')}.`;

  return (
    <div
      className={cn('lk-pw', className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={ariaLabel}
      {...rest}
    >
      <svg
        className="lk-pw-svg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
      >
        {/* rotated group so fraction-of-circle hours start at 12 o'clock, clockwise */}
        <g transform={`rotate(-90 ${c} ${c})`}>
          {/* faint full track ring */}
          <circle
            className="lk-pw-track"
            cx={c}
            cy={c}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={thickness}
            strokeLinecap="round"
          />
          {/* colored phase bands */}
          {arcs.map((a, i) => {
            const span = arcSpanHours(a.from, a.to);
            const len = (span / 24) * circ;
            if (len <= 0) return null;
            const offset = -(a.from / 24) * circ;
            return (
              <circle
                key={`${a.label ?? 'arc'}-${i}`}
                className="lk-pw-arc"
                cx={c}
                cy={c}
                r={r}
                fill="none"
                stroke={a.color}
                strokeWidth={thickness}
                strokeLinecap="round"
                strokeDasharray={`${len.toFixed(2)} ${(circ - len).toFixed(2)}`}
                strokeDashoffset={offset.toFixed(2)}
              />
            );
          })}
        </g>

        {/* hour ticks (drawn in screen space via hourPoint, no rotated group) */}
        {hourTicks
          ? Array.from({ length: 24 }, (_, h) => {
              const major = h % 6 === 0;
              const outer = major ? tickMajor : tickMinor;
              const p1 = hourPoint(c, tickBase, h);
              const p2 = hourPoint(c, outer, h);
              return (
                <line
                  key={`tick-${h}`}
                  className={major ? 'lk-pw-tick lk-pw-tick-major' : 'lk-pw-tick'}
                  x1={p1.x.toFixed(2)}
                  y1={p1.y.toFixed(2)}
                  x2={p2.x.toFixed(2)}
                  y2={p2.y.toFixed(2)}
                />
              );
            })
          : null}

        {/* cardinal labels at 0/6/12/18 */}
        {hourTicks
          ? CARDINALS.map(({ h, label }) => {
              const p = hourPoint(c, labelRadius, h);
              return (
                <text
                  key={`card-${h}`}
                  className="lk-pw-card"
                  x={p.x.toFixed(2)}
                  y={p.y.toFixed(2)}
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {label}
                </text>
              );
            })
          : null}

        {/* now hand — line from center to the inner edge of the ring + tip dot */}
        {nowTip ? (
          <g className="lk-pw-now">
            <line
              className="lk-pw-hand"
              x1={c}
              y1={c}
              x2={nowTip.x.toFixed(2)}
              y2={nowTip.y.toFixed(2)}
            />
            <circle className="lk-pw-hand-dot" cx={nowTip.x.toFixed(2)} cy={nowTip.y.toFixed(2)} r={4} />
          </g>
        ) : null}

        {/* markers — dots on the ring + optional labels just outside */}
        {markers.map((m, i) => {
          const p = hourPoint(c, r, m.at);
          const color = m.color ?? 'var(--accent)';
          const lp = m.label ? hourPoint(c, markerLabelRadius, m.at) : null;
          return (
            <g key={`mk-${m.label ?? 'm'}-${i}`}>
              <circle className="lk-pw-marker" cx={p.x.toFixed(2)} cy={p.y.toFixed(2)} r={4} fill={color} />
              {lp ? (
                <text
                  className="lk-pw-marker-label"
                  x={lp.x.toFixed(2)}
                  y={lp.y.toFixed(2)}
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {m.label}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>

      <div className="lk-pw-center">
        {children ?? (
          <span className="lk-pw-clock lk-display lk-tnum">
            {nowLabel ?? '24h'}
          </span>
        )}
      </div>
    </div>
  );
}
