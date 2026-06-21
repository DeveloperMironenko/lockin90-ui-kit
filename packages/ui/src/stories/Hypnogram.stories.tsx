import type { Meta, StoryObj } from '@storybook/react-vite';
import { Hypnogram } from '../components/Hypnogram';

const meta = {
  title: 'Components/Hypnogram',
  component: Hypnogram,
} satisfies Meta<typeof Hypnogram>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };
