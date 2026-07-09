import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { Spinner } from '../components/Spinner';
import { colors } from '@lockin90/tokens';

const meta = { title: 'Native/Spinner' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <View style={{ padding: 24 }}>
      <Spinner />
    </View>
  ),
};

export const Large: Story = {
  render: () => (
    <View style={{ padding: 24 }}>
      <Spinner size={52} thickness={4.5} />
    </View>
  ),
};

export const Sizes: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 24, padding: 24 }}>
      <Spinner size={22} />
      <Spinner size={34} thickness={3.5} />
      <Spinner size={52} thickness={4.5} />
    </View>
  ),
};

export const Mint: Story = {
  render: () => (
    <View style={{ padding: 24 }}>
      <Spinner size={34} color={colors.mint} />
    </View>
  ),
};
