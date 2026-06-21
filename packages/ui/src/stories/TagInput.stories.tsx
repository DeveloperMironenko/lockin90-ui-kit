import type { Meta, StoryObj } from '@storybook/react-vite';
import { TagInput } from '../components/TagInput';
import { CodeInput } from '../components/TagInput';

const meta = {
  title: 'Primitives/TagInput',
  component: TagInput,
} satisfies Meta<typeof TagInput>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

export const Code: StoryObj<typeof meta> = {
  render: () => <CodeInput />,
};
