import { type HTMLAttributes, type CSSProperties } from 'react';
import { cn } from '../cn';
import { Chip } from './Chip';

export type TimelineTone = 'high' | 'mid' | 'low';

export interface TimelineItem {
  /** mono timestamp, e.g. "8:30am" */
  time: string;
  /** row heading */
  title: string;
  /** one-line supporting detail */
  desc: string;
  /** tints the node + impact pill (high = positive/mint, low = negative/red) */
  tone?: TimelineTone;
  /** small uppercase category label under the description */
  cat?: string;
  /** mono impact pill on the right, e.g. "+4 focus" / "−12" */
  impact?: string;
  /** outlined SVG path drawn inside the leading icon tile */
  iconPath?: string;
  /** color of the leading icon glyph (defaults to accent) */
  iconColor?: string;
  /** inline chip after the title, e.g. "+caffeine" or a "now" badge */
  badge?: { label: string; tone?: 'default' | 'high' | 'mid' | 'low' | 'accent' };
  /** highlight as the live/current row (accent ring + glow) */
  active?: boolean;
}

export interface ActivityTimelineProps extends HTMLAttributes<HTMLDivElement> {
  items?: TimelineItem[];
}

/** Faithful reproduction of the design's example entries. */
const DEFAULT_ITEMS: TimelineItem[] = [
  {
    time: '8:30am',
    title: 'Morning coffee',
    desc: 'Double espresso · 130mg · inside window',
    tone: 'high',
    cat: 'Substance',
    impact: '+4 focus',
    iconColor: 'var(--zone-mid)',
    iconPath: 'M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4zM6 1v3M10 1v3M14 1v3',
    badge: { label: '+caffeine' },
  },
  {
    time: '12:15pm',
    title: 'Lunch logged',
    desc: 'Chicken, rice & greens · 52g protein · 740 kcal',
    tone: 'high',
    cat: 'Meal',
    impact: '+5 baseline',
    iconColor: 'var(--lime)',
    iconPath: 'M3 11h18M5 11V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4M7 11v8M17 11v8',
  },
  {
    time: '3:00pm',
    title: 'Energy dip',
    desc: 'Self-report · felt 4/10 · post-lunch crash',
    tone: 'low',
    cat: 'Mood',
    impact: '−12',
    iconColor: 'var(--zone-low)',
    iconPath: 'M3 17l6-6 4 4 8-8M21 7v5h-5',
  },
  {
    time: '6:00pm',
    title: 'Gym · strength',
    desc: 'Squat 4×3 @ 180kg · RPE 8.5 · 38 min',
    tone: 'low',
    cat: 'Workout',
    impact: '−4 residual',
    iconColor: 'var(--magenta)',
    iconPath: 'M6.5 6.5h11M6.5 17.5h11M4 9v6M20 9v6M9 7v10M15 7v10',
    badge: { label: 'now', tone: 'accent' },
    active: true,
  },
];

const ROW_TONE: Record<TimelineTone, string> = { high: 'lk-high', mid: 'lk-mid', low: 'lk-low' };
const IMPACT_TONE: Record<TimelineTone, string> = { high: 'lk-high', mid: '', low: 'lk-low' };

/** Vertical activity timeline — a connected rail of dotted nodes, each row a
 *  time + title + short description, tinted by energy zone. */
export function ActivityTimeline({ items = DEFAULT_ITEMS, className, ...rest }: ActivityTimelineProps) {
  return (
    <div className={cn('lk-tl', className)} {...rest}>
      <span className="lk-tl-rail" aria-hidden="true" />
      {items.map((it, i) => (
        <div key={i} className={cn('lk-tl-row', it.tone && ROW_TONE[it.tone], it.active && 'lk-active')}>
          <div className="lk-tl-time lk-mono lk-tnum">{it.time}</div>
          <div className="lk-tl-node" aria-hidden="true">
            <i />
          </div>
          <div className="lk-tl-body">
            <div className="lk-tl-title">
              {it.iconPath && (
                <span className="lk-tl-ic" style={{ '--lk-tl-ecol': it.iconColor } as CSSProperties} aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d={it.iconPath} />
                  </svg>
                </span>
              )}
              {it.title}
              {it.badge && (
                <Chip tone={it.badge.tone ?? 'default'} style={{ fontSize: 9, padding: '1px 7px' }}>
                  {it.badge.label}
                </Chip>
              )}
            </div>
            <div className="lk-tl-sub">{it.desc}</div>
            {it.cat && <div className="lk-tl-cat">{it.cat}</div>}
          </div>
          {it.impact && <span className={cn('lk-tl-impact', it.tone && IMPACT_TONE[it.tone])}>{it.impact}</span>}
        </div>
      ))}
    </div>
  );
}

export type { TimelineItem as ActivityTimelineItem };
