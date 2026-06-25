import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChoiceChip } from '../components/ChoiceChip';

const meta = {
  title: 'Primitives/ChoiceChip',
  component: ChoiceChip,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ChoiceChip>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: 'Instagram' } };
export const Selected: Story = { args: { children: 'Instagram', selected: true } };
export const WithDot: Story = { args: { children: 'LinkedIn', leadingDot: true, selected: true } };
export const Small: Story = { args: { children: 'Photo', size: 'sm', selected: true } };
export const Disabled: Story = { args: { children: 'TikTok', disabled: true } };

const PLATFORMS = ['Instagram', 'X', 'LinkedIn', 'TikTok', 'YouTube', 'Threads'];

export const MultiSelectRow: Story = {
  render: () => {
    const [sel, setSel] = useState<string[]>(['Instagram', 'LinkedIn']);
    const toggle = (p: string) =>
      setSel((s) => (s.includes(p) ? s.filter((x) => x !== p) : [...s, p]));
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, maxWidth: 360 }}>
        {PLATFORMS.map((p) => (
          <ChoiceChip key={p} selected={sel.includes(p)} leadingDot onClick={() => toggle(p)}>
            {p}
          </ChoiceChip>
        ))}
      </div>
    );
  },
};
