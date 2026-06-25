import type { Meta, StoryObj } from '@storybook/react-vite';
import { TypingIndicator } from '../components/TypingIndicator';

const meta: Meta<typeof TypingIndicator> = {
  title: 'Primitives/TypingIndicator',
  component: TypingIndicator,
  parameters: { layout: 'centered' },
  // give the bubble a real chat-column width so its 82% max-width doesn't clamp
  // the labelled variant below its content (which pushed the dots outside)
  decorators: [
    (Story) => (
      <div style={{ width: 360, display: 'flex' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof TypingIndicator>;

export const Default: Story = { args: {} };

export const WithLabel: Story = {
  args: { label: 'Sofia is typing' },
};
