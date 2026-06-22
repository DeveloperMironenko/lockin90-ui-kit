import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { Sparkline } from '../components/Sparkline';

const meta = { title: 'Native/Sparkline' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <View style={{ width: 340 }}>
      <Sparkline />
    </View>
  ),
};

export const Area: Story = {
  render: () => (
    <View style={{ width: 340 }}>
      <Sparkline fill color="#7C5CFF" width={200} height={48} />
    </View>
  ),
};

export const Down: Story = {
  render: () => (
    <View style={{ width: 340 }}>
      <Sparkline data={[80, 76, 70, 66, 60, 55, 48]} color="#FF4D6D" width={200} height={48} />
    </View>
  ),
};
