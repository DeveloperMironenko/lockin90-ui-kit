import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../cn';
import { Icon } from './Icon';

/* ============================================================================
   EngagementBar — the post/feed footer row: a horizontal group of icon+count
   "react" actions (like · comment · share · save) in a thin strip above the
   card edge. Each action is a pressable icon-button with a tabular-nums count
   beside it; only actions whose prop object is provided are rendered.

   Active states colorize the glyph: a liked heart fills rose/bad and tints its
   count; a saved bookmark fills accent (violet). Mirrors `.post-foot`/`.react`
   from the social feed design (feed.html / social.html).
   ========================================================================== */

export interface EngagementBarProps extends HTMLAttributes<HTMLDivElement> {
  like?: { count?: number; active?: boolean; onToggle?: () => void };
  comment?: { count?: number; onPress?: () => void };
  share?: { onPress?: () => void };
  save?: { active?: boolean; onToggle?: () => void };
}

/** A single icon (+ optional count) react action inside the bar. */
function ReactAction({
  variant,
  icon,
  count,
  active,
  label,
  onClick,
}: {
  variant: 'like' | 'comment' | 'share' | 'save';
  icon: 'apple-health' | 'quote' | 'share' | 'save';
  count?: number;
  active?: boolean;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        'lk-react',
        `lk-react-${variant}`,
        active && 'lk-react-on',
      )}
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
    >
      <Icon name={icon} size={16} />
      {count != null && <span className="lk-react-cnt">{count}</span>}
    </button>
  );
}

/** Horizontal like / comment / share / save action row for feed posts. */
export const EngagementBar = forwardRef<HTMLDivElement, EngagementBarProps>(
  function EngagementBar({ like, comment, share, save, className, ...rest }, ref) {
    return (
      <div ref={ref} className={cn('lk-engagement', className)} {...rest}>
        {like && (
          <ReactAction
            variant="like"
            icon="apple-health"
            label={like.active ? 'Unlike' : 'Like'}
            count={like.count}
            active={like.active}
            onClick={like.onToggle}
          />
        )}
        {comment && (
          <ReactAction
            variant="comment"
            icon="quote"
            label="Comments"
            count={comment.count}
            onClick={comment.onPress}
          />
        )}
        {share && (
          <ReactAction
            variant="share"
            icon="share"
            label="Share"
            onClick={share.onPress}
          />
        )}
        {save && (
          <ReactAction
            variant="save"
            icon="save"
            label={save.active ? 'Saved' : 'Save'}
            active={save.active}
            onClick={save.onToggle}
          />
        )}
      </div>
    );
  },
);
