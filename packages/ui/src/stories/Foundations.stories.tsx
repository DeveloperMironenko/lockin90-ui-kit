import type { Meta, StoryObj } from '@storybook/react-vite';
import { BrandMark } from '../components/BrandMark';

const meta = {
  title: 'Foundations/BrandMark',
  component: BrandMark,
  args: { variant: 'lockup', size: 40 },
} satisfies Meta<typeof BrandMark>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Lockup: Story = {};
export const Mark: Story = { args: { variant: 'mark', size: 56 } };
export const Icon: Story = { args: { variant: 'icon', size: 76 } };
export const Mono: Story = { args: { variant: 'mono', size: 56 } };
