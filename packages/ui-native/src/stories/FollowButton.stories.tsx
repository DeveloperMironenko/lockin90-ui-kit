import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { FollowButton, type FollowButtonProps } from '../components/FollowButton';

/** Wrapper that owns the controlled `following` state so the pill toggles. */
function Toggling({ following: initial = false, ...rest }: Partial<FollowButtonProps>) {
  const [following, setFollowing] = useState(initial);
  return <FollowButton {...rest} following={following} onToggle={() => setFollowing((f) => !f)} />;
}

const meta = { title: 'Native/FollowButton' } satisfies Meta;
export default meta;

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
