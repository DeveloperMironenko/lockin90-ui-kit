import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View, Text } from 'react-native';
import { Popover, CopyButton } from '../components/Popover';
import { Button } from '../components/Button';

// NOTE: native Popover has no `open` prop — pressing the "?" trigger toggles a
// transparent RN Modal that renders OVER the full screen (a glass card anchored
// near the top), outside this story frame. Tap the backdrop to close.
const meta = {
  title: 'Native/Popover',
  component: Popover,
} satisfies Meta<typeof Popover>;
export default meta;

type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => (
    <View style={{ gap: 8 }}>
      <Text>Tap "?" — the panel opens as a full-screen overlay.</Text>
      <Popover />
    </View>
  ),
};

export const CustomTrigger: Story = {
  render: () => (
    <Popover trigger={<Button size="sm" title="Why?" />}>
      <Text>
        Your readiness score blends recent training load, sleep, and recovery
        into one number — higher means you can push harder today.
      </Text>
    </Popover>
  ),
};

export const Copy: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <CopyButton value="LOCKIN-2026" label="LOCKIN-2026" />
      <CopyButton value="LOCKIN-2026" />
    </View>
  ),
};
