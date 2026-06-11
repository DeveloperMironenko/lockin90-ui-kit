import type { Meta, StoryObj } from '@storybook/react-vite';
import Marquee from './index';

const meta = {
  title: 'Layout/Marquee',
  component: Marquee,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Marquee>;

export default meta;
type Story = StoryObj;

const items = ['Oura', 'WHOOP', 'Apple Health', 'Garmin', 'Polar', 'Withings', 'Fitbit', 'Coros'];

export const Integrations: Story = {
  render: () => (
    <div style={{ padding: '32px 0', background: 'var(--bg-base)' }}>
      <Marquee speed={28}>
        {items.map((n) => (
          <span
            key={n}
            className="ea-glass font-mono text-[12px] text-secondary"
            style={{ padding: '8px 16px', whiteSpace: 'nowrap' }}
          >
            {n}
          </span>
        ))}
      </Marquee>
    </div>
  ),
};
