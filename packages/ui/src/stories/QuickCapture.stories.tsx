import type { Meta, StoryObj } from '@storybook/react-vite';
import { QuickCapture } from '../components/QuickCapture';

const meta = {
  title: 'Components/QuickCapture',
  component: QuickCapture,
} satisfies Meta<typeof QuickCapture>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };
