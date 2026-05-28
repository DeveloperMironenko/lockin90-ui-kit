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
  href: string;
  icon: NavLinkIcon;
  children: React.ReactNode;
  // Optional unread-count badge rendered right-aligned. Hidden when undefined / 0;
  // shown as a small accent-coloured pill for values 1+; displays "99+" past 99.
  badge?: number;
}
