import type { Meta, StoryObj } from '@storybook/react-vite';
import { SupplementCard } from '../components/SupplementCard';

const meta = {
  title: 'Components/SupplementCard',
  component: SupplementCard,
} satisfies Meta<typeof SupplementCard>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };
