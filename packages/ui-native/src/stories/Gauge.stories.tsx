import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { Gauge } from '../components/Gauge';
import { colors } from '@lockin90/tokens';

const meta = { title: 'Native/Gauge' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <Gauge value={78} label="ENERGY" />
    </View>
  ),
};

export const Zones: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <Gauge
        value={78}
        label="TODAY"
        zones={[
          { to: 34, color: colors.zoneLow },
          { to: 67, color: colors.zoneMid },
          { to: 100, color: colors.zoneHigh },
        ]}
      />
    </View>
  ),
};

export const Ticks: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <Gauge value={64} label="SCORE" ticks={7} />
    </View>
  ),
};

export const Sizes: Story = {
  render: () => (
    <View style={{ padding: 16, flexDirection: 'row', gap: 24, alignItems: 'center' }}>
      <Gauge size={96} value={38} thickness={8} sweep={180} label="LOW" />
      <Gauge size={130} value={64} thickness={11} label="MID" />
      <Gauge
        size={170}
        value={88}
        thickness={16}
        label="HIGH"
        zones={[
          { to: 34, color: colors.zoneLow },
          { to: 67, color: colors.zoneMid },
          { to: 100, color: colors.zoneHigh },
        ]}
      />
    </View>
  ),
};
