import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import CodeInput from './index';

const meta: Meta<typeof CodeInput> = {
  title: 'Forms/CodeInput',
  component: CodeInput,
};
export default meta;

type Story = StoryObj<typeof CodeInput>;

export const SixDigit: Story = {
  render: () => {
    const [v, setV] = useState('');
    return <CodeInput value={v} onChange={setV} autoFocus />;
  },
};

export const FourDigit: Story = {
  render: () => {
    const [v, setV] = useState('12');
    return <CodeInput value={v} onChange={setV} length={4} />;
  },
};

export const Invalid: Story = {
  render: () => {
    const [v, setV] = useState('123456');
    return <CodeInput value={v} onChange={setV} invalid />;
  },
};

export const Disabled: Story = {
  render: () => <CodeInput value="123" onChange={() => {}} disabled />,
};
