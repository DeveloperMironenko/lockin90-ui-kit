import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View, Text } from 'react-native';
import { colors, fonts } from '@lockin90/tokens';
import { QRCode } from '../components/QRCode';

const meta = { title: 'Native/QRCode' } satisfies Meta;
export default meta;

type Story = StoryObj;

const OTPAUTH =
  'otpauth://totp/LockIn90:operator@lockin90.com?secret=JBSWY3DPEHPK3PXP&issuer=LockIn90&algorithm=SHA1&digits=6&period=30';

/** TOTP enrolment — scan with an authenticator app. Always pair with a
 *  copyable plaintext secret fallback (not shown) for accessibility. */
export const TotpEnrolment: Story = {
  render: () => (
    <View style={{ alignItems: 'center', gap: 12, padding: 16 }}>
      <QRCode
        value="otpauth://totp/LockIn90:ada@example.com?secret=JBSWY3DPEHPK3PXP&issuer=LockIn90"
        size={200}
      />
      <Text style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.textDim }}>
        JBSW Y3DP EHPK 3PXP
      </Text>
    </View>
  ),
};

export const ScanToOpen: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <QRCode value="https://lockin90.com/r/abc123" />
    </View>
  ),
};

export const Small: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <QRCode value="https://lockin90.com" size={120} />
    </View>
  ),
};

/** A plain URL. */
export const Url: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <QRCode value="https://lockin90.com/changelog" />
    </View>
  ),
};

export const Sizes: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 20, padding: 16 }}>
      <QRCode value={OTPAUTH} size={120} />
      <QRCode value={OTPAUTH} size={180} />
      <QRCode value={OTPAUTH} size={240} />
    </View>
  ),
};

/** Short payload — encoder picks the smallest version that fits. */
export const ShortValue: Story = {
  render: () => (
    <View style={{ padding: 16 }}>
      <QRCode value="LK90" size={160} />
    </View>
  ),
};
