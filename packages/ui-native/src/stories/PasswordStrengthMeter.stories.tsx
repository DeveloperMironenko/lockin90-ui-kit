import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { PasswordStrengthMeter } from '../components/PasswordStrengthMeter';

const meta = { title: 'Native/PasswordStrengthMeter' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Weak: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <PasswordStrengthMeter score={1} />
    </View>
  ),
};

export const Fair: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <PasswordStrengthMeter score={2} />
    </View>
  ),
};

export const Good: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <PasswordStrengthMeter score={3} />
    </View>
  ),
};

export const Strong: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <PasswordStrengthMeter score={4} />
    </View>
  ),
};

export const WithHint: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <PasswordStrengthMeter score={2} hint="2 rules to go" />
    </View>
  ),
};
