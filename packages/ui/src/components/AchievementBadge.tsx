import { type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../cn';
import { Icon, type IconName } from './Icon';
import { Ring } from './Ring';

export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface AchievementBadgeProps extends HTMLAttributes<HTMLDivElement> {
  /** Badge name. */
  title: string;
  /** Short criteria / description line. */
  description?: string;
  /** Medal glyph — defaults to a star. */
  icon?: IconName;
  /** Locked = desaturated + dimmed + lock overlay. */
  locked?: boolean;
  /** Medal tier color: bronze / silver / gold / platinum. */
  tier?: AchievementTier;
  /** 0..1 → a progress Ring is drawn around the medal (in-progress badges). */
  progress?: number;
  /** Small date label shown when unlocked. */
  unlockedAt?: string;
}

/** Per-tier medal accent color (token-driven). */
const TIER_COLOR: Record<AchievementTier, string> = {
  bronze: 'var(--warn)',
  silver: 'var(--text-dim)',
  gold: 'var(--zone-mid)',
  platinum: 'var(--cyan)',
};

/**
 * AchievementBadge — a centered medal card: tier-colored medallion holding the
 * icon, optionally wrapped by a progress Ring (in-progress achievements), with
 * the title, description and an optional unlock date below. Unlocked badges get
 * a gradient hairline + glow; locked ones are desaturated, dimmed and carry a
 * small lock overlay. CSS class: .lk-achv (distinct from Toast's .lk-badge).
 */
export function AchievementBadge({
  title,
  description,
  icon = 'star',
  locked = false,
  tier = 'gold',
  progress,
  unlockedAt,
  className,
  style,
  ...rest
}: AchievementBadgeProps) {
  const accent = TIER_COLOR[tier];
  const hasProgress = typeof progress === 'number';
  const pct = hasProgress ? Math.max(0, Math.min(1, progress)) * 100 : 0;

  const medal = (
    <span className="lk-achv-medal" style={{ ['--lk-achv-tier']: accent } as CSSProperties}>
      <Icon name={icon} size={30} />
    </span>
  );

  return (
    <div
      className={cn('lk-achv', locked ? 'lk-achv--locked' : 'lk-achv--unlocked', className)}
      style={{ ['--lk-achv-tier']: accent, ...style } as CSSProperties}
      {...rest}
    >
      {locked ? (
        <span className="lk-achv-lock" aria-hidden="true">
          <Icon name="lock" size={14} />
        </span>
      ) : null}

      <div className="lk-achv-crest">
        {hasProgress ? (
          <Ring value={pct} size={84} thickness={6} color={accent} glow={!locked}>
            {medal}
          </Ring>
        ) : (
          medal
        )}
      </div>

      <div className="lk-achv-name">{title}</div>
      {description ? <div className="lk-achv-desc">{description}</div> : null}

      {hasProgress ? (
        <div className="lk-achv-prog lk-tnum">{Math.round(pct)}%</div>
      ) : unlockedAt ? (
        <div className="lk-achv-date lk-tnum">
          <Icon name="check" size={12} />
          {unlockedAt}
        </div>
      ) : null}
    </div>
  );
}
