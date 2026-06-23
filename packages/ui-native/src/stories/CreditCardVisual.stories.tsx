import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { CreditCardVisual } from '../components/CreditCardVisual';

const meta = { title: 'Native/CreditCardVisual' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <View style={{ width: 360 }}>
      <CreditCardVisual last4="4242" holder="Marek Kowalczyk" expiry="09/28" brand="VISA" gradient="cta" />
    </View>
  ),
};

export const Flux: Story = {
  render: () => (
    <View style={{ width: 360 }}>
      <CreditCardVisual last4="8810" holder="Marek Kowalczyk" expiry="04/27" brand="MASTERCARD" gradient="flux" />
    </View>
  ),
};

export const Violet: Story = {
  render: () => (
    <View style={{ width: 360 }}>
      <CreditCardVisual last4="0117" holder="Marek Kowalczyk" expiry="11/29" brand="AMEX" gradient="violet" />
    </View>
  ),
};
