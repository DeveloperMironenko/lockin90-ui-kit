import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { RangeBar } from '../components/RangeBar';

const meta = { title: 'Native/RangeBar' } satisfies Meta;
export default meta;

type Story = StoryObj;

// Total testosterone — in optimal range
export const Default: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <RangeBar
        value={742}
        min={264}
        max={916}
        low={400}
        high={800}
        label="Testosterone"
        unit="ng/dL"
        showValue
      />
    </View>
  ),
};

// Fasting glucose — high-normal, watch (lands in the high zone → bad tone)
export const HighWatch: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <RangeBar
        value={96}
        min={70}
        max={99}
        low={75}
        high={90}
        label="Fasting glucose"
        unit="mg/dL"
        showValue
      />
    </View>
  ),
};

// Below the optimal band → warn tone
export const LowOutOfRange: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <RangeBar
        value={280}
        min={264}
        max={916}
        low={400}
        high={800}
        label="Testosterone"
        unit="ng/dL"
        showValue
      />
    </View>
  ),
};

// Force the marker tone regardless of zone
export const ForcedTone: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <RangeBar value={60} min={0} max={100} low={40} high={80} label="Marker" showValue markerTone="warn" />
    </View>
  ),
};

// No header — bare track + marker
export const TrackOnly: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <RangeBar value={1.8} min={0.4} max={4} low={0.8} high={3.2} />
    </View>
  ),
};
