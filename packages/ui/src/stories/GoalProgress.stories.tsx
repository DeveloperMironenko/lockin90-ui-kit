import type { Meta, StoryObj } from '@storybook/react-vite';
import { GoalProgress } from '../components/GoalProgress';

const meta = {
  title: 'Components/GoalProgress',
  component: GoalProgress,
} satisfies Meta<typeof GoalProgress>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };
