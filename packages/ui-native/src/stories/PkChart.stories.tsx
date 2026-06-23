import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { PkChart } from '../components/PkChart';

const meta = { title: 'Native/PkChart' } satisfies Meta;
export default meta;

/** Caffeine through the day: three doses, a sleep-disruption line, dose markers
 *  and a peak callout. */
export const Default: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <PkChart />
    </View>
  ),
};

export const SingleDose: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <PkChart doses={[{ at: 8, mg: 200, label: 'Pre-workout' }]} />
    </View>
  ),
};

export const FromSamples: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <PkChart
        doses={undefined}
        samples={[4, 38, 92, 74, 58, 110, 96, 78, 62, 48, 36, 26]}
        axis={['6a', '9a', '12p', '3p', '6p', '9p']}
      />
    </View>
  ),
};
