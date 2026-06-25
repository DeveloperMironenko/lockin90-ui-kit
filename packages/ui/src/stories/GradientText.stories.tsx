import type { Meta, StoryObj } from '@storybook/react-vite';
import { GradientText } from '../components/GradientText';

const meta = {
  title: 'Primitives/GradientText',
  component: GradientText,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof GradientText>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: { children: 'LockIn90' } };
