import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { View } from 'react-native';
import { ChoiceChip } from '../components/ChoiceChip';

const meta = { title: 'Native/ChoiceChip' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      <ChoiceChip>Instagram</ChoiceChip>
      <ChoiceChip selected>Instagram</ChoiceChip>
      <ChoiceChip selected leadingDot>
        LinkedIn
      </ChoiceChip>
      <ChoiceChip size="sm" selected>
        Photo
      </ChoiceChip>
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
