import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { CharCounter } from '../components/CharCounter';

const meta = { title: 'Native/CharCounter' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Ok: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <CharCounter value={42} max={160} />
    </View>
  ),
};

export const Warn: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <CharCounter value={150} max={160} />
    </View>
  ),
};

export const Over: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <CharCounter value={206} max={160} />
    </View>
  ),
};

export const AtLimit: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <CharCounter value={60} max={60} />
    </View>
  ),
};

export const States: Story = {
  render: () => (
    <View style={{ width: 320, gap: 16 }}>
      <CharCounter value={42} max={160} />
      <CharCounter value={150} max={160} />
      <CharCounter value={60} max={60} />
      <CharCounter value={206} max={160} />
    </View>
  ),
};

export const CountOnly: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <CharCounter value={88} max={120} showBar={false} />
    </View>
  ),
};

export const BarOnly: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <CharCounter value={88} max={120} showCount={false} />
    </View>
  ),
};

export const CustomFormat: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <CharCounter value={88} max={120} format={(v, m) => `${m - v} left`} />
    </View>
  ),
};
