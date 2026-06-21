import { type HTMLAttributes } from 'react';
import { cn } from '../cn';

export type SleepStage = 'awake' | 'rem' | 'light' | 'deep';

/** One contiguous stretch of a single sleep stage, positioned across the night. */
export interface SleepSegment {
  stage: SleepStage;
  /** start position across the night, 0..1 (0 = lights-out, 1 = wake) */
  from: number;
  /** end position across the night, 0..1 */
  to: number;
}

/** Per-stage roll-up shown in the summary tiles + legend. */
export interface SleepStageTotal {
  stage: SleepStage;
  /** human duration, e.g. "1h 18m" */
  duration: string;
  /** share of the night, 0..100 */
  pct: number;
}

export interface HypnogramProps extends HTMLAttributes<HTMLDivElement> {
  /** mono eyebrow above the title, e.g. "Last night · 7h 24m" */
  eyebrow?: string;
  /** display title */
  title?: string;
  /** the stepped stage timeline, in chronological order */
  segments?: SleepSegment[];
  /** per-stage roll-ups for the summary tiles + legend */
  stageTotals?: SleepStageTotal[];
  /** time-axis ticks under the chart */
  axis?: string[];
  /** accessible description of the chart shape */
  ariaLabel?: string;
}

/** lane order top→bottom (Awake/REM/Light/Deep) and its y-center within the 168px viewBox */
const STAGE_META: Record<SleepStage, { label: string; color: string; y: number }> = {
  awake: { label: 'Awake', color: 'var(--text-faint)', y: 21 },
  rem: { label: 'REM', color: 'var(--mint)', y: 61 },
  light: { label: 'Light', color: 'var(--cyan)', y: 101 },
  deep: { label: 'Deep', color: 'var(--violet)', y: 141 },
};

const VB_W = 660;
const VB_H = 168;
/** the stepped line is drawn in the violet of the deepest stage */
const LINE_COLOR = 'var(--violet)';

/** Faithful reproduction of the design's "Sleep stages" example. */
const DEFAULT_SEGMENTS: SleepSegment[] = [
  { stage: 'awake', from: 0, to: 24 / VB_W },
  { stage: 'light', from: 24 / VB_W, to: 70 / VB_W },
  { stage: 'deep', from: 70 / VB_W, to: 156 / VB_W },
  { stage: 'light', from: 156 / VB_W, to: 208 / VB_W },
  { stage: 'rem', from: 208 / VB_W, to: 262 / VB_W },
  { stage: 'light', from: 262 / VB_W, to: 318 / VB_W },
  { stage: 'deep', from: 318 / VB_W, to: 372 / VB_W },
  { stage: 'light', from: 372 / VB_W, to: 410 / VB_W },
  { stage: 'awake', from: 410 / VB_W, to: 426 / VB_W },
  { stage: 'light', from: 426 / VB_W, to: 474 / VB_W },
  { stage: 'rem', from: 474 / VB_W, to: 540 / VB_W },
  { stage: 'light', from: 540 / VB_W, to: 578 / VB_W },
  { stage: 'rem', from: 578 / VB_W, to: 626 / VB_W },
  { stage: 'awake', from: 626 / VB_W, to: 640 / VB_W },
  { stage: 'light', from: 640 / VB_W, to: 1 },
];

const DEFAULT_STAGE_TOTALS: SleepStageTotal[] = [
  { stage: 'deep', duration: '1h 18m', pct: 18 },
  { stage: 'light', duration: '3h 52m', pct: 52 },
  { stage: 'rem', duration: '1h 46m', pct: 24 },
  { stage: 'awake', duration: '28m', pct: 6 },
];

const DEFAULT_AXIS = ['11:06pm', '12:30', '2:00', '3:30', '5:00', '6:30am'];

const DEFAULT_ARIA = 'Hypnogram: deep sleep front-loaded early, REM cycles lengthening toward morning.';

/** Build a stepped SVG path that walks the stage timeline left→right,
 *  drawing a flat run at each stage's lane and a vertical riser between runs. */
