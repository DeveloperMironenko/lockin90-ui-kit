import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';

/** Notification kind — drives the leading icon's color + glyph. */
export type NotifType = 'insight' | 'coach' | 'sync';

export interface NotifFilter {
  /** Pill label, e.g. 'All'. */
  label: string;
  /** Count badge shown after the label. */
  count: number;
  /** Active pill paints the gradient. */
  active?: boolean;
}

export interface NotifAction {
  /** Button label, e.g. 'View insight'. */
  label: string;
  /** `primary` paints the gradient CTA; default is the glass button. */
  kind?: 'primary' | 'default';
}

export interface NotifItem {
  /** Notification kind, drives the leading icon. */
  type: NotifType;
  /** Headline. */
  title: string;
  /** One-line body; ReactNode so consumers can pass <b>…</b> emphasis. */
  snippet: ReactNode;
  /** Relative time, e.g. '2m'. */
  time: string;
  /** Unread → tinted bg, accent rail + leading dot. */
  unread?: boolean;
  /** Optional inline action button under the body. */
  action?: NotifAction;
}

export interface NotificationCenterProps extends HTMLAttributes<HTMLDivElement> {
  /** Filter pill row above the list. */
  filters?: NotifFilter[];
  /** Notification rows. */
  items?: NotifItem[];
}

const TYPE_CLASS: Record<NotifType, string> = {
  insight: 'lk-notif-t-insight',
  coach: 'lk-notif-t-coach',
  sync: 'lk-notif-t-sync',
};

const TYPE_ICON: Record<NotifType, ReactNode> = {
  insight: <path d="M9 18h6M10 21h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2v.3h6v-.3c0-.8.4-1.5 1-2A7 7 0 0 0 12 2Z" />,
  coach: <path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9 9 0 0 1-3.7-.8L3 21l1.3-4A8.5 8.5 0 1 1 21 11.5Z" />,
  sync: <path d="M21 12a9 9 0 1 1-3-6.7M21 4v4h-4" />,
};

const DEFAULT_FILTERS: NotifFilter[] = [
  { label: 'All', count: 6, active: true },
  { label: 'Insights', count: 3 },
  { label: 'Coach', count: 2 },
  { label: 'System', count: 1 },
];

const DEFAULT_ITEMS: NotifItem[] = [
  {
    type: 'insight',
    title: 'New insight',
    snippet: (
      <>
        Late caffeine is costing you <b>~9 pts</b> of recovery — try a 2pm cutoff.
      </>
    ),
    time: '2m',
    unread: true,
    action: { label: 'View insight', kind: 'primary' },
  },
  {
    type: 'coach',
    title: 'Coach Mara replied',
    snippet: '"Nice work on the sleep streak — let’s push the morning walk next."',
    time: '14m',
    unread: true,
    action: { label: 'Reply' },
  },
  {
    type: 'sync',
    title: 'Oura synced',
    snippet: (
      <>
        Recovery <b>81%</b> · last night&rsquo;s data is in and scored.
      </>
    ),
    time: '1h',
  },
  {
    type: 'insight',
    title: 'Weekly report ready',
    snippet: (
      <>
        Your <b>Jun 9–15</b> summary is in — energy trended up 6%.
      </>
    ),
    time: '3h',
  },
];

/** Action-button glyph: arrow for the primary CTA, chat bubble for a reply. */
function actionIcon(kind: NotifAction['kind']): ReactNode {
  return kind === 'primary' ? (
    <path d="M5 12h14M13 6l6 6-6 6" />
  ) : (
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
  );
}

/** Notification center — scrollable filter pills with count badges (active = gradient)
 *  over notification rows. Unread rows get a tinted bg, accent rail + dot, optional inline
 *  action. Renders the showcase example by default. */
export function NotificationCenter({
  filters = DEFAULT_FILTERS,
  items = DEFAULT_ITEMS,
  className,
  ...rest
}: NotificationCenterProps) {
  return (
    <div className={cn('lk-notif', className)} {...rest}>
      <div className="lk-notif-filters">
        {filters.map((f, i) => (
          <button key={i} type="button" className={cn('lk-notif-filter', f.active && 'lk-notif-active')}>
            {f.label} <span className="lk-notif-fc lk-mono">{f.count}</span>
          </button>
        ))}
      </div>
      <div className="lk-notif-list">
        {items.map((it, i) => (
          <article
            key={i}
            className={cn('lk-notif-row', it.unread ? 'lk-notif-unread' : 'lk-notif-read')}
          >
            <div className={cn('lk-notif-ico', TYPE_CLASS[it.type])}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                {TYPE_ICON[it.type]}
              </svg>
            </div>
            <div className="lk-notif-body">
              <div className="lk-notif-top">
                {it.unread && <span className="lk-notif-dot" />}
                <span className="lk-notif-title lk-display">{it.title}</span>
                <span className="lk-notif-time lk-mono">{it.time}</span>
              </div>
              <p className="lk-notif-snippet">{it.snippet}</p>
              {it.action && (
                <div className="lk-notif-meta">
                  <button
                    type="button"
                    className={cn('lk-notif-act', it.action.kind === 'primary' && 'lk-notif-primary')}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      {actionIcon(it.action.kind)}
                    </svg>
                    {it.action.label}
                  </button>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
