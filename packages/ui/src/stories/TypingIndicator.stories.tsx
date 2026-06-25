import type { Meta, StoryObj } from '@storybook/react-vite';
import { TypingIndicator } from '../components/TypingIndicator';

const meta = {
  title: 'Primitives/TypingIndicator',
  component: TypingIndicator,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof TypingIndicator>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };

export const WithLabel: Story = {
  args: { label: 'Sofia is typing' },
};
