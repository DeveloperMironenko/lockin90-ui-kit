import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from './index';

const meta = {
  title: 'Primitives/Alert',
  component: Alert,
  args: { variant: 'info', children: 'Your wearable last synced 4 minutes ago.' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['error', 'success', 'info'] },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = { args: { variant: 'info' } };
export const Success: Story = { args: { variant: 'success', children: 'Profile updated.' } };
export const Error: Story = { args: { variant: 'error', children: 'Invalid credentials. Try again.' } };
