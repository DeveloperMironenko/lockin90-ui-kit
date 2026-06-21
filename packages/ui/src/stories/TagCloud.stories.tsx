import type { Meta, StoryObj } from '@storybook/react-vite';
import { TagCloud } from '../components/TagCloud';

const meta = {
  title: 'Components/TagCloud',
  component: TagCloud,
} satisfies Meta<typeof TagCloud>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };
