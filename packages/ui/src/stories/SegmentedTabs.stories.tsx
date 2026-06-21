import type { Meta, StoryObj } from '@storybook/react-vite';
import { SegmentedTabs } from '../components/SegmentedTabs';

const meta = {
  title: 'Components/SegmentedTabs',
  component: SegmentedTabs,
} satisfies Meta<typeof SegmentedTabs>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

export const TwoUp: StoryObj<typeof meta> = { args: { tabs: ['Following', 'All Men'], active: 0 } };
