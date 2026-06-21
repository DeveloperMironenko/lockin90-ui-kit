import type { Meta, StoryObj } from '@storybook/react-vite';
import { SimilarExerciseRow } from '../components/SimilarExerciseRow';

const meta = {
  title: 'Components/SimilarExerciseRow',
  component: SimilarExerciseRow,
} satisfies Meta<typeof SimilarExerciseRow>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };
