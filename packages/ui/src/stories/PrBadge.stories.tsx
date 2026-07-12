import type { Meta, StoryObj } from '@storybook/react-vite';
import { PrBadge } from '../components/PrBadge';

const meta = {
  title: 'Primitives/PrBadge',
  component: PrBadge,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof PrBadge>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = { args: { size: 'sm' } };

export const StateTags: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <PrBadge />
      <PrBadge label="NEW" />
      <PrBadge label="AT PEAK" />
      <PrBadge label="PR" size="sm" />
    </div>
  ),
};
