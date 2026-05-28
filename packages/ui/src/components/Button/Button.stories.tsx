import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, ButtonLink } from './index';

const meta = {
  title: 'Primitives/Button',
  component: Button,
  args: { children: 'Log Energy', variant: 'primary' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: 'primary' } };
export const Secondary: Story = { args: { variant: 'secondary', children: 'Cancel' } };
export const Ghost: Story = { args: { variant: 'ghost', children: 'Skip' } };
export const Loading: Story = { args: { loading: true, children: 'Saving…' } };
export const Disabled: Story = { args: { disabled: true } };

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
};

export const AsLink: Story = {
  render: () => <ButtonLink href="#">Go to dashboard</ButtonLink>,
};
