import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PushPreview } from '../admin/PushPreview';

const meta = {
  title: 'Primitives/PushPreview',
  component: PushPreview,
  parameters: { layout: 'centered' },
  args: {
    appName: 'LockIn90',
    title: 'Your afternoon energy forecast just got smarter',
    body: "We now factor caffeine timing into your afternoon projection. Open LockIn90 to see today's curve and why your 3pm dip happens →",
    timeLabel: 'now',
  },
} satisfies Meta<typeof PushPreview>;
export default meta;

type Story = StoryObj<typeof meta>;

const frame = (inner: ReactNode) => (
  <div style={{ width: 380, maxWidth: '100%' }}>{inner}</div>
);

export const Push: Story = {
  args: { channel: 'push' },
  render: (args) => frame(<PushPreview {...args} />),
};

export const InApp: Story = {
  args: { channel: 'in-app' },
  render: (args) => frame(<PushPreview {...args} />),
};

export const Email: Story = {
  args: { channel: 'email' },
  render: (args) => frame(<PushPreview {...args} />),
};

export const Placeholder: Story = {
  args: {
    channel: 'push',
    title: '',
    body: '',
    placeholder: true,
  },
  render: (args) => frame(<PushPreview {...args} />),
};
