import type { Meta, StoryObj } from '@storybook/react-vite';
import OAuthButton from './index';

const meta: Meta<typeof OAuthButton> = {
  title: 'Foundation/OAuthButton',
  component: OAuthButton,
  args: { provider: 'google' },
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: 360, display: 'grid', gap: 12 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof OAuthButton>;

export const Google: Story = { args: { provider: 'google' } };
export const Apple: Story = { args: { provider: 'apple' } };
export const Loading: Story = { args: { provider: 'google', loading: true } };
export const Disabled: Story = { args: { provider: 'apple', disabled: true } };
export const CustomLabel: Story = { args: { provider: 'google', label: 'Sign up with Google' } };

export const Both: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      <OAuthButton provider="google" />
      <OAuthButton provider="apple" />
    </div>
  ),
};
