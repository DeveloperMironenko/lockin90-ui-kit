import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { PasswordInput } from '../components/PasswordInput';

const meta = { title: 'Native/PasswordInput' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <View style={{ width: 300 }}>
      <PasswordInput label="Password" placeholder="••••••••" />
    </View>
  ),
};

export const Visible: Story = {
  render: () => (
    <View style={{ width: 300 }}>
      <PasswordInput label="Password" defaultVisible defaultValue="hunter2" />
    </View>
  ),
};

export const Invalid: Story = {
  render: () => (
    <View style={{ width: 300 }}>
      <PasswordInput label="Password" invalid defaultValue="short" />
    </View>
  ),
};
