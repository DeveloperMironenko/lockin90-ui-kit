import type { Meta, StoryObj } from '@storybook/react-vite';
import { SegmentedTabs } from '../components/SegmentedTabs';

const meta = {
  title: 'Primitives/SegmentedTabs',
  component: SegmentedTabs,
} satisfies Meta<typeof SegmentedTabs>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

export const TwoUp: StoryObj<typeof meta> = { args: { tabs: ['Following', 'All Men'], active: 0 } };

/** Time-range control where the longer ranges are gated behind an upsell. */
export const Locked: StoryObj<typeof meta> = {
  args: { tabs: ['1M', '3M', '1Y', 'All'], active: 0, locked: [2, 3] },
};
