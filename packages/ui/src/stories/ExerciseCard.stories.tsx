import type { Meta, StoryObj } from '@storybook/react-vite';
import { ExerciseCard } from '../components/ExerciseCard';

const meta = {
  title: 'Components/ExerciseCard',
  component: ExerciseCard,
} satisfies Meta<typeof ExerciseCard>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };
