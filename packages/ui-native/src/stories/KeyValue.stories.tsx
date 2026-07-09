import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { KeyValue, type KeyValueRow } from '../components/KeyValue';
import { StatusDot } from '../components/StatusDot';

const meta = { title: 'Native/KeyValue' } satisfies Meta;
export default meta;

const ROWS: KeyValueRow[] = [
  { key: 'Plan', value: 'Pro' },
  { key: 'MRR', value: '$29.00' },
  { key: 'Member since', value: 'Jan 2026' },
];

export const Default: StoryObj = {
  render: () => (
    <View style={{ width: 320 }}>
      <KeyValue rows={ROWS} />
    </View>
  ),
};

export const Inline: StoryObj = {
  render: () => (
    <View style={{ width: 320 }}>
      <KeyValue rows={ROWS} align="inline" />
    </View>
  ),
};

export const Status: StoryObj = {
  render: () => (
    <View style={{ gap: 12 }}>
      <StatusDot tone="high" label="Online" />
      <StatusDot tone="mid" label="Degraded" />
      <StatusDot tone="low" label="Down" />
      <StatusDot tone="accent" label="Syncing" pulse />
    </View>
  ),
};
