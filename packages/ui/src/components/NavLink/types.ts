import type { ReactNode } from 'react';

export type NavLinkIcon =
  | 'bolt'
  | 'link'
  | 'grid'
  | 'circle'
  | 'plus'
  | 'heart'
  | 'dumbbell'
  | 'scale'
  | 'moon'
  | 'calendar'
  | 'alert'
  | 'book'
  | 'gear'
  | 'inbox';

export interface NavLinkProps {
  /** Destination — renders as a plain `<a href>` (no router dependency). */
  href: string;
  /**
   * Active/current page — shows the left accent bar and lit background.
   * Router-free: the consuming app computes this (e.g. from `usePathname`).
   */
  active?: boolean;
  /** Built-in icon name, or any custom icon node. */
  icon?: NavLinkIcon | ReactNode;
  /** Label. `label` and `children` are interchangeable; `children` wins if both set. */
  label?: ReactNode;
  children?: ReactNode;
  /** Optional unread-count badge. Hidden when undefined / 0; caps at "99+". */
  badge?: number;
  onClick?: () => void;
  className?: string;
}
