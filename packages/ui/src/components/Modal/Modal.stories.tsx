import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Modal from './index';
import { Button } from '../Button';
import { Body } from '../Typography';

const meta = {
  title: 'Primitives/Modal',
  component: Modal,
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj; // render-only stories (no required args supplied)

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open modal</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          eyebrow="CONFIRM"
          title="Delete session"
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => setOpen(false)}>Delete</Button>
            </>
          }
        >
          <Body color="secondary">This permanently removes the logged session. This cannot be undone.</Body>
        </Modal>
      </>
    );
  },
};
