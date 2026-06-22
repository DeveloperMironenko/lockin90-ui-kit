import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toolbar } from '../components/Toolbar';
import { Dropzone } from '../components/Toolbar';

const meta = {
  title: 'Primitives/Toolbar',
  component: Toolbar,
} satisfies Meta<typeof Toolbar>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

export const Upload: StoryObj<typeof meta> = {
  render: () => <Dropzone />,
};
