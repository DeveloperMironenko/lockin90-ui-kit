import type { Meta, StoryObj } from '@storybook/react-vite';
import { CyclePhaseWheel } from '../components/CyclePhaseWheel';

const meta = {
  title: 'Components/CyclePhaseWheel',
  component: CyclePhaseWheel,
} satisfies Meta<typeof CyclePhaseWheel>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };
