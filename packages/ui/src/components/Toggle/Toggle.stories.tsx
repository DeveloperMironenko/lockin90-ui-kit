import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Toggle from './index';

const meta = {
  title: 'Primitives/Toggle',
  component: Toggle,
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: () => {
    const [on, setOn] = useState(true);
    return <Toggle checked={on} onChange={setOn} label="Share data" />;
  },
};

export const Off: Story = {
  render: () => <Toggle checked={false} onChange={() => {}} label="Off" />,
};

export const Disabled: Story = {
  render: () => <Toggle checked onChange={() => {}} disabled label="Disabled" />,
};
