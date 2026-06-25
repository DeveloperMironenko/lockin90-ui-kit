import type { Meta, StoryObj } from '@storybook/react-vite';
import { Menu } from '../components/Menu';

const meta = {
  title: 'Primitives/Menu',
  component: Menu,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Menu>;
export default meta;

export const Default: StoryObj<typeof meta> = {};

export const LeftAlign: StoryObj<typeof meta> = {
  args: { align: 'left' },
};
