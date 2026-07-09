import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { Meter } from '../components/Meter';

const meta = { title: 'Native/Meter' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <Meter value={72} label="Readiness" showValue unit="%" />
    </View>
  ),
};

export const WithThreshold: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <Meter value={64} label="Energy" showValue unit="%" threshold={80} />
    </View>
  ),
};

export const ToneHigh: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <Meter value={88} label="Recovery" showValue unit="%" tone="high" />
    </View>
  ),
};

export const ToneMid: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <Meter value={52} label="Strain" showValue unit="%" tone="mid" />
    </View>
  ),
};

export const ToneLow: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <Meter value={21} label="Sleep debt" showValue unit="%" tone="low" />
    </View>
  ),
};

export const Segmented: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <Meter value={3} min={0} max={4} label="Password strength" segments={4} tone="high" />
    </View>
  ),
};

export const Confidence: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <Meter value={80} label="Confidence" showValue unit="%" segments={5} />
    </View>
  ),
};
