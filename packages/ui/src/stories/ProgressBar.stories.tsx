import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar } from '../components/ProgressBar';

const meta = {
  title: 'Primitives/ProgressBar',
  component: ProgressBar,
} satisfies Meta<typeof ProgressBar>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Determinate: Story = { args: { value: 0.73 } };

export const WithLabelAndValue: Story = {
  args: { value: 0.73, label: 'Syncing history', showValue: true },
};

export const Indeterminate: Story = { args: { label: 'Loading' } };

export const Showcase: Story = {
  render: () => (
    <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <ProgressBar value={0.2} />
      <ProgressBar value={0.5} label="Determinate" showValue />
      <ProgressBar value={0.85} height={12} />
      <ProgressBar value={1} label="Complete" showValue />
      <ProgressBar label="Indeterminate" />
      <ProgressBar height={4} gradient="var(--grad-cta)" rounded={false} value={0.4} />
    </div>
  ),
};
