import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { Chip } from '../components/Chip';

const meta = { title: 'Native/Chip' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => <Chip tone="high" dot label="on track" />,
};

export const Tones: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      <Chip tone="default" label="default" />
      <Chip tone="high" dot label="high" />
      <Chip tone="mid" dot label="mid" />
      <Chip tone="low" dot label="low" />
      <Chip tone="accent" dot label="accent" />
    </View>
  ),
};

/** `size="sm"` is the compact count/status badge (the retired `Badge`): tighter box,
 *  10px tabular mono, filled-gradient accent, and a bare glowing `dot`. */
export const Sizes: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
      <Chip tone="accent" label="md" />
      <Chip size="sm" tone="accent" label="3" />
      <Chip size="sm" tone="high" label="12" />
      <Chip size="sm" tone="mid" label="7" />
      <Chip size="sm" tone="low" label="99+" />
      <Chip size="sm" tone="neutral" label="new" />
      <Chip size="sm" tone="low" dot label="" />
      <Chip size="sm" tone="accent" dot label="" />
    </View>
  ),
};

export const SizeSm: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
      <Chip size="sm" tone="accent" label="3" />
      <Chip size="sm" tone="high" label="12" />
      <Chip size="sm" tone="mid" label="new" />
      <Chip size="sm" tone="low" label="99+" />
      <Chip size="sm" tone="neutral" label="beta" />
      <Chip size="sm" tone="high" dot label="" />
      <Chip size="sm" tone="accent" dot label="" />
      <Chip size="sm" tone="neutral" dot label="" />
    </View>
  ),
};
