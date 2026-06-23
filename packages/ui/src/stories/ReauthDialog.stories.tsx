import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ReauthDialog, type ReauthDialogProps } from '../components/ReauthDialog';
import { Button } from '../components/Button';

const meta = {
  title: 'Primitives/ReauthDialog',
  component: ReauthDialog,
  args: { open: false, onClose: () => {} },
} satisfies Meta<typeof ReauthDialog>;
export default meta;

/** Toggle wrapper — a trigger button opens the dialog; close resets it. */
function Demo(props: Omit<ReauthDialogProps, 'open' | 'onClose'>) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ padding: 24 }}>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      <ReauthDialog
        {...props}
        open={open}
        onClose={() => setOpen(false)}
        onSubmitPassword={() => setOpen(false)}
        onGoogle={() => setOpen(false)}
      />
    </div>
  );
}

export const PasswordOnly: StoryObj<typeof meta> = {
  render: () => <Demo hasPassword hasGoogle={false} />,
};

export const GoogleOnly: StoryObj<typeof meta> = {
  render: () => (
    <Demo
      hasPassword={false}
      hasGoogle
      description="For your security, re-authenticate with Google to continue."
    />
  ),
};

export const Both: StoryObj<typeof meta> = {
  render: () => <Demo hasPassword hasGoogle />,
};

export const WithError: StoryObj<typeof meta> = {
  render: () => (
    <Demo hasPassword hasGoogle error="Incorrect password. Please try again." />
  ),
};
