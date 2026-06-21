import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination, Breadcrumb } from '../components/Pagination';

const meta = {
  title: 'Primitives/Pagination',
  component: Pagination,
} satisfies Meta<typeof Pagination>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

export const Mid: StoryObj<typeof meta> = { args: { page: 5, pageCount: 20 } };

export const Crumbs: StoryObj<typeof meta> = {
  render: () => <Breadcrumb />,
};
