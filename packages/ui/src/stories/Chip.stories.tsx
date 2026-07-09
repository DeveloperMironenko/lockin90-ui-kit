import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip } from '../components/Chip';

const meta = {
  title: 'Primitives/Chip',
  component: Chip,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Chip>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: { children: 'on track', tone: 'high', dot: true } };

export const Tones: StoryObj<typeof meta> = {
  render: () => (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
      <Chip>default</Chip>
      <Chip tone="neutral">neutral</Chip>
      <Chip tone="high" dot>high</Chip>
      <Chip tone="mid">mid</Chip>
      <Chip tone="low">low</Chip>
      <Chip tone="accent">accent</Chip>
    </div>
  ),
};

/** `size="sm"` is the compact count/status badge (the retired `Badge`): tighter box,
 *  10px tabular mono, filled-gradient accent, and a bare glowing `dot`. */
export const Sizes: StoryObj<typeof meta> = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
      <Chip tone="accent">md</Chip>
      <Chip size="sm" tone="accent">3</Chip>
      <Chip size="sm" tone="high">12</Chip>
      <Chip size="sm" tone="mid">7</Chip>
      <Chip size="sm" tone="low">99+</Chip>
      <Chip size="sm" tone="neutral">new</Chip>
      <Chip size="sm" tone="low" dot />
      <Chip size="sm" tone="accent" dot />
    </div>
  ),
};
