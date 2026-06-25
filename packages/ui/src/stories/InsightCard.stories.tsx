import type { Meta, StoryObj } from '@storybook/react-vite';
import { InsightCard } from '../components/InsightCard';

const meta = {
  title: 'Primitives/InsightCard',
  component: InsightCard,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof InsightCard>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: 'sparkle',
    title: 'Logging dinner earlier may help',
    body: 'Earlier meals appeared alongside steadier next-morning energy. Still gathering evidence.',
  },
};

export const Positive: Story = {
  args: {
    tone: 'positive',
    icon: 'checkCircle',
    title: 'Morning training beats evening',
    body: 'Sessions before 11am left recovery +11% vs evening. Schedule your heavy days early.',
    stats: [
      { label: 'p', value: '0.04' },
      { label: 'n', value: '24' },
    ],
  },
};

export const WithSparkline: Story = {
  args: {
    tone: 'accent',
    icon: 'sparkle',
    title: 'Your sweet spot is 7h 30m–8h sleep',
    body: 'Nights in the 7.5–8h band produced your highest-energy days (avg 84). Below 7h, energy fell off a cliff (avg 61).',
    data: [50, 60, 78, 86, 80, 66, 56],
    stats: [
      { label: 'p', value: '0.05' },
      { label: 'n', value: '61' },
      { label: 'confidence', value: 'high' },
    ],
  },
};
