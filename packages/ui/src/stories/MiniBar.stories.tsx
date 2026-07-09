import type { Meta, StoryObj } from '@storybook/react-vite';
import { MiniBar } from '../admin/MiniBar';

const meta = {
  title: 'Admin/MiniBar',
  component: MiniBar,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof MiniBar>;
export default meta;

type Story = StoryObj<typeof meta>;

/* A labelled proportion row — label · fill bar (value/max) · caption. The
   value/max track is delegated to the canonical Meter (track-only mode). */
export const Default: Story = {
  args: { label: 'PRO', value: 29, max: 40, caption: '3 · $29k', tone: 'flux' },
};

export const Tones: Story = {
  args: { label: 'PRO', value: 29, max: 40 },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 360 }}>
      <MiniBar label="PRO" value={29} max={40} caption="3 · $29k" tone="flux" />
      <MiniBar label="COACH" value={12} max={40} caption="1 · $12k" tone="mint" />
      <MiniBar label="TEAM" value={8} max={40} caption="2 · $8k" tone="cyan" />
      <MiniBar label="FREE" value={4} max={40} caption="120" tone="neutral" />
    </div>
  ),
};
