import type { ElementType, ReactNode } from 'react';
import { cn } from '../../cn';

export interface TabBarItem {
  key: string;
  label: ReactNode;
  icon: ReactNode;
  href?: string;
  active?: boolean;
  /** Inert "coming soon" tab — rendered dim as a non-link `<span>`. */
  disabled?: boolean;
}

export interface TabBarProps {
  items: Array<TabBarItem>;
  className?: string;
  /**
   * Link element used for each (enabled) item — defaults to a plain `<a>` (full
   * navigation). Pass a router link (e.g. Next.js `Link`) to get client-side
   * navigation without a full page reload. It receives `href`, `className`,
   * `aria-current` and children.
   */
  linkComponent?: ElementType;
}

/** Mobile bottom navigation bar — icon over a tiny mono label per item. */
export default function TabBar({ items, className, linkComponent }: TabBarProps) {
  const Link: ElementType = linkComponent ?? 'a';
  return (
    <nav className={cn('lk-tabbar', className)} aria-label="Primary">
      {items.map((it) =>
        it.disabled ? (
          <span
            key={it.key}
            className={cn('lk-tabbar-item', 'lk-disabled')}
            aria-disabled="true"
          >
            {it.icon}
            <span>{it.label}</span>
          </span>
        ) : (
          <Link
            key={it.key}
            className={cn('lk-tabbar-item', it.active && 'lk-active')}
            href={it.href}
            aria-current={it.active ? 'page' : undefined}
          >
            {it.icon}
            <span>{it.label}</span>
          </Link>
        ),
      )}
    </nav>
  );
}
