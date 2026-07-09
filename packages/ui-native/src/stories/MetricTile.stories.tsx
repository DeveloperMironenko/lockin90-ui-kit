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

export const Empty: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <MetricTile label="Sync success" empty hint="No data yet — connect a wearable" />
    </View>
  ),
};

/** The `spark` accessory — a bottom fill bar (a single 0..1 value, or a series
 *  filled to `last / max`). This is what admin `StatCard` renders. */
export const WithSpark: Story = {
  render: () => (
    <View style={{ width: 320, gap: 12 }}>
      <MetricTile label="Adherence" value="78" unit="%" delta="+6" deltaTone="up" spark={[0.78]} />
      <MetricTile label="Volume" value="14.2k" unit="kg" spark={[8, 11, 9, 13, 12, 15]} />
      <MetricTile label="Sleep debt" value="1.4" unit="h" delta="-0.3" deltaTone="down" spark={[0.35]} sparkColor="#FF4D6D" />
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
