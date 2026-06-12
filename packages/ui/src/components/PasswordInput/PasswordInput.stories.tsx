import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import PasswordInput from './index';

const meta: Meta<typeof PasswordInput> = {
  title: 'Forms/PasswordInput',
  component: PasswordInput,
  args: { placeholder: 'Password' },
};
export default meta;

type Story = StoryObj<typeof PasswordInput>;

export const Default: Story = {
  render: (args) => {
    const [v, setV] = useState('');
    return <PasswordInput {...args} value={v} onChange={(e) => setV(e.target.value)} autoComplete="current-password" />;
  },
};

export const Invalid: Story = {
  render: (args) => {
    const [v, setV] = useState('hunter2');
    return <PasswordInput {...args} invalid value={v} onChange={(e) => setV(e.target.value)} />;
  },
};

export const Disabled: Story = {
  args: { disabled: true, value: 'secret' },
};
