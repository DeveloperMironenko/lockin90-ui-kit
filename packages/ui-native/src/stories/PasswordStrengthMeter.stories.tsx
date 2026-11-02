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
  { id: 'len', label: '8+ characters', met: true },
  { id: 'case', label: 'Upper & lowercase', met: true },
  { id: 'num', label: 'Number or symbol', met: false },
  { id: 'common', label: 'Not common', met: false },
];

/** As the mobile sign-up design draws it: a prefix, a hint and the rule checklist in rows of two. */
export const WithRules: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <PasswordStrengthMeter
        score={2}
        labelPrefix="Strength:"
        hint="2 rules to go"
        rules={RULES}
        metLabel=", done"
        unmetLabel=", not yet"
      />
    </View>
  ),
};

/** Nothing typed yet: the label is faint, not red. */
export const Empty: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <PasswordStrengthMeter
        score={0}
        label="—"
        labelPrefix="Strength:"
        hint="Min 8 characters"
        rules={RULES.map((r) => ({ ...r, met: false }))}
        metLabel=", done"
        unmetLabel=", not yet"
      />
    </View>
  ),
};
