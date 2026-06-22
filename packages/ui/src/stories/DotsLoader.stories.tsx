import type { Meta, StoryObj } from '@storybook/react-vite';
import { DotsLoader } from '../components/DotsLoader';

const meta = {
  title: 'Primitives/DotsLoader',
  component: DotsLoader,
} satisfies Meta<typeof DotsLoader>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };

export const TypingIndicator: Story = {
  args: { size: 6, color: 'var(--text-dim)', gap: 4 },
};

export const Mint: Story = {
  args: { color: 'var(--mint)', size: 9 },
};

export const FourDots: Story = {
  args: { count: 4, size: 8 },
};
