import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { TypingIndicator } from '../components/TypingIndicator';

const meta = { title: 'Native/TypingIndicator' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <View style={{ width: 320, padding: 24 }}>
      <TypingIndicator />
    </View>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <View style={{ width: 320, padding: 24 }}>
      <TypingIndicator label="Sofia is typing" />
    </View>
  ),
};
