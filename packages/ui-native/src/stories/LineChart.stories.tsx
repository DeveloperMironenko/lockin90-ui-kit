import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { colors } from '@lockin90/tokens';
import { LineChart } from '../components/LineChart';

const meta = { title: 'Native/LineChart' } satisfies Meta;
export default meta;

export const Default: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <LineChart />
    </View>
  ),
};

export const Sharp: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <LineChart smooth={false} />
    </View>
  ),
};

export const WithMarkers: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <LineChart markers={[{ index: 9, color: colors.zoneLow, label: 'peak' }]} />
    </View>
  ),
};

export const WithYAxis: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <LineChart
        yAxis
        data={[280, 286, 292, 288, 296, 302, 308, 305, 300, 296, 290, 284]}
        axis={['Mon', 'Wed', 'Fri', 'Sun']}
      />
    </View>
  ),
};
