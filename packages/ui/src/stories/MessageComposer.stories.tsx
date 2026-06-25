import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { MessageComposer } from '../components/MessageComposer';

const meta = {
  title: 'Primitives/MessageComposer',
  component: MessageComposer,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof MessageComposer>;
export default meta;

function Demo(props: { placeholder?: string; e2ee?: boolean; disabled?: boolean }) {
  const [sent, setSent] = useState<string[]>([]);
  return (
    <div style={{ width: 420, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {sent.length ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {sent.map((m, i) => (
            <div
              key={i}
              style={{
                alignSelf: 'flex-end',
                maxWidth: '80%',
                padding: '8px 12px',
                borderRadius: 14,
                background: 'var(--glass-2)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                fontSize: 13,
              }}
            >
              {m}
            </div>
          ))}
        </div>
      ) : null}
      <MessageComposer {...props} onSend={(t) => setSent((s) => [...s, t])} />
    </div>
  );
}

export const Default: StoryObj<typeof meta> = {
  args: { onSend: () => {} },
  render: () => <Demo placeholder="Message Dr. Petrov…" />,
};

export const Encrypted: StoryObj<typeof meta> = {
  args: { onSend: () => {} },
  render: () => <Demo e2ee placeholder="Encrypted message…" />,
};

export const Disabled: StoryObj<typeof meta> = {
  args: { onSend: () => {} },
  render: () => <Demo disabled placeholder="You can't reply here" />,
};
