import { useState } from 'react';
import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { ReauthDialog, type ReauthDialogProps } from '../components/ReauthDialog';
import { Button } from '../components/Button';

// NOTE: native ReauthDialog wraps the kit Modal (RN Modal), which renders OVER
// the full screen — a centered glass card on a dimmed scrim — so it appears as
// an overlay above this story frame, not inline. Tap "Open dialog" to show it,
// then the scrim, Cancel, or close button to dismiss.
const meta = {
  title: 'Native/ReauthDialog',
  component: ReauthDialog,
} satisfies Meta<typeof ReauthDialog>;
export default meta;

type Story = StoryObj<typeof ReauthDialog>;

/** Toggle wrapper — a trigger button opens the dialog; close resets it. */
function Demo(props: Omit<ReauthDialogProps, 'open' | 'onClose'>) {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ padding: 24 }}>
      <Button variant="primary" title="Open dialog" onPress={() => setOpen(true)} />
      <ReauthDialog
        {...props}
        open={open}
        onClose={() => setOpen(false)}
        onSubmitPassword={() => setOpen(false)}
        onGoogle={() => setOpen(false)}
      />
    </View>
  );
}

export const PasswordOnly: Story = {
  render: () => <Demo hasPassword hasGoogle={false} />,
};

export const GoogleOnly: Story = {
  render: () => (
    <Demo
      hasPassword={false}
      hasGoogle
      description="For your security, re-authenticate with Google to continue."
    />
  ),
};

export const Both: Story = {
  render: () => <Demo hasPassword hasGoogle />,
};

export const WithError: Story = {
  render: () => <Demo hasPassword hasGoogle error="Incorrect password. Please try again." />,
};
