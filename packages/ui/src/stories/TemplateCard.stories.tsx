import type { Meta, StoryObj } from '@storybook/react-vite';
import { TemplateCard } from '../components/TemplateCard';
import { Icon } from '../components/Icon';

const meta: Meta<typeof TemplateCard> = {
  title: 'Primitives/TemplateCard',
  component: TemplateCard,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: 380 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof TemplateCard>;

export const Default: Story = {
  args: {
    name: 'Push Day A',
    meta: 'Chest · Arms · 5 ex · ~48m',
    lastUsed: 'Last used 2d ago',
  },
};

export const CoachTemplate: Story = {
  args: {
    name: '5×5 Strength',
    meta: 'Full body · 5 ex · ~52m',
    lastUsed: 'Last used 5d ago',
    source: 'coach',
    tint: 'var(--mint)',
    onPress: () => {},
  },
};

export const AiTemplate: Story = {
  args: {
    name: 'Peaking Block · W3',
    meta: 'Squat focus · 4 ex · ~40m',
    source: 'ai',
    tint: 'var(--accent)',
    onPress: () => {},
  },
};

export const WithTrailing: Story = {
  args: {
    name: 'Pull Day B',
    meta: 'Back · Biceps · 6 ex · ~55m',
    lastUsed: 'Last used yesterday',
    tint: 'var(--cyan)',
    onPress: () => {},
    trailing: <Icon name="chevron" size={16} />,
  },
};

export const List: Story = {
  args: { name: 'Push Day A' },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
      <TemplateCard name="Push Day A" meta="Chest · Arms · 5 ex · ~48m" lastUsed="Last used 2d ago" tint="var(--cyan)" onPress={() => {}} />
      <TemplateCard name="5×5 Strength" meta="Full body · 5 ex · ~52m" source="coach" tint="var(--mint)" onPress={() => {}} />
      <TemplateCard name="Peaking Block · W3" meta="Squat focus · 4 ex · ~40m" source="ai" tint="var(--accent)" onPress={() => {}} />
    </div>
  ),
};
