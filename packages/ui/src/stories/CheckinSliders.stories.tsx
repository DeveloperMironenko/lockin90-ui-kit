import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckinSliders } from '../components/CheckinSliders';

const meta = {
  title: 'Components/CheckinSliders',
  component: CheckinSliders,
} satisfies Meta<typeof CheckinSliders>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };
