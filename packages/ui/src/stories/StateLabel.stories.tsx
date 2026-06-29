import type { Meta, StoryObj } from '@storybook/react-vite';
import { StateLabel } from '../components/StateLabel';

const meta = {
  title: 'Primitives/StateLabel',
  component: StateLabel,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof StateLabel>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { num: '01', label: 'Sign in' },
  render: (args) => (
    <div style={{ width: 520 }}>
      <StateLabel {...args} />
    </div>
  ),
};

export const AuthSections: Story = {
  args: { num: '01', label: 'Sign in' },
  render: () => (
    <div style={{ width: 520, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <StateLabel num="01" label="Sign in" />
      <StateLabel num="02" label="Create account" />
      <StateLabel num="03" label="Verify email" />
    </div>
  ),
};
