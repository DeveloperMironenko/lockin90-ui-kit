import type { Meta, StoryObj } from '@storybook/react-vite';
import { SecretField } from '../admin/SecretField';

const meta = {
  title: 'Primitives/SecretField',
  component: SecretField,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof SecretField>;
export default meta;

type Story = StoryObj<typeof meta>;

/** Default masked state — prefix + dots + accent tail, eye + copy actions. */
export const Masked: Story = {
  args: {
    prefix: 'whk_oura_',
    tail: '2a4f',
    revealedValue: 'whk_oura_3f9a1c7e8b2d4061a9e5c2f72a4f',
    value: 'whk_oura_••••2a4f',
  },
};

/** Starts revealed (masked={false}) — shows the full secret immediately. */
export const Revealed: Story = {
  args: {
    masked: false,
    prefix: 'whk_oura_',
    tail: '2a4f',
    revealedValue: 'whk_oura_3f9a1c7e8b2d4061a9e5c2f72a4f',
    value: 'whk_oura_••••2a4f',
  },
};

/** A webhook HMAC signing key (matches the wearables.html signing-keys panel). */
export const WebhookKey: Story = {
  args: {
    prefix: 'whk_live_',
    tail: '9c1d',
    revealedValue: 'whk_live_a17b3e5d9f2c4081b6d0e3a59c1d',
    value: 'whk_live_••••9c1d',
  },
};

/** A TOTP / 2FA shared secret (no prefix, no tail — fully masked middle). */
export const TotpSecret: Story = {
  args: {
    value: '•••• •••• •••• ••••',
    revealedValue: 'JBSW Y3DP EHPK 3PXP',
    copyable: true,
  },
};
