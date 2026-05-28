import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider, OrDivider } from './index';

const meta = {
  title: 'Primitives/Divider',
  component: Divider,
  argTypes: {
    strength: { control: 'inline-radio', options: ['default', 'strong'] },
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { strength: 'default' },
  render: (args) => (
    <div style={{ width: 320 }}>
      <Divider {...args} />
    </div>
  ),
};

export const Strong: Story = {
  args: { strength: 'strong' },
  render: (args) => (
    <div style={{ width: 320 }}>
      <Divider {...args} />
    </div>
  ),
};

export const Or: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <OrDivider />
    </div>
  ),
};
