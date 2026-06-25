import type { Meta, StoryObj } from '@storybook/react-vite';
import { MuscleDiagram } from '../components/MuscleDiagram';

const meta = {
  title: 'Primitives/MuscleDiagram',
  component: MuscleDiagram,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof MuscleDiagram>;
export default meta;

export const Default: StoryObj<typeof meta> = {};

export const PushDay: StoryObj<typeof meta> = {
  args: {
    view: 'front',
    targets: [
      { group: 'chest', role: 'primary' },
      { group: 'triceps', role: 'secondary' },
      { group: 'shoulders', role: 'secondary' },
    ],
  },
};

export const PullDay: StoryObj<typeof meta> = {
  args: {
    view: 'back',
    targets: [
      { group: 'lats', role: 'primary' },
      { group: 'back', role: 'primary' },
      { group: 'biceps', role: 'secondary' },
    ],
  },
};

export const Legs: StoryObj<typeof meta> = {
  args: {
    view: 'front',
    targets: [
      { group: 'quads', role: 'primary' },
      { group: 'glutes', role: 'secondary' },
      { group: 'calves', role: 'stabilizer' },
    ],
  },
};

export const NoLegend: StoryObj<typeof meta> = {
  args: { showLegend: false },
};
