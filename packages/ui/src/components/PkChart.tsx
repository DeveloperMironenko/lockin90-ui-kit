import { useId, type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../cn';

/** root style + the beat-period custom property driving the heartbeat pace */
type PkChartStyle = CSSProperties & { '--lk-pk-beat'?: string };

/** A single dose taken at `at` hours from t0, of `mg` of substance. */
export interface PkDose {
  /** time the dose is taken, in hours from t0 */
  at: number;
  /** dose amount (drives the per-dose peak height, in `unit`) */
  mg: number;
  /** optional label shown on the dose marker tag */
  label?: string;
}

/** A horizontal reference line at `value` (same y-scale as the curve). */
export interface PkThreshold {
  /** y-value of the reference line, in the chart's `unit` */
  value: number;
  /** optional label shown in the right-aligned tag */
  label?: string;
}

export interface PkChartProps extends HTMLAttributes<HTMLDivElement> {
  /** raw concentration samples, evenly spaced across `hours` (wins over `doses`) */
  samples?: number[];
  /** doses; each becomes a Bateman absorption/elimination curve, summed */
  doses?: PkDose[];
  /** total timespan in hours */
  hours?: number;
  /** elimination half-life in hours (caffeine ≈ 5) */
  halfLifeH?: number;
  /** time-to-peak in hours */
  tMaxH?: number;
  /** horizontal dashed reference line + label */
  threshold?: PkThreshold;
  /** y unit suffix shown in tags */
  unit?: string;
  /** curve color (a token var or hex) */
  color?: string;
  /** plot height in px (also the viewBox height) */
  height?: number;
  /** x-axis labels under the chart */
  axis?: string[];
  /** vertical line + mg tag at each dose.at */
  showDoseMarkers?: boolean;
  /** heart rate (beats/min) pacing the live-trace heartbeat; beat period =
   *  60000/bpm ms. Only the raw-`samples` (live/ECG) variant beats. */
  bpm?: number;
  /** disable the heartbeat animation; static render (kit `still` convention) */
  still?: boolean;
  /** accessible description of the chart shape */
  ariaLabel?: string;
}

const VB_W = 560;
/** vertical inset (viewBox units) so the curve never touches the top/bottom edge */
const PAD_Y = 14;
/** number of derived y-axis ticks */
const Y_TICKS = 4;
/** number of samples synthesized when building from doses */
const SAMPLE_N = 121;

const DEFAULT_DOSES: PkDose[] = [
  { at: 7, mg: 120, label: 'Coffee' },
  { at: 10, mg: 80, label: 'Espresso' },
  { at: 13.5, mg: 60, label: 'Tea' },
];
const DEFAULT_THRESHOLD: PkThreshold = { value: 50, label: 'Sleep-disruption' };
const DEFAULT_AXIS = ['6a', '10a', '2p', '6p', '10p'];

/* ── Bateman one-compartment PK model (IDENTICAL on web + native) ───────────
   ke = ln2/halfLife ; ka = ln2/(tMax/2). Bateman shape s(τ)=e^-keτ − e^-kaτ
   for τ≥0. Normalize so a single dose's peak == 1, so `mg` is the peak height
   ("mg in system"). Doses sum. */
export function batemanShapeNorm(halfLifeH: number, tMaxH: number) {
  const ke = Math.LN2 / halfLifeH;
  const ka = Math.LN2 / (tMaxH / 2);
  const s = (tau: number) => (tau < 0 ? 0 : Math.exp(-ke * tau) - Math.exp(-ka * tau));
  // closed-form peak time; guard ka ≈ ke (degenerate → tiny offset peak)
  const tauPeak = Math.abs(ka - ke) < 1e-9 ? tMaxH : Math.log(ka / ke) / (ka - ke);
  const peakShape = s(tauPeak) || 1;
  return (tau: number) => s(tau) / peakShape;
}

/** Build `SAMPLE_N` concentration samples over [0, hours] by summing each
 *  dose's normalized Bateman curve. (IDENTICAL on web + native.) */
export function buildPkSamples(
  doses: PkDose[],
  hours: number,
  halfLifeH: number,
  tMaxH: number,
): number[] {
  const shapeNorm = batemanShapeNorm(halfLifeH, tMaxH);
  const out: number[] = [];
  for (let i = 0; i < SAMPLE_N; i++) {
    const t = (i / (SAMPLE_N - 1)) * hours;
    let c = 0;
    for (const d of doses) c += d.mg * shapeNorm(t - d.at);
    out.push(c);
  }
  return out;
}

/** Derive ~`Y_TICKS` evenly-spaced tick values across [0, max]. */
function deriveTicks(max: number): number[] {
  if (max <= 0) return [0];
  const ticks: number[] = [];
  for (let i = 0; i < Y_TICKS; i++) ticks.push((max * i) / (Y_TICKS - 1));
  return ticks;
}

/** Compact label for a tick value: integers as-is, else 1 decimal. */
const tickLabel = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1));

