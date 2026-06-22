import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { gradients } from '@lockin90/tokens';
import { AvatarStack } from '../components/AvatarStack';

const meta = { title: 'Native/AvatarStack' } satisfies Meta;
export default meta;

type Story = StoryObj;

const ROSTER = [
  { name: 'Jamie Tan', gradient: gradients.mint.stops },
  { name: 'Maya Kane', gradient: gradients.cta.stops },
  { name: 'Avery Rhodes', gradient: gradients.warm.stops },
  { name: 'Sam Vega', gradient: gradients.violet.stops },
  { name: 'Priya Chen' },
  { name: 'Dan Morrow' },
  { name: 'Sara Kapoor' },
];

export const Default: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <AvatarStack avatars={ROSTER} max={4} size={32} />
    </View>
  ),
};

export const WithOverflow: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <AvatarStack avatars={ROSTER} max={3} size={32} />
    </View>
  ),
};

export const NoOverflow: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <AvatarStack avatars={ROSTER.slice(0, 3)} max={4} size={32} />
    </View>
  ),
};

export const Sizes: Story = {
  render: () => (
    <View style={{ padding: 16, gap: 24 }}>
      {[24, 32, 44, 56].map((s) => (
        <AvatarStack key={s} avatars={ROSTER} max={4} size={s} />
      ))}
    </View>
  ),
};
