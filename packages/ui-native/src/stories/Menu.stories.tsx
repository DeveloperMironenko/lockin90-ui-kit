import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View, Text } from 'react-native';
import { Menu } from '../components/Menu';

// NOTE: native Menu has no `open` prop — pressing the ⋯ trigger toggles a
// transparent RN Modal that renders OVER the full screen (outside this story
// frame). Tap the trigger to open it; the backdrop closes on tap.
const meta = {
  title: 'Native/Menu',
  component: Menu,
} satisfies Meta<typeof Menu>;
export default meta;

type Story = StoryObj<typeof Menu>;

export const Default: Story = {
  render: () => (
    <View style={{ gap: 8 }}>
      <Text>Tap the ⋯ — the menu opens as a full-screen overlay.</Text>
      <Menu />
    </View>
  ),
};

export const LeftAlign: Story = {
  render: () => <Menu align="left" />,
};

export const CustomItems: Story = {
  render: () => (
    <Menu
      items={[
        { label: 'View profile' },
        { label: 'Share' },
        { divider: true, label: '' },
        { label: 'Remove', danger: true },
      ]}
    />
  ),
};
