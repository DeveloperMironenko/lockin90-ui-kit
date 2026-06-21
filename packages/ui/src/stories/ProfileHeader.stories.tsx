import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProfileHeader } from '../components/ProfileHeader';

const meta = {
  title: 'Components/ProfileHeader',
  component: ProfileHeader,
} satisfies Meta<typeof ProfileHeader>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };
