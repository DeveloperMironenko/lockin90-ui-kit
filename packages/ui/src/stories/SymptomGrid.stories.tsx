import type { Meta, StoryObj } from '@storybook/react-vite';
import { SymptomGrid } from '../components/SymptomGrid';

const meta = {
  title: 'Components/SymptomGrid',
  component: SymptomGrid,
} satisfies Meta<typeof SymptomGrid>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };
