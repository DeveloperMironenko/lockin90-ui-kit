import type { Meta, StoryObj } from '@storybook/react-vite';
import { DeltaPill } from '../components/DeltaPill';

const meta = {
  title: 'Primitives/DeltaPill',
  component: DeltaPill,
} satisfies Meta<typeof DeltaPill>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Up: Story = { args: { value: '+12%' } };
export const Down: Story = { args: { value: '-3.4%' } };
export const Flat: Story = { args: { value: 0, direction: 'flat' } };

export const InferredFromNumber: Story = { args: { value: 8 } };

export const Small: Story = { args: { value: '+6ms', size: 'sm' } };

export const IconOnly: Story = { args: { value: '+1', iconOnly: true } };

export const ForcedTone: Story = {
  args: { value: '+22%', direction: 'down', tone: 'down' },
};

export const Gallery: Story = {
  args: { value: '+8' },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
      <DeltaPill value="+8" />
      <DeltaPill value="+14%" />
      <DeltaPill value="-5%" />
      <DeltaPill value={0} direction="flat" />
      <DeltaPill value="+6ms" size="sm" />
      <DeltaPill value="-2" size="sm" />
      <DeltaPill value="+1" iconOnly />
    </div>
  ),
};
