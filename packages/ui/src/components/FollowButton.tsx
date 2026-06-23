import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../cn';
import { Icon } from './Icon';

export interface FollowButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onToggle'> {
  /** Controlled follow state. */
  following: boolean;
  /** Fired when the pill is pressed — flip `following` in the parent. */
  onToggle: () => void;
  size?: 'sm' | 'md';
  /** Label shown when not following. @default 'Follow' */
  followLabel?: string;
  /** Label shown when following (hover swaps to "Unfollow"). @default 'Following' */
  followingLabel?: string;
  disabled?: boolean;
}

/**
 * Pill follow toggle. Not-following = accent-filled "＋ Follow"; following =
 * glass/outlined "✓ Following" (dim). Controlled via `following` + `onToggle`.
 * On hover the "Following" state swaps to "Unfollow" in the `bad` tone (CSS).
 */
export const FollowButton = forwardRef<HTMLButtonElement, FollowButtonProps>(
  function FollowButton(
    {
      following,
      onToggle,
      size = 'md',
      followLabel = 'Follow',
      followingLabel = 'Following',
      disabled,
      className,
      type = 'button',
      ...rest
    },
    ref,
  ) {
    const glyph = size === 'sm' ? 12 : 13;
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'lk-followbtn',
          following && 'lk-followbtn-following',
          size === 'sm' && 'lk-followbtn-sm',
          className,
        )}
        aria-pressed={following}
        disabled={disabled}
        onClick={onToggle}
        {...rest}
      >
        <Icon name={following ? 'check' : 'plus'} size={glyph} className="lk-followbtn-ico" />
        <span className="lk-followbtn-label">{following ? followingLabel : followLabel}</span>
      </button>
    );
  },
);
