import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { Pagination, Breadcrumb } from '../components/Pagination';

const meta = {
  title: 'Native/Pagination',
  component: Pagination,
} satisfies Meta<typeof Pagination>;
export default meta;

type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <Pagination />
    </View>
  ),
};

export const Mid: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <Pagination page={5} pageCount={20} />
    </View>
  ),
};

export const Crumbs: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <Breadcrumb />
    </View>
  ),
};
