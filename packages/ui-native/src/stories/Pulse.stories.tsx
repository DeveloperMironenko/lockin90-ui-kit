import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View, Text } from 'react-native';
import { Pulse } from '../components/Pulse';

const meta = { title: 'Native/Pulse' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <Pulse />,
};

export const Tones: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
        <Pulse tone="ok" />
        <Text style={{ color: '#fff' }}>ok</Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
        <Pulse tone="warn" />
        <Text style={{ color: '#fff' }}>warn</Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
        <Pulse tone="bad" />
        <Text style={{ color: '#fff' }}>bad</Text>
      </View>
    </View>
  ),
};
