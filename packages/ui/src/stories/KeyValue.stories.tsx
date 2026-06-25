import type { Meta, StoryObj } from '@storybook/react-vite';
import { KeyValue, StatusDot } from '../components/KeyValue';

const meta = {
  title: 'Primitives/KeyValue',
  component: KeyValue,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof KeyValue>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

export const Inline: StoryObj<typeof meta> = { args: { align: 'inline' } };

export const Status: StoryObj<typeof meta> = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <StatusDot tone="high" label="Online" />
      <StatusDot tone="mid" label="Degraded" />
      <StatusDot tone="low" label="Down" />
      <StatusDot tone="accent" label="Syncing" pulse />
    </div>
  ),
};
