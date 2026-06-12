import type { Meta, StoryObj } from '@storybook/react-vite';
import Button from './index';

const meta: Meta<typeof Button> = {
  title: 'Foundation/Button',
  component: Button,
  args: { children: 'Log event' },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { variant: 'primary', magnetic: true } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Danger: Story = { args: { variant: 'danger', children: 'Refund $19.99' } };
export const Small: Story = { args: { variant: 'primary', size: 'sm' } };
export const AsLink: Story = { args: { href: '#start', children: 'Get started' } };
export const Row: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="default">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger" size="sm">
        Danger
      </Button>
    </div>
  ),
};
