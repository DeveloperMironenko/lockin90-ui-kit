import type { Meta, StoryObj } from '@storybook/react-vite';
import { CodeBlock } from '../components/CodeBlock';

const meta = {
  title: 'Primitives/CodeBlock',
  component: CodeBlock,
} satisfies Meta<typeof CodeBlock>;
export default meta;

const JSON_SAMPLE = `{
  "id": "evt_7f33a1",
  "userId": 4821,
  "kind": "substance.caffeine",
  "at": "2026-06-15T07:42:11Z",
  "payload": { "caffeineMg": 180, "vehicle": "espresso" },
  "deleted": false
}`;

export const Default: StoryObj<typeof meta> = {
  args: { code: JSON_SAMPLE, label: 'events/evt_7f33a1.json · 1.4 KB' },
};

export const IncidentId: StoryObj<typeof meta> = {
  args: { code: 'INC-7F3A-9C20-E4', label: 'Incident reference' },
};

export const NoHeader: StoryObj<typeof meta> = {
  args: { code: JSON_SAMPLE, copyable: false },
};

export const Wrapped: StoryObj<typeof meta> = {
  args: {
    code: 'curl -s https://api.lockin90.com/v1/events/evt_7f33a1 -H "Authorization: Bearer sk_live_8f2a...redacted" | jq .payload',
    label: 'Response',
    wrap: true,
  },
};

export const Capped: StoryObj<typeof meta> = {
  args: { code: JSON_SAMPLE + '\n' + JSON_SAMPLE + '\n' + JSON_SAMPLE, label: 'Raw payload', maxHeight: 140 },
};
