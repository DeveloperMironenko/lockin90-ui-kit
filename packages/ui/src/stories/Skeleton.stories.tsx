import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from '../components/Skeleton';

const meta = {
  title: 'Primitives/Skeleton',
  component: Skeleton,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Skeleton>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: { width: 240, height: 16 } };
