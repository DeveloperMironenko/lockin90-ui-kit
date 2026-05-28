'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavLinkProps } from './types';

function Icon({ name, active }: { name: NavLinkProps['icon']; active: boolean }) {
  const c = active ? '#FFFFFF' : '#555555';
  const s = 20;
  if (name === 'bolt') return (
    <svg width={s} height={s} viewBox="0 0 22 22" fill="none">
      <path d="M13 2 L4 12 H10 L8 20 L18 9 H12 L13 2 Z" fill={c} stroke={c} strokeWidth="0.8" strokeLinejoin="round"/>
    </svg>
  );
  if (name === 'link') return (
    <svg width={s} height={s} viewBox="0 0 22 22" fill="none">
      <path d="M8 14 L14 8" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M9.5 6.5 L13 3 A4 4 0 0 1 19 9 L15.5 12.5" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M12.5 15.5 L9 19 A4 4 0 0 1 3 13 L6.5 9.5" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
  if (name === 'grid') return (
    <svg width={s} height={s} viewBox="0 0 22 22" fill="none">
      <rect x="3" y="11" width="3" height="8" stroke={c} strokeWidth="1.6"/>
      <rect x="9.5" y="5" width="3" height="14" stroke={c} strokeWidth="1.6"/>
      <rect x="16" y="9" width="3" height="10" stroke={c} strokeWidth="1.6"/>
    </svg>
  );
  if (name === 'plus') return (
    <svg width={s} height={s} viewBox="0 0 22 22" fill="none">
      <path d="M11 4 V18 M4 11 H18" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
  if (name === 'heart') return (
    <svg width={s} height={s} viewBox="0 0 22 22" fill="none">
      <path d="M11 18 C 4 13, 3 9, 5.5 7 C 8 5, 11 7, 11 9 C 11 7, 14 5, 16.5 7 C 19 9, 18 13, 11 18 Z" stroke={c} strokeWidth="1.6" strokeLinejoin="round"/>
    </svg>
  );
  if (name === 'dumbbell') return (
    <svg width={s} height={s} viewBox="0 0 22 22" fill="none">
      <rect x="2" y="8" width="2.5" height="6" stroke={c} strokeWidth="1.5"/>
      <rect x="17.5" y="8" width="2.5" height="6" stroke={c} strokeWidth="1.5"/>
      <path d="M4.5 11 H17.5" stroke={c} strokeWidth="2"/>
    </svg>
  );
  if (name === 'scale') return (
    <svg width={s} height={s} viewBox="0 0 22 22" fill="none">
      <rect x="3" y="5" width="16" height="13" stroke={c} strokeWidth="1.6" rx="1"/>
      <path d="M11 8 L11 14 M8 11 L14 11" stroke={c} strokeWidth="1.4"/>
    </svg>
  );
  if (name === 'moon') return (
    <svg width={s} height={s} viewBox="0 0 22 22" fill="none">
      <path d="M16 13 A 7 7 0 1 1 9 4 A 5.5 5.5 0 0 0 16 13 Z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
  if (name === 'calendar') return (
    <svg width={s} height={s} viewBox="0 0 22 22" fill="none">
      <rect x="3.5" y="5" width="15" height="14" stroke={c} strokeWidth="1.6" rx="1"/>
      <path d="M3.5 9 H18.5 M7 3 V6 M15 3 V6" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
  if (name === 'alert') return (
    <svg width={s} height={s} viewBox="0 0 22 22" fill="none">
      <path d="M11 3 L19 18 H3 L11 3 Z" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M11 9 V13 M11 16 V16.4" stroke={c} strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
  if (name === 'book') return (
    <svg width={s} height={s} viewBox="0 0 22 22" fill="none">
      <path d="M4 4 H10 A 2 2 0 0 1 12 6 V19 A 1.5 1.5 0 0 0 13.5 17.5 H18 V4 H13 A 2 2 0 0 0 11 6" stroke={c} strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
      <path d="M4 4 V17.5 H10" stroke={c} strokeWidth="1.5" fill="none"/>
    </svg>
  );
  if (name === 'gear') return (
    <svg width={s} height={s} viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="3" stroke={c} strokeWidth="1.5"/>
      <path d="M11 2 V5 M11 17 V20 M2 11 H5 M17 11 H20 M4.5 4.5 L6.5 6.5 M15.5 15.5 L17.5 17.5 M4.5 17.5 L6.5 15.5 M15.5 6.5 L17.5 4.5" stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
  if (name === 'inbox') return (
    <svg width={s} height={s} viewBox="0 0 22 22" fill="none">
      <path d="M3 4 H19 V13 H14 L13 15 H9 L8 13 H3 Z" stroke={c} strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
      <path d="M5 4 V11 M17 4 V11" stroke={c} strokeWidth="1.5"/>
    </svg>
  );
  return (
    <svg width={s} height={s} viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="8.5" r="3.2" stroke={c} strokeWidth="1.6"/>
      <path d="M3.5 19 Q11 13, 18.5 19" stroke={c} strokeWidth="1.6" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

export default function NavLink({ href, icon, children, badge }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + '/');

  // Cap the displayed badge at 99 so it can't push the layout. Hidden when undefined / 0.
  const showBadge = typeof badge === 'number' && badge > 0;
  const badgeLabel = showBadge ? (badge > 99 ? '99+' : String(badge)) : null;

  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 py-[10px] px-3 rounded relative no-underline font-display italic font-bold text-[13px] tracking-[0.1em] uppercase transition-all duration-200 ${
        isActive
          ? 'bg-elevated border border-border text-white'
          : 'bg-transparent border border-transparent text-muted'
      }`}
    >
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent rounded-r-sm" />
      )}
      <Icon name={icon} active={isActive} />
      <span className="flex-1">{children}</span>
      {badgeLabel && (
        <span
          data-testid="navlink-badge"
          className="ml-auto inline-flex items-center justify-center min-w-[20px] h-[18px] px-1.5 rounded-full bg-accent text-white font-mono not-italic font-bold text-[10px] tracking-normal"
        >
          {badgeLabel}
        </span>
      )}
    </Link>
  );
}
