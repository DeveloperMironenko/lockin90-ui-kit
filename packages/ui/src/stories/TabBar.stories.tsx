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

/** The mobile shell nav (home.html): Today · Calendar · ⊕Log · Coach · Insights —
 *  string icon names + an elevated center FAB at index 2. */
export const MobileNav: StoryObj<typeof meta> = {
  args: {
    active: 0,
    fabIndex: 2,
    items: [
      { icon: 'home', label: 'Today' },
      { icon: 'calendar', label: 'Calendar' },
      { icon: 'plus', label: 'Log' },
      { icon: 'user', label: 'Coach' },
      { icon: 'activity', label: 'Insights' },
    ],
  },
};
