import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { DeltaPill } from '../components/DeltaPill';

const meta = { title: 'Native/DeltaPill' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Up: Story = {
  render: () => (
    <View style={{ alignItems: 'flex-start' }}>
      <DeltaPill value="+12%" />
    </View>
  ),
};

export const Down: Story = {
  render: () => (
    <View style={{ alignItems: 'flex-start' }}>
      <DeltaPill value="-3.4%" />
    </View>
  ),
};

export const Flat: Story = {
  render: () => (
    <View style={{ alignItems: 'flex-start' }}>
      <DeltaPill value={0} direction="flat" />
    </View>
  ),
};

export const Small: Story = {
  render: () => (
    <View style={{ alignItems: 'flex-start' }}>
      <DeltaPill value="+6ms" size="sm" />
    </View>
  ),
};

export const IconOnly: Story = {
  render: () => (
    <View style={{ alignItems: 'flex-start' }}>
      <DeltaPill value="+1" iconOnly />
    </View>
  ),
};

export const Gallery: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
      <DeltaPill value="+8" />
      <DeltaPill value="+14%" />
      <DeltaPill value="-5%" />
      <DeltaPill value={0} direction="flat" />
      <DeltaPill value="+6ms" size="sm" />
      <DeltaPill value="-2" size="sm" />
      <DeltaPill value="+1" iconOnly />
    </View>
  ),
};
