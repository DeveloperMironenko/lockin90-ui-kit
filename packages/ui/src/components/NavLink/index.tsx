import type { CSSProperties, ReactNode } from 'react';
import { cn } from '../../cn';
import type { NavLinkIcon, NavLinkProps } from './types';

export type { NavLinkIcon, NavLinkProps } from './types';

const ICON_NAMES: ReadonlySet<string> = new Set([
  'bolt',
  'link',
  'grid',
  'circle',
  'plus',
  'heart',
  'dumbbell',
  'scale',
  'moon',
  'calendar',
  'alert',
  'book',
  'gear',
  'inbox',
]);

function isIconName(icon: NavLinkProps['icon']): icon is NavLinkIcon {
  return typeof icon === 'string' && ICON_NAMES.has(icon);
}

/** Built-in line-icon set. Uses `currentColor` so it inherits the link's color. */
function NavIcon({ name }: { name: NavLinkIcon }) {
  const s = 20;
  const c = 'currentColor';
  switch (name) {
    case 'bolt':
      return (
        <svg width={s} height={s} viewBox="0 0 22 22" fill="none" aria-hidden>
          <path d="M13 2 L4 12 H10 L8 20 L18 9 H12 L13 2 Z" fill={c} stroke={c} strokeWidth="0.8" strokeLinejoin="round" />
        </svg>
      );
    case 'link':
      return (
        <svg width={s} height={s} viewBox="0 0 22 22" fill="none" aria-hidden>
          <path d="M8 14 L14 8" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M9.5 6.5 L13 3 A4 4 0 0 1 19 9 L15.5 12.5" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M12.5 15.5 L9 19 A4 4 0 0 1 3 13 L6.5 9.5" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'grid':
      return (
        <svg width={s} height={s} viewBox="0 0 22 22" fill="none" aria-hidden>
          <rect x="3" y="11" width="3" height="8" stroke={c} strokeWidth="1.6" />
          <rect x="9.5" y="5" width="3" height="14" stroke={c} strokeWidth="1.6" />
          <rect x="16" y="9" width="3" height="10" stroke={c} strokeWidth="1.6" />
        </svg>
      );
    case 'plus':
      return (
        <svg width={s} height={s} viewBox="0 0 22 22" fill="none" aria-hidden>
          <path d="M11 4 V18 M4 11 H18" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'heart':
      return (
        <svg width={s} height={s} viewBox="0 0 22 22" fill="none" aria-hidden>
          <path d="M11 18 C 4 13, 3 9, 5.5 7 C 8 5, 11 7, 11 9 C 11 7, 14 5, 16.5 7 C 19 9, 18 13, 11 18 Z" stroke={c} strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );
    case 'dumbbell':
      return (
        <svg width={s} height={s} viewBox="0 0 22 22" fill="none" aria-hidden>
          <rect x="2" y="8" width="2.5" height="6" stroke={c} strokeWidth="1.5" />
          <rect x="17.5" y="8" width="2.5" height="6" stroke={c} strokeWidth="1.5" />
          <path d="M4.5 11 H17.5" stroke={c} strokeWidth="2" />
        </svg>
      );
    case 'scale':
      return (
        <svg width={s} height={s} viewBox="0 0 22 22" fill="none" aria-hidden>
          <rect x="3" y="5" width="16" height="13" stroke={c} strokeWidth="1.6" rx="1" />
          <path d="M11 8 L11 14 M8 11 L14 11" stroke={c} strokeWidth="1.4" />
        </svg>
      );
    case 'moon':
      return (
        <svg width={s} height={s} viewBox="0 0 22 22" fill="none" aria-hidden>
          <path d="M16 13 A 7 7 0 1 1 9 4 A 5.5 5.5 0 0 0 16 13 Z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      );
    case 'calendar':
      return (
        <svg width={s} height={s} viewBox="0 0 22 22" fill="none" aria-hidden>
          <rect x="3.5" y="5" width="15" height="14" stroke={c} strokeWidth="1.6" rx="1" />
          <path d="M3.5 9 H18.5 M7 3 V6 M15 3 V6" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'alert':
      return (
        <svg width={s} height={s} viewBox="0 0 22 22" fill="none" aria-hidden>
          <path d="M11 3 L19 18 H3 L11 3 Z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M11 9 V13 M11 16 V16.4" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case 'book':
      return (
        <svg width={s} height={s} viewBox="0 0 22 22" fill="none" aria-hidden>
          <path d="M4 4 H10 A 2 2 0 0 1 12 6 V19 A 1.5 1.5 0 0 0 13.5 17.5 H18 V4 H13 A 2 2 0 0 0 11 6" stroke={c} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
          <path d="M4 4 V17.5 H10" stroke={c} strokeWidth="1.5" fill="none" />
        </svg>
      );
    case 'gear':
      return (
        <svg width={s} height={s} viewBox="0 0 22 22" fill="none" aria-hidden>
          <circle cx="11" cy="11" r="3" stroke={c} strokeWidth="1.5" />
          <path d="M11 2 V5 M11 17 V20 M2 11 H5 M17 11 H20 M4.5 4.5 L6.5 6.5 M15.5 15.5 L17.5 17.5 M4.5 17.5 L6.5 15.5 M15.5 6.5 L17.5 4.5" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case 'inbox':
      return (
        <svg width={s} height={s} viewBox="0 0 22 22" fill="none" aria-hidden>
          <path d="M3 4 H19 V13 H14 L13 15 H9 L8 13 H3 Z" stroke={c} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
          <path d="M5 4 V11 M17 4 V11" stroke={c} strokeWidth="1.5" />
        </svg>
      );
    case 'circle':
    default:
      return (
        <svg width={s} height={s} viewBox="0 0 22 22" fill="none" aria-hidden>
          <circle cx="11" cy="8.5" r="3.2" stroke={c} strokeWidth="1.6" />
          <path d="M3.5 19 Q11 13, 18.5 19" stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </svg>
      );
  }
}

/**
 * Sidebar navigation link. Active state shows a glowing left accent bar.
 * Router-free — renders a plain `<a href>`; the app supplies `active`.
 */
export default function NavLink({
  href,
  active = false,
  icon,
  label,
  children,
  badge,
  onClick,
  className,
}: NavLinkProps) {
  const showBadge = typeof badge === 'number' && badge > 0;
  const badgeLabel = showBadge ? (badge > 99 ? '99+' : String(badge)) : null;
  const content: ReactNode = children ?? label;

  const style: CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    borderRadius: 'var(--r-sm)',
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: active ? 600 : 500,
    color: active ? 'var(--text)' : 'var(--text-dim)',
    background: active ? 'var(--glass)' : 'transparent',
    border: '1px solid',
    borderColor: active ? 'var(--border)' : 'transparent',
    transition:
      'background 0.25s var(--ease), color 0.25s var(--ease), border-color 0.25s var(--ease)',
  };

  return (
    <a
      href={href}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cn(className)}
      style={style}
    >
      {active && (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 2,
            height: 20,
            borderRadius: '0 2px 2px 0',
            background: 'var(--accent)',
          }}
        />
      )}
      {icon != null && (
        <span aria-hidden style={{ display: 'inline-flex', flexShrink: 0 }}>
          {isIconName(icon) ? <NavIcon name={icon} /> : icon}
        </span>
      )}
      <span style={{ flex: 1 }}>{content}</span>
      {badgeLabel && (
        <span
          data-testid="navlink-badge"
          style={{
            marginLeft: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 20,
            height: 18,
            padding: '0 6px',
            borderRadius: 'var(--r-pill)',
            background: 'var(--accent)',
            color: '#fff',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: 10,
          }}
        >
          {badgeLabel}
        </span>
      )}
    </a>
  );
}
