import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs } from '../components/Tabs';

const meta = {
  title: 'Primitives/Tabs',
  component: Tabs,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Tabs>;
export default meta;

export const Default: StoryObj<typeof meta> = { args: {} };

export const FourUp: StoryObj<typeof meta> = {
  args: { tabs: ['Stats', 'History', 'Guide', 'Ranks'], active: 2 },
};
