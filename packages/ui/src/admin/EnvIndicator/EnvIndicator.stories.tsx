import type { Meta, StoryObj } from '@storybook/react-vite';
import EnvIndicator from './index';

const meta = {
  title: 'Admin/EnvIndicator',
  component: EnvIndicator,
  args: { env: 'PROD' },
  argTypes: {
    env: { control: 'inline-radio', options: ['DEV', 'STAGING', 'PROD'] },
  },
} satisfies Meta<typeof EnvIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dev: Story = { args: { env: 'DEV' } };
export const Staging: Story = { args: { env: 'STAGING' } };
export const Prod: Story = { args: { env: 'PROD' } };

export const All: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <EnvIndicator env="DEV" />
      <EnvIndicator env="STAGING" />
      <EnvIndicator env="PROD" />
    </div>
  ),
};
