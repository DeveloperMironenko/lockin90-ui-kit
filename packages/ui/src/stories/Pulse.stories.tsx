import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pulse } from '../components/Pulse';

const meta = {
  title: 'Primitives/Pulse',
  component: Pulse,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Pulse>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };
