import { type HTMLAttributes } from 'react';
import { cn } from '../cn';
import { Chip, type ChipTone } from './Chip';

/** Zone tint for a metric tile / sparkline color. */
export type AthleteZone = 'high' | 'mid' | 'low';

/** One tile in the 4-up metric grid. */
export interface AthleteMetric {
  /** mono uppercase label, e.g. "Energy" */
  label: string;
  /** big value, e.g. "78" or "7.4" */
  value: string;
  /** small mono unit suffix, e.g. "h" or "%" */
  unit?: string;
  /** zone tint for the left rail */
  zone?: AthleteZone;
}

/** One athlete shown as a roster card. */
export interface Athlete {
  /** display name, e.g. "Leo P" */
  name: string;
  /** avatar initials, e.g. "LP" */
  initials: string;
  /** status chip text, e.g. "on track" / "needs attention" */
  status: string;
  /** chip tone for the status pill (defaults: high if online, low if not) */
  statusTone?: ChipTone;
  /** last-sync line, e.g. "Synced 12m ago · Garmin" */
  sync: string;
  /** true → online (mint dot + cta avatar); false → offline (red dot + violet avatar) */
  online?: boolean;
  /** the 4 metric tiles (energy / sleep / readiness / compliance) */
  metrics: AthleteMetric[];
  /** 7 trend values (any scale) drawn as the footer sparkline, oldest → newest */
  trend: number[];
  /** zone color for the sparkline stroke (defaults to the worst metric zone) */
  trendZone?: AthleteZone;
  /** optional amber attention flag → highlights the card + shows an alert chip */
  flag?: string;
}

export interface AthleteRosterCardProps extends HTMLAttributes<HTMLDivElement> {
  /** athletes to render as a responsive 2-up grid */
  athletes?: Athlete[];
}

const ZONE_CLASS: Record<AthleteZone, string> = { high: 'lk-ath-zh', mid: 'lk-ath-zm', low: 'lk-ath-zl' };
const ZONE_STROKE: Record<AthleteZone, string> = {
  high: 'var(--zone-high)',
  mid: 'var(--zone-mid)',
  low: 'var(--zone-low)',
};

/** Faithful reproduction of the design's "Athlete roster" example. */
const DEFAULT_ATHLETES: Athlete[] = [
  {
    name: 'Leo P',
    initials: 'LP',
    status: 'on track',
    statusTone: 'high',
    sync: 'Synced 12m ago · Garmin',
    online: true,
    metrics: [
      { label: 'Energy', value: '78', zone: 'high' },
      { label: 'Sleep', value: '7.4', unit: 'h', zone: 'high' },
      { label: 'Readiness', value: '81', zone: 'high' },
      { label: 'Compliance', value: '92', unit: '%', zone: 'high' },
    ],
    trend: [20, 19, 21, 13, 11, 9, 6],
    trendZone: 'high',
  },
  {
    name: 'Ava R',
    initials: 'AR',
    status: 'needs attention',
    statusTone: 'low',
    sync: 'Synced 2h ago · Whoop',
    online: false,
    metrics: [
      { label: 'Energy', value: '54', zone: 'mid' },
      { label: 'Sleep', value: '5.9', unit: 'h', zone: 'low' },
      { label: 'Readiness', value: '47', zone: 'low' },
      { label: 'Compliance', value: '61', unit: '%', zone: 'low' },
    ],
    trend: [7, 11, 10, 17, 19, 21, 23],
    trendZone: 'low',
    flag: '⚠ recovery dropping',
  },
];

/** the sparkline viewBox — points are normalized into this box */
const SPARK_W = 84;
const SPARK_H = 26;
const SPARK_PAD = 6;

/** build the polyline `d` for a trend series, normalized into the spark viewBox */
function sparkPath(trend: number[]): string {
  const n = trend.length;
  if (n === 0) return '';
  const min = Math.min(...trend);
  const max = Math.max(...trend);
  const span = max - min || 1;
  return trend
    .map((v, i) => {
      const x = n <= 1 ? 0 : +((i / (n - 1)) * SPARK_W).toFixed(2);
      const frac = (v - min) / span;
      const y = +(SPARK_PAD + (1 - frac) * (SPARK_H - SPARK_PAD * 2)).toFixed(2);
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    })
    .join(' ');
}

/**
 * Athlete roster card — a coach-side card (or 2-up grid) for athletes: a
 * gradient avatar with an online/offline status dot, name + status chip + last
 * sync, a 4-tile zone-tinted metric grid (energy / sleep / readiness /
 * compliance), an optional amber attention flag + alert chip, and a 7-day trend
 * sparkline. Defaults reproduce the design example.
 */
export function AthleteRosterCard({ athletes = DEFAULT_ATHLETES, className, ...rest }: AthleteRosterCardProps) {
  return (
    <div className={cn('lk-ath-grid', className)} {...rest}>
      {athletes.map((a, ai) => {
        const online = a.online ?? true;
        const statusTone: ChipTone = a.statusTone ?? (online ? 'high' : 'low');
        const trendZone: AthleteZone = a.trendZone ?? (a.flag ? 'low' : 'high');
        return (
          <article key={ai} className={cn('lk-card', 'lk-ath-card', a.flag && 'lk-ath-flag')} tabIndex={0}>
            {/* header */}
            <div className="lk-ath-top">
              <div className={cn('lk-ath-av', 'lk-display', online ? 'lk-ath-good' : 'lk-ath-warn')} aria-hidden="true">
                {a.initials}
                <span className="lk-ath-st">
                  <span className={cn('lk-ath-dot', online ? 'lk-ath-on' : 'lk-ath-off')} />
                </span>
              </div>
              <div className="lk-ath-id">
                <div className="lk-ath-name">
                  {a.name}
                  <Chip tone={statusTone} dot style={{ fontSize: '9.5px', padding: '2px 7px' }}>
                    {a.status}
                  </Chip>
                </div>
                <div className="lk-ath-spec">{a.sync}</div>
              </div>
              <svg className="lk-ath-chev" viewBox="0 0 24 24">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </div>

            {/* metric grid */}
            <div className="lk-ath-metrics">
              {a.metrics.map((m, mi) => (
                <div key={mi} className={cn('lk-ath-tile', ZONE_CLASS[m.zone ?? 'high'])}>
                  <div className="lk-ath-k lk-mono">{m.label}</div>
                  <div className="lk-ath-v lk-tnum">
                    {m.value}
                    {m.unit ? <span className="lk-ath-u lk-mono">{m.unit}</span> : null}
                  </div>
                </div>
              ))}
            </div>

            {/* footer — optional alert chip, 7-day trend + sparkline */}
            <div className="lk-ath-foot">
              {a.flag ? (
                <Chip tone="low" dot className="lk-ath-alert" style={{ fontSize: '10px' }}>
                  {a.flag}
                </Chip>
              ) : null}
              <span className="lk-ath-sync lk-mono">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8" />
                </svg>
                7-day trend
              </span>
              <svg className="lk-ath-spark" viewBox={`0 0 ${SPARK_W} ${SPARK_H}`} preserveAspectRatio="none" aria-hidden="true">
                <path
                  d={sparkPath(a.trend)}
                  fill="none"
                  stroke={ZONE_STROKE[trendZone]}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </article>
        );
      })}
    </div>
  );
}
