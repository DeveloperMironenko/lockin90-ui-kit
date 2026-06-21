import type { Meta, StoryObj } from '@storybook/react-vite';
import { GlycemicCurve } from '../components/GlycemicCurve';

const meta = {
  title: 'Components/GlycemicCurve',
  component: GlycemicCurve,
} satisfies Meta<typeof GlycemicCurve>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };
