import type { Meta, StoryObj } from '@storybook/react-vite';
import { VideoStrip } from '../components/VideoStrip';

const meta = {
  title: 'Components/VideoStrip',
  component: VideoStrip,
} satisfies Meta<typeof VideoStrip>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };
