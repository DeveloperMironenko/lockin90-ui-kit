import type { Meta, StoryObj } from '@storybook/react-vite';
import { PasswordStrengthMeter } from '../components/PasswordStrengthMeter';

const meta: Meta<typeof PasswordStrengthMeter> = {
  title: 'Primitives/PasswordStrengthMeter',
  component: PasswordStrengthMeter,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: 280 }}>
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
