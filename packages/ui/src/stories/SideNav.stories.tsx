import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SideNav, type NavGroupData } from '../admin/SideNav';

const meta = {
  title: 'Primitives/SideNav',
  component: SideNav,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof SideNav>;
export default meta;

const groups: NavGroupData[] = [
  {
    label: 'Operate',
    items: [
      { icon: 'grid', label: 'Overview', href: '#', active: true },
      { icon: 'user', label: 'Users', href: '#users' },
      { icon: 'target', label: 'Calibration', href: '#calibration' },
      { icon: 'activity', label: 'Versions / Rollout', href: '#rollout' },
    ],
  },
  {
    label: 'Revenue',
    items: [
      { icon: 'billing', label: 'Plans & Billing', href: '#billing' },
      { icon: 'refresh', label: 'Refunds', href: '#refunds', count: 7, countTone: 'danger' },
    ],
  },
  {
    label: 'Trust & Safety',
    items: [
      { icon: 'shield', label: 'Coach Moderation', href: '#mod', count: 3, countTone: 'warn' },
      { icon: 'send', label: 'Broadcasts', href: '#broadcasts' },
      { icon: 'file', label: 'Audit Log', href: '#audit', count: 128, countTone: 'accent' },
    ],
  },
  {
    label: 'Platform',
    items: [
      { icon: 'data-source', label: 'Workers', href: '#workers', count: 12, countTone: 'ok' },
      { icon: 'flask', label: 'Substances', href: '#substances' },
      { icon: 'code', label: 'API Docs', href: '#docs' },
      { icon: 'settings', label: 'Settings', href: '#settings' },
    ],
  },
];

const footer = (
  <>
    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
      <span
        aria-hidden
        style={{
          width: 7,
          height: 7,
          borderRadius: 999,
          background: 'var(--ok)',
          boxShadow: '0 0 8px var(--ok)',
        }}
      />
      All systems nominal
    </div>
    <div className="lk-mono" style={{ marginTop: 4, fontFamily: 'var(--font-mono)' }}>
      build 2026.06.23 · c1a4e02
    </div>
  </>
);

/** Desktop rail: labelled groups, count badges, an active item and a status footer. */
export const Default: StoryObj<typeof meta> = {
  render: () => (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-1)' }}>
      <SideNav groups={groups} footer={footer} />
      <div style={{ flex: 1, padding: 32, color: 'var(--text-dim)' }}>
        Main content area — the rail is sticky and full-height on desktop.
      </div>
    </div>
  ),
};

/** Narrow-width drawer: open the off-canvas rail; tap the scrim to dismiss. */
export const Drawer: StoryObj<typeof meta> = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-1)' }}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          style={{
            margin: 16,
            padding: '8px 14px',
            borderRadius: 'var(--r-sm)',
            border: '1px solid var(--border)',
            background: 'var(--glass)',
            color: 'var(--text-dim)',
            cursor: 'pointer',
          }}
        >
          Open navigation
        </button>
        <SideNav
          groups={groups}
          footer={footer}
          mobileOpen={open}
          onMobileOpenChange={setOpen}
        />
      </div>
    );
  },
};
