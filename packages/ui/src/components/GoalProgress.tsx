import { type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';
import { BarFill } from './BarFill';
import { Chip, type ChipTone } from './Chip';

/** Domain accent for the leading icon tile (drives color + default glyph). */
export type GoalDomain = 'energy' | 'sleep';
/** Progress-bar gradient — mint (on track) or warm (at risk). */
export type GoalProgressTone = 'mint' | 'warm';

export interface GoalProgressProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Eyebrow above the name, e.g. "Energy" or "Sleep · duration". */
  domain?: ReactNode;
  /** Which icon tile / glyph to show. */
  icon?: GoalDomain;
  /** Goal title, e.g. "Avg energy ≥ 80". */
  name?: ReactNode;
  /** Big current value. */
  current?: ReactNode;
  /** Small suffix after the current value, e.g. "/100" or "h avg". */
  unit?: ReactNode;
  /** Target value text, e.g. "80" or "7.5 h". */
  target?: ReactNode;
  /** Percentage 0..100 — drives the mini ring + the progress bar fill. */
  pct?: number;
  /** Progress-bar gradient tone. */
  progressTone?: GoalProgressTone;
  /** Footer date / window string, e.g. "Aug 31 · 12 days left". */
  date?: ReactNode;
  /** Footer date glyph. */
  dateIcon?: 'calendar' | 'clock';
  /** Pace chip tone (high = on track, mid = at risk, low = off). */
  paceTone?: ChipTone;
  /** Pace chip text, e.g. "+3 / 14d · on track". */
  paceLabel?: ReactNode;
  /** Whether the pace chip shows a leading dot. */
  paceDot?: boolean;
}

const ICON: Record<GoalDomain, ReactNode> = {
  energy: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
  sleep: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />,
};

const DATE_ICON = {
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M3 9h18M8 2v4M16 2v4" />
    </>
  ),
  clock: (
    <>
      <path d="M12 6v6l4 2" />
      <circle cx="12" cy="12" r="9" />
    </>
  ),
} as const;

/**
 * Goal progress card — name + mini progress ring + current/target values +
 * gradient progress bar + a pace/status chip. Defaults to the design example
 * ("Avg energy ≥ 80").
 */
export function GoalProgress({
  domain = 'Energy',
  icon = 'energy',
  name = 'Avg energy ≥ 80',
  current = 76,
  unit = ' /100',
  target = '80',
  pct = 95,
  progressTone = 'mint',
  date = 'Aug 31 · 12 days left',
  dateIcon = 'calendar',
  paceTone = 'high',
  paceLabel = '+3 / 14d · on track',
  paceDot = true,
  className,
  ...rest
}: GoalProgressProps) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <section className={cn('lk-card', 'lk-hover', 'lk-goal-card', className)} {...rest}>
      <div className="lk-goal-top">
        <div className={cn('lk-goal-ico', `lk-goal-dom-${icon}`)}>
          <svg viewBox="0 0 24 24" stroke="currentColor">{ICON[icon]}</svg>
        </div>
        <div className="lk-goal-head">
          <div className="lk-goal-dom">{domain}</div>
          <div className="lk-goal-name">{name}</div>
        </div>
        <div className="lk-goal-mini" style={{ ['--p']: clamped } as CSSProperties} aria-hidden="true">
          <b>{Math.round(clamped)}%</b>
        </div>
      </div>

      <div className="lk-goal-vals">
        <span className="lk-goal-cur lk-tnum">
          {current}
          {unit != null && <small>{unit}</small>}
        </span>
        <span className="lk-goal-tgt">
          target <b>{target}</b>
        </span>
      </div>

      <div className="lk-goal-prog">
        <BarFill value={clamped / 100} className={`lk-goal-prog-${progressTone}`} />
        <span className="lk-goal-pct lk-mono">{Math.round(clamped)}%</span>
      </div>

      <div className="lk-goal-foot">
        <span className="lk-goal-date">
          <svg viewBox="0 0 24 24">{DATE_ICON[dateIcon]}</svg> {date}
        </span>
        <Chip tone={paceTone} dot={paceDot} className="lk-goal-trend">
          {paceLabel}
        </Chip>
      </div>
    </section>
  );
}
