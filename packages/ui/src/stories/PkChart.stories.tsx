import type { Meta, StoryObj } from '@storybook/react-vite';
import { PkChart } from '../components/PkChart';

const meta = {
  title: 'Primitives/PkChart',
  component: PkChart,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof PkChart>;
export default meta;

/** Caffeine through the day: three doses, a sleep-disruption line, dose markers
 *  and a peak callout. */
export const Default: StoryObj<typeof meta> = {};

export const SingleDose: StoryObj<typeof meta> = {
  args: {
    doses: [{ at: 8, mg: 200, label: 'Pre-workout' }],
  },
};

/** Live trace from raw samples — the ECG-style variant. It carries a heartbeat
 *  paced by `bpm` (beat period = 60000/bpm ms): a lub-dub pulse + sonar ring on
 *  the peak dot and a glow flash of the trace on every beat. */
export const FromSamples: StoryObj<typeof meta> = {
  args: {
    doses: undefined,
    samples: [4, 38, 92, 74, 58, 110, 96, 78, 62, 48, 36, 26],
    axis: ['6a', '9a', '12p', '3p', '6p', '9p'],
    bpm: 64,
  },
};

/** The live trace with the heartbeat disabled via `still` — the static,
 *  catalogable state (reduced-motion users get this automatically). */
export const Still: StoryObj<typeof meta> = {
  args: {
    doses: undefined,
    samples: [4, 38, 92, 74, 58, 110, 96, 78, 62, 48, 36, 26],
    axis: ['6a', '9a', '12p', '3p', '6p', '9p'],
    bpm: 64,
    still: true,
  },
};
