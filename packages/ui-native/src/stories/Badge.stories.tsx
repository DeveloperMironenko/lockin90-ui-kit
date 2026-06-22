import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { Badge } from '../components/Badge';

const meta = {
  title: 'Native/Badge',
  component: Badge,
} satisfies Meta<typeof Badge>;
export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = { args: { children: '3' } };

export const Tones: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
      <Badge tone="accent">3</Badge>
      <Badge tone="high">12</Badge>
      <Badge tone="mid">7</Badge>
      <Badge tone="low">99+</Badge>
      <Badge tone="neutral">new</Badge>
    </View>
  ),
};

export const Dots: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
      <Badge tone="accent" dot />
      <Badge tone="high" dot />
      <Badge tone="mid" dot />
      <Badge tone="low" dot />
      <Badge tone="neutral" dot />
    </View>
  ),
};
