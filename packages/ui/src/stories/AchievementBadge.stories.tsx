import type { Meta, StoryObj } from '@storybook/react-vite';
import { AchievementBadge } from '../components/AchievementBadge';

const meta = {
  title: 'Primitives/AchievementBadge',
  component: AchievementBadge,
  args: { title: 'Sunrise Streak' },
} satisfies Meta<typeof AchievementBadge>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Unlocked: Story = {
  args: {
    title: 'Sunrise Streak',
    description: 'Log before 9am · 14 days running',
    icon: 'star',
    tier: 'gold',
    unlockedAt: 'Jun 12, 2026',
  },
};

export const Locked: Story = {
  args: {
    title: 'Hydration Hero',
    description: 'Hit 3L water · 14 days running',
    icon: 'check',
    tier: 'platinum',
    locked: true,
  },
};

export const InProgress: Story = {
  args: {
    title: 'Iron Streak',
    description: 'Log every day for 25 days',
    icon: 'sparkle',
    tier: 'silver',
    locked: true,
    progress: 0.6,
  },
};

export const Tiers: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <AchievementBadge title="Bronze" description="First milestone" icon="star" tier="bronze" unlockedAt="Mar 02" />
      <AchievementBadge title="Silver" description="Ten in a row" icon="star" tier="silver" unlockedAt="Apr 18" />
      <AchievementBadge title="Gold" description="A full month" icon="star" tier="gold" unlockedAt="May 30" />
      <AchievementBadge title="Platinum" description="Ninety days locked in" icon="star" tier="platinum" unlockedAt="Jun 22" />
    </div>
  ),
};
