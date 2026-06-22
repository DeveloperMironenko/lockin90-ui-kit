import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View, Text } from 'react-native';
import { Sheet } from '../components/Sheet';

const meta = { title: 'Native/Sheet' } satisfies Meta;
export default meta;

type Story = StoryObj;

const rowStyle = {
  paddingVertical: 14,
  paddingHorizontal: 4,
  borderBottomWidth: 1,
  borderBottomColor: 'rgba(255,255,255,0.08)',
} as const;

export const Bottom: Story = {
  render: () => (
    <Sheet open side="bottom" title="Choose set type">
      <View>
        <Text style={[rowStyle, { color: '#fff' }]}>Working set</Text>
        <Text style={[rowStyle, { color: '#fff' }]}>Warm-up</Text>
        <Text style={[rowStyle, { color: '#fff' }]}>Drop set</Text>
        <Text style={{ paddingVertical: 14, paddingHorizontal: 4, color: '#fff' }}>Failure</Text>
      </View>
    </Sheet>
  ),
};

export const Right: Story = {
  render: () => (
    <Sheet open side="right" title="Filters">
      <View>
        <Text style={[rowStyle, { color: '#fff' }]}>Date range</Text>
        <Text style={[rowStyle, { color: '#fff' }]}>Energy zone</Text>
        <Text style={{ paddingVertical: 14, paddingHorizontal: 4, color: '#fff' }}>Source</Text>
      </View>
    </Sheet>
  ),
};
