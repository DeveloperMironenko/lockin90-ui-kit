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

// Actual (solid) → forecast (dashed) with an uncertainty ribbon that widens over
// the forecast horizon, plus an event marker at the forecast boundary.
export const Forecast: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <LineChart
        color={colors.accent}
        // indices 0..6 are observed; 6..11 are the forecast continuation
        data={[60, 64, 71, 78, 84, 88, 90, 93, 95, 96, 95, 92]}
        dashedFromIndex={6}
        band={{
          // ribbon hugs the line over the actuals, fans out over the forecast
          upper: [60, 64, 71, 78, 84, 88, 92, 98, 103, 107, 110, 112],
          lower: [60, 64, 71, 78, 84, 88, 88, 88, 87, 85, 80, 72],
        }}
        markers={[{ index: 6, color: colors.accent, label: 'now' }]}
        axis={['9am', '12pm', '3pm', '6pm', '9pm']}
      />
    </View>
  ),
};
