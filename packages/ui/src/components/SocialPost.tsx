import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';
import { Card } from './Card';
import { Avatar } from './Avatar';

export interface SocialPostAuthor {
  /** Display name. */
  name: string;
  /** Optional @handle (rendered in mono, without the leading @). */
  handle?: string;
  /** Optional avatar image URL — falls back to a monogram of `name`. */
  avatar?: string;
}

export interface SocialPostProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** The post author — name, optional handle, optional avatar. */
  author: SocialPostAuthor;
  /** Relative timestamp, e.g. `'2h'`. Shown after the handle with a `·`. */
  time?: string;
  /** The post body / prose. */
  body?: ReactNode;
  /** Optional attached media slot — a card, image, or progress card (rendered as-is). */
  media?: ReactNode;
  /** Optional engagement-footer slot — consumer passes `<EngagementBar/>` (rendered as-is, separated by a hairline). */
  footer?: ReactNode;
  /** Optional small tag, e.g. `'PR'` or `'Streak'`. */
  badge?: string;
}

/**
 * SocialPost — a community-feed post on the glass surface: an Avatar + name +
 * @handle · time header (with an optional badge tag), the body prose, an
 * optional attached `media` slot, and an optional engagement `footer` slot
 * separated by a hairline. Composes from Card + Avatar. Mirrors the feed post
 * card from the Aurora Flux design (`.post`). The footer is a slot so consumers
 * pass the separate `<EngagementBar/>` primitive.
 */
export const SocialPost = forwardRef<HTMLDivElement, SocialPostProps>(function SocialPost(
  { author, time, body, media, footer, badge, className, ...rest },
  ref,
) {
  return (
    <Card ref={ref} hover className={cn('lk-post', className)} {...rest}>
      <div className="lk-post-head">
        <Avatar name={author.name} src={author.avatar} size={42} />
        <div className="lk-post-id">
          <div className="lk-post-name">
            {author.name}
            {badge && <span className="lk-post-badge">{badge}</span>}
          </div>
          {(author.handle || time) && (
            <div className="lk-post-meta">
              {author.handle && <span className="lk-post-handle">@{author.handle}</span>}
              {time && <span className="lk-post-time">{time}</span>}
            </div>
          )}
        </div>
      </div>

      {body != null && <div className="lk-post-body">{body}</div>}

      {media != null && <div className="lk-post-media">{media}</div>}

      {footer != null && <div className="lk-post-foot">{footer}</div>}
    </Card>
  );
});
