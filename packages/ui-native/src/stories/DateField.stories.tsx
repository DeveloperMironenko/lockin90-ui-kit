import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { DateField, TreeItem } from '../components/DateField';

const meta = { title: 'Native/DateField' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <DateField label="Publish date" value="2026-06-21" />
    </View>
  ),
};

export const Empty: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <DateField label="Start date" placeholder="YYYY-MM-DD" />
    </View>
  ),
};

export const Tree: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <TreeItem label="Product" depth={0} expandable expanded active dragHandle>
        <TreeItem label="Features" depth={1} dragHandle />
        <TreeItem label="Science" depth={1} dragHandle />
      </TreeItem>
    </View>
  ),
};
