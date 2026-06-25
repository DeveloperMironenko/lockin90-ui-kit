import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from '../components/Select';

const meta: Meta<typeof Select> = {
  title: 'Primitives/Select',
  component: Select,
  parameters: { layout: 'centered' },
  // the trigger is width:100% — give it width so it doesn't collapse to the chevron
  decorators: [
    (Story) => (
      <div style={{ width: 240 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

export const Default: StoryObj<typeof Select> = {
  args: { placeholder: 'Select an option' },
};

export const WithLabel: StoryObj<typeof Select> = {
  args: {
    label: 'Unit system',
    options: [
      { value: 'metric', label: 'Metric (kg)' },
      { value: 'imperial', label: 'Imperial (lb)' },
    ],
  },
};
