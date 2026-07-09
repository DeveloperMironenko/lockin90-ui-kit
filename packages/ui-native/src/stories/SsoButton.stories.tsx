import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { SsoButton } from '../components/SsoButton';

const meta = { title: 'Native/SsoButton' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Google: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', width: 200 }}>
      <SsoButton provider="google" />
    </View>
  ),
};

export const Apple: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', width: 200 }}>
      <SsoButton provider="apple" />
    </View>
  ),
};

export const Disabled: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', width: 200 }}>
      <SsoButton provider="google" disabled />
    </View>
  ),
};

/* The auth-screen layout — two providers side by side, each filling its cell. */
export const Pair: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 10, width: 320 }}>
      <SsoButton provider="google" />
      <SsoButton provider="apple" />
    </View>
  ),
};
