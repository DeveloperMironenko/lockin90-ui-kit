import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { TabBar, FAB } from '../components/TabBar';

const meta = { title: 'Native/TabBar' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <View style={{ width: 340 }}>
      <TabBar active={0} />
    </View>
  ),
};

export const Fab: Story = {
  render: () => <FAB />,
};

export const ExtendedFab: Story = {
  render: () => <FAB label="Log set" />,
};
