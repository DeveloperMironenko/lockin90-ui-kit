import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toggle } from '../components/Toggle';

const meta = {
  title: 'Primitives/Toggle',
  component: Toggle,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Toggle>;
export default meta;

export const Off: StoryObj<typeof meta> = { args: {} };

export const On: StoryObj<typeof meta> = { args: { checked: true } };

export const WithLabel: StoryObj<typeof meta> = {
  args: { checked: true, label: 'Email notifications' },
};
