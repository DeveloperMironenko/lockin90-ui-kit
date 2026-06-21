import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox, RadioGroup } from '../components/Checkbox';

const meta = {
  title: 'Primitives/Checkbox',
  component: Checkbox,
} satisfies Meta<typeof Checkbox>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: { label: 'Remember me', checked: true } };

export const Indeterminate: StoryObj<typeof meta> = {
  args: { indeterminate: true, label: 'Select all' },
};

export const Radios: StoryObj<typeof meta> = {
  render: () => (
    <RadioGroup
      name="goal"
      value="focus"
      options={[
        { value: 'recover', label: 'Recover' },
        { value: 'focus', label: 'Focus' },
        { value: 'perform', label: 'Perform' },
      ]}
    />
  ),
};
