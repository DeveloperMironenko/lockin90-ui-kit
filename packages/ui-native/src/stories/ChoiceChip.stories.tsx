import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { View } from 'react-native';
import { ChoiceChip } from '../components/ChoiceChip';

const meta = { title: 'Native/ChoiceChip' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <View style={{ alignItems: 'flex-start' }}>
      <ChoiceChip>Instagram</ChoiceChip>
    </View>
  ),
};

export const Selected: Story = {
  render: () => (
    <View style={{ alignItems: 'flex-start' }}>
      <ChoiceChip selected>Instagram</ChoiceChip>
    </View>
  ),
};

export const WithDot: Story = {
  render: () => (
    <View style={{ alignItems: 'flex-start' }}>
      <ChoiceChip selected leadingDot>
        LinkedIn
      </ChoiceChip>
    </View>
  ),
};

export const Small: Story = {
  render: () => (
    <View style={{ alignItems: 'flex-start' }}>
      <ChoiceChip size="sm" selected>
        Photo
      </ChoiceChip>
    </View>
  ),
};

export const Disabled: Story = {
  render: () => (
    <View style={{ alignItems: 'flex-start' }}>
      <ChoiceChip disabled>TikTok</ChoiceChip>
    </View>
  ),
};

const PLATFORMS = ['Instagram', 'X', 'LinkedIn', 'TikTok', 'YouTube', 'Threads'];

export const MultiSelectRow: Story = {
  render: () => {
    const [sel, setSel] = useState<string[]>(['Instagram', 'LinkedIn']);
    const toggle = (p: string) =>
      setSel((s) => (s.includes(p) ? s.filter((x) => x !== p) : [...s, p]));
    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, maxWidth: 360 }}>
        {PLATFORMS.map((p) => (
          <ChoiceChip key={p} selected={sel.includes(p)} leadingDot onPress={() => toggle(p)}>
            {p}
          </ChoiceChip>
        ))}
      </View>
    );
  },
};
