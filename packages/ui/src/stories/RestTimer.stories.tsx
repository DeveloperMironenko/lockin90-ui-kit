import type { Meta, StoryObj } from '@storybook/react-vite';
import { RestTimer } from '../components/RestTimer';

const meta = {
  title: 'Components/RestTimer',
  component: RestTimer,
} satisfies Meta<typeof RestTimer>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };
