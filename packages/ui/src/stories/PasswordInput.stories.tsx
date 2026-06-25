import type { Meta, StoryObj } from '@storybook/react-vite';
import { PasswordInput } from '../components/PasswordInput';

const meta = {
  title: 'Primitives/PasswordInput',
  component: PasswordInput,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof PasswordInput>;
export default meta;

export const Default: StoryObj<typeof meta> = {
  args: { label: 'Password', placeholder: '••••••••' },
};

export const Visible: StoryObj<typeof meta> = {
  args: { label: 'Password', defaultVisible: true, defaultValue: 'hunter2' },
};

export const Invalid: StoryObj<typeof meta> = {
  args: { label: 'Password', invalid: true, defaultValue: 'short' },
};
