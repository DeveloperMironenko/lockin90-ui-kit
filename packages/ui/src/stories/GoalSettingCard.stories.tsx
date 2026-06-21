import type { Meta, StoryObj } from '@storybook/react-vite';
import { GoalSettingCard } from '../components/GoalSettingCard';

const meta = {
  title: 'Components/GoalSettingCard',
  component: GoalSettingCard,
} satisfies Meta<typeof GoalSettingCard>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };
