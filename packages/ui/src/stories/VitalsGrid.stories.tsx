import type { Meta, StoryObj } from '@storybook/react-vite';
import { VitalsGrid } from '../components/VitalsGrid';

const meta = {
  title: 'Components/VitalsGrid',
  component: VitalsGrid,
} satisfies Meta<typeof VitalsGrid>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };
