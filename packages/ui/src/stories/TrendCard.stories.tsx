import type { Meta, StoryObj } from '@storybook/react-vite';
import { TrendCard } from '../admin/TrendCard';

const meta = {
  title: 'Admin/TrendCard',
  component: TrendCard,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof TrendCard>;
export default meta;

type Story = StoryObj<typeof meta>;

/* A rising 7-day signups series with a positive delta, mint line/area. */
export const Default: Story = {
  args: {
    title: 'Signups · 7d',
    value: '312',
    delta: '+18%',
    deltaDir: 'up',
    points: [180, 210, 205, 240, 265, 290, 312],
    color: '#34F5C5',
    xLabels: ['Mon', 'Wed', 'Fri', 'Sun'],
  },
};

/* A declining series with a negative delta, rose line/area. */
export const Down: Story = {
  args: {
    title: 'Churn · 7d',
    value: '0.9%',
    delta: '-0.3%',
    deltaDir: 'down',
    points: [1.6, 1.5, 1.4, 1.2, 1.1, 1.0, 0.9],
    color: '#FF4D6D',
    xLabels: ['Mon', 'Wed', 'Fri', 'Sun'],
  },
};

/* No delta, flat/informational card. */
export const NoDelta: Story = {
  args: {
    title: 'Active now',
    value: '41.2k',
    points: [39, 40, 41, 40, 42, 41, 41.2],
    color: '#6E7BFF',
  },
};
