import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToastProvider, useToast } from './index';
import { Button } from '../Button';

const meta = {
  title: 'Primitives/Toast',
  component: ToastProvider,
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

function Demo() {
  const { push, audit } = useToast();
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <Button variant="secondary" onClick={() => push('success', 'Profile saved')}>Success</Button>
      <Button variant="secondary" onClick={() => push('error', 'Request failed')}>Error</Button>
      <Button variant="ghost" onClick={() => audit('updated training level')}>Audit</Button>
    </div>
  );
}

export const Interactive: Story = {
  render: () => (
    <ToastProvider>
      <Demo />
    </ToastProvider>
  ),
};
