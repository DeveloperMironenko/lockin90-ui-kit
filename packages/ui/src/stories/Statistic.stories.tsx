import type { Meta, StoryObj } from '@storybook/react-vite';
import { Statistic } from '../admin/Statistic';

const meta = {
  title: 'Admin/Statistic',
  component: Statistic,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Statistic>;
export default meta;

type Story = StoryObj<typeof meta>;

/* A borderless big-number block for inside a Panel (now a thin wrapper of the
   root Stat at its sm/lg sizes). */
export const Default: Story = {
  args: { label: 'MRR', value: '$48.2k', sub: 'last 30 days' },
};

export const Row: Story = {
  args: { label: 'MRR', value: '$48.2k' },
  render: () => (
    <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>
      <Statistic label="MRR" value="$48.2k" size="lg" tone="gradient" />
      <Statistic label="Active" value="1,204" sub="7d" />
      <Statistic label="Uptime" value="99.9%" tone="mint" />
    </div>
  ),
};
