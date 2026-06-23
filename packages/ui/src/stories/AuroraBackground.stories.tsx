import type { Meta, StoryObj } from '@storybook/react-vite';
import { AuroraBackground, type AuroraBackgroundProps } from '../components/AuroraBackground';

// The backdrop is position:absolute inset-0, so frame it in a tall,
// relatively-positioned, void-colored stage with foreground content above it.
function Stage(props: AuroraBackgroundProps) {
  return (
    <div
      style={{
        position: 'relative',
        minHeight: 460,
        overflow: 'hidden',
        borderRadius: 'var(--r, 16px)',
        background: 'var(--bg-0, #080A12)',
      }}
    >
      <AuroraBackground {...props} />
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          placeItems: 'center',
          minHeight: 460,
          padding: 32,
          textAlign: 'center',
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontFamily: 'var(--font-display, system-ui)',
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--text, #EEF1F8)',
            }}
          >
            Aurora Flux
          </h2>
          <p style={{ marginTop: 8, color: 'var(--text-dim, #AAB2C6)', fontFamily: 'var(--font-ui, system-ui)' }}>
            Drifting energy-spectrum blobs + grid veil, behind your content.
          </p>
        </div>
      </div>
    </div>
  );
}

const meta = {
  title: 'Primitives/AuroraBackground',
  component: AuroraBackground,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'subtle', 'vivid'] },
    grid: { control: 'boolean' },
  },
  render: (args) => <Stage {...args} />,
} satisfies Meta<typeof AuroraBackground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { variant: 'default', grid: true } };
export const Subtle: Story = { args: { variant: 'subtle', grid: true } };
export const Vivid: Story = { args: { variant: 'vivid', grid: true } };
export const NoGrid: Story = { args: { variant: 'default', grid: false } };
