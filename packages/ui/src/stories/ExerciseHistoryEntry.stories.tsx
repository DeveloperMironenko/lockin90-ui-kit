import type { Meta, StoryObj } from '@storybook/react-vite';
import { ExerciseHistoryEntry } from '../components/ExerciseHistoryEntry';

const meta = {
  title: 'Components/ExerciseHistoryEntry',
  component: ExerciseHistoryEntry,
} satisfies Meta<typeof ExerciseHistoryEntry>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };
