import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { Skeleton } from '../components/Skeleton';

const meta = { title: 'Native/Skeleton' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <Skeleton width={240} height={16} />
    </View>
  ),
};

export const Stack: Story = {
  render: () => (
    <View style={{ width: 320, gap: 10 }}>
      <Skeleton width="60%" height={18} />
      <Skeleton width="100%" height={14} />
      <Skeleton width="90%" height={14} />
      <Skeleton width={120} height={40} radius={12} />
    </View>
  ),
};
