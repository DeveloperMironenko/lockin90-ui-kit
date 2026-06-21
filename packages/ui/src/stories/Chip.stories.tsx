import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip } from '../components/Chip';

const meta = {
  title: 'Primitives/Chip',
  component: Chip,
} satisfies Meta<typeof Chip>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: { children: 'on track', tone: 'high', dot: true } };
