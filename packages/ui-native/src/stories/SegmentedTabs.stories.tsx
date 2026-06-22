import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { SegmentedTabs } from '../components/SegmentedTabs';

const meta = { title: 'Native/SegmentedTabs' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <SegmentedTabs />
    </View>
  ),
};

export const TwoUp: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <SegmentedTabs tabs={['Following', 'All Men']} active={0} />
    </View>
  ),
};

/** Time-range control where the longer ranges are gated behind an upsell. */
export const Locked: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <SegmentedTabs tabs={['1M', '3M', '1Y', 'All']} active={0} locked={[2, 3]} />
    </View>
  ),
};
