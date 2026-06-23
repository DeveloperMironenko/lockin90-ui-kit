import type { Meta, StoryObj } from '@storybook/react-vite';
import { MethodChip, type Method } from '../admin/MethodChip';
import { RedactedField } from '../admin/RedactedField';

const meta = {
  title: 'Admin/MethodChip & RedactedField',
  component: MethodChip,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof MethodChip>;
export default meta;

type Story = StoryObj<typeof meta>;

const METHODS: Method[] = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'];

/** All five HTTP methods, each colour-mapped per the API-explorer chips. */
export const Methods: Story = {
  args: { method: 'GET' },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
      {METHODS.map((m) => (
        <MethodChip key={m} method={m} />
      ))}
    </div>
  ),
};

/** A method chip alongside a route path, as seen in the API explorer. */
export const InRouteRow: Story = {
  args: { method: 'PATCH' },
  render: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-dim)',
      }}
    >
      <MethodChip method="PATCH" />
      <span>
        <b style={{ color: 'var(--text)' }}>/events</b>/:id
      </span>
    </div>
  ),
};

/** The redacted pill — default (neutral) and danger (bad-tinted) tones. */
export const Redacted: Story = {
  args: { method: 'GET' },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
      <RedactedField />
      <RedactedField label="Contents encrypted" />
      <RedactedField label="Plaintext withheld" tone="danger" />
    </div>
  ),
};

/** Everything together — the two operator field primitives side by side. */
export const Gallery: Story = {
  args: { method: 'GET' },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
        {METHODS.map((m) => (
          <MethodChip key={m} method={m} />
        ))}
      </div>
      <RedactedField label="Encrypted — unreadable" />
    </div>
  ),
};
