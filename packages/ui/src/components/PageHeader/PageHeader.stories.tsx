import type { Meta, StoryObj } from '@storybook/react-vite';
import PageHeader from './index';
import { Button } from '../Button';

const meta = {
  title: 'Primitives/PageHeader',
  component: PageHeader,
  args: { eyebrow: 'DASHBOARD', title: 'Today', slashWidth: 60 },
  render: (args) => (
    <div style={{ width: 520 }}>
      <PageHeader {...args} />
    </div>
  ),
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithActions: Story = {
  args: {
    actions: <Button variant="secondary">Customize</Button>,
  },
};
