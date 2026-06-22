import type { Meta, StoryObj } from '@storybook/react-vite';
import { CharCounter } from '../components/CharCounter';

const meta = {
  title: 'Primitives/CharCounter',
  component: CharCounter,
} satisfies Meta<typeof CharCounter>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Ok: Story = { args: { value: 42, max: 160 } };

export const Warn: Story = { args: { value: 150, max: 160 } };

export const Over: Story = { args: { value: 206, max: 160 } };

export const AtLimit: Story = { args: { value: 60, max: 60 } };

export const CountOnly: Story = { args: { value: 88, max: 120, showBar: false } };

export const BarOnly: Story = { args: { value: 88, max: 120, showCount: false } };

export const CustomFormat: Story = {
  args: { value: 88, max: 120, format: (v, m) => `${m - v} left` },
};