/** Round a number for compact path strings. */
const r = (n: number) => Math.round(n * 100) / 100;

/** Map a value in [0, max] to its y (viewBox units), max → top, 0 → bottom. */
function valueToY(v: number, max: number, height: number): number {
  const top = PAD_Y;
  const bottom = height - PAD_Y;
  const t = max > 0 ? v / max : 0;
  return bottom - t * (bottom - top);
}

/** Catmull-Rom spline expressed as cubic béziers — a smooth curve passing
 *  through every point (endpoints duplicated so the ends stay anchored). */
function smoothPath(pts: Array<[number, number]>): string {
  const n = pts.length;
  if (n === 0) return '';
  if (n < 3) return pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${r(x)},${r(y)}`).join(' ');
  let d = `M${r(pts[0][0])},${r(pts[0][1])}`;
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${r(c1x)},${r(c1y)} ${r(c2x)},${r(c2y)} ${r(p2[0])},${r(p2[1])}`;
  }
  return d;
}

/** PkChart — a pharmacokinetics concentration-over-time primitive. Plots a
 *  smooth area+line of substance "in system" (from raw `samples` or summed
 *  per-dose Bateman curves), with a dashed threshold reference line, vertical
 *  dose markers, a peak callout dot, a right y-axis and an x-axis row. Built on
 *  LineChart's conventions: VB_W viewBox + preserveAspectRatio="none", round
 *  HTML overlay dots/tags positioned by % so they stay crisp. The live
 *  raw-`samples` (ECG-style) variant carries a heartbeat paced by `bpm`: a
 *  lub-dub pulse + sonar ring on the peak dot and a glow flash of the trace
 *  each beat; `still` (or reduced motion) holds it static. */
