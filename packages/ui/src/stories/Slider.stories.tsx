import type { Meta, StoryObj } from '@storybook/react-vite';
import { Slider } from '../components/Slider';

const meta = {
  title: 'Primitives/Slider',
  component: Slider,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Slider>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

export const Mint: StoryObj<typeof meta> = {
  args: { value: 64, fill: 'var(--grad-mint)', glow: 'var(--mint)' },
};

export const Warm: StoryObj<typeof meta> = {
  args: { value: 40, fill: 'linear-gradient(90deg, var(--zone-low), var(--accent))' },
};

export const WithLabels: StoryObj<typeof meta> = {
  args: {
    value: 2,
    min: 0,
    max: 4,
    labels: ['Rough', 'Low', 'OK', 'Good', 'Great'],
  },
};
