import type { Meta, StoryObj } from '@storybook/react-vite';
import Chip from './index';

const meta = {
  title: 'Primitives/Chip',
  component: Chip,
  args: { children: 'HIGH ZONE', tone: 'high', dot: true },
  argTypes: {
    tone: { control: 'inline-radio', options: ['neutral', 'high', 'mid', 'low', 'accent'] },
    dot: { control: 'boolean' },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const High: Story = { args: { tone: 'high', children: 'HIGH ZONE', dot: true } };
export const Mid: Story = { args: { tone: 'mid', children: 'MODERATE', dot: true } };
export const Low: Story = { args: { tone: 'low', children: 'AFTERNOON DIP', dot: true } };
export const Accent: Story = { args: { tone: 'accent', children: 'NEW PATTERN', dot: true } };
export const Neutral: Story = { args: { tone: 'neutral', children: '14 EVENTS', dot: false } };

export const Row: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Chip tone="high" dot>+6 vs avg</Chip>
      <Chip tone="mid" dot>caffeine late</Chip>
      <Chip tone="low" dot>poor sleep</Chip>
      <Chip tone="accent" dot>detected</Chip>
      <Chip tone="neutral">synthetic</Chip>
    </div>
  ),
};
