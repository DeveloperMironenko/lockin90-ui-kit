import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';
import { Avatar } from './Avatar';
import { Icon } from './Icon';

export interface ProfileStat {
  /** Small uppercase caption beneath the value (e.g. `'Followers'`). */
  label: string;
  /** Big display value (e.g. `'2.4k'`). */
  value: string;
}

export interface ProfileHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Display name, shown in the display face. */
  name: string;
  /** Optional @handle (rendered in mono, with a leading `@`). */
  handle?: string;
  /** Avatar image URL — falls back to a monogram of `name`. */
  avatar?: string;
  /** Cover banner image URL; when absent a brand flux gradient is painted. */
  cover?: string;
  /** Optional bio prose. */
  bio?: ReactNode;
  /** Stat grid (e.g. Followers / Following / Streak), evenly spaced. */
  stats?: ProfileStat[];
  /** Show a verified check beside the name. */
  verified?: boolean;
  /** Top-right action slot — consumer passes a FollowButton / Edit button. */
  action?: ReactNode;
}

/**
 * ProfileHeader — a social profile hero: a cover banner (image or brand flux
 * gradient fallback) with an overlapping circular Avatar at its bottom-left,
 * a name row (display name + optional verified check + @handle) with an action
 * slot top-right, the bio prose, and an evenly-spaced stat grid. Composed from
 * the kit Avatar + Icon. Mirrors `.pf-cover / .pf-body` from the design mockup.
 */
export function ProfileHeader({
  name,
  handle,
  avatar,
  cover,
  bio,
  stats,
  verified,
  action,
  className,
  ...rest
}: ProfileHeaderProps) {
  return (
    <div className={cn('lk-pf', className)} {...rest}>
      <div
        className={cn('lk-pf-cover', !cover && 'lk-pf-cover-grad')}
        style={cover ? { backgroundImage: `url(${cover})` } : undefined}
        aria-hidden="true"
      />
      <div className="lk-pf-body">
        <div className="lk-pf-top">
          <Avatar className="lk-pf-avatar" name={name} src={avatar} size={84} />
          {action != null && <div className="lk-pf-action">{action}</div>}
        </div>
        <div className="lk-pf-id">
          <div className="lk-pf-name lk-display">
            {name}
            {verified && (
              <Icon name="checkCircle" size={18} className="lk-pf-verified" aria-label="Verified" />
            )}
          </div>
          {handle != null && <div className="lk-pf-handle lk-mono">@{handle}</div>}
        </div>
        {bio != null && <p className="lk-pf-bio">{bio}</p>}
        {stats != null && stats.length > 0 && (
          <div className="lk-pf-stats">
            {stats.map((s, i) => (
              <div className="lk-pf-stat" key={`${s.label}-${i}`}>
                <span className="lk-pf-stat-v lk-display lk-tnum">{s.value}</span>
                <span className="lk-pf-stat-l lk-mono">{s.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
