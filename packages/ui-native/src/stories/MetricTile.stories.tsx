import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { MetricTile, ProgressDots } from '../components/MetricTile';

const meta = {
  title: 'Native/MetricTile',
  component: MetricTile,
} satisfies Meta<typeof MetricTile>;
export default meta;

type Story = StoryObj<typeof MetricTile>;

export const Default: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <MetricTile />
    </View>
  ),
};

export const WithDelta: Story = {
  render: () => (
    <View style={{ width: 320, gap: 12 }}>
      <MetricTile label="Streak" value="142" unit="days" delta="+3" deltaTone="up" />
      <MetricTile label="Resting HR" value="58" unit="bpm" delta="-2" deltaTone="down" />
    </View>
  ),
};

export const Dots: Story = {
  render: () => (
    <View style={{ width: 320, gap: 12 }}>
      <ProgressDots total={14} filled={5} />
      <ProgressDots total={7} filled={7} />
    </View>
  ),
};
