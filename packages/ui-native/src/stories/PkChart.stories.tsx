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

/** Live trace from raw samples — the ECG-style variant. It carries a heartbeat
 *  paced by `bpm` (beat period = 60000/bpm ms): a lub-dub pulse + sonar ring on
 *  the peak dot and a glow flash of the trace on every beat. */
export const FromSamples: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <PkChart
        doses={undefined}
        samples={[4, 38, 92, 74, 58, 110, 96, 78, 62, 48, 36, 26]}
        axis={['6a', '9a', '12p', '3p', '6p', '9p']}
        bpm={64}
      />
    </View>
  ),
};

/** The live trace with the heartbeat disabled via `still` — the static,
 *  catalogable state. */
export const Still: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <PkChart
        doses={undefined}
        samples={[4, 38, 92, 74, 58, 110, 96, 78, 62, 48, 36, 26]}
        axis={['6a', '9a', '12p', '3p', '6p', '9p']}
        bpm={64}
        still
      />
    </View>
  ),
};
