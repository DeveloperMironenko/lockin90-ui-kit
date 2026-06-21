import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider } from '../components/Divider';

const meta = {
  title: 'Primitives/Divider',
  component: Divider,
} satisfies Meta<typeof Divider>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };
