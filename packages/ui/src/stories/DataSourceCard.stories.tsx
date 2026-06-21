import type { Meta, StoryObj } from '@storybook/react-vite';
import { DataSourceCard } from '../components/DataSourceCard';

const meta = {
  title: 'Components/DataSourceCard',
  component: DataSourceCard,
} satisfies Meta<typeof DataSourceCard>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };
