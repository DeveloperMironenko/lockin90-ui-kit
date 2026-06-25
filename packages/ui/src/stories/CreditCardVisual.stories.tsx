import type { Meta, StoryObj } from '@storybook/react-vite';
import { CreditCardVisual } from '../components/CreditCardVisual';

const meta = {
  title: 'Primitives/CreditCardVisual',
  component: CreditCardVisual,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof CreditCardVisual>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    last4: '4242',
    holder: 'Marek Kowalczyk',
    expiry: '09/28',
    brand: 'VISA',
    gradient: 'cta',
  },
};

export const Flux: Story = {
  args: {
    last4: '8810',
    holder: 'Marek Kowalczyk',
    expiry: '04/27',
    brand: 'MASTERCARD',
    gradient: 'flux',
  },
};

export const Violet: Story = {
  args: {
    last4: '0117',
    holder: 'Marek Kowalczyk',
    expiry: '11/29',
    brand: 'AMEX',
    gradient: 'violet',
  },
};
