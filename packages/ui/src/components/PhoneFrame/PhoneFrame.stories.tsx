import type { Meta, StoryObj } from '@storybook/react-vite';
import PhoneFrame from './index';

const meta = {
  title: 'Layout/PhoneFrame',
  component: PhoneFrame,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof PhoneFrame>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <PhoneFrame>
      <div style={{ position: 'relative', height: '100%', padding: 24 }}>
        <div className="ea-eyebrow">Today · Wed Jun 11</div>
        <div className="font-display font-bold text-white" style={{ fontSize: 30, letterSpacing: '-0.02em' }}>
          Energy
        </div>
        <div className="ea-card ea-card-lit" style={{ marginTop: 20 }}>
          <div className="ea-num text-white" style={{ fontSize: 56 }}>78</div>
          <div className="ea-eyebrow" style={{ marginTop: 6 }}>HIGH ZONE</div>
        </div>
      </div>
    </PhoneFrame>
  ),
};
