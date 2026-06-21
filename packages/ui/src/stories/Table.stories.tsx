import type { Meta, StoryObj } from '@storybook/react-vite';
import { Table } from '../components/Table';

const meta = {
  title: 'Primitives/Table',
  component: Table,
} satisfies Meta<typeof Table>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

export const Dense: StoryObj<typeof meta> = { args: { dense: true } };
