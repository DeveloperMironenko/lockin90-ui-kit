import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { TabBar, FAB } from '../components/TabBar';

const meta = { title: 'Native/TabBar' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <View style={{ width: 340 }}>
      <TabBar active={0} />
    </View>
  ),
};

export const Fab: Story = {
  render: () => <FAB />,
};

export const ExtendedFab: Story = {
  render: () => <FAB label="Log set" />,
};

/** The mobile shell nav (home.html): Today · Calendar · ⊕Log · Coach · Insights —
 *  string icon names + an elevated center FAB at index 2. */
export const MobileNav: Story = {
  render: () => (
    <View style={{ width: 340 }}>
      <TabBar
        active={0}
        fabIndex={2}
        items={[
          { icon: 'home', label: 'Today' },
          { icon: 'calendar', label: 'Calendar' },
          { icon: 'plus', label: 'Log' },
          { icon: 'user', label: 'Coach' },
          { icon: 'activity', label: 'Insights' },
        ]}
      />
    </View>
  ),
};
