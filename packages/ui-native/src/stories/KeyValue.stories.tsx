import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { KeyValue, type KeyValueRow } from '../components/KeyValue';

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
