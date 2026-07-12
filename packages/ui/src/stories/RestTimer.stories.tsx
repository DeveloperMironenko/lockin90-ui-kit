import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { RestTimer } from '../components/RestTimer';

const meta = {
  title: 'Primitives/RestTimer',
  component: RestTimer,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof RestTimer>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { remainingSec: 95, totalSec: 150 },
};

export const WithTransport: Story = {
  args: {
    remainingSec: 62,
    totalSec: 150,
    sublabel: 'Next: Bench Press · set 3 of 5',
    onSkip: () => {},
  },
};

export const WithHrReadout: Story = {
  args: {
    remainingSec: 45,
    totalSec: 90,
    sublabel: 'Next: Incline DB Press',
    onSkip: () => {},
    trailing: (
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-dim)' }}>♥ 128 bpm</span>
    ),
  },
};

export const Paused: Story = {
  args: { remainingSec: 45, totalSec: 90, paused: true, sublabel: 'Timer held', onSkip: () => {} },
};

export const Live: Story = {
  args: { remainingSec: 90, totalSec: 90 },
  render: (args) => {
    const [left, setLeft] = useState(args.totalSec);
    useEffect(() => {
      const t = setInterval(() => setLeft((v) => (v > 0 ? v - 1 : args.totalSec)), 1000);
      return () => clearInterval(t);
    }, [args.totalSec]);
    return <RestTimer {...args} remainingSec={left} sublabel="Ticking every second" onSkip={() => setLeft(0)} />;
  },
};
