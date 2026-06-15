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
  /** Emphasised quick-action tab — rendered as a raised accent circle (FAB). */
  primary?: boolean;
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
      {/* Energy-spectrum gradient for the ACTIVE tab's icon stroke. A gradient
          stroke has no CSS equivalent — it needs an SVG <defs> in the DOM — so
          this hidden, out-of-flow 0×0 svg is that gradient source, referenced by
          `.lk-tabbar-item.lk-active svg { stroke: url(#lk-tabgrad) }`. */}
      <svg
        width="0"
        height="0"
        aria-hidden="true"
        focusable="false"
        style={{ position: 'absolute' }}
      >
        <defs>
          <linearGradient id="lk-tabgrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#A8FF35" />
            <stop offset="0.5" stopColor="#22D3EE" />
            <stop offset="1" stopColor="#7C5CFF" />
          </linearGradient>
        </defs>
      </svg>
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
        ) : it.primary ? (
          <Link
            key={it.key}
            className={cn('lk-tabbar-item', 'lk-tabbar-primary')}
            href={it.href}
            aria-current={it.active ? 'page' : undefined}
          >
            <span className="lk-tabbar-fab">{it.icon}</span>
            <span>{it.label}</span>
          </Link>
        ) : (
          <Link
            key={it.key}
            className={cn('lk-tabbar-item', it.active && 'lk-active')}
            href={it.href}
            aria-current={it.active ? 'page' : undefined}
          >
            {it.icon}
            <span>{it.label}</span>
            <span className="lk-tabbar-dot" aria-hidden="true" />
          </Link>
        ),
      )}
    </nav>
  );
}
