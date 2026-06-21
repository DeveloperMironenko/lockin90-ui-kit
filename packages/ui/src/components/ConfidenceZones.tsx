import { type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../cn';

/** Tone of a distribution zone — drives dot color + bar fill/glow. */
export type ZoneTone = 'high' | 'mid' | 'low';

/** One row in the zone-distribution list. */
export interface ConfidenceZone {
  /** zone label, e.g. "High" */
  name: string;
  /** share of time spent in this zone, 0..100 */
  pct: number;
  /** mono sub-line, e.g. "13 / 34 slots" */
  sub?: string;
  /** color/glow tone — defaults to the row's position (high → mid → low) */
  tone: ZoneTone;
}

/** The labelled model-confidence meter. */
export interface ConfidenceMeter {
  /** confidence percentage, 0..100 */
  pct: number;
  /** sample size, rendered as "n = <n> events" */
  n: number;
}

export interface ConfidenceZonesProps extends HTMLAttributes<HTMLDivElement> {
  /** model-confidence meter (fill + % + low→high labels) */
  confidence?: ConfidenceMeter;
  /** label above the confidence meter */
  confidenceLabel?: string;
  /** label above the zone-distribution list */
  zonesLabel?: string;
  /** mono count shown beside the zone-distribution label */
  zonesCount?: string;
  /** zone-distribution rows */
  zones?: ConfidenceZone[];
}

/** map a tone to its CSS color variable (dots + row %) */
const TONE_VAR: Record<ZoneTone, string> = {
  high: 'var(--zone-high)',
  mid: 'var(--zone-mid)',
  low: 'var(--zone-low)',
};

/** Faithful reproduction of the design's "Confidence & zones" example. */
const DEFAULT_CONFIDENCE: ConfidenceMeter = { pct: 84, n: 412 };
const DEFAULT_ZONES: ConfidenceZone[] = [
  { name: 'High', pct: 38, sub: '13 / 34 slots', tone: 'high' },
  { name: 'Moderate', pct: 44, sub: '15 / 34 slots', tone: 'mid' },
  { name: 'Low', pct: 18, sub: '6 / 34 slots', tone: 'low' },
];

/** clamp a 0..100 percentage to a 0..1 bar fraction */
function frac(pct: number): number {
  return Math.max(0, Math.min(1, pct / 100));
}

/** Confidence & zones — two stacked intelligence widgets in one card: a labelled
 *  model-confidence meter and a zone-distribution list over thin per-tone bars. */
export function ConfidenceZones({
  confidence = DEFAULT_CONFIDENCE,
  confidenceLabel = 'Model confidence',
  zonesLabel = 'Time in zone',
  zonesCount = 'last 30d',
  zones = DEFAULT_ZONES,
  className,
  ...rest
}: ConfidenceZonesProps) {
  return (
    <div className={cn('lk-zone-card', 'lk-card', className)} {...rest}>
      {/* model-confidence meter */}
      <div className="lk-zone-block">
        <div className="lk-zone-head">
          <span className="lk-zone-ttl">{confidenceLabel}</span>
          <span className="lk-zone-cnt lk-mono">n = {confidence.n} events</span>
        </div>
        <div className="lk-zone-meter">
          <div
            className="lk-barfill is-visible"
            style={{ ['--v']: frac(confidence.pct) } as CSSProperties}
          >
            <i />
          </div>
          <span className="lk-zone-pct lk-display lk-tnum">
            {Math.round(confidence.pct)}
            <span className="lk-zone-pct-unit">%</span>
          </span>
        </div>
        <div className="lk-zone-ends">
          <span>low</span>
          <span className="lk-zone-hi">high</span>
        </div>
      </div>

      {/* zone-distribution list + bars */}
      <div className="lk-zone-block">
        <div className="lk-zone-head">
          <span className="lk-zone-ttl">{zonesLabel}</span>
          <span className="lk-zone-cnt lk-mono">{zonesCount}</span>
        </div>

        <div className="lk-zone-list">
          {zones.map((zone, i) => (
            <div className="lk-zone-row" key={`${zone.name}-${i}`}>
              <span
                className="lk-zone-dot"
                style={{ background: TONE_VAR[zone.tone], color: TONE_VAR[zone.tone] }}
                aria-hidden="true"
              />
              <div>
                <div className="lk-zone-name">{zone.name}</div>
                {zone.sub && <div className="lk-zone-sub">{zone.sub}</div>}
              </div>
              <div className="lk-zone-rpct lk-tnum" style={{ color: TONE_VAR[zone.tone] }}>
                {Math.round(zone.pct)}%
              </div>
            </div>
          ))}
        </div>

        <div className="lk-zone-bars">
          {zones.map((zone, i) => (
            <div
              className={cn('lk-barfill is-visible', `lk-zone-${zone.tone}`)}
              style={{ ['--v']: frac(zone.pct) } as CSSProperties}
              key={`${zone.name}-bar-${i}`}
            >
              <i />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
