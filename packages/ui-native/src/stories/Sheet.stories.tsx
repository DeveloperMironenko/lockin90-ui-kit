import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View, Text, Pressable } from 'react-native';
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

function BottomDemo() {
  const [open, setOpen] = useState(true);
  return (
    <View>
      <Pressable onPress={() => setOpen(true)} style={{ padding: 12 }}>
        <Text style={{ color: '#fff' }}>Open sheet</Text>
      </Pressable>
      <Sheet open={open} onClose={() => setOpen(false)} side="bottom" title="Choose set type">
        <View>
          <Text style={[rowStyle, { color: '#fff' }]}>Working set</Text>
          <Text style={[rowStyle, { color: '#fff' }]}>Warm-up</Text>
          <Text style={[rowStyle, { color: '#fff' }]}>Drop set</Text>
          <Text style={{ paddingVertical: 14, paddingHorizontal: 4, color: '#fff' }}>Failure</Text>
        </View>
      </Sheet>
    </View>
  );
}

export const Bottom: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Drag the handle (or the title strip) down to dismiss — past ~25% of the sheet height, or with a quick downward fling. A shorter drag springs back.',
      },
    },
  },
  render: () => <BottomDemo />,
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
