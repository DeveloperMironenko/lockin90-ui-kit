import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion } from '../components/Accordion';

const meta = {
  title: 'Primitives/Accordion',
  component: Accordion,
} satisfies Meta<typeof Accordion>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

export const Multiple: StoryObj<typeof meta> = { args: { multiple: true } };
