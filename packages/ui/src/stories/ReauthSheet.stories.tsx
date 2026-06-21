import type { Meta, StoryObj } from '@storybook/react-vite';
import { ReauthSheet } from '../components/ReauthSheet';

const meta = {
  title: 'Components/ReauthSheet',
  component: ReauthSheet,
} satisfies Meta<typeof ReauthSheet>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };
