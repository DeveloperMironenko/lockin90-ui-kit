import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { StatusDot } from '../components/StatusDot';

const meta = { title: 'Native/StatusDot' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <StatusDot tone="high" label="Online" />,
};

export const Tones: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <StatusDot tone="high" label="Online" />
      <StatusDot tone="mid" label="Degraded" />
      <StatusDot tone="low" label="Down" />
      <StatusDot tone="accent" label="Syncing" pulse />
      <StatusDot tone="neutral" label="Idle" />
    </View>
  ),
};
