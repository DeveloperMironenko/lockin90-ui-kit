import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatusChip } from '../admin/StatusChip';

const meta = {
  title: 'Admin/StatusChip',
  component: StatusChip,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof StatusChip>;
export default meta;

type Story = StoryObj<typeof meta>;

/* A mono signal chip (now a thin wrapper of the canonical Chip). */
export const Default: Story = {
  args: { tone: 'high', dot: true, children: 'Healthy' },
};

export const Tones: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
      <StatusChip tone="neutral">idle</StatusChip>
      <StatusChip tone="high" dot>ok</StatusChip>
      <StatusChip tone="mid">audit</StatusChip>
      <StatusChip tone="low" dot>danger</StatusChip>
      <StatusChip tone="accent">deploy</StatusChip>
    </div>
  ),
};
