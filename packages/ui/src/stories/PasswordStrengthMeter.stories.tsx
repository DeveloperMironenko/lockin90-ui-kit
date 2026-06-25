import type { Meta, StoryObj } from '@storybook/react-vite';
import { PasswordStrengthMeter } from '../components/PasswordStrengthMeter';

const meta = {
  title: 'Primitives/PasswordStrengthMeter',
  component: PasswordStrengthMeter,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof PasswordStrengthMeter>;
export default meta;

type Story = StoryObj<typeof meta>;

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
