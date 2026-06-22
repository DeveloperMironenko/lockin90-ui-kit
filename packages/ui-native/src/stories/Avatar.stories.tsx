import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { Avatar } from '../components/Avatar';

const meta = {
  title: 'Native/Avatar',
  component: Avatar,
  args: { name: 'Maya Kane', size: 48 },
} satisfies Meta<typeof Avatar>;
export default meta;

type Story = StoryObj<typeof Avatar>;

export const Monogram: Story = {};

export const Rounded: Story = { args: { shape: 'rounded', size: 56 } };

export const Sizes: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
      {[28, 36, 44, 56, 72].map((s) => (
        <Avatar key={s} name="Leo P" size={s} />
      ))}
    </View>
  ),
};
