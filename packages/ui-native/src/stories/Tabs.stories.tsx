import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { Tabs } from '../components/Tabs';

const meta = { title: 'Native/Tabs' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <View style={{ width: 340 }}>
      <Tabs />
    </View>
  ),
};

export const FourUp: Story = {
  render: () => (
    <View style={{ width: 340 }}>
      <Tabs tabs={['Stats', 'History', 'Guide', 'Ranks']} active={2} />
    </View>
  ),
};
