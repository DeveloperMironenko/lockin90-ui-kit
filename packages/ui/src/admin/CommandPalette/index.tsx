'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../cn';
import type { CommandItem, CommandPaletteProps } from './types';

const DEFAULT_COMMANDS: CommandItem[] = [
  { id: 'go-dashboard',         label: 'Dashboard',                   group: 'Operations', href: '/dashboard' },
  { id: 'go-audit',             label: 'Audit log',                   group: 'Operations', href: '/audit-log' },
  { id: 'go-queues',            label: 'Worker queues',               group: 'Operations', href: '/queues' },
  { id: 'go-errors',            label: 'Errors',                      group: 'Operations', href: '/errors' },
  { id: 'go-users',             label: 'Users',                       group: 'Users',      href: '/users' },
  { id: 'go-coach',             label: 'Coach moderation',            group: 'Users',      href: '/coach-moderation' },
  { id: 'go-gdpr',              label: 'GDPR queue',                  group: 'Users',      href: '/gdpr' },
  { id: 'go-referrals',         label: 'Referrals',                   group: 'Growth',     href: '/referrals' },
  { id: 'go-onboarding',        label: 'Onboarding funnel',           group: 'Growth',     href: '/onboarding' },
  { id: 'go-plans',             label: 'Plan tiers',                  group: 'Billing',    href: '/plans' },
  { id: 'go-promo-codes',       label: 'Promo codes',                 group: 'Billing',    href: '/promo-codes' },
  { id: 'go-refunds',           label: 'Refunds',                     group: 'Billing',    href: '/refunds' },
  { id: 'go-broadcasts',        label: 'Broadcasts',                  group: 'Content',    href: '/broadcasts' },
  { id: 'go-achievements',      label: 'Achievements',                group: 'Content',    href: '/achievements' },
  { id: 'go-feature-modules',   label: 'Feature modules',             group: 'Content',    href: '/feature-modules' },
  { id: 'go-substances',        label: 'Substances',                  group: 'Catalogs',   href: '/substances' },
  { id: 'go-products',          label: 'Products',                    group: 'Catalogs',   href: '/products' },
  { id: 'go-lab-tests',         label: 'Lab tests',                   group: 'Catalogs',   href: '/lab-tests' },
  { id: 'go-interactions',      label: 'Interaction rules',           group: 'Catalogs',   href: '/interaction-rules' },
  { id: 'go-time-tracking',     label: 'Activity types',              group: 'Catalogs',   href: '/time-tracking' },
  { id: 'go-calibration',       label: 'Calibration jobs',            group: 'Pipeline',   href: '/calibration' },
  { id: 'go-generators',        label: 'Generator versions',          group: 'Pipeline',   href: '/generators' },
  { id: 'go-goals',             label: 'Goal firings',                group: 'Pipeline',   href: '/goals' },
  { id: 'go-api-docs',          label: 'API docs',                    group: 'System',     href: '/api-docs' },
  { id: 'go-settings',          label: 'Settings',                    group: 'System',     href: '/settings' },
  { id: 'new-broadcast',        label: 'Compose broadcast',           group: 'Actions',    href: '/broadcasts/new' },
  { id: 'new-achievement',      label: 'Create achievement',          group: 'Actions',    href: '/achievements/new' },
  { id: 'new-promo',            label: 'Create promo code',           group: 'Actions',    href: '/promo-codes/new' },
  { id: 'new-recompute',        label: 'Start calibration recompute', group: 'Actions',    href: '/calibration/new' },
  { id: 'new-substance',        label: 'Add substance',               group: 'Actions',    href: '/substances/new' },
];

/**
 * Aurora ⌘K command overlay for the admin console. Self-toggles on ⌘K / Ctrl-K
 * (and closes on Escape) when used uncontrolled, or follows the `open` prop when
 * controlled. Filter by typing; navigate the list with ↑ / ↓; ↵ selects.
 *
 * Reimplements the old Tailwind overlay with the Aurora glass portal pattern
 * (`lk-card lk-lit` panel over a blurred scrim, `lk-input` search). Selecting an
 * item routes to its `href` (via `window.location`, so the kit stays free of a
 * router dependency) or runs its `onRun`.
 */
export default function CommandPalette({
  commands = DEFAULT_COMMANDS,
  open: openProp,
  onOpenChange,
  onSelect,
  placeholder = 'Type a command or search…',
  className,
}: CommandPaletteProps = {}) {
  const controlled = openProp !== undefined;
  const [openState, setOpenState] = useState(false);
  const open = controlled ? openProp : openState;
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);

  const setOpen = (next: boolean) => {
    if (!controlled) setOpenState(next);
    onOpenChange?.(next);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(!open);
      }
      if (e.key === 'Escape' && open) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, controlled]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q),
    );
  }, [query, commands]);

  useEffect(() => {
    setCursor(0);
  }, [query]);

  if (!open || typeof document === 'undefined') return null;

  const run = (cmd: CommandItem) => {
    setOpen(false);
    setQuery('');
    onSelect?.(cmd);
    if (cmd.href) {
      if (typeof window !== 'undefined') window.location.href = cmd.href;
    } else {
      cmd.onRun?.();
    }
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, filtered.length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      const sel = filtered[cursor];
      if (sel) run(sel);
    }
  };

  return createPortal(
    <div
      onClick={() => setOpen(false)}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '15vh',
        padding: '15vh 20px 20px',
        background: 'rgba(3,4,8,0.6)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
        className={cn('lk-card', 'lk-lit', 'lk-cmdk', className)}
        style={{
          width: 560,
          maxWidth: '90vw',
          maxHeight: '60vh',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: 'var(--elev-2)',
        }}
      >
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onInputKey}
          placeholder={placeholder}
          aria-label="Search commands"
          className="lk-cmdk-input"
          style={{
            width: '100%',
            padding: '16px 20px',
            background: 'transparent',
            border: 'none',
            borderBottom: '1px solid var(--border)',
            color: 'var(--text)',
            fontFamily: 'var(--font-ui)',
            fontSize: 15,
            outline: 'none',
          }}
        />
        <div className="lk-cmdk-list" style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
          {filtered.length === 0 ? (
            <div
              className="lk-muted"
              style={{ padding: '32px 20px', textAlign: 'center', fontSize: 12 }}
            >
              No matches
            </div>
          ) : (
            filtered.map((cmd, i) => (
              <button
                key={cmd.id}
                type="button"
                onMouseEnter={() => setCursor(i)}
                onClick={() => run(cmd)}
                className={cn('lk-cmdk-item', i === cursor && 'lk-active')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  padding: '9px 20px',
                  textAlign: 'left',
                  border: 'none',
                  cursor: 'pointer',
                  background: i === cursor ? 'var(--glass-2)' : 'transparent',
                  color: 'var(--text)',
                  transition: 'background 0.15s var(--ease)',
                }}
              >
                <span style={{ minWidth: 0, fontSize: 13, color: 'var(--text)' }}>{cmd.label}</span>
                <span
                  className="lk-eyebrow"
                  style={{ flex: '0 0 auto', fontSize: 10, letterSpacing: '0.12em' }}
                >
                  {cmd.group}
                </span>
              </button>
            ))
          )}
        </div>
        <div
          className="lk-cmdk-foot lk-muted"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 20px',
            borderTop: '1px solid var(--border)',
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
          }}
        >
          <span>↑↓ navigate · ↵ select · ESC close</span>
          <span className="lk-kbd">⌘K</span>
        </div>
      </div>
    </div>,
    document.body,
  );
}
