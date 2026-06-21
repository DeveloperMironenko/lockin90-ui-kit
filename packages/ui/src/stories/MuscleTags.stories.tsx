import type { Meta, StoryObj } from '@storybook/react-vite';
import { MuscleTags } from '../components/MuscleTags';

const meta = {
  title: 'Components/MuscleTags',
  component: MuscleTags,
} satisfies Meta<typeof MuscleTags>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

export const Chips: StoryObj<typeof meta> = { args: { variant: 'chips' } };
