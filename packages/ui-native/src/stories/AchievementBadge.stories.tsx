import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { AchievementBadge } from '../components/AchievementBadge';

const meta = { title: 'Native/AchievementBadge' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Unlocked: Story = {
  render: () => (
    <View style={{ width: 200 }}>
      <AchievementBadge
        title="Sunrise Streak"
        description="Log before 9am · 14 days running"
        icon="star"
        tier="gold"
        unlockedAt="Jun 12, 2026"
      />
    </View>
  ),
};

export const Locked: Story = {
  render: () => (
    <View style={{ width: 200 }}>
      <AchievementBadge
        title="Hydration Hero"
        description="Hit 3L water · 14 days running"
        icon="check"
        tier="platinum"
        locked
      />
    </View>
  ),
};

export const InProgress: Story = {
  render: () => (
    <View style={{ width: 200 }}>
      <AchievementBadge
        title="Iron Streak"
        description="Log every day for 25 days"
        icon="sparkle"
        tier="silver"
        locked
        progress={0.6}
      />
    </View>
  ),
};

export const Tiers: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
      <View style={{ width: 160 }}>
        <AchievementBadge title="Bronze" description="First milestone" icon="star" tier="bronze" unlockedAt="Mar 02" />
      </View>
      <View style={{ width: 160 }}>
        <AchievementBadge title="Silver" description="Ten in a row" icon="star" tier="silver" unlockedAt="Apr 18" />
      </View>
      <View style={{ width: 160 }}>
        <AchievementBadge title="Gold" description="A full month" icon="star" tier="gold" unlockedAt="May 30" />
      </View>
      <View style={{ width: 160 }}>
        <AchievementBadge title="Platinum" description="Ninety days locked in" icon="star" tier="platinum" unlockedAt="Jun 22" />
      </View>
    </View>
  ),
};
