import type { Meta, StoryObj } from '@storybook/react-vite';
import { TabBar, FAB } from '../components/TabBar';

const meta = {
  title: 'Primitives/TabBar',
  component: TabBar,
} satisfies Meta<typeof TabBar>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

export const Fab: StoryObj<typeof meta> = { render: () => <FAB /> };

export const ExtendedFab: StoryObj<typeof meta> = { render: () => <FAB label="Log set" /> };
