import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { InlineEdit, type InlineEditProps } from '../admin/InlineEdit';

const meta = {
  title: 'Primitives/InlineEdit',
  component: InlineEdit,
  // Defaults satisfy the required props; each story's `render` supplies its own
  // stateful instance via <Live>.
  args: { value: '', onCommit: () => {} },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof InlineEdit>;
export default meta;

/** Wrapper that wires `onCommit` to local state so committed edits stick. */
function Live(props: Omit<InlineEditProps, 'value' | 'onCommit'> & { initial: string | number }) {
  const { initial, ...rest } = props;
  const [value, setValue] = useState<string | number>(initial);
  return <InlineEdit value={value} onCommit={setValue} {...rest} />;
}

export const Text: StoryObj<typeof meta> = {
  render: () => <Live initial="time_of_day" type="text" />,
};

export const NumberWithSuffix: StoryObj<typeof meta> = {
  render: () => <Live initial={300} type="number" suffix="ms" />,
};

export const RightAligned: StoryObj<typeof meta> = {
  render: () => <Live initial={45} type="number" suffix="pts" align="right" />,
};
