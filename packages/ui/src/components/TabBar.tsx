import { type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';
import { Icon } from './Icon';

/* ============================================================================
   Mobile atoms — TabBar (bottom navigation) + FAB (floating action button).
   ========================================================================== */

/** One tab: a glyph (any node) over a short label. */
export interface TabBarItem {
  icon: ReactNode;
  label: string;
}

export interface TabBarProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Tabs, left→right. Defaults to a 5-tab Home/Log/Coach/Stats/More set. */
  items?: TabBarItem[];
  /** Index of the active tab. */
  active?: number;
  /** Fires with the clicked tab index. */
  onChange?: (index: number) => void;
}

const DEFAULT_ITEMS: TabBarItem[] = [
  { icon: <Icon name="star" size={22} />, label: 'Home' },
  { icon: <Icon name="plus" size={22} />, label: 'Log' },
  { icon: <Icon name="info" size={22} />, label: 'Coach' },
  { icon: <Icon name="timer" size={22} />, label: 'Stats' },
  { icon: <Icon name="more" size={22} />, label: 'More' },
];

/** Bottom navigation bar — a flex row of icon-over-label tab buttons; the
 *  active tab glows in the accent color, the rest sit faint. Glass bar with a
 *  top border, meant to sit pinned to the bottom of a screen. */
export function TabBar({
  items = DEFAULT_ITEMS,
  active = 0,
  onChange,
  className,
  ...rest
}: TabBarProps) {
  return (
    <nav className={cn('lk-tabbar', className)} aria-label="Primary" {...rest}>
      {items.map((item, i) => (
        <button
          key={i}
          type="button"
          aria-current={i === active ? 'page' : undefined}
          className={cn('lk-tabbar-item', i === active && 'is-active')}
          onClick={() => onChange?.(i)}
        >
          <span className="lk-tabbar-icon">{item.icon}</span>
          <span className="lk-tabbar-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

export interface FABProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Glyph rendered inside the button. Defaults to a plus. */
  icon?: ReactNode;
  /** Optional text — renders an extended (pill) FAB instead of a circle. */
  label?: string;
}

/** Floating action button — a circular gradient button with a strong glow and
 *  a hover lift. With a `label` it grows into an extended pill FAB. Positioning
 *  is left to the consumer. */
export function FAB({
  icon,
  label,
  className,
  type = 'button',
  'aria-label': ariaLabel,
  ...rest
}: FABProps) {
  return (
    <button
      type={type}
      className={cn('lk-fab', label != null && 'lk-fab-extended', className)}
      aria-label={ariaLabel ?? (label == null ? 'Add' : undefined)}
      {...rest}
    >
      <span className="lk-fab-icon">{icon ?? <Icon name="plus" size={22} />}</span>
      {label != null && <span className="lk-fab-label">{label}</span>}
    </button>
  );
}
