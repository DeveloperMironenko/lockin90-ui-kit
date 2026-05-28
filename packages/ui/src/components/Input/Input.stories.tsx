import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input, NumberInput, StandalonePasswordInput, Select } from './index';

const meta = {
  title: 'Primitives/Input',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
  render: () => {
    const [v, setV] = useState('');
    return (
      <div style={{ width: 320 }}>
        <Input id="email" type="email" label="EMAIL" value={v} onChange={setV} placeholder="you@team.com" />
      </div>
    );
  },
};

export const Number: Story = {
  render: () => {
    const [v, setV] = useState('72');
    return (
      <div style={{ width: 320 }}>
        <NumberInput id="weight" label="BODY WEIGHT" value={v} onChange={setV} unit="kg" min={0} max={400} />
      </div>
    );
  },
};

export const Password: Story = {
  render: () => {
    const [v, setV] = useState('');
    return (
      <div style={{ width: 320 }}>
        <StandalonePasswordInput id="pw" label="PASSWORD" value={v} onChange={setV} placeholder="••••••••" />
      </div>
    );
  },
};

export const SelectField: Story = {
  render: () => {
    const [v, setV] = useState('intermediate');
    return (
      <div style={{ width: 320 }}>
        <Select
          id="level"
          label="TRAINING LEVEL"
          value={v}
          onChange={setV}
          options={[
            { value: 'beginner', label: 'Beginner' },
            { value: 'intermediate', label: 'Intermediate' },
            { value: 'advanced', label: 'Advanced' },
          ]}
        />
      </div>
    );
  },
};
