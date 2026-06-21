import type { Meta, StoryObj } from '@storybook/react-vite';
import { WorkoutTemplate } from '../components/WorkoutTemplate';

const meta = {
  title: 'Components/WorkoutTemplate',
  component: WorkoutTemplate,
} satisfies Meta<typeof WorkoutTemplate>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };
