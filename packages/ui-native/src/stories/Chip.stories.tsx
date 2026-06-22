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
