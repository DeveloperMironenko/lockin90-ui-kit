import type { Meta, StoryObj } from '@storybook/react-vite';
import { BarFill } from '../components/BarFill';

const meta = {
  title: 'Primitives/BarFill',
  component: BarFill,
} satisfies Meta<typeof BarFill>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: { value: 0.72 } };
