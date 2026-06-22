import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View, Text } from 'react-native';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';

// NOTE: native Modal wraps RN Modal, which renders OVER the full screen (a
// centered glass card on a dimmed scrim) — it appears as an overlay above this
// story frame, not inline. Tap the scrim or close button to dismiss.
const meta = {
  title: 'Native/Modal',
  component: Modal,
} satisfies Meta<typeof Modal>;
export default meta;

type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: () => (
    <Modal
      open
      title="Confirm action"
      footer={
        <>
          <Button variant="ghost" title="Cancel" />
          <Button variant="primary" title="Confirm" />
        </>
      }
    >
      <Text>
        This action will recalculate your energy baseline and cannot be undone.
        Are you sure you want to continue?
      </Text>
    </Modal>
  ),
};

export const Small: Story = {
  render: () => (
    <Modal open size="sm" title="Delete note?">
      <Text>This note will be permanently removed.</Text>
    </Modal>
  ),
};

export const StringBody: Story = {
  render: () => (
    <View style={{ gap: 8 }}>
      {/* string children are auto-wrapped in <Text> by the component */}
      <Modal open title="Heads up">Your session expires in 5 minutes.</Modal>
    </View>
  ),
};
