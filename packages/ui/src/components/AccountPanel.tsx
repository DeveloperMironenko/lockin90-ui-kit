import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';
import { Chip, type ChipTone } from './Chip';

/** Built-in row icon keys — each maps to a stroked 24×24 glyph. */
export type AccountRowIcon = 'bell' | 'lock' | 'link' | 'trash' | 'sliders' | 'devices' | 'logout';

/** One settings row: leading icon + title/subtitle + trailing chevron. */
export interface AccountRow {
  /** Stable key for the row. */
  key: string;
  /** Built-in icon glyph (or pass `node` for a custom one). */
  icon?: AccountRowIcon;
  /** Custom leading icon node — overrides `icon` when set. */
  node?: ReactNode;
  /** Row title, e.g. "Notifications". */
  title: string;
  /** Mono-tone subtitle / current value, e.g. "Push, email, quiet hours". */
  subtitle?: string;
  /** Destructive styling (red) — for delete / sign out. */
  danger?: boolean;
  /** Link target — renders an `<a>` when set, otherwise a `<button>`. */
  href?: string;
  /** Click handler (used for the `<button>` form). */
  onSelect?: () => void;
}

/** Identity shown in the hero. */
export interface AccountUser {
  /** Display name. */
  name?: string;
  /** Initials for the avatar (falls back to first two letters of `name`). */
  initials?: string;
  /** Email address. */
  email?: string;
  /** Whether the email is verified — shows the mint "verified" pill. */
  verified?: boolean;
  /** Plan label, e.g. "Pro". */
  plan?: string;
  /** Optional secondary role chip, e.g. "Coach". */
  role?: string;
  /** Mono "member since" line, e.g. "member since Apr 2024". */
  since?: string;
  /** Short user id line, e.g. "user · #41207". */
  uid?: string;
}

export interface AccountPanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Identity rendered in the hero card. */
  user?: AccountUser;
  /** Settings rows rendered below the hero. */
  rows?: AccountRow[];
  /** Plan chip tone. */
  planTone?: ChipTone;
  /** Show the camera badge on the avatar. */
  editableAvatar?: boolean;
  /** Edit-profile button handler — omit to hide the button. */
  onEditProfile?: () => void;
}

/** Stroked 24×24 glyphs keyed by `AccountRowIcon`. */
const ICONS: Record<AccountRowIcon, ReactNode> = {
  bell: (
    <>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.5 21a2 2 0 0 0 3 0" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  link: (
    <>
      <path d="M9 15l6-6" />
      <path d="M7 11l-2 2a3 3 0 0 0 4 4l2-2" />
      <path d="M17 13l2-2a3 3 0 0 0-4-4l-2 2" />
    </>
  ),
  trash: <path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" />,
  sliders: (
    <>
      <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3" />
      <path d="M1 14h6M9 8h6M17 16h6" />
    </>
  ),
  devices: (
    <>
      <rect x="2" y="4" width="14" height="11" rx="2" />
      <path d="M8 19h6M11 15v4" />
      <rect x="16" y="9" width="6" height="11" rx="1.5" />
    </>
  ),
  logout: (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5M21 12H9" />
    </>
  ),
};

const CHEVRON = <path d="M9 6l6 6-6 6" />;

/** Default settings rows matching the design example. */
const DEFAULT_ROWS: AccountRow[] = [
  { key: 'notifications', icon: 'bell', title: 'Notifications', subtitle: 'Push, email, quiet hours', href: '#notifications' },
  { key: 'privacy', icon: 'lock', title: 'Privacy & data', subtitle: 'Sharing, exports, deletion', href: '#privacy' },
  { key: 'connected', icon: 'link', title: 'Connected accounts', subtitle: '3 connected', href: '#connected' },
  { key: 'delete', icon: 'trash', title: 'Delete account', subtitle: 'Permanently erase your data', danger: true, href: '#delete' },
];

const DEFAULT_USER: AccountUser = {
  name: 'Marcus Kane',
  initials: 'MK',
  email: 'marcus@example.com',
  verified: true,
  plan: 'Pro',
  role: 'Coach',
  since: 'member since Apr 2024',
  uid: 'user · #41207',
};

/** Resolve the avatar initials from explicit prop or the name. */
function initialsFor(user: AccountUser): string {
  if (user.initials) return user.initials;
  return (user.name ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');
}

/**
 * Account / settings surface: an avatar hero (initials avatar + name + plan/role
 * chips + verified email + edit/uid aside) over a stack of grouped settings rows
 * (icon + title/subtitle + chevron), with a danger variant for destructive rows.
 */
export function AccountPanel({
  user = DEFAULT_USER,
  rows = DEFAULT_ROWS,
  planTone = 'accent',
  editableAvatar = true,
  onEditProfile,
  className,
  ...rest
}: AccountPanelProps) {
  return (
    <div className={cn('lk-acct', className)} {...rest}>
      <div className="lk-acct-hero">
        <div className="lk-acct-av" aria-hidden="true">
          {initialsFor(user)}
          {editableAvatar && (
            <span className="lk-acct-cam" title="Change avatar">
              <svg viewBox="0 0 24 24">
                <path d="M14.5 4h-5L8 6H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-4z" />
                <circle cx="12" cy="13" r="3.5" />
              </svg>
            </span>
          )}
        </div>

        <div>
          <div className="lk-acct-name">{user.name}</div>
          <div className="lk-acct-meta">
            {user.plan && (
              <Chip tone={planTone} dot>
                {user.plan}
              </Chip>
            )}
            {user.role && <Chip tone="high">{user.role}</Chip>}
            {user.since && <span className="lk-chip lk-mono lk-acct-since">{user.since}</span>}
          </div>
          {user.email && (
            <div className="lk-acct-email">
              {user.email}
              {user.verified && (
                <span className="lk-acct-verified" title="Email verified">
                  <svg viewBox="0 0 24 24">
                    <path d="M5 12l5 5L20 6" />
                  </svg>
                  verified
                </span>
              )}
            </div>
          )}
        </div>

        <div className="lk-acct-aside">
          {onEditProfile && (
            <button className="lk-acct-edit" type="button" onClick={onEditProfile}>
              <svg viewBox="0 0 24 24">
                <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
              </svg>{' '}
              Edit profile
            </button>
          )}
          {user.uid && <span className="lk-acct-uid">{user.uid}</span>}
        </div>
      </div>

      <div className="lk-acct-rows">
        {rows.map((row) => {
          const inner = (
            <>
              <span className="lk-acct-ico">
                <svg viewBox="0 0 24 24">{row.node ?? (row.icon ? ICONS[row.icon] : null)}</svg>
              </span>
              <span className="lk-acct-main">
                <div className="lk-acct-t">{row.title}</div>
                {row.subtitle && <div className="lk-acct-s">{row.subtitle}</div>}
              </span>
              <span className="lk-acct-arr">
                <svg viewBox="0 0 24 24">{CHEVRON}</svg>
              </span>
            </>
          );
          const cls = cn('lk-acct-row', row.danger && 'lk-acct-danger');
          return row.href ? (
            <a key={row.key} className={cls} href={row.href}>
              {inner}
            </a>
          ) : (
            <button key={row.key} className={cls} type="button" onClick={row.onSelect}>
              {inner}
            </button>
          );
        })}
      </div>
    </div>
  );
}
