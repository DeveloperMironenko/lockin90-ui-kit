import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, PulseDot } from './index';

const meta = {
  title: 'Primitives/Badge',
  component: Badge,
  args: { children: 'COMING SOON', variant: 'muted' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['muted', 'active', 'danger'] },
    dot: { control: 'boolean' },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Muted: Story = { args: { variant: 'muted', children: 'COMING SOON' } };
export const Active: Story = { args: { variant: 'active', dot: true, children: 'CONNECTED' } };
export const Danger: Story = { args: { variant: 'danger', dot: true, children: 'ACTION REQUIRED' } };

export const WithPulseDot: Story = {
  render: () => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <PulseDot />
      <Badge variant="active">LIVE SYNC</Badge>
    </span>
  ),
};
