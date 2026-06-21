import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stat } from '../components/Stat';

const meta = {
  title: 'Primitives/Stat',
  component: Stat,
} satisfies Meta<typeof Stat>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: { label: 'Energy', value: '76' } };
