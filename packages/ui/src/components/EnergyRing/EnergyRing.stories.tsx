import type { Meta, StoryObj } from '@storybook/react-vite';
import EnergyRing from './index';

const meta = {
  title: 'Visualizations/EnergyRing',
  component: EnergyRing,
  args: { score: 72, size: 260, animate: false },
  argTypes: {
    score: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    size: { control: { type: 'range', min: 120, max: 320, step: 10 } },
    animate: { control: 'boolean' },
  },
} satisfies Meta<typeof EnergyRing>;

export default meta;
type Story = StoryObj<typeof meta>;

export const High: Story = { args: { score: 88 } };
export const Mid: Story = { args: { score: 64 } };
export const Low: Story = { args: { score: 31 } };

export const Animated: Story = { args: { score: 76, animate: true } };
