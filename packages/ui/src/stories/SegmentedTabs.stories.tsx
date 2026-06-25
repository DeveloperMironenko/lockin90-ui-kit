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

/** Rollout flag — semantic tones colour the active segment + leading dot.
 *  Canary paints amber. */
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
