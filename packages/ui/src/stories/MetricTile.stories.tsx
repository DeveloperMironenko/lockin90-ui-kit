import type { Meta, StoryObj } from '@storybook/react-vite';
import { MetricTile, ProgressDots } from '../components/MetricTile';

const meta = {
  title: 'Primitives/MetricTile',
  component: MetricTile,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof MetricTile>;
export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {},
};

export const WithDelta: StoryObj<typeof meta> = {
  args: {
    label: 'Streak',
    value: '142',
    delta: '+3',
    deltaTone: 'up',
  },
};

export const Empty: StoryObj<typeof meta> = {
  args: {
    label: 'Sync success',
    empty: true,
    hint: 'No data yet — connect a wearable',
  },
};

/** The `spark` accessory — a bottom fill bar (a single 0..1 value, or a series
 *  filled to `last / max`). This is what admin `StatCard` renders. */
export const WithSpark: StoryObj<typeof meta> = {
  args: {
    label: 'Adherence',
    value: '78',
    unit: '%',
    delta: '+6',
    deltaTone: 'up',
    spark: [0.78],
  },
};

export const Dots: StoryObj<typeof meta> = {
  render: () => <ProgressDots />,
};
