import { type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../cn';
import { Icon, type IconName } from './Icon';

/* ============================================================================
   Mobile atoms — TabBar (bottom navigation) + FAB (floating action button).
   ========================================================================== */

/** One tab: a glyph over a short label. */
export interface TabBarItem {
  /** Glyph. Pass a node, or an `IconName` to draw the shared icon set tinted to
   *  the tab's active/inactive color automatically (via `currentColor`). */
  icon: ReactNode | IconName;
  label: string;
}

export interface TabBarProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** Tabs, left→right. Defaults to a 5-tab Home/Log/Coach/Stats/More set. */
  items?: TabBarItem[];
  /** Index of the active tab. */
  active?: number;
  /** Fires with the clicked tab index. */
  onChange?: (index: number) => void;
  /** Index of the item rendered as an elevated center FAB — a gradient tile that
   *  overhangs the bar top, label beneath. Omit for a flat bar. */
  fabIndex?: number;
  /** Press handler for the FAB item (falls back to `onChange(fabIndex)`). */
  onFabPress?: () => void;
}

const DEFAULT_ITEMS: TabBarItem[] = [
  { icon: 'star', label: 'Home' },
  { icon: 'plus', label: 'Log' },
  { icon: 'info', label: 'Coach' },
  { icon: 'timer', label: 'Stats' },
  { icon: 'more', label: 'More' },
];

/** Bottom navigation bar — a flex row of icon-over-label tab buttons; the
 *  active tab glows in the accent color, the rest sit faint. Glass bar with a
 *  top border, meant to sit pinned to the bottom of a screen. */
export function TabBar({
  items = DEFAULT_ITEMS,
  active = 0,
  onChange,
  fabIndex,
  onFabPress,
  className,
  ...rest
}: TabBarProps) {
  return (
    <nav className={cn('lk-tabbar', className)} aria-label="Primary" {...rest}>
      {items.map((item, i) => {
        const isFab = i === fabIndex;
        const glyph =
          typeof item.icon === 'string' ? <Icon name={item.icon as IconName} size={22} /> : item.icon;
        return (
          <button
            key={i}
            type="button"
            aria-current={i === active ? 'page' : undefined}
            className={cn('lk-tabbar-item', isFab && 'lk-tabbar-item--fab', i === active && 'is-active')}
            onClick={() => (isFab && onFabPress ? onFabPress() : onChange?.(i))}
          >
            <span className={isFab ? 'lk-tabbar-fab' : 'lk-tabbar-icon'}>{glyph}</span>
            <span className="lk-tabbar-label">{item.label}</span>
          </button>
        );
      })}
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
