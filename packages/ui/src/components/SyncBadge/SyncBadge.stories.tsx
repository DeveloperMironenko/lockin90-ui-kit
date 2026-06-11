import type { Meta, StoryObj } from '@storybook/react-vite';
import SyncBadge from './index';

const meta = {
  title: 'Patterns/SyncBadge',
  component: SyncBadge,
  args: { status: 'synced', time: '2m ago' },
  argTypes: { status: { control: 'inline-radio', options: ['synced', 'syncing', 'error'] } },
} satisfies Meta<typeof SyncBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Synced: Story = { args: { status: 'synced', time: '2m ago' } };
export const Syncing: Story = { args: { status: 'syncing', time: undefined } };
export const Error: Story = { args: { status: 'error', time: '1h ago' } };
