import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from '../components/Select';

const meta = {
  title: 'Primitives/Select',
  component: Select,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Select>;
export default meta;

export const Default: StoryObj<typeof meta> = {};

export const WithLabel: StoryObj<typeof meta> = {
  args: {
    label: 'Unit system',
    options: [
      { value: 'metric', label: 'Metric (kg)' },
      { value: 'imperial', label: 'Imperial (lb)' },
    ],
  },
};
