'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CommandItem } from './types';

const DEFAULT_COMMANDS: CommandItem[] = [
  { id: 'go-dashboard',         label: 'Dashboard',                 group: 'Operations', href: '/dashboard' },
  { id: 'go-audit',             label: 'Audit log',                 group: 'Operations', href: '/audit-log' },
  { id: 'go-queues',            label: 'Worker queues',             group: 'Operations', href: '/queues' },
  { id: 'go-errors',            label: 'Errors',                    group: 'Operations', href: '/errors' },
  { id: 'go-users',             label: 'Users',                     group: 'Users',      href: '/users' },
  { id: 'go-coach',             label: 'Coach moderation',          group: 'Users',      href: '/coach-moderation' },
  { id: 'go-gdpr',              label: 'GDPR queue',                group: 'Users',      href: '/gdpr' },
  { id: 'go-referrals',         label: 'Referrals',                 group: 'Growth',     href: '/referrals' },
  { id: 'go-onboarding',        label: 'Onboarding funnel',         group: 'Growth',     href: '/onboarding' },
  { id: 'go-plans',             label: 'Plan tiers',                group: 'Billing',    href: '/plans' },
  { id: 'go-promo-codes',       label: 'Promo codes',               group: 'Billing',    href: '/promo-codes' },
  { id: 'go-refunds',           label: 'Refunds',                   group: 'Billing',    href: '/refunds' },
  { id: 'go-broadcasts',        label: 'Broadcasts',                group: 'Content',    href: '/broadcasts' },
  { id: 'go-achievements',      label: 'Achievements',              group: 'Content',    href: '/achievements' },
  { id: 'go-feature-modules',   label: 'Feature modules',           group: 'Content',    href: '/feature-modules' },
  { id: 'go-substances',        label: 'Substances',                group: 'Catalogs',   href: '/substances' },
  { id: 'go-products',          label: 'Products',                  group: 'Catalogs',   href: '/products' },
  { id: 'go-lab-tests',         label: 'Lab tests',                 group: 'Catalogs',   href: '/lab-tests' },
  { id: 'go-interactions',      label: 'Interaction rules',         group: 'Catalogs',   href: '/interaction-rules' },
  { id: 'go-time-tracking',     label: 'Activity types',            group: 'Catalogs',   href: '/time-tracking' },
  { id: 'go-calibration',       label: 'Calibration jobs',          group: 'Pipeline',   href: '/calibration' },
  { id: 'go-generators',        label: 'Generator versions',        group: 'Pipeline',   href: '/generators' },
  { id: 'go-goals',             label: 'Goal firings',              group: 'Pipeline',   href: '/goals' },
  { id: 'go-api-docs',          label: 'API docs',                  group: 'System',     href: '/api-docs' },
  { id: 'go-settings',          label: 'Settings',                  group: 'System',     href: '/settings' },
  { id: 'new-broadcast',        label: 'Compose broadcast',         group: 'Actions',    href: '/broadcasts/new' },
  { id: 'new-achievement',      label: 'Create achievement',        group: 'Actions',    href: '/achievements/new' },
  { id: 'new-promo',            label: 'Create promo code',         group: 'Actions',    href: '/promo-codes/new' },
  { id: 'new-recompute',        label: 'Start calibration recompute', group: 'Actions',  href: '/calibration/new' },
  { id: 'new-substance',        label: 'Add substance',             group: 'Actions',    href: '/substances/new' },
];

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(o => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DEFAULT_COMMANDS;
    return DEFAULT_COMMANDS.filter(c => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => { setCursor(0); }, [query]);

  if (!open) return null;

  const run = (cmd: CommandItem) => {
    setOpen(false);
    setQuery('');
    if (cmd.href) router.push(cmd.href);
    else cmd.onRun?.();
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor(c => Math.min(c + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setCursor(c => Math.max(c - 1, 0)); }
    if (e.key === 'Enter')     { e.preventDefault(); const sel = filtered[cursor]; if (sel) run(sel); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/70" onClick={() => setOpen(false)}>
      <div
        className="bg-elevated border border-border-strong rounded w-[560px] max-w-[90vw] max-h-[60vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <input
          autoFocus
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={onInputKey}
          placeholder="Type a command or search…"
          className="px-5 py-4 bg-transparent border-b border-border text-white text-[15px] outline-none"
        />
        <div className="flex-1 overflow-y-auto py-1">
          {filtered.length === 0 ? (
            <div className="px-5 py-8 text-center text-muted text-[12px]">No matches</div>
          ) : (
            filtered.map((cmd, i) => (
              <button
                key={cmd.id}
                onMouseEnter={() => setCursor(i)}
                onClick={() => run(cmd)}
                className={`w-full px-5 py-2 text-left flex items-center justify-between gap-3 ${
                  i === cursor ? 'bg-elevated-2' : 'bg-transparent'
                }`}
              >
                <div className="min-w-0">
                  <div className="text-[13px] text-white">{cmd.label}</div>
                </div>
                <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-muted shrink-0">
                  {cmd.group}
                </span>
              </button>
            ))
          )}
        </div>
        <div className="px-5 py-2 border-t border-border flex items-center justify-between font-mono text-[10px] text-muted">
          <span>↑↓ navigate · ↵ select · ESC close</span>
          <span>⌘K</span>
        </div>
      </div>
    </div>
  );
}
