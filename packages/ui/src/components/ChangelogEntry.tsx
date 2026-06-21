import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../cn';
import { Chip } from './Chip';

/** One change-type bucket. Each bullet is a ReactNode so consumers can pass
 *  `<b>…</b>` emphasis inside a line. */
export interface ChangelogGroups {
  /** brand-new capabilities (mint) */
  new?: ReactNode[];
  /** refinements to existing behavior (cyan) */
  improved?: ReactNode[];
  /** bug fixes (amber) */
  fixed?: ReactNode[];
}

export interface ChangelogEntryProps extends HTMLAttributes<HTMLDivElement> {
  /** release version, e.g. '1.8.0' */
  version?: string;
  /** human-readable release date, e.g. 'Jun 18, 2026' */
  date?: string;
  /** affected platform/service shown as a chip, e.g. 'Frontend' */
  platform?: string;
  /** optional release codename, e.g. 'Aurora' */
  codename?: string;
  /** grouped bullets under New / Improved / Fixed */
  groups?: ChangelogGroups;
}

type GroupKey = 'new' | 'improved' | 'fixed';

const GROUP_META: Record<GroupKey, { label: string; icon: ReactNode }> = {
  new: { label: 'New', icon: <path d="M12 5v14M5 12h14" strokeLinecap="round" /> },
  improved: {
    label: 'Improved',
    icon: <path d="M12 3l2.2 6.6H21l-5.4 4 2.1 6.6L12 16l-5.7 4.2 2.1-6.6L3 9.6h6.8z" strokeLinejoin="round" />,
  },
  fixed: { label: 'Fixed', icon: <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /> },
};

const GROUP_ORDER: GroupKey[] = ['new', 'improved', 'fixed'];

const DEFAULT_GROUPS: ChangelogGroups = {
  new: [
    <>
      <b>Energy forecast</b> projects your next 7 days from logged events.
    </>,
    <>
      <b>Snap &amp; log</b> meals from a photo with one tap.
    </>,
  ],
  improved: [
    <>
      Dashboard <b>loads 40% faster</b> on first paint.
    </>,
    <>Smoother score-ring animation on the home screen.</>,
  ],
  fixed: [
    <>
      Calendar no longer skips <b>DST transition</b> days.
    </>,
  ],
};

/** Changelog entry — a "what's new" release card: gradient version, platform
 *  chip + codename, date, and grouped New / Improved / Fixed bullet lists.
 *  Renders the showcase release by default. */
export function ChangelogEntry({
  version = '1.8.0',
  date = 'Jun 18, 2026',
  platform = 'Frontend',
  codename = 'Aurora',
  groups = DEFAULT_GROUPS,
  className,
  ...rest
}: ChangelogEntryProps) {
  return (
    <article className={cn('lk-card', 'lk-rel', className)} {...rest}>
      <div className="lk-rel-top">
        <span className="lk-rel-ver lk-display lk-tnum">{version}</span>
        <div className="lk-rel-headmeta">
          {platform && (
            <div className="lk-rel-tags">
              <Chip tone="accent">{platform}</Chip>
            </div>
          )}
          {codename && (
            <p className="lk-rel-codename">
              Codename <b>{codename}</b>
            </p>
          )}
        </div>
        {date && <span className="lk-rel-date lk-mono">{date}</span>}
      </div>

      <div className="lk-rel-changes">
        {GROUP_ORDER.map((key) => {
          const items = groups?.[key];
          if (!items || items.length === 0) return null;
          const meta = GROUP_META[key];
          return (
            <div key={key} className={cn('lk-rel-group', `lk-${key}`)}>
              <div className="lk-rel-group-head">
                <span className="lk-rel-group-ico">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    {meta.icon}
                  </svg>
                </span>
                <span className="lk-rel-group-name">{meta.label}</span>
                <span className="lk-rel-group-count lk-tnum">{items.length}</span>
              </div>
              <ul className="lk-rel-list">
                {items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </article>
  );
}
