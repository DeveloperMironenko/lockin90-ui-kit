import type { Meta, StoryObj } from '@storybook/react-vite';
import { ShareCard } from '../components/ShareCard';

const meta = {
  title: 'Primitives/ShareCard',
  component: ShareCard,
  parameters: { layout: 'centered' },
  argTypes: {
    gradient: { control: 'inline-radio', options: ['flux', 'cta', 'mint', 'violet'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof ShareCard>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Ring readout — the canonical energy-score share. */
export const RingScore: Story = {
  args: {
    title: 'Last 7 days',
    metric: 76,
    metricLabel: 'High zone',
    ring: { value: 76, max: 100 },
    gradient: 'flux',
    size: 'md',
    stats: [
      { label: 'Best', value: '88' },
      { label: 'Sleep', value: '7h18' },
      { label: 'Streak', value: '23d' },
    ],
  },
};

/** Big number headline (no ring) — a streak/PR card. */
export const NumberHeadline: Story = {
  args: {
    title: 'Current streak',
    metric: '23',
    metricLabel: 'days locked in',
    gradient: 'cta',
    size: 'md',
    stats: [
      { label: 'Best', value: '41d' },
      { label: 'This year', value: '212' },
    ],
  },
};

/** Mint gradient, square (1:1) aspect. */
export const MintSquare: Story = {
  args: {
    title: 'Recovery',
    metric: 91,
    metricLabel: 'Peak',
    ring: { value: 91 },
    gradient: 'mint',
    size: 'sm',
  },
};

/** Violet gradient, story (9:16) aspect, no supporting stats. */
export const VioletStory: Story = {
  args: {
    title: 'Personal best',
    metric: '142.5kg',
    metricLabel: 'Back squat · +5kg',
    gradient: 'violet',
    size: 'lg',
  },
};

/** Unbranded variant (brand mark + watermark hidden). */
export const Unbranded: Story = {
  args: {
    title: 'Avg energy',
    metric: 84,
    metricLabel: 'out of 100',
    ring: { value: 84 },
    gradient: 'flux',
    size: 'md',
    brand: false,
  },
};
