import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sparkline } from '../components/Sparkline';

const meta = {
  title: 'Primitives/Sparkline',
  component: Sparkline,
} satisfies Meta<typeof Sparkline>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

export const Area: StoryObj<typeof meta> = {
  args: { fill: true, color: 'var(--accent)' },
};

export const Down: StoryObj<typeof meta> = {
  args: { data: [80, 76, 70, 66, 60, 55, 48], color: 'var(--zone-low)' },
};
