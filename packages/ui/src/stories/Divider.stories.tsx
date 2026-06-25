import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider } from '../components/Divider';

const meta: Meta<typeof Divider> = {
  title: 'Primitives/Divider',
  component: Divider,
  parameters: { layout: 'centered' },
  // a horizontal rule is width:100% — give it width so it's visible
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

export const Default: StoryObj<typeof Divider> = { args: {} };
