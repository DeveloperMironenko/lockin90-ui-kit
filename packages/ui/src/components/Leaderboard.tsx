import { type HTMLAttributes } from 'react';
import { cn } from '../cn';
import { Chip } from './Chip';

/** A single ranked competitor in the cohort. */
export interface LeaderboardRow {
  /** Rank position (1-based). 1/2/3 get the gold/silver/bronze treatment. */
  rank: number;
  /** Display name. */
  name: string;
  /** Avatar monogram, e.g. "MK". */
  initials: string;
  /** Secondary line under the name, e.g. "21-day streak". */
  meta?: string;
  /** Primary score value. */
  score: number | string;
  /** Score unit label, e.g. "avg". */
  unit?: string;
  /**
   * Medal badge text on the avatar (top-3 only), e.g. "1". When omitted but the
   * row is in the top 3, the rank is used.
   */
  medal?: string;
  /** Marks this as the current user's row — highlight + "you" tag. */
  you?: boolean;
}

export interface LeaderboardProps extends HTMLAttributes<HTMLDivElement> {
  /** Header title. */
  title?: string;
  /** Header subtitle (mono, uppercase). */
  sub?: string;
  /** Header metric chip, e.g. "28 in cohort". Hidden when empty. */
  metric?: string;
  /** Ranked rows, best-first. */
  rows?: LeaderboardRow[];
  /** Total cohort size for the footer's "of N"; defaults to the row count. */
  total?: number;
  /** Footer lead-in before the bolded rank; the bolded "#N of M" follows. */
  footerLead?: string;
  /** Footer trailing text after the bolded rank. */
  footerTail?: string;
  /** Footer CTA text. Hidden when empty. */
  footerCta?: string;
}

/** The design's example cohort. */
const DEFAULT_ROWS: LeaderboardRow[] = [
  { rank: 1, name: 'Mara K', initials: 'MK', meta: '21-day streak', score: '6.9', unit: 'avg' },
  { rank: 2, name: 'Leo P', initials: 'LP', meta: '18-day streak', score: '6.7', unit: 'avg' },
  { rank: 3, name: 'Ava R', initials: 'AR', meta: '15-day streak', score: '6.5', unit: 'avg' },
  { rank: 4, name: 'Sam T', initials: 'ST', meta: '9-day streak', score: '6.2', unit: 'avg' },
  { rank: 5, name: 'You', initials: 'YO', meta: '7-day streak', score: '6.0', unit: 'avg', you: true },
];

/**
 * Leaderboard — a ranked cohort list. The top 3 wear gold/silver/bronze
 * avatars (with a crown on #1), every row shows avatar + name + meta + score,
 * and the current user's row is highlighted with a "you" tag. A header labels
 * the metric and a footer summarizes the viewer's standing ("you're #N of M").
 * Mirrors the native `Leaderboard` prop API and defaults to the design's set.
 */
export function Leaderboard({
  title = 'Consistency',
  sub = 'This week · avg energy',
  metric = '28 in cohort',
  rows = DEFAULT_ROWS,
  total = 28,
  footerLead = "You're",
  footerTail = 'this week',
  footerCta = 'View full ranking →',
  className,
  ...rest
}: LeaderboardProps) {
  const you = rows.find((r) => r.you);
  const showFooter = footerLead != null || footerCta != null;

  return (
    <div className={cn('lk-card', 'lk-lb-card', className)} {...rest}>
      <div className="lk-lb-head">
        <div>
          <div className="lk-lb-title">{title}</div>
          {sub && <div className="lk-lb-sub">{sub}</div>}
        </div>
        {metric && (
          <Chip tone="accent" dot className="lk-lb-metric">
            {metric}
          </Chip>
        )}
      </div>

      {rows.map((r) => {
        const top = r.rank >= 1 && r.rank <= 3 ? r.rank : 0;
        const medal = r.medal ?? (top ? String(top) : undefined);
        return (
          <div
            key={`${r.rank}-${r.name}`}
            className={cn(
              'lk-lb-row',
              top === 1 && 'lk-lb-top1',
              top === 2 && 'lk-lb-top2',
              top === 3 && 'lk-lb-top3',
              r.you && 'lk-lb-you',
            )}
          >
            <div className="lk-lb-rank lk-tnum">
              {r.rank}
              {top === 1 && (
                <svg className="lk-lb-crown" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 18h18l-1.5-9-4.5 4-3-6-3 6-4.5-4z" />
                </svg>
              )}
            </div>

            <div className="lk-lb-av">
              {r.initials}
              {top > 0 && medal != null && <span className="lk-lb-medal">{medal}</span>}
            </div>

            <div className="lk-lb-id">
              <div className="lk-lb-name">
                {r.name}
                {r.you && <span className="lk-lb-tag">you</span>}
              </div>
              {r.meta && <div className="lk-lb-meta">{r.meta}</div>}
            </div>

            <div className="lk-lb-score">
              <div className="lk-lb-v lk-display lk-tnum">{r.score}</div>
              {r.unit && <div className="lk-lb-u lk-mono">{r.unit}</div>}
            </div>
          </div>
        );
      })}

      {showFooter && (
        <div className="lk-lb-foot">
          {footerLead != null && you && (
            <span className="lk-lb-foot-txt">
              {footerLead} <b>#{you.rank} of {total}</b>
              {footerTail ? ` ${footerTail}` : ''}
            </span>
          )}
          {footerCta && <span className="lk-lb-foot-cta">{footerCta}</span>}
        </div>
      )}
    </div>
  );
}
