import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FollowButton, type FollowButtonProps } from '../components/FollowButton';

/** Wrapper that owns the controlled `following` state so the pill toggles. */
function Toggling({ following: initial = false, ...rest }: Partial<FollowButtonProps>) {
  const [following, setFollowing] = useState(initial);
  return <FollowButton {...rest} following={following} onToggle={() => setFollowing((f) => !f)} />;
}

const meta = {
  title: 'Primitives/FollowButton',
  component: FollowButton,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof FollowButton>;
export default meta;

// render-only stories (wrapper owns the controlled state), so `args` aren't required
type Story = StoryObj;

export const NotFollowing: Story = {
  render: () => <Toggling following={false} />,
};

export const Following: Story = {
  render: () => <Toggling following />,
};

export const Small: Story = {
  render: () => <Toggling following={false} size="sm" />,
};
