import type { Meta, StoryObj } from '@storybook/react-vite';
import { PasswordStrengthMeter } from '../components/PasswordStrengthMeter';

const meta: Meta<typeof PasswordStrengthMeter> = {
  title: 'Primitives/PasswordStrengthMeter',
  component: PasswordStrengthMeter,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof PasswordStrengthMeter>;

export const Weak: Story = {
  args: { score: 1 },
};

export const Fair: Story = {
  args: { score: 2 },
};

export const Good: Story = {
  args: { score: 3 },
};

export const Strong: Story = {
  args: { score: 4 },
};

export const WithHint: Story = {
  args: { score: 2, hint: '2 rules to go' },
};

const RULES = [
  { id: 'len', label: '10+ characters', met: true },
  { id: 'case', label: 'Upper & lowercase', met: true },
  { id: 'num', label: 'A number or symbol', met: false },
  { id: 'common', label: 'Not common / breached', met: false },
];

/** As the sign-in designs draw it: a prefix, a hint and the rule checklist (1 column on phones). */
export const WithRules: Story = {
  args: {
    score: 2,
    labelPrefix: 'Strength:',
    hint: '2 rules to go',
    rules: RULES,
    metLabel: ', done',
    unmetLabel: ', not yet',
  },
};

/** Nothing typed yet: the label is faint, not red. */
export const Empty: Story = {
  args: {
    score: 0,
    label: '—',
    labelPrefix: 'Strength:',
    hint: 'Min 10 characters',
    rules: RULES.map((r) => ({ ...r, met: false })),
    metLabel: ', done',
    unmetLabel: ', not yet',
  },
};
