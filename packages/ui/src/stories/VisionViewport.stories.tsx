import type { Meta, StoryObj } from '@storybook/react-vite';
import { VisionViewport } from '../components/VisionViewport';

const meta = {
  title: 'Components/VisionViewport',
  component: VisionViewport,
} satisfies Meta<typeof VisionViewport>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };
