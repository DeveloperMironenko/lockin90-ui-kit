import type { ReactNode } from 'react';
import { cn } from '../../cn';

export interface TabBarItem {
  key: string;
  label: ReactNode;
  icon: ReactNode;
  href?: string;
  active?: boolean;
}

export interface TabBarProps {
  items: Array<TabBarItem>;
  className?: string;
}

/** Mobile bottom navigation bar — icon over a tiny mono label per item. */
export default function TabBar({ items, className }: TabBarProps) {
  return (
    <nav className={cn('lk-tabbar', className)} aria-label="Primary">
      {items.map((it) => (
        <a
          key={it.key}
          className={cn('lk-tabbar-item', it.active && 'lk-active')}
          href={it.href}
          aria-current={it.active ? 'page' : undefined}
        >
          {it.icon}
          <span>{it.label}</span>
        </a>
      ))}
    </nav>
  );
}
