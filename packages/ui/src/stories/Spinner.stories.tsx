import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from '../components/Spinner';

const meta = {
  title: 'Primitives/Spinner',
  component: Spinner,
} satisfies Meta<typeof Spinner>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: { size: 24 } };

export const Large: StoryObj<typeof meta> = { args: { size: 52, thickness: 4.5 } };

export const Mint: StoryObj<typeof meta> = { args: { size: 34, color: 'var(--mint)' } };
