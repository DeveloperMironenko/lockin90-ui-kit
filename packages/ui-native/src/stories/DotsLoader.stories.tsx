import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View, Text } from 'react-native';
import { DotsLoader } from '../components/DotsLoader';
import { colors } from '@lockin90/tokens';

const meta = { title: 'Native/DotsLoader' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <View style={{ width: 320, padding: 24 }}>
      <DotsLoader />
    </View>
  ),
};

export const TypingIndicator: Story = {
  render: () => (
    <View style={{ width: 320, padding: 24, gap: 8 }}>
      <DotsLoader size={6} gap={4} color={colors.textDim} />
      <Text style={{ color: colors.textFaint, fontSize: 12 }}>coach is typing…</Text>
    </View>
  ),
};

export const Mint: Story = {
  render: () => (
    <View style={{ width: 320, padding: 24 }}>
      <DotsLoader size={9} color={colors.mint} />
    </View>
  ),
};

export const FourDots: Story = {
  render: () => (
    <View style={{ width: 320, padding: 24 }}>
      <DotsLoader count={4} size={8} />
    </View>
  ),
};
