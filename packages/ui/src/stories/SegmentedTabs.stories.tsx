import type { Meta, StoryObj } from '@storybook/react-vite';
import { SegmentedTabs } from '../components/SegmentedTabs';

const meta = {
  title: 'Primitives/SegmentedTabs',
  component: SegmentedTabs,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof SegmentedTabs>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

export const TwoUp: StoryObj<typeof meta> = { args: { tabs: ['Following', 'All Men'], active: 0 } };

/** Time-range control where the longer ranges are gated behind an upsell. */
export const Locked: StoryObj<typeof meta> = {
  args: { tabs: ['1M', '3M', '1Y', 'All'], active: 0, locked: [2, 3] },
};

/** Catalog type switcher — each segment carries a trailing count badge. */
export const WithCounts: StoryObj<typeof meta> = {
  args: {
    tabs: [
      { label: 'Substances', count: 486 },
      { label: 'Products', count: 128 },
      { label: 'Lab Tests', count: 74 },
      { label: 'Interactions', count: 63 },
    ],
    active: 0,
  },
};

/** Rollout flag — semantic per-item tones colour the active segment + leading
 *  dot. Canary paints amber. (Distinct from the control-level `tone` prop.) */
export const Tones: StoryObj<typeof meta> = {
  args: {
    tabs: [
      { label: 'Off', tone: 'danger' },
      { label: 'Canary', tone: 'canary' },
      { label: 'On', tone: 'ok' },
    ],
    active: 1,
  },
};

/** Control-level `tone="mint"` — the selected segment uses the mint gradient +
 *  glow + dark label (the onboarding Activity-level control). */
export const MintTone: StoryObj<typeof meta> = {
  args: { tabs: ['Sedentary', 'Light', 'Active', 'Athlete'], active: 2, tone: 'mint' },
};

/** `size="sm"` + `tone="gradient"` — the design settings `.seg`: a compact
 *  content-hugging mono pill control whose active segment is a CTA-gradient
 *  pill + glow + dark label (unit system / week start rows). */
export const SmallGradient: StoryObj<typeof meta> = {
  args: { tabs: ['Metric', 'Imperial'], active: 0, size: 'sm', tone: 'gradient' },
};

/** `appearance="tint"` + per-tab icons + counts — the design changelog
 *  `.svc-toggle` service filter: glass track, accent-tinted active pill +
 *  accent border, cyan-tinted active count badge. */
export const ServiceFilter: StoryObj<typeof meta> = {
  args: {
    tabs: [
      { label: 'All', icon: 'list', count: 5 },
      { label: 'Web', icon: 'monitor', count: 3 },
      { label: 'Mobile', icon: 'smartphone', count: 2 },
    ],
    active: 0,
    appearance: 'tint',
  },
};
