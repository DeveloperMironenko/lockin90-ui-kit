import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { ProgressBar } from '../components/ProgressBar';

const meta = { title: 'Native/ProgressBar' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Determinate: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <ProgressBar value={0.73} />
    </View>
  ),
};

export const WithLabelAndValue: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <ProgressBar value={0.73} label="Syncing history" showValue />
    </View>
  ),
};

export const Indeterminate: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <ProgressBar label="Loading" />
    </View>
  ),
};

export const Showcase: Story = {
  render: () => (
    <View style={{ width: 320, gap: 20 }}>
      <ProgressBar value={0.2} />
      <ProgressBar value={0.5} label="Determinate" showValue />
      <ProgressBar value={0.85} height={12} />
      <ProgressBar value={1} label="Complete" showValue />
      <ProgressBar label="Indeterminate" />
      <ProgressBar height={4} gradient={['#7C5CFF', '#22D3EE']} rounded={false} value={0.4} />
    </View>
  ),
};
