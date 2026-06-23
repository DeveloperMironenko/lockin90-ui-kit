import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProfileHeader } from '../components/ProfileHeader';
import { Button } from '../components/Button';

const meta = {
  title: 'Primitives/ProfileHeader',
  component: ProfileHeader,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ProfileHeader>;
export default meta;

type Story = StoryObj<typeof meta>;

const AVATAR = 'https://i.pravatar.cc/200?img=47';
const COVER =
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=70';

const STATS = [
  { label: 'Followers', value: '2.4k' },
  { label: 'Following', value: '312' },
  { label: 'Streak', value: '118' },
];

export const Default: Story = {
  args: {
    name: 'Sofia Lindqvist',
    handle: 'sofialifts',
    avatar: AVATAR,
    cover: COVER,
    verified: true,
    bio: 'Olympic-style lifter chasing a stable 7-day baseline. Caffeine-cutter, early sleeper, forecast believer. 90-day club, week 11.',
    stats: STATS,
    action: (
      <Button variant="primary" size="sm">
        Follow
      </Button>
    ),
  },
};

export const NoCover: Story = {
  args: {
    name: 'Sofia Lindqvist',
    handle: 'sofialifts',
    avatar: AVATAR,
    verified: true,
    bio: 'Brand gradient cover fallback when no banner image is supplied.',
    stats: STATS,
    action: (
      <Button variant="primary" size="sm">
        Follow
      </Button>
    ),
  },
};

export const Minimal: Story = {
  args: {
    name: 'Jordan Reyes',
  },
};
