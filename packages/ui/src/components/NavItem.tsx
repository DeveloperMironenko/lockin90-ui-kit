import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';

export interface NavItemProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** The row's text. */
  label: string;
  /** A kit `Icon` (18px), before the label. */
  icon?: ReactNode;
  /** The page it leads to is the one shown: highlighted, with the accent bar, `aria-current="page"`. */
  active?: boolean;
  /** A small count after the label (e.g. new insights). */
  badge?: ReactNode;
  /** `sm`: a page's own section list (design `web/settings.html` `.subnav`): 9 × 12, 13.5px, a 16px
   *  icon, no edge bar. @default 'md' */
  size?: 'sm' | 'md';
}

/** A sidebar's link row (NavItem.md): icon, label, an optional badge; the current page highlighted with
 *  the accent bar on the sidebar's edge. A real `<a>`: the app passes `href` (and its router's click). */
export const NavItem = forwardRef<HTMLAnchorElement, NavItemProps>(function NavItem(
  { label, icon, active = false, badge, size = 'md', className, ...rest },
  ref,
) {
  return (
    <a
      ref={ref}
      {...rest}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'lk-nav-item',
        size === 'sm' && 'lk-nav-item-sm',
        active && 'lk-nav-item-active',
        className,
      )}
    >
      {icon != null && (
        <span className="lk-nav-item-icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="lk-nav-item-label">{label}</span>
      {badge != null && <span className="lk-nav-item-badge">{badge}</span>}
    </a>
  );
});
