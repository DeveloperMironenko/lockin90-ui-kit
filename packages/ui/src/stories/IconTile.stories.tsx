import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconTile } from '../components/IconTile';

const meta = {
  title: 'Primitives/IconTile',
  component: IconTile,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof IconTile>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { icon: 'user', color: 'var(--accent)' } };
