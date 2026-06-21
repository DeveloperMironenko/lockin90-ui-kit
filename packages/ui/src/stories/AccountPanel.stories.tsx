import type { Meta, StoryObj } from '@storybook/react-vite';
import { AccountPanel } from '../components/AccountPanel';

const meta = {
  title: 'Components/AccountPanel',
  component: AccountPanel,
} satisfies Meta<typeof AccountPanel>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };
