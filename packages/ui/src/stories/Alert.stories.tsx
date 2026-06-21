import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from '../components/Alert';

const meta = {
  title: 'Primitives/Alert',
  component: Alert,
} satisfies Meta<typeof Alert>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: { title: 'Heads up', children: 'Your estimates use data from 30+ days ago.' },
};

export const Success: Story = {
  args: { tone: 'success', title: 'Saved' },
};

export const Warn: Story = {
  args: { tone: 'warn', title: 'Late caffeine detected' },
};

export const Danger: Story = {
  args: { tone: 'danger', title: 'Payment failed', onDismiss: () => {} },
};
