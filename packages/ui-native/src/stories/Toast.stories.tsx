import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { Toast } from '../components/Toast';

const meta = {
  title: 'Native/Toast',
  component: Toast,
} satisfies Meta<typeof Toast>;
export default meta;

type Story = StoryObj<typeof Toast>;

export const Default: Story = {
  args: { title: 'Saved' },
};

export const Success: Story = {
  args: { tone: 'success', title: 'Workout logged', message: '+1,000 kg volume' },
};

export const AllTones: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Toast tone="default" title="Saved" message="Your changes are stored." />
      <Toast tone="success" title="Workout logged" message="+1,000 kg volume" />
      <Toast tone="warn" title="Late caffeine detected" message="May affect sleep onset." />
      <Toast tone="danger" title="Sync failed" message="Tap to retry." onDismiss={() => {}} />
    </View>
  ),
};
