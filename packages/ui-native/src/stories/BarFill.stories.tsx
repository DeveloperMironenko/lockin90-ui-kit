import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { BarFill } from '../components/BarFill';

const meta = {
  title: 'Native/BarFill',
  component: BarFill,
} satisfies Meta<typeof BarFill>;
export default meta;

type Story = StoryObj<typeof BarFill>;

export const Default: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <BarFill value={0.72} />
    </View>
  ),
};

export const Levels: Story = {
  render: () => (
    <View style={{ width: 320, gap: 12 }}>
      <BarFill value={0.2} />
      <BarFill value={0.5} />
      <BarFill value={0.85} />
      <BarFill value={1} height={12} />
    </View>
  ),
};
