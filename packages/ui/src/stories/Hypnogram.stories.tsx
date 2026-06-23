import type { Meta, StoryObj } from '@storybook/react-vite';
import { Hypnogram } from '../components/Hypnogram';

const meta = {
  title: 'Primitives/Hypnogram',
  component: Hypnogram,
} satisfies Meta<typeof Hypnogram>;
export default meta;

export const Default: StoryObj<typeof meta> = {};

export const NoLabels: StoryObj<typeof meta> = {
  args: { showStageLabels: false },
};

export const Short: StoryObj<typeof meta> = {
  args: {
    segments: [
      { stage: 'awake', minutes: 8 },
      { stage: 'light', minutes: 42 },
      { stage: 'deep', minutes: 55 },
      { stage: 'rem', minutes: 22 },
      { stage: 'light', minutes: 30 },
    ],
    axis: ['11p', '12a', '1a'],
  },
};
