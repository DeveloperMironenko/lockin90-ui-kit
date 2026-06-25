import type { Meta, StoryObj } from '@storybook/react-vite';
import { BackLink } from '../components/BackLink';

const meta = {
  title: 'Primitives/BackLink',
  component: BackLink,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof BackLink>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

export const Custom: StoryObj<typeof meta> = { args: { label: 'Exercises' } };
