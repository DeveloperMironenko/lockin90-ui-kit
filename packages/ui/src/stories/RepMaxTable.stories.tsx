import type { Meta, StoryObj } from '@storybook/react-vite';
import { RepMaxTable } from '../components/RepMaxTable';

const meta = {
  title: 'Components/RepMaxTable',
  component: RepMaxTable,
} satisfies Meta<typeof RepMaxTable>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };
