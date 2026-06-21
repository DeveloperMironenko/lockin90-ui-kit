import type { Meta, StoryObj } from '@storybook/react-vite';
import { WorkoutSetLogger } from '../components/WorkoutSetLogger';

const meta = {
  title: 'Components/WorkoutSetLogger',
  component: WorkoutSetLogger,
} satisfies Meta<typeof WorkoutSetLogger>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };
