import type { Meta, StoryObj } from '@storybook/react-vite';
import { QRCode } from '../components/QRCode';

const meta = {
  title: 'Primitives/QRCode',
  component: QRCode,
} satisfies Meta<typeof QRCode>;
export default meta;

const OTPAUTH =
  'otpauth://totp/LockIn90:operator@lockin90.com?secret=JBSWY3DPEHPK3PXP&issuer=LockIn90&algorithm=SHA1&digits=6&period=30';

/** A TOTP enrolment payload — scan in any authenticator app. */
export const TotpEnrolment: StoryObj<typeof meta> = {
  args: { value: OTPAUTH },
};

/** A plain URL. */
export const Url: StoryObj<typeof meta> = {
  args: { value: 'https://lockin90.com/changelog' },
};

export const Sizes: StoryObj<typeof meta> = {
  args: { value: OTPAUTH },
  render: () => (
    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end' }}>
      <QRCode value={OTPAUTH} size={120} />
      <QRCode value={OTPAUTH} size={180} />
      <QRCode value={OTPAUTH} size={240} />
    </div>
  ),
};

/** Short payload — encoder picks the smallest version that fits. */
export const ShortValue: StoryObj<typeof meta> = {
  args: { value: 'LK90', size: 160 },
};
