import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { CodeBlock } from '../components/CodeBlock';

const meta = { title: 'Native/CodeBlock' } satisfies Meta;
export default meta;

type Story = StoryObj;

const JSON_SAMPLE = `{
  "id": "evt_7f33a1",
  "userId": 4821,
  "kind": "substance.caffeine",
  "at": "2026-06-15T07:42:11Z",
  "payload": { "caffeineMg": 180, "vehicle": "espresso" },
  "deleted": false
}`;

export const Default: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <CodeBlock code={JSON_SAMPLE} label="events/evt_7f33a1.json · 1.4 KB" />
    </View>
  ),
};

export const IncidentId: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <CodeBlock code="INC-7F3A-9C20-E4" label="Incident reference" />
    </View>
  ),
};

export const NoHeader: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <CodeBlock code={JSON_SAMPLE} copyable={false} />
    </View>
  ),
};

export const Wrapped: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <CodeBlock
        code={'curl -s https://api.lockin90.com/v1/events/evt_7f33a1 -H "Authorization: Bearer sk_live_8f2a...redacted"'}
        label="Response"
        wrap
      />
    </View>
  ),
};

export const Capped: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <CodeBlock code={`${JSON_SAMPLE}\n${JSON_SAMPLE}\n${JSON_SAMPLE}`} label="Raw payload" maxHeight={140} />
    </View>
  ),
};
