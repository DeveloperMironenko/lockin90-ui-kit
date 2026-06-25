import type { Meta, StoryObj } from '@storybook/react-vite';
import { TagInput } from '../components/TagInput';
import { CodeInput } from '../components/TagInput';

const meta = {
  title: 'Primitives/TagInput',
  component: TagInput,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof TagInput>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

export const Invalid: StoryObj<typeof meta> = {
  args: { invalid: true, tags: ['sleep', 'recovery'] },
};

export const Code: StoryObj<typeof meta> = {
  render: () => <CodeInput />,
};

export const CodeInvalid: StoryObj<typeof meta> = {
  render: () => <CodeInput value="123456" invalid />,
};
