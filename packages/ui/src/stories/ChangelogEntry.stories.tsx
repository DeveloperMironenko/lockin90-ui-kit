import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChangelogEntry } from '../components/ChangelogEntry';

const meta = {
  title: 'Components/ChangelogEntry',
  component: ChangelogEntry,
} satisfies Meta<typeof ChangelogEntry>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };
