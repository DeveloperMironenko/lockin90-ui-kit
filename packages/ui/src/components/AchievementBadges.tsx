import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';
import { BarFill } from './BarFill';

/** Medal-tier tint for the medallion icon. */
export type AchievementTier = 'gold' | 'silver' | 'cyan';
/** Which medallion glyph to draw. */
export type AchievementIcon = 'streak' | 'sunrise' | 'droplet' | 'trophy' | 'bolt';

export interface Achievement {
  /** Badge title, e.g. "30-Day Streak". */
  name: ReactNode;
  /** One-line earn criteria, e.g. "Log every day for a month straight". */
  criteria?: ReactNode;
  /** Medallion glyph. */
  icon?: AchievementIcon;
  /** Medal tier tint for the icon. */
  tier?: AchievementTier;
  /** Earned vs locked. Earned shows the gradient border + earned date. */
  earned?: boolean;
  /** Earned date string (earned badges), e.g. "Earned Jun 18". */
  date?: ReactNode;
  /** Progress label (locked badges), e.g. "12 / 30 days". */
  progressLabel?: ReactNode;
  /** Progress fraction 0..1 (locked badges) — drives the bar fill. */
  progress?: number;
}

export interface AchievementBadgesProps extends HTMLAttributes<HTMLDivElement> {
  /** Badges to render. Defaults to the design's example set. */
  items?: Achievement[];
}

/** Medallion glyphs (rendered inside a 24×24 viewBox, stroked by CSS). */
const MEDAL_ICON: Record<AchievementIcon, ReactNode> = {
  streak: (
    <path d="M12 2c1.5 3 1 5-1 7-1.5 1.5-2 3.5-1 5.5C11 17 13 16 14 14c1.5 3 .5 6-2 8 4 0 7-3 7-7 0-5-3-8-7-13z" />
  ),
  sunrise: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  droplet: <path d="M12 2.5S6 9 6 14a6 6 0 0 0 12 0c0-5-6-11.5-6-11.5z" />,
  trophy: (
    <>
      <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z" />
      <path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3" />
    </>
  ),
  bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7z" />,
};

const CHECK = <path d="M20 6 9 17l-5-5" />;
const LOCK = (
  <>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </>
);

/** The design's example badge set: two earned + one locked-in-progress. */
const DEFAULT_ITEMS: Achievement[] = [
  {
    name: '30-Day Streak',
    criteria: 'Log every day for a month straight',
    icon: 'streak',
    tier: 'gold',
    earned: true,
    date: 'Earned Jun 18',
  },
  {
    name: 'Early Riser',
    criteria: '50 mornings waking before 6:30am',
    icon: 'sunrise',
    tier: 'silver',
    earned: true,
    date: 'Earned Jun 12',
  },
  {
    name: 'Hydration Hero',
    criteria: 'Hit 3L water · 30 days running',
    icon: 'droplet',
    tier: 'cyan',
    earned: false,
    progressLabel: '12 / 30 days',
    progress: 0.4,
  },
];

/**
 * Achievement badges — a grid of medal cards. Each is a ringed medallion +
 * name + earn criteria; earned badges glow with an animated gradient border
 * and show an earned date, locked badges dim behind a lock and show progress.
 * Defaults to the design's example set.
 */
export function AchievementBadges({ items = DEFAULT_ITEMS, className, ...rest }: AchievementBadgesProps) {
  return (
    <div className={cn('lk-ach-grid', className)} {...rest}>
      {items.map((a, i) => {
        const earned = a.earned ?? false;
        return (
          <article
            key={i}
            className={cn(
              'lk-ach-badge',
              earned ? 'lk-earned' : 'lk-locked',
              a.tier && `lk-ach-${a.tier}`,
            )}
            tabIndex={0}
          >
            <span className="lk-ach-lock" aria-hidden="true">
              <svg viewBox="0 0 24 24" stroke="currentColor">
                {earned ? CHECK : LOCK}
              </svg>
            </span>

            <div className="lk-ach-medal">
              <svg viewBox="0 0 24 24" stroke="currentColor">
                {MEDAL_ICON[a.icon ?? 'trophy']}
              </svg>
            </div>

            <div className="lk-ach-name">{a.name}</div>
            {a.criteria != null && <div className="lk-ach-crit">{a.criteria}</div>}

            {earned ? (
              a.date != null && (
                <div className="lk-ach-date">
                  <svg viewBox="0 0 24 24" stroke="currentColor">{CHECK}</svg> {a.date}
                </div>
              )
            ) : (
              (a.progressLabel != null || a.progress != null) && (
                <div className="lk-ach-prog">
                  <div className="lk-ach-pr">
                    <span>Progress</span>
                    {a.progressLabel != null && <b className="lk-mono lk-tnum">{a.progressLabel}</b>}
                  </div>
                  <BarFill value={a.progress ?? 0} />
                </div>
              )
            )}
          </article>
        );
      })}
    </div>
  );
}
