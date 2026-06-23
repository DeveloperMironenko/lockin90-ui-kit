import type { Meta, StoryObj } from '@storybook/react-vite';
import { MetricTile, ProgressDots } from '../components/MetricTile';

const meta = {
  title: 'Primitives/MetricTile',
  component: MetricTile,
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

export const Dots: StoryObj<typeof meta> = {
  render: () => <ProgressDots />,
};
