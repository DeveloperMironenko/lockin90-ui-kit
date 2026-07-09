import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatCard } from '../admin/StatCard';

const meta = {
  title: 'Admin/StatCard',
  component: StatCard,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof StatCard>;
export default meta;

type Story = StoryObj<typeof meta>;

/* A KPI cell (now a thin wrapper of MetricTile): opaque card, gradient value,
   arrow line-delta, and the bottom spark-fill bar. */
export const Default: Story = {
  args: {
    label: 'Total users',
    value: '12,480',
    valueTone: 'gradient',
    delta: '312 · 7d',
    deltaDir: 'up',
    spark: 0.78,
  },
};

export const Mint: Story = {
  args: { label: 'Uptime', value: '99.9%', valueTone: 'mint', delta: 'stable', deltaDir: 'flat', spark: 0.99 },
};

/* Graded value colour + matching spark colour (e.g. an error-rate scale). */
export const GradedColor: Story = {
  args: { label: 'Error rate', value: '1.8%', valueColor: '#FFB020', delta: '0.4%', deltaDir: 'down', spark: 0.3, sparkColor: '#FFB020' },
};
