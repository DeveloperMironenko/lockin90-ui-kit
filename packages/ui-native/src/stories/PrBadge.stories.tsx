import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { PrBadge } from '../components/PrBadge';

const meta = { title: 'Native/PrBadge' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <View style={{ alignItems: 'flex-start' }}>
      <PrBadge />
    </View>
  ),
};

export const Small: Story = {
  render: () => (
    <View style={{ alignItems: 'flex-start' }}>
      <PrBadge size="sm" />
    </View>
  ),
};

export const StateTags: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <PrBadge />
      <PrBadge label="NEW" />
      <PrBadge label="AT PEAK" />
      <PrBadge label="PR" size="sm" />
    </View>
  ),
};
