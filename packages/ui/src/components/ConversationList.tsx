import { type HTMLAttributes } from 'react';
import { cn } from '../cn';

/** Avatar gradient token — paints the rounded avatar tile background. */
export type ConvAvatar = 'violet' | 'cta';

export interface ConvThread {
  /** Display name, e.g. 'Coach Mara'. */
  name: string;
  /** Avatar initials, e.g. 'CM'. Omit on group threads to show the group glyph. */
  initials?: string;
  /** Last-message preview line. */
  preview: string;
  /** Sender prefix on group previews, e.g. 'Ava:'. */
  from?: string;
  /** Relative time, e.g. '14m'. */
  time: string;
  /** Unread count → gradient pill; bolds the preview too. */
  unread?: number;
  /** Online → glowing teal presence dot (else a faint idle dot). */
  online?: boolean;
  /** E2EE thread → lock badge on the avatar + inline "Encrypted" chip. */
  encrypted?: boolean;
  /** Verified contact → accent tick beside the name. */
  verified?: boolean;
  /** Group thread → renders the group-people glyph instead of initials. */
  group?: boolean;
  /** Highlight the row as the currently-open thread. */
  active?: boolean;
  /** Avatar gradient (default 'violet'). */
  avatar?: ConvAvatar;
}

export interface ConvFollow {
  /** Button label, e.g. 'Follow' / 'Following ✓'. */
  label: string;
  /** Following state → glass + teal toggle styling. */
  following?: boolean;
}

export interface ConversationListProps extends HTMLAttributes<HTMLDivElement> {
  /** Thread rows. */
  threads?: ConvThread[];
  /** Follow / Following toggle button pair under the list. */
  follows?: ConvFollow[];
}

const AVATAR_GRAD: Record<ConvAvatar, string> = {
  violet: 'var(--grad-violet)',
  cta: 'var(--grad-cta)',
};

const DEFAULT_THREADS: ConvThread[] = [
  {
    name: 'Coach Mara',
    initials: 'CM',
    preview: "Let's push the morning walk",
    time: '14m',
    unread: 2,
    online: true,
    encrypted: true,
    verified: true,
    active: true,
    avatar: 'violet',
  },
  {
    name: 'Leo P',
    initials: 'LP',
    preview: 'Nice streak!',
    time: '1h',
    avatar: 'cta',
  },
  {
    name: 'Recovery Squad',
    preview: "who's plunging?",
    from: 'Ava:',
    time: '3h',
    unread: 5,
    group: true,
    avatar: 'violet',
  },
];

const DEFAULT_FOLLOWS: ConvFollow[] = [
  { label: 'Follow' },
  { label: 'Following ✓', following: true },
];

/** Lock glyph used for the avatar E2EE badge and the inline "Encrypted" chip. */
function LockGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

/** Group-people glyph shown on group threads in place of initials. */
function GroupGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="9" cy="9" r="3" />
      <path d="M3 20a6 6 0 0 1 12 0" />
      <path d="M16 7a3 3 0 0 1 0 6M21 20a6 6 0 0 0-5-5.9" />
    </svg>
  );
}

/** Conversation list — DM/thread rows with a gradient avatar (online presence dot + E2EE
 *  lock badge), name (+ verified tick), last-message preview, time + unread count pill, an
 *  inline "Encrypted" chip on encrypted threads, plus a Follow / Following toggle pair.
 *  Renders the showcase example by default. */
export function ConversationList({
  threads = DEFAULT_THREADS,
  follows = DEFAULT_FOLLOWS,
  className,
  ...rest
}: ConversationListProps) {
  return (
    <div className={cn('lk-conv', className)} {...rest}>
      {threads.map((t, i) => {
        const unread = (t.unread ?? 0) > 0;
        return (
          <button key={i} type="button" className={cn('lk-conv-row', t.active && 'lk-conv-active')}>
            <span
              className="lk-conv-av"
              style={{ background: AVATAR_GRAD[t.avatar ?? 'violet'] }}
              aria-hidden="true"
            >
              {t.group ? <GroupGlyph /> : t.initials}
              <span className={cn('lk-conv-dot', t.online && 'lk-conv-online')} />
              {t.encrypted && (
                <span className="lk-conv-lock">
                  <LockGlyph />
                </span>
              )}
            </span>
            <span className="lk-conv-meta">
              <span className="lk-conv-name">
                {t.name}
                {t.verified && (
                  <svg className="lk-conv-vtick" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M9 12l2 2 4-4" />
                    <path d="M12 2 4 5v6c0 5 3.4 8.7 8 11 4.6-2.3 8-6 8-11V5z" />
                  </svg>
                )}
              </span>
              <span className={cn('lk-conv-preview', unread && 'lk-conv-unread')}>
                {t.from && <span className="lk-conv-from">{t.from} </span>}
                {t.preview}
              </span>
              {t.encrypted && (
                <span className="lk-conv-e2ee lk-mono">
                  <LockGlyph />
                  Encrypted
                </span>
              )}
            </span>
            <span className="lk-conv-right">
              <span className="lk-conv-time lk-mono">{t.time}</span>
              {unread && <span className="lk-conv-badge lk-mono">{t.unread}</span>}
            </span>
          </button>
        );
      })}
      {follows.length > 0 && (
        <div className="lk-conv-follows">
          {follows.map((f, i) => (
            <button
              key={i}
              type="button"
              className={cn('lk-conv-follow', f.following && 'lk-conv-following')}
            >
              {!f.following && (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              )}
              {f.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
