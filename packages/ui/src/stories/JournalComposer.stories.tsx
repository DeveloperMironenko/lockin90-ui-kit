import type { Meta, StoryObj } from '@storybook/react-vite';
import { JournalComposer } from '../components/JournalComposer';

const meta = {
  title: 'Components/JournalComposer',
  component: JournalComposer,
} satisfies Meta<typeof JournalComposer>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };
