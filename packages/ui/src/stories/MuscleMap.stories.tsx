import type { Meta, StoryObj } from '@storybook/react-vite';
import { MuscleMap } from '../components/MuscleMap';

const meta = {
  title: 'Components/MuscleMap',
  component: MuscleMap,
} satisfies Meta<typeof MuscleMap>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };
