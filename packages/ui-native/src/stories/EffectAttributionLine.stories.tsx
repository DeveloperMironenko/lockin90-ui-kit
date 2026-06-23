import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { EffectAttributionLine } from '../components/EffectAttributionLine';

const meta = { title: 'Native/EffectAttributionLine' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Positive: Story = {
  render: () => (
    <View style={{ alignItems: 'flex-start' }}>
      <EffectAttributionLine value={12} unit="pts" label="Deep sleep 1h20m" />
    </View>
  ),
};

export const Negative: Story = {
  render: () => (
    <View style={{ alignItems: 'flex-start' }}>
      <EffectAttributionLine value={-18} unit="m" label="deep sleep / late-caffeine night" />
    </View>
  ),
};

export const Neutral: Story = {
  render: () => (
    <View style={{ alignItems: 'flex-start' }}>
      <EffectAttributionLine value={0} unit="pts" label="no net change" />
    </View>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <View style={{ alignItems: 'flex-start' }}>
      <EffectAttributionLine value={7} unit="pts" label="morning sunlight" icon="sparkle" />
    </View>
  ),
};

export const Stack: Story = {
  render: () => (
    <View style={{ flexDirection: 'column', gap: 14, maxWidth: 360 }}>
      <EffectAttributionLine value={14} unit="pts" label="Deep sleep 1h20m" icon="mood-great" />
      <EffectAttributionLine value={6} unit="pts" label="Morning sunlight 20m" icon="sparkle" />
      <EffectAttributionLine value={-9} unit="pts" label="Late caffeine 14:40" icon="warning" />
      <EffectAttributionLine value={-4} unit="pts" label="Low hydration" />
      <EffectAttributionLine value={0} unit="pts" label="No training load change" />
    </View>
  ),
};
