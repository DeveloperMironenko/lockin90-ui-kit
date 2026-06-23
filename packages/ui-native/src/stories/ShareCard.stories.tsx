import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { ShareCard } from '../components/ShareCard';

const meta = { title: 'Native/ShareCard' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Square: Story = {
  render: () => (
    <View style={{ width: 440 }}>
      <ShareCard
        title="Energy Score"
        value="87"
        ring={0.87}
        subtitle="Best energy week in a month. Locked in."
        gradient="flux"
        brand
        device="oura"
        aspect="square"
      />
    </View>
  ),
};

export const StoryAspect: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <ShareCard
        title="Today"
        value="76"
        ring={0.76}
        subtitle="7-day average · HIGH zone"
        gradient="violet"
        brand
        device="whoop"
        aspect="story"
      />
    </View>
  ),
};

export const Wide: Story = {
  render: () => (
    <View style={{ width: 560 }}>
      <ShareCard
        title="Weekly Recap"
        value="91"
        ring={0.91}
        subtitle="Current streak: 23 days"
        gradient="mint"
        brand
        aspect="wide"
      />
    </View>
  ),
};
