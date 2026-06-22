import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { NoteField } from '../components/NoteField';

const meta = {
  title: 'Native/NoteField',
  component: NoteField,
} satisfies Meta<typeof NoteField>;
export default meta;

type Story = StoryObj<typeof NoteField>;

export const Default: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <NoteField label="Private notes" />
    </View>
  ),
};

export const Filled: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <NoteField label="Private notes" defaultValue="Keep elbows tucked, pause at chest." />
    </View>
  ),
};

export const NoLabel: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <NoteField placeholder="What's on your mind?" />
    </View>
  ),
};
