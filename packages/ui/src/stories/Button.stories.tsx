import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../components/Button';

const meta = {
  title: 'Primitives/Button',
  component: Button,
} satisfies Meta<typeof Button>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: { children: 'Log check-in', variant: 'primary' } };
