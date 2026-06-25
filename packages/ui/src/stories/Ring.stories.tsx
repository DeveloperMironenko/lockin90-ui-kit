import type { Meta, StoryObj } from '@storybook/react-vite';
import { Ring } from '../components/Ring';

const meta = {
  title: 'Primitives/Ring',
  component: Ring,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Ring>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

export const Gradient: StoryObj<typeof meta> = {
  args: { gradient: ['#7C5CFF', '#A8FF35'], value: 84 },
};

export const Sizes: StoryObj<typeof meta> = {
  render: () => (
    <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
      <Ring size={64} value={38} color="var(--zone-low)" thickness={5} />
      <Ring size={90} value={64} color="var(--cyan)" thickness={6} />
      <Ring size={120} value={88} color="var(--mint)" thickness={8} />
    </div>
  ),
};
