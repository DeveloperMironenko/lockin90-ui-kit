import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from '../components/Input';

const meta = {
  title: 'Primitives/Input',
  component: Input,
  args: { placeholder: '100', label: 'Weight', unit: 'kg' },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Input>;
export default meta;

export const Default: StoryObj<typeof meta> = {};

export const Invalid: StoryObj<typeof meta> = { args: { invalid: true, defaultValue: 'abc' } };

export const Plain: StoryObj<typeof meta> = { args: { label: undefined, unit: undefined, placeholder: 'Search…' } };
