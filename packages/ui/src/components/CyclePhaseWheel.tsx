import { type HTMLAttributes } from 'react';
import { cn } from '../cn';
import { Chip } from './Chip';

export interface CyclePhase {
  /** phase name, e.g. "Ovulation" */
  name: string;
  /** number of days this phase spans */
  days: number;
  /** arc + swatch color (hex) */
  color: string;
}

export interface CyclePhaseWheelProps extends HTMLAttributes<HTMLDivElement> {
  /** the four (or more) cycle phases, in order */
  phases?: CyclePhase[];
  /** the current day of the cycle, 1-based */
  currentDay?: number;
  /** total length of the cycle in days */
  cycleLength?: number;
}

/** Faithful reproduction of the design's 28-day example. */
const DEFAULT_PHASES: CyclePhase[] = [
  { name: 'Menstrual', days: 5, color: '#FF4D6D' },
  { name: 'Follicular', days: 9, color: '#34F5C5' },
  { name: 'Ovulation', days: 5, color: '#A8FF35' },
  { name: 'Luteal', days: 9, color: '#7C5CFF' },
];

/* wheel geometry (300x300 viewBox, stroke ring at r=120) */
const CX = 150;
const CY = 150;
const R = 120;
const STROKE = 22;
const CIRC = 2 * Math.PI * R; // 753.98
/** gap between adjacent arcs, in path-length units */
const ARC_GAP = 4;

interface ArcSpec {
  phase: CyclePhase;
  /** stroke-dasharray "<dash> <rest>" */
  dash: string;
  /** stroke-dashoffset */
  offset: number;
}

/** lay each phase out as a proportional arc, sweeping clockwise from 12 o'clock */
function buildArcs(phases: CyclePhase[], total: number): ArcSpec[] {
  const out: ArcSpec[] = [];
  let cursor = 0; // path-length consumed so far
  for (const phase of phases) {
    const span = (phase.days / total) * CIRC;
    const dash = Math.max(span - ARC_GAP, 1);
    out.push({
      phase,
      dash: `${dash.toFixed(1)} ${(CIRC - dash).toFixed(1)}`,
      offset: -Number(cursor.toFixed(1)),
    });
    cursor += span;
  }
  return out;
}

/** point on the ring for a 0..1 fraction of the cycle (angle 0 = +x / 3 o'clock;
 *  the parent svg's -90deg rotation moves that to 12 o'clock) */
function ringPoint(fraction: number): { x: number; y: number } {
  const a = fraction * 2 * Math.PI;
  return { x: CX + R * Math.cos(a), y: CY + R * Math.sin(a) };
}

/** which phase contains a given 1-based day */
function phaseOfDay(phases: CyclePhase[], day: number): CyclePhase {
  let acc = 0;
  for (const phase of phases) {
    acc += phase.days;
    if (day <= acc) return phase;
  }
  return phases[phases.length - 1];
}

/** Cycle phase wheel — a circular SVG of the menstrual-cycle phases as colored
 *  arcs, a glowing current-day marker, a center day/phase readout and a legend. */
export function CyclePhaseWheel({
  phases = DEFAULT_PHASES,
  currentDay = 16,
  cycleLength = 28,
  className,
  ...rest
}: CyclePhaseWheelProps) {
  const arcs = buildArcs(phases, cycleLength);
  const current = phaseOfDay(phases, currentDay);
  // mid-point of the current day along the cycle
  const marker = ringPoint((currentDay - 0.5) / cycleLength);

  let dayCursor = 0;
  const legend = phases.map((p) => {
    const from = dayCursor + 1;
    const to = dayCursor + p.days;
    dayCursor = to;
    return { ...p, from, to };
  });

  const label = `Cycle wheel, Day ${currentDay}, ${current.name.toLowerCase()} phase of a ${cycleLength}-day cycle.`;

  return (
    <div className={cn('lk-cyc', 'lk-card', className)} {...rest}>
      <div className="lk-cyc-head">
        <Chip>
          <span className="lk-mono">Cycle</span> · Day{' '}
          <span className="lk-tnum">{currentDay}</span> of <span className="lk-tnum">{cycleLength}</span>
        </Chip>
      </div>

      <div className="lk-cyc-wrap">
        <div className="lk-cyc-wheel" role="img" aria-label={label}>
          <svg className="lk-cyc-svg" viewBox="0 0 300 300">
            {/* track */}
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="var(--border-2)" strokeWidth={STROKE} />
            {/* phase arcs */}
            {arcs.map((arc, i) => (
              <circle
                key={i}
                className="lk-cyc-arc"
                cx={CX}
                cy={CY}
                r={R}
                stroke={arc.phase.color}
                strokeWidth={STROKE}
                strokeDasharray={arc.dash}
                strokeDashoffset={arc.offset}
              />
            ))}
          </svg>

          {/* current-day marker */}
          <svg className="lk-cyc-marker" viewBox="0 0 300 300" aria-hidden="true">
            <circle
              cx={marker.x.toFixed(1)}
              cy={marker.y.toFixed(1)}
              r={9}
              fill="var(--bg-1)"
              stroke={current.color}
              strokeWidth={3}
              style={{ filter: `drop-shadow(0 0 9px ${current.color})` }}
            />
            <circle cx={marker.x.toFixed(1)} cy={marker.y.toFixed(1)} r={3.5} fill={current.color} />
          </svg>

          {/* center readout */}
          <div className="lk-cyc-center">
            <div className="lk-cyc-day">
              Day <span className="lk-tnum">{currentDay}</span>
            </div>
            <div className="lk-cyc-phase">{current.name}</div>
            <div className="lk-cyc-of">
              of a <span className="lk-tnum">{cycleLength}</span>-day cycle
            </div>
          </div>
        </div>
      </div>

      <div className="lk-cyc-legend">
        {legend.map((p) => (
          <div className="lk-cyc-lg" key={p.name}>
            <span className="lk-cyc-swatch" style={{ color: p.color }} />
            <div>
              <div className="lk-cyc-ln1">{p.name}</div>
              <div className="lk-cyc-ln2">
                Days {p.from}–{p.to}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export type { CyclePhase as CyclePhaseWheelPhase };
