import type { Meta, StoryObj } from '@storybook/react-vite';
import { PersonalRecords } from '../components/PersonalRecords';

const meta = {
  title: 'Components/PersonalRecords',
  component: PersonalRecords,
} satisfies Meta<typeof PersonalRecords>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };
