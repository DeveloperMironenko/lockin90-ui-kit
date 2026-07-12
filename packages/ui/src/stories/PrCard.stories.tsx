import type { Meta, StoryObj } from '@storybook/react-vite';
import { PrCard } from '../components/PrCard';

const meta: Meta<typeof PrCard> = {
  title: 'Primitives/PrCard',
  component: PrCard,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: 240 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof PrCard>;

export const NewRecord: Story = {
  args: {
    name: 'Back Squat',
    kind: 'Estimated 1RM',
    value: '130 kg',
    detail: 'today · +2kg',
    state: 'new',
    onPress: () => {},
  },
};

export const AtPeak: Story = {
  args: {
    name: 'Deadlift',
    kind: 'Estimated 1RM',
    value: '180 kg',
    detail: '3d ago',
    state: 'atPeak',
  },
};

export const OffPeak: Story = {
  args: {
    name: 'Bench Press',
    kind: 'Estimated 1RM',
    value: '95 kg',
    detail: 'peak 102 kg · 5w ago',
    state: 'offPeak',
  },
};

export const Plain: Story = {
  args: {
    name: 'Overhead Press',
    kind: 'Rep max · 5RM',
    value: '55 kg',
  },
};

export const Grid: Story = {
  args: { name: 'Back Squat', kind: 'Estimated 1RM', value: '130 kg' },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, width: 420 }}>
      <PrCard name="Back Squat" kind="Estimated 1RM" value="130 kg" detail="today · +2kg" state="new" onPress={() => {}} />
      <PrCard name="Deadlift" kind="Estimated 1RM" value="180 kg" detail="3d ago" state="atPeak" onPress={() => {}} />
      <PrCard name="Bench Press" kind="Estimated 1RM" value="95 kg" detail="peak 102 kg · 5w ago" state="offPeak" onPress={() => {}} />
      <PrCard name="Overhead Press" kind="Rep max · 5RM" value="55 kg" onPress={() => {}} />
    </div>
  ),
};
