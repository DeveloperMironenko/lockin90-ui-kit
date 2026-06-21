import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';
import { Chip, type ChipTone } from './Chip';

export interface FeedPostAuthor {
  /** Display name, e.g. 'Jordan D'. */
  name: string;
  /** Handle without the body of the row, e.g. '@jordan_d'. */
  handle: string;
  /** Two-letter avatar initials, e.g. 'JD'. */
  initials: string;
  /** Show the verified check beside the name. */
  verified?: boolean;
}

export interface FeedPostAttach {
  /** Chip label, e.g. '🔥 14-day streak'. */
  label: string;
  /** Chip tone — defaults to 'mid' (the streak look). */
  tone?: ChipTone;
  /** Leading glowing dot on the chip. */
  dot?: boolean;
}

export interface FeedPostEngagement {
  /** Like count. */
  likes: number;
  /** Comment count. */
  comments: number;
  /** Like shown active (filled heart, low tone). */
  liked?: boolean;
}

export interface FeedPostProps extends HTMLAttributes<HTMLElement> {
  /** Post author — avatar, name, handle. */
  author?: FeedPostAuthor;
  /** Relative time, e.g. '2h'. */
  time?: string;
  /** Post body; ReactNode so consumers can pass <span class="lk-post-tag"> hashtags. */
  body?: ReactNode;
  /** Optional attached chip under the body (e.g. a streak). */
  attach?: FeedPostAttach;
  /** Like / comment counts + liked state. */
  engagement?: FeedPostEngagement;
}

const DEFAULT_AUTHOR: FeedPostAuthor = {
  name: 'Jordan D',
  handle: '@jordan_d',
  initials: 'JD',
  verified: true,
};

const DEFAULT_BODY: ReactNode = (
  <>
    Hit a <span className="lk-post-tag">#sleepstreak</span> 😴 — energy&rsquo;s up 18% this week. The 10pm
    wind-down alarm changed everything.
  </>
);

const DEFAULT_ATTACH: FeedPostAttach = { label: '🔥 14-day streak', tone: 'mid', dot: true };

const DEFAULT_ENGAGEMENT: FeedPostEngagement = { likes: 42, comments: 8, liked: true };

/** Community feed post — gradient-avatar header (name, handle, time), body with an
 *  attached streak chip, and a like / comment / share / save engagement footer.
 *  Renders the showcase example by default. */
export function FeedPost({
  author = DEFAULT_AUTHOR,
  time = '2h',
  body = DEFAULT_BODY,
  attach = DEFAULT_ATTACH,
  engagement = DEFAULT_ENGAGEMENT,
  className,
  ...rest
}: FeedPostProps) {
  return (
    <article className={cn('lk-card', 'lk-hover', 'lk-post', className)} {...rest}>
      <div className="lk-post-head">
        <div className="lk-post-av" aria-hidden="true">
          {author.initials}
        </div>
        <div className="lk-post-id">
          <div className="lk-post-pn">
            {author.name}
            {author.verified && (
              <svg className="lk-post-verified" viewBox="0 0 24 24" aria-label="verified">
                <path d="M9 12l2 2 4-4" />
                <circle cx="12" cy="12" r="9" />
              </svg>
            )}
          </div>
          <div className="lk-post-ph">
            {author.handle}
            <span className="lk-post-ts">{time}</span>
          </div>
        </div>
      </div>

      <p className="lk-post-text">{body}</p>

      {attach && (
        <div className="lk-post-attach">
          <Chip tone={attach.tone ?? 'mid'} dot={attach.dot}>
            {attach.label}
          </Chip>
        </div>
      )}

      <div className="lk-post-foot">
        <button
          type="button"
          className={cn('lk-post-react', 'lk-post-like', engagement.liked && 'lk-post-on')}
          aria-pressed={engagement.liked}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" />
          </svg>
          <span className="lk-post-cnt lk-mono lk-tnum">{engagement.likes}</span>
        </button>
        <button type="button" className="lk-post-react">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 21l2.1-5.4A8.5 8.5 0 1 1 21 11.5z" />
          </svg>
          <span className="lk-post-cnt lk-mono lk-tnum">{engagement.comments}</span>
        </button>
        <button type="button" className="lk-post-react lk-post-share">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v13" />
          </svg>
          <span className="lk-post-cnt lk-mono">Share</span>
        </button>
        <button type="button" className="lk-post-react lk-post-save" aria-label="Save">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>
    </article>
  );
}