function buildPath(segments: SleepSegment[]): string {
  if (segments.length === 0) return '';
  const x = (f: number) => +(f * VB_W).toFixed(2);
  const parts: string[] = [];
  segments.forEach((seg, i) => {
    const { y } = STAGE_META[seg.stage];
    const x0 = x(seg.from);
    const x1 = x(seg.to);
    if (i === 0) parts.push(`M${x0},${y}`);
    else parts.push(`L${x0},${y}`); // vertical riser from prev lane to this lane
    parts.push(`L${x1},${y}`); // flat run at this lane
  });
  return parts.join(' ');
}

/** Sleep hypnogram — a stepped stage lane chart (Awake / REM / Light / Deep
 *  across the night) drawn in SVG, with a time axis, stage legend and a row of
 *  per-stage summary tiles (stage · duration · % of night). */
export function Hypnogram({
  eyebrow = 'Last night · 7h 24m',
  title = 'Sleep stages',
  segments = DEFAULT_SEGMENTS,
  stageTotals = DEFAULT_STAGE_TOTALS,
  axis = DEFAULT_AXIS,
  ariaLabel = DEFAULT_ARIA,
  className,
  ...rest
}: HypnogramProps) {
  const path = buildPath(segments);

  return (
    <div className={cn('lk-hyp', 'lk-card', className)} {...rest}>
      <div className="lk-hyp-head">
        <span className="lk-hyp-eyebrow">{eyebrow}</span>
        <h3 className="lk-display">{title}</h3>
      </div>

      <div className="lk-hyp-wrap" role="img" aria-label={ariaLabel}>
        <svg className="lk-hyp-svg" viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none">
          {/* lane background washes */}
          <g>
            <rect x="0" y="2" width={VB_W} height="38" fill="rgba(106,114,134,.05)" />
            <rect x="0" y="42" width={VB_W} height="38" fill="rgba(74,222,168,.05)" />
            <rect x="0" y="82" width={VB_W} height="38" fill="rgba(34,211,238,.05)" />
            <rect x="0" y="122" width={VB_W} height="38" fill="rgba(124,92,255,.06)" />
          </g>
          {/* lane dividers */}
          <g stroke="var(--border)" strokeWidth="1">
            <line x1="0" y1="40" x2={VB_W} y2="40" />
            <line x1="0" y1="80" x2={VB_W} y2="80" />
            <line x1="0" y1="120" x2={VB_W} y2="120" />
          </g>
          {/* lane labels */}
          <g fontFamily="var(--font-mono)" fontSize="8.5" fill="var(--text-faint)">
            <text x="4" y="14">
              AWAKE
            </text>
            <text x="4" y="54">
              REM
            </text>
            <text x="4" y="94">
              LIGHT
            </text>
            <text x="4" y="134">
              DEEP
            </text>
          </g>
          {/* stepped stage line */}
          <path
            d={path}
            fill="none"
            stroke={LINE_COLOR}
            strokeWidth="2.4"
            strokeLinejoin="round"
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 7px rgba(124,92,255,.5))' }}
          />
        </svg>

        <div className="lk-hyp-axis">
          {axis.map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>

        <div className="lk-hyp-legend">
          {stageTotals.map((s) => {
            const meta = STAGE_META[s.stage];
            return (
              <span key={s.stage}>
                <i style={{ background: meta.color }} /> {meta.label} · {s.duration}
              </span>
            );
          })}
        </div>
      </div>

      <div className="lk-hyp-grid">
        {stageTotals.map((s) => {
          const meta = STAGE_META[s.stage];
          return (
            <div className="lk-hyp-tile" key={s.stage}>
              <span className="lk-hyp-dot" style={{ background: meta.color }} />
              <div className="lk-hyp-name">{meta.label}</div>
              <div className="lk-hyp-min lk-tnum">{s.duration}</div>
              <div className="lk-hyp-pct">
                <span className="lk-mono">{s.pct}%</span> of night
              </div>
              <div className="lk-hyp-bar">
                <i style={{ width: `${s.pct}%`, background: meta.color }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export type { SleepSegment as HypnogramSegment, SleepStageTotal as HypnogramStageTotal };
