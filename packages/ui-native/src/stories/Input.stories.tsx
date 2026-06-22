import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { Input } from '../components/Input';

const meta = { title: 'Native/Input' } satisfies Meta;
export default meta;

export const Default: StoryObj = {
  render: () => (
    <View style={{ width: 320 }}>
      <Input label="Weight" unit="kg" placeholder="100" />
    </View>
  ),
};

export const Invalid: StoryObj = {
  render: () => (
    <View style={{ width: 320 }}>
      <Input label="Weight" unit="kg" placeholder="100" invalid defaultValue="abc" />
    </View>
  ),
};

export const Plain: StoryObj = {
  render: () => (
    <View style={{ width: 320 }}>
      <Input placeholder="Search…" inputSize="sm" />
    </View>
  ),
};
