import type { Meta, StoryObj } from '@storybook/react-vite';
import { Leaderboard } from '../components/Leaderboard';

const meta = {
  title: 'Components/Leaderboard',
  component: Leaderboard,
} satisfies Meta<typeof Leaderboard>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };
