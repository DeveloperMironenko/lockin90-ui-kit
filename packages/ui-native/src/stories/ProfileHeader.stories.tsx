import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { ProfileHeader } from '../components/ProfileHeader';
import { Button } from '../components/Button';

const meta = { title: 'Native/ProfileHeader' } satisfies Meta;
export default meta;

type Story = StoryObj;

const AVATAR = 'https://i.pravatar.cc/200?img=47';
const COVER = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=70';

const STATS = [
  { label: 'Followers', value: '2.4k' },
  { label: 'Following', value: '312' },
  { label: 'Streak', value: '118' },
];

const Frame = ({ children }: { children: React.ReactNode }) => (
  <View style={{ width: 360, padding: 16 }}>{children}</View>
);

export const Default: Story = {
  render: () => (
    <Frame>
      <ProfileHeader
        name="Sofia Lindqvist"
        handle="sofialifts"
        avatar={AVATAR}
        cover={COVER}
        verified
        bio="Olympic-style lifter chasing a stable 7-day baseline. Caffeine-cutter, early sleeper, forecast believer. 90-day club, week 11."
        stats={STATS}
        action={<Button variant="primary" size="sm" title="Follow" />}
      />
    </Frame>
  ),
};

export const NoCover: Story = {
  render: () => (
    <Frame>
      <ProfileHeader
        name="Sofia Lindqvist"
        handle="sofialifts"
        avatar={AVATAR}
        verified
        bio="Brand gradient cover fallback when no banner image is supplied."
        stats={STATS}
        action={<Button variant="primary" size="sm" title="Follow" />}
      />
    </Frame>
  ),
};

export const Minimal: Story = {
  render: () => (
    <Frame>
      <ProfileHeader name="Jordan Reyes" />
    </Frame>
  ),
};
