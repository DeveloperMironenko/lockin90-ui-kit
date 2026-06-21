import type { Meta, StoryObj } from '@storybook/react-vite';
import { NoteField } from '../components/NoteField';

const meta = {
  title: 'Primitives/NoteField',
  component: NoteField,
  args: { label: 'Private notes' },
} satisfies Meta<typeof NoteField>;
export default meta;

export const Default: StoryObj<typeof meta> = {};

export const Filled: StoryObj<typeof meta> = {
  args: { defaultValue: 'Keep elbows tucked, pause at chest.' },
};
