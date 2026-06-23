'use client';

import {
  useEffect,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { cn } from '../cn';
import { Icon, type IconName } from '../components/Icon';
import { BrandMark } from '../components/BrandMark';

/* SideNav — the load-bearing operator (admin) rail. Sticky full-height glass
   rail with labelled groups, gradient active-indicator bar, per-item count
   badges and a status footer; collapses to an off-canvas drawer + scrim on
   narrow widths. Web-only (admin has no native surface). Matches the
   `.nav` rail from lockin90-design/admin/*.html. */

/** A single navigable row in the rail. */
export interface NavItemData {
  /** Leading glyph from the shared icon set. */
  icon: IconName;
  /** Visible row label. */
  label: string;
  /** Destination — rendered as an `<a>` when present, else a `<button>`. */
  href?: string;
  /** Marks the current page (gradient bar + accent text + `aria-current`). */
  active?: boolean;
  /** Optional trailing count badge (e.g. pending refunds). */
  count?: number;
  /** Tone of the count badge. @default 'accent' */
  countTone?: 'accent' | 'ok' | 'warn' | 'danger';
  /** Click handler — also closes the mobile drawer. */
  onSelect?: () => void;
}

/** An optionally-labelled cluster of nav items. */
export interface NavGroupData {
  /** Mono uppercase section label rendered above the items. */
  label?: string;
  items: NavItemData[];
}

export interface SideNavProps {
  /** Flat list of items (use this OR `groups`). */
  items?: NavItemData[];
  /** Labelled groups of items (use this OR `items`). */
  groups?: NavGroupData[];
  /** Top brand slot. @default a `BrandMark` lockup */
  brand?: ReactNode;
  /** Bottom status / user slot. */
  footer?: ReactNode;
  /** Controlled drawer state on narrow widths. */
  mobileOpen?: boolean;
  /** Fired when the drawer should open/close (toggle, scrim, item-select, Esc). */
  onMobileOpenChange?: (open: boolean) => void;
}

const COUNT_TONE: Record<NonNullable<NavItemData['countTone']>, string> = {
  accent: 'lk-snav-count-accent',
  ok: 'lk-snav-count-ok',
  warn: 'lk-snav-count-warn',
  danger: 'lk-snav-count-danger',
};

function NavItem({ item, onClose }: { item: NavItemData; onClose: () => void }) {
  const { icon, label, href, active, count, countTone = 'accent', onSelect } = item;

  const handle = (e: MouseEvent) => {
    if (onSelect) {
      // Buttons (no href) handle navigation purely via onSelect.
      if (!href) e.preventDefault();
      onSelect();
    }
    onClose();
  };

  const inner = (
    <>
      <Icon name={icon} size={16} className="lk-snav-item-ico" aria-hidden />
      <span className="lk-snav-item-label">{label}</span>
      {count != null && (
        <span className={cn('lk-snav-count', COUNT_TONE[countTone])}>{count}</span>
      )}
    </>
  );

  const className = cn('lk-snav-item', active && 'is-active');

  if (href) {
    return (
      <a
        className={className}
        href={href}
        aria-current={active ? 'page' : undefined}
        onClick={handle}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={className}
      aria-current={active ? 'page' : undefined}
      onClick={handle}
    >
      {inner}
    </button>
  );
}

/**
 * Operator console left rail. Renders `groups` (labelled) when provided,
 * otherwise the flat `items`. Sticky full-height on desktop; an off-canvas
 * drawer driven by `mobileOpen` with a tap-to-dismiss scrim on narrow widths.
 */
export function SideNav({
  items,
  groups,
  brand,
  footer,
  mobileOpen = false,
  onMobileOpenChange,
}: SideNavProps) {
  const close = () => onMobileOpenChange?.(false);

  // Close the drawer on Escape while it's open.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobileOpen]);

  const resolvedGroups: NavGroupData[] =
    groups ?? (items ? [{ items }] : []);

  const onScrimKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      close();
    }
  };

  return (
    <>
      <div
        className={cn('lk-snav-scrim', mobileOpen && 'is-open')}
        aria-hidden={!mobileOpen}
        onClick={close}
        onKeyDown={onScrimKey}
      />
      <aside
        className={cn('lk-snav', mobileOpen && 'is-open')}
        aria-label="Admin navigation"
      >
        <div className="lk-snav-brand">
          {brand ?? <BrandMark variant="lockup" size={17} />}
        </div>

        <nav className="lk-snav-nav" aria-label="Primary">
          {resolvedGroups.map((group, gi) => (
            <div className="lk-snav-group" key={gi}>
              {group.label && (
                <div className="lk-snav-group-label">{group.label}</div>
              )}
              {group.items.map((item, ii) => (
                <NavItem key={`${gi}-${ii}`} item={item} onClose={close} />
              ))}
            </div>
          ))}
        </nav>

        {footer != null && <div className="lk-snav-foot">{footer}</div>}
      </aside>
    </>
  );
}
