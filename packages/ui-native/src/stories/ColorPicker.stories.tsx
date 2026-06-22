import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { View } from 'react-native';
import { ColorPicker } from '../components/ColorPicker';

const meta = { title: 'Native/ColorPicker' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const [color, setColor] = useState('#7C5CFF');
    return (
      <View style={{ width: 320, padding: 16 }}>
        <ColorPicker value={color} onChange={setColor} label="Category color" />
      </View>
    );
  },
};

export const CustomSwatches: Story = {
  render: () => {
    const [color, setColor] = useState('#34F5C5');
    return (
      <View style={{ width: 320, padding: 16 }}>
        <ColorPicker
          value={color}
          onChange={setColor}
          label="Accent"
          swatches={['#34F5C5', '#22D3EE', '#6E7BFF', '#FF3D81']}
        />
      </View>
    );
  },
};

export const WithAlpha: Story = {
  render: () => {
    const [color, setColor] = useState('#7C5CFF80');
    return (
      <View style={{ width: 320, padding: 16 }}>
        <ColorPicker value={color} onChange={setColor} allowAlpha label="Overlay tint" />
      </View>
    );
  },
};
