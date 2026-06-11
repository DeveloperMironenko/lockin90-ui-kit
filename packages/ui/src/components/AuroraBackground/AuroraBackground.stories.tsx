import type { Meta, StoryObj } from '@storybook/react-vite';
import AuroraBackground from './index';

const meta = {
  title: 'Layout/AuroraBackground',
  component: AuroraBackground,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AuroraBackground>;

export default meta;
type Story = StoryObj; // full-bleed demo

export const Default: Story = {
  render: () => (
    <div style={{ position: 'relative', minHeight: 420, background: 'var(--bg-base)' }}>
      <AuroraBackground grid />
      <div style={{ position: 'relative', zIndex: 1, padding: 48 }}>
        <div className="font-display font-bold text-white" style={{ fontSize: 40, letterSpacing: '-0.02em' }}>
          Aurora background
        </div>
        <p className="text-secondary" style={{ maxWidth: 420 }}>
          Drifting energy-spectrum blobs sit behind every screen. Content lives in a
          relative, z-indexed layer above it.
        </p>
      </div>
    </div>
  ),
};
