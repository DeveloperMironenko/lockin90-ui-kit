import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import ReauthDialog from './index';
import Button from '../Button';

const meta: Meta<typeof ReauthDialog> = {
  title: 'Overlays/ReauthDialog',
  component: ReauthDialog,
};
export default meta;

type Story = StoryObj<typeof ReauthDialog>;

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** Happy path — `verify` resolves, so `onConfirmed` fires. */
export const HappyPath: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    const [done, setDone] = useState(false);
    return (
      <div style={{ padding: 40 }}>
        <Button onClick={() => { setDone(false); setOpen(true); }}>Delete account…</Button>
        {done && <p className="lk-muted" style={{ marginTop: 12 }}>Re-auth confirmed ✓</p>}
        <ReauthDialog
          open={open}
          verify={async () => {
            await sleep(500);
            // resolve = correct password
          }}
          onConfirmed={() => { setOpen(false); setDone(true); }}
          onCancel={() => setOpen(false)}
        />
      </div>
    );
  },
};

/** Wrong password — `verify` throws, so the error renders and `onConfirmed` never fires. */
export const WrongPassword: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <div style={{ padding: 40 }}>
        <Button variant="danger" onClick={() => setOpen(true)}>Delete account…</Button>
        <ReauthDialog
          open={open}
          verify={async () => {
            await sleep(400);
            throw new Error('That password is incorrect.');
          }}
          onConfirmed={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </div>
    );
  },
};

/** External loading — parent action pending disables the whole form. */
export const ExternalLoading: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <div style={{ padding: 40 }}>
        <Button onClick={() => setOpen(true)}>Open</Button>
        <ReauthDialog
          open={open}
          loading
          verify={async () => {}}
          onConfirmed={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </div>
    );
  },
};
