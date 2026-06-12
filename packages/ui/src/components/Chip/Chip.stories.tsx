import type { Meta, StoryObj } from '@storybook/react-vite';
import Chip from './index';

const meta: Meta<typeof Chip> = {
  title: 'Foundation/Chip',
  component: Chip,
  args: { children: 'recovered', tone: 'high', dot: true },
};
export default meta;

type Story = StoryObj<typeof Chip>;

export const Tones: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      <Chip tone="high" dot>
        recovered
      </Chip>
      <Chip tone="mid" dot>
        pending
      </Chip>
      <Chip tone="low" dot>
        re-auth
      </Chip>
      <Chip tone="accent">PRO</Chip>
      <Chip>n = 18 events</Chip>
    </div>
  ),
};
