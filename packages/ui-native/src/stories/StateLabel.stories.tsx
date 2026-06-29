import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { StateLabel } from '../components/StateLabel';

const meta = { title: 'Native/StateLabel' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <View style={{ width: 480 }}>
      <StateLabel num="01" label="Sign in" />
    </View>
  ),
};

export const AuthSections: Story = {
  render: () => (
    <View style={{ width: 480, gap: 18 }}>
      <StateLabel num="01" label="Sign in" />
      <StateLabel num="02" label="Create account" />
      <StateLabel num="03" label="Verify email" />
    </View>
  ),
};
