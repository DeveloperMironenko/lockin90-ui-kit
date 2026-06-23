import type { Meta, StoryObj } from '@storybook/react-vite';
import { PulseStrip } from '../admin/PulseStrip';

const meta = {
  title: 'Admin/PulseStrip',
  component: PulseStrip,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof PulseStrip>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Live: Story = {
  args: {
    state: 'live',
    items: [
      { swatch: 'var(--mint)', label: 'webhooks now', value: '41/s' },
      { swatch: 'var(--cyan)', label: 'HMAC verify', value: '99.7%' },
      { swatch: 'var(--warn)', label: 'retrying', value: '3' },
      { swatch: 'var(--accent)', label: 'p95 ingest', value: '214 ms' },
    ],
    right: 'pg-boss · wearable-ingest queue · depth 7',
  },
};

export const Idle: Story = {
  args: {
    state: 'idle',
    items: [
      { swatch: 'var(--text-faint)', label: 'webhooks now', value: '0/s' },
      { swatch: 'var(--text-faint)', label: 'HMAC verify', value: '—' },
      { swatch: 'var(--text-faint)', label: 'last event', value: '6m ago' },
    ],
    right: 'pg-boss · wearable-ingest queue · depth 0',
  },
};
