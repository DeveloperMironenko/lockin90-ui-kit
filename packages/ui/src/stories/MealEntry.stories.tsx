import type { Meta, StoryObj } from '@storybook/react-vite';
import { MealEntry } from '../components/MealEntry';

const meta = {
  title: 'Components/MealEntry',
  component: MealEntry,
} satisfies Meta<typeof MealEntry>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };
