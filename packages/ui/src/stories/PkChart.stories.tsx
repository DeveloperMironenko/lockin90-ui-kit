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

export const FromSamples: StoryObj<typeof meta> = {
  args: {
    doses: undefined,
    samples: [4, 38, 92, 74, 58, 110, 96, 78, 62, 48, 36, 26],
    axis: ['6a', '9a', '12p', '3p', '6p', '9p'],
  },
};