export function PkChart({
  samples,
  doses = DEFAULT_DOSES,
  hours = 24,
  halfLifeH = 5,
  tMaxH = 0.75,
  threshold = DEFAULT_THRESHOLD,
  unit = 'mg',
  color = 'var(--accent)',
  height = 180,
  axis = DEFAULT_AXIS,
  showDoseMarkers = true,
  bpm = 64,
  still = false,
  ariaLabel,
  className,
  style,
  ...rest
}: PkChartProps) {
  const uid = useId();
  const fillId = `lk-pk-fill-${uid}`;
  const dangerId = `lk-pk-danger-${uid}`;
  const clipId = `lk-pk-clip-${uid}`;

  const data = samples && samples.length > 0 ? samples : buildPkSamples(doses, hours, halfLifeH, tMaxH);
  const n = data.length;

  // y-scale spans [0, max(curveMax, threshold)] so the threshold line fits.
  const curveMax = n ? Math.max(...data) : 0;
  const yMax = Math.max(curveMax, threshold ? threshold.value : 0) || 1;

  // viewBox points (x spread evenly across full width; y on the [0, yMax] scale)
  const pts: Array<[number, number]> = data.map((v, i) => {
    const x = n === 1 ? VB_W / 2 : (i / (n - 1)) * VB_W;
    return [x, valueToY(v, yMax, height)];
  });
  const line = smoothPath(pts);
  const areaPath = line ? `${line} L${VB_W},${height} L0,${height} Z` : '';

  // peak (max) point for the callout
  let peakIdx = 0;
  for (let i = 1; i < n; i++) if (data[i] > data[peakIdx]) peakIdx = i;
  const peakPt = pts[peakIdx];
  const peakVal = n ? data[peakIdx] : 0;

  // threshold y (and danger-zone clip-rect above it)
  const thY = threshold ? valueToY(threshold.value, yMax, height) : 0;

  // y-axis ticks across [0, yMax]
  const tickRows = deriveTicks(yMax).map((v) => ({ v, y: valueToY(v, yMax, height) }));

  // dose marker x positions (hours → x across [0, hours])
  const markerDoses = showDoseMarkers && !samples ? doses : [];
  const doseX = (at: number) => (hours > 0 ? (at / hours) * VB_W : 0);

  // heartbeat: only the live (raw `samples`) trace beats, paced by `bpm` via
  // the --lk-pk-beat period; `still` (and reduced motion, in CSS) disables it.
  const live = Boolean(samples && samples.length > 0);
  const beatMs = Number.isFinite(bpm) && bpm > 0 ? 60000 / bpm : 0;
  const beating = live && !still && beatMs > 0;
  const rootStyle: PkChartStyle | undefined = beating
    ? { ...style, '--lk-pk-beat': `${r(beatMs)}ms` }
    : style;

  return (
    <div className={cn('lk-pk', className)} style={rootStyle} {...rest}>
      <div className="lk-pk-plot" style={{ height }}>
        <div className="lk-pk-canvas">
          <svg
            className="lk-pk-svg"
            viewBox={`0 0 ${VB_W} ${height}`}
            preserveAspectRatio="none"
            role="img"
            aria-label={ariaLabel}
          >
            <defs>
              <linearGradient id={fillId} x1="0" y1="0" x2="0" y2={height}>
                <stop offset="0" stopColor={color} stopOpacity="0.26" />
                <stop offset="1" stopColor={color} stopOpacity="0" />
              </linearGradient>
              <linearGradient id={dangerId} x1="0" y1="0" x2="0" y2={height}>
                <stop offset="0" stopColor="var(--bad)" stopOpacity="0.22" />
                <stop offset="1" stopColor="var(--bad)" stopOpacity="0.04" />
              </linearGradient>
              {/* clip the danger fill to everything above the threshold line */}
              {threshold && (
                <clipPath id={clipId}>
                  <rect x="0" y="0" width={VB_W} height={r(thY)} />
                </clipPath>
              )}
            </defs>

            {/* y-axis gridlines aligned with the ticks */}
            <g className="lk-pk-grid">
              {tickRows.map((t) => (
                <line key={t.v} x1="0" y1={r(t.y)} x2={VB_W} y2={r(t.y)} />
              ))}
            </g>

            {/* area fill under the curve */}
            {areaPath && <path d={areaPath} fill={`url(#${fillId})`} />}

            {/* danger-zone tint: the curve's area clipped above the threshold */}
            {threshold && areaPath && (
              <path d={areaPath} fill={`url(#${dangerId})`} clipPath={`url(#${clipId})`} />
            )}

            {/* dose markers: faint vertical lines at each dose time */}
            {markerDoses.map((d, i) => (
              <line
                key={i}
                className="lk-pk-dose-line"
                x1={r(doseX(d.at))}
                y1={PAD_Y}
                x2={r(doseX(d.at))}
                y2={height - PAD_Y}
              />
            ))}

            {/* threshold dashed reference line */}
            {threshold && (
              <line className="lk-pk-threshold" x1="0" y1={r(thY)} x2={VB_W} y2={r(thY)} />
            )}

            {/* heartbeat glow: a wide stroke under the live trace that flashes
                once per beat (duration = --lk-pk-beat) */}
            {beating && line && (
              <path
                className="lk-pk-beat-glow"
                d={line}
                fill="none"
                stroke={color}
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* the concentration curve (glowing) */}
            {line && (
              <path
                className="lk-pk-line"
                d={line}
                fill="none"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>

          {/* dose marker tags — %-positioned HTML overlays so they stay crisp.
              Alternate two rows so closely-spaced doses don't overlap. */}
          {markerDoses.map((d, i) => (
            <div
              key={i}
              className="lk-pk-marker lk-pk-marker--dose"
              style={{ left: `${(doseX(d.at) / VB_W) * 100}%`, top: i % 2 === 0 ? '0px' : '20px' }}
            >
              <span className="lk-pk-dose-tag">
                {`+${d.mg}${unit}`}
                {d.label ? ` · ${d.label}` : ''}
              </span>
            </div>
          ))}

          {/* peak callout dot + tag */}
          {peakPt && peakVal > 0 && (
            <div
              className="lk-pk-marker"
              style={{ left: `${(peakPt[0] / VB_W) * 100}%`, top: `${(peakPt[1] / height) * 100}%` }}
            >
              <span className="lk-pk-tag" style={{ color, borderColor: color }}>
                {`${tickLabel(peakVal)}${unit}`}
              </span>
              {/* heartbeat sonar ring, expanding off the dot once per beat */}
              {beating && <span className="lk-pk-beat-ring" style={{ borderColor: color }} />}
              <span className={cn('lk-pk-dot', beating && 'lk-pk-dot--beat')} style={{ background: color }} />
            </div>
          )}

          {/* threshold label, pinned right at the threshold y */}
          {threshold && (
            <span className="lk-pk-th-tag" style={{ top: `${(thY / height) * 100}%` }}>
              {`${threshold.label ? threshold.label + ' ' : ''}${tickLabel(threshold.value)}${unit}`}
            </span>
          )}
        </div>

        {/* y-axis value labels, pinned in the right gutter at each tick's y */}
        <div className="lk-pk-yaxis" aria-hidden="true">
          {tickRows.map((t, i) => (
            <span key={i} className="lk-pk-ytick" style={{ top: `${(t.y / height) * 100}%` }}>
              {tickLabel(t.v)}
            </span>
          ))}
        </div>
      </div>

      {axis && axis.length > 0 && (
        <div className="lk-pk-axis">
          {axis.map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}
