'use client';

import type { ReactNode } from 'react';
import { cn } from '../../cn';

export interface NavItemProps {
  /** Leading icon (typically an inline `<svg>` or an icon node). */
  icon?: ReactNode;
  /** The nav label. */
  children: ReactNode;
  /** Destination — renders as a plain `<a href>` (no router dependency). */
  href?: string;
  /** Active/current page — shows the left accent bar and lit background. */
  active?: boolean;
  /** Inert "coming soon" item — dimmed, non-interactive, rendered as a `<span>`. */
  disabled?: boolean;
  /** Optional trailing count badge (rendered in `lk-nav-badge`). */
  badge?: ReactNode;
  onClick?: () => void;
  className?: string;
}

/** Sidebar navigation link. Active state shows a glowing left accent bar. */
export default function NavItem({
  icon,
  children,
  href,
  active = false,
  disabled = false,
  badge,
  onClick,
  className,
}: NavItemProps) {
  const content = (
    <>
      {icon}
      <span>{children}</span>
      {badge != null && <span className="lk-nav-badge">{badge}</span>}
    </>
  );

  // Inert item — a non-link span, mirroring the disabled TabBar item.
  if (disabled) {
    return (
      <span className={cn('lk-nav-item', 'lk-disabled', className)} aria-disabled="true">
        {content}
      </span>
    );
  }

  return (
    <a
      className={cn('lk-nav-item', active && 'lk-active', className)}
      href={href}
      aria-current={active ? 'page' : undefined}
      onClick={onClick}
    >
      {content}
    </a>
  );
}
