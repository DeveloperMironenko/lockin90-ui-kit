import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View, Text } from 'react-native';
import { Divider } from '../components/Divider';

const meta = { title: 'Native/Divider' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <Divider />
    </View>
  ),
};

export const Gradient: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <Divider gradient />
    </View>
  ),
};

export const BetweenContent: Story = {
  render: () => (
    <View style={{ width: 320, gap: 12 }}>
      <Text style={{ color: '#fff' }}>Above the divider</Text>
      <Divider />
      <Text style={{ color: '#fff' }}>Below the divider</Text>
      <Divider gradient />
      <Text style={{ color: '#fff' }}>Below the gradient divider</Text>
    </View>
  ),
};
