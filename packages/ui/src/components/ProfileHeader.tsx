import { type HTMLAttributes } from 'react';
import { cn } from '../cn';

/** Identity rendered over the cover banner. */
export interface ProfileUser {
  /** Display name, e.g. "Maya Kane". */
  name?: string;
  /** Handle / sub-line shown under the name, e.g. "@maya_k · 🏃 Marathoner". */
  handle?: string;
  /** Initials for the avatar (falls back to the first two letters of `name`). */
  initials?: string;
  /** Short bio paragraph. `b` segments render emphasized via `<strong>`. */
  bio?: string;
  /** Whether to show the verified tick beside the name. */
  verified?: boolean;
}

/** One cell of the 4-up stat grid. */
export interface ProfileStat {
  /** Numeric / display value, e.g. "142" or "1.2". */
  value: string;
  /** Mono caption beneath the value, e.g. "🔥 Streak". */
  label: string;
  /** Small trailing unit rendered inside the value, e.g. "k" → "1.2k". */
  suffix?: string;
  /** Render the value with the flowing gradient fill (used for the streak). */
  gradient?: boolean;
}

export interface ProfileHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Identity shown over the cover. */
  user?: ProfileUser;
  /** The 4-up stat grid (streak / followers / following / avg score). */
  stats?: ProfileStat[];
  /** Follow button label. */
  followLabel?: string;
  /** Follow button handler. */
  onFollow?: () => void;
  /** Message button handler — omit to hide the message action. */
  onMessage?: () => void;
}

const DEFAULT_USER: ProfileUser = {
  name: 'Maya Kane',
  handle: '@maya_k · 🏃 Marathoner',
  initials: 'MK',
  bio: 'Optimizing recovery between long runs. Early sleeper, caffeine-cutter, <b>forecast believer</b>. 90-day club, week 11.',
  verified: true,
};

const DEFAULT_STATS: ProfileStat[] = [
  { value: '142', label: '🔥 Streak', gradient: true },
  { value: '1.2', label: 'Followers', suffix: 'k' },
  { value: '312', label: 'Following' },
  { value: '7.4', label: 'Avg score' },
];

/** Resolve the avatar initials from explicit prop or the name. */
function initialsFor(user: ProfileUser): string {
  if (user.initials) return user.initials;
  return (user.name ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');
}

/** Split a bio on `<b>…</b>` markers into plain + emphasized segments. */
function renderBio(bio: string) {
  return bio.split(/(<b>.*?<\/b>)/g).map((part, i) => {
    const m = part.match(/^<b>(.*?)<\/b>$/);
    return m ? <b key={i}>{m[1]}</b> : <span key={i}>{part}</span>;
  });
}

/**
 * Profile header: a gradient cover banner with an overlapping initials avatar,
 * identity (name + verified tick + @handle), follow/message actions, a bio
 * paragraph, and a 4-up stat grid (streak / followers / following / avg score).
 */
export function ProfileHeader({
  user = DEFAULT_USER,
  stats = DEFAULT_STATS,
  followLabel = 'Follow',
  onFollow,
  onMessage,
  className,
  ...rest
}: ProfileHeaderProps) {
  return (
    <div className={cn('lk-pf', className)} {...rest}>
      <div className="lk-pf-cover" aria-hidden="true" />

      <div className="lk-pf-body">
        <div className="lk-pf-top">
          <div className="lk-pf-id">
            <span className="lk-pf-avatar" aria-hidden="true">
              {initialsFor(user)}
            </span>
            <div className="lk-pf-who">
              <div className="lk-pf-name">
                {user.name}
                {user.verified && (
                  <svg viewBox="0 0 24 24" aria-label="verified">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                )}
              </div>
              {user.handle && <div className="lk-pf-handle">{user.handle}</div>}
            </div>
          </div>

          <div className="lk-pf-actions">
            <button className="lk-pf-follow" type="button" onClick={onFollow}>
              <svg viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span>{followLabel}</span>
            </button>
            {onMessage && (
              <button className="lk-pf-msg" type="button" aria-label={`Message ${user.name ?? ''}`.trim()} onClick={onMessage}>
                <svg viewBox="0 0 24 24">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {user.bio && <p className="lk-pf-bio">{renderBio(user.bio)}</p>}

        <div className="lk-pf-stats">
          {stats.map((stat, i) => (
            <div className="lk-pf-stat" key={i}>
              <div className={cn('v', 'lk-mono', 'lk-tnum', stat.gradient && 'lk-gradient-text')}>
                {stat.value}
                {stat.suffix && <small>{stat.suffix}</small>}
              </div>
              <div className="l">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
