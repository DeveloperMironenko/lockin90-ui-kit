import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ColorPicker } from '../components/ColorPicker';

const meta = {
  title: 'Primitives/ColorPicker',
  component: ColorPicker,
  args: { value: '#7C5CFF', onChange: () => {} },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ColorPicker>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [color, setColor] = useState('#7C5CFF');
    return <ColorPicker value={color} onChange={setColor} label="Category color" />;
  },
};

export const CustomSwatches: Story = {
  render: () => {
    const [color, setColor] = useState('#34F5C5');
    return (
      <ColorPicker
        value={color}
        onChange={setColor}
        label="Accent"
        swatches={['#34F5C5', '#22D3EE', '#6E7BFF', '#FF3D81']}
      />
    );
  },
};

export const WithAlpha: Story = {
  render: () => {
    const [color, setColor] = useState('#7C5CFF80');
    return <ColorPicker value={color} onChange={setColor} allowAlpha label="Overlay tint" />;
  },
};
