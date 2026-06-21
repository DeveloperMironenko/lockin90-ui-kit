import type { Meta, StoryObj } from '@storybook/react-vite';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';

const meta = {
  title: 'Primitives/Modal',
  component: Modal,
} satisfies Meta<typeof Modal>;
export default meta;

export const Default: StoryObj<typeof meta> = {
  render: () => (
    <Modal
      open
      title="Confirm action"
      footer={
        <>
          <Button variant="ghost">Cancel</Button>
          <Button variant="primary">Confirm</Button>
        </>
      }
    >
      <p style={{ margin: 0 }}>
        This action will recalculate your energy baseline and cannot be undone.
        Are you sure you want to continue?
      </p>
    </Modal>
  ),
};
