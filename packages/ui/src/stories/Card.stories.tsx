import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from '../components/Card';

const meta = {
  title: 'Primitives/Card',
  component: Card,
} satisfies Meta<typeof Card>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: { children: 'Glass card surface' } };
