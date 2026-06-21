import type { Meta, StoryObj } from '@storybook/react-vite';
import { AchievementBadges } from '../components/AchievementBadges';

const meta = {
  title: 'Components/AchievementBadges',
  component: AchievementBadges,
} satisfies Meta<typeof AchievementBadges>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };
