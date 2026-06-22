import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { ProGate, LockedRow } from '../components/ProGate';

const meta = {
  title: 'Native/ProGate',
  component: ProGate,
} satisfies Meta<typeof ProGate>;
export default meta;

type Story = StoryObj<typeof ProGate>;

export const Default: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <ProGate />
    </View>
  ),
};

export const WithContent: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <ProGate>
        <View style={{ height: 160, backgroundColor: '#7C4DFF', borderRadius: 8 }} />
      </ProGate>
    </View>
  ),
};

export const Locked: Story = {
  render: () => (
    <View style={{ width: 320, gap: 12 }}>
      <LockedRow />
      <LockedRow label="12 more PRs this month" />
    </View>
  ),
};
