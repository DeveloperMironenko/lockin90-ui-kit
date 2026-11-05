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

const RULES = [
  { id: 'len', label: '10+ characters', met: true },
  { id: 'case', label: 'Upper & lowercase', met: true },
  { id: 'num', label: 'A number or symbol', met: false },
  { id: 'common', label: 'Not a common password', met: true },
  { id: 'odd', label: 'An odd last rule keeps its column', met: false },
];

/** The rules in 2 columns at phone width (as web): a long label wraps, the tick on its first line. */
export const WithRules: Story = {
  render: () => (
    <View style={{ width: 300 }}>
      <PasswordStrengthMeter
        score={3}
        labelPrefix="Strength:"
        hint="2 rules to go"
        rules={RULES}
        metLabel=", done"
        unmetLabel=", not yet"
      />
    </View>
  ),
};
