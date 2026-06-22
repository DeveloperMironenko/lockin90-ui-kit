import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { Table } from '../components/Table';

const meta = { title: 'Native/Table' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <View style={{ width: 340 }}>
      <Table />
    </View>
  ),
};

export const Dense: Story = {
  render: () => (
    <View style={{ width: 340 }}>
      <Table dense />
    </View>
  ),
};
