import type { Meta, StoryObj } from '@storybook/react-vite';
import { SsoButton } from '../components/SsoButton';

const meta = {
  title: 'Primitives/SsoButton',
  component: SsoButton,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof SsoButton>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Google: Story = { args: { provider: 'google' } };

export const Apple: Story = { args: { provider: 'apple' } };

export const Disabled: Story = { args: { provider: 'google', disabled: true } };

/* The auth-screen layout — two providers side by side, each filling its cell. */
export const Pair: Story = {
  args: { provider: 'google' },
  render: () => (
    <div style={{ display: 'flex', gap: 10, width: 320 }}>
      <SsoButton provider="google" />
      <SsoButton provider="apple" />
    </div>
  ),
};
