import type { Meta, StoryObj } from '@storybook/react-vite';
import StatusBadge from './index';

const meta = {
  title: 'Primitives/StatusBadge',
  component: StatusBadge,
  args: { tone: 'green', children: 'SYNCED', dot: true },
  argTypes: {
    tone: { control: 'inline-radio', options: ['green', 'amber', 'red', 'neutral', 'info'] },
    dot: { control: 'boolean' },
  },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Green: Story = { args: { tone: 'green', children: 'SYNCED' } };
export const Amber: Story = { args: { tone: 'amber', children: 'PENDING' } };
export const Red: Story = { args: { tone: 'red', children: 'FAILED' } };
export const Neutral: Story = { args: { tone: 'neutral', children: 'IDLE' } };
export const Info: Story = { args: { tone: 'info', children: 'QUEUED' } };

export const AllTones: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <StatusBadge tone="green">SYNCED</StatusBadge>
      <StatusBadge tone="amber">PENDING</StatusBadge>
      <StatusBadge tone="red">FAILED</StatusBadge>
      <StatusBadge tone="neutral">IDLE</StatusBadge>
      <StatusBadge tone="info">QUEUED</StatusBadge>
    </div>
  ),
};
