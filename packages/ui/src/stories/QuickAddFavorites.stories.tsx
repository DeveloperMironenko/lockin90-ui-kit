import type { Meta, StoryObj } from '@storybook/react-vite';
import { QuickAddFavorites } from '../components/QuickAddFavorites';

const meta = {
  title: 'Components/QuickAddFavorites',
  component: QuickAddFavorites,
} satisfies Meta<typeof QuickAddFavorites>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };
