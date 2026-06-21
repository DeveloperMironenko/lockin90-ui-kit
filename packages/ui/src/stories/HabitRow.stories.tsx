import type { Meta, StoryObj } from '@storybook/react-vite';
import { HabitRow } from '../components/HabitRow';

const meta = {
  title: 'Components/HabitRow',
  component: HabitRow,
} satisfies Meta<typeof HabitRow>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };
