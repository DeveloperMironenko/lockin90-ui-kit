import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { Slider } from '../components/Slider';

const meta = { title: 'Native/Slider' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <Slider value={72} />
    </View>
  ),
};

export const Mint: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <Slider value={64} fill={['#34F5C5', '#22D3EE']} glow="#34F5C5" />
    </View>
  ),
};

export const Warm: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <Slider value={40} fill={['#FF4D6D', '#7C5CFF']} glow="#FF4D6D" />
    </View>
  ),
};
