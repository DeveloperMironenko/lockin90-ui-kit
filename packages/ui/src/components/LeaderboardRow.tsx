import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../cn';
import { Avatar } from './Avatar';
import { Icon } from './Icon';

export interface LeaderboardRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Position in the ranking (1-based). Ranks 1/2/3 show a gold/silver/bronze crown. */
  rank: number;
  /** Display name shown beside the avatar. */
  name: string;
  /** Avatar image URL; falls back to a monogram derived from `name`. */
  avatar?: string;
  /** The ranked stat, e.g. `'1,240 pts'`. */
  value: string;
  /** Optional dimmer second line under the name. */
  sublabel?: string;
  /** Emphasize the current user's row with an accent tint + border. */
  highlight?: boolean;
}

/** Podium tint per medal rank: gold (1) · silver (2) · bronze (3). */
const MEDAL_COLOR: Record<number, string> = {
  1: 'var(--warn)', // gold #FFB020
  2: 'var(--text-dim)', // silver
  3: '#C77B3A', // bronze amber
};

/**
 * LeaderboardRow — one ranked entry in a standings list: rank (display font) +
 * avatar + name (+ optional sublabel) on the left, the ranked value on the
 * right. Ranks 1–3 swap the number for a gold/silver/bronze crown glyph.
 * `highlight` accent-tints the row to mark the current user ("you"). Composed
 * from `Avatar` + `Icon`; mirrors the native `@lockin90/ui-native` twin.
 */
export const LeaderboardRow = forwardRef<HTMLDivElement, LeaderboardRowProps>(
  function LeaderboardRow(
    { rank, name, avatar, value, sublabel, highlight, className, ...rest },
    ref,
  ) {
    const medalColor = MEDAL_COLOR[rank];

    return (
      <div
        ref={ref}
        className={cn('lk-lbrow', highlight && 'lk-lbrow-highlight', className)}
        {...rest}
      >
        <span className="lk-lbrow-rank">
          {medalColor ? (
            <Icon name="star" size={20} className="lk-lbrow-medal" style={{ color: medalColor }} />
          ) : (
            <span className="lk-lbrow-rank-num">{rank}</span>
          )}
        </span>

        <Avatar name={name} src={avatar} size={40} className="lk-lbrow-avatar" />

        <span className="lk-lbrow-main">
          <span className="lk-lbrow-name">{name}</span>
          {sublabel != null && <span className="lk-lbrow-sub">{sublabel}</span>}
        </span>

        <span className="lk-lbrow-value">{value}</span>
      </div>
    );
  },
);
