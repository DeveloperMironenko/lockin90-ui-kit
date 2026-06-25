import type { Meta, StoryObj } from '@storybook/react-vite';
import { PricingTierCard } from '../components/PricingTierCard';
import { Button } from '../components/Button';

const meta = {
  title: 'Primitives/PricingTierCard',
  component: PricingTierCard,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof PricingTierCard>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Free: Story = {
  args: {
    name: 'Free',
    price: 'Free',
    description: 'Track your energy and see the basics. No card required.',
    features: ['Daily energy score', '100 events / day', '1 AI insight / day', '1 data source'],
    cta: <Button style={{ width: '100%' }}>Get started</Button>,
  },
};

export const ProFeatured: Story = {
  args: {
    name: 'Pro',
    price: '$12',
    period: '/mo',
    featured: true,
    ribbonLabel: 'Most popular',
    description: 'The full attribution engine — unlimited everything.',
    features: [
      'Unlimited events & logging',
      'Unlimited AI insights',
      '72h energy forecast',
      'CGM & cohort comparison',
      'CSV / PDF export · 2yr history',
    ],
    cta: (
      <Button variant="primary" style={{ width: '100%' }}>
        Upgrade to Pro
      </Button>
    ),
  },
};

export const Elite: Story = {
  args: {
    name: 'Elite',
    price: '$29',
    period: '/mo',
    description: 'For coaches managing athletes — everything in Pro, plus a roster.',
    features: [
      'Manage up to 25 athletes',
      'Athlete readiness dashboard',
      'Encrypted coach DMs',
      '14-day forecast horizon',
      'Priority support & API',
    ],
    cta: <Button style={{ width: '100%' }}>Upgrade to Elite</Button>,
  },
};

export const Disabled: Story = {
  args: {
    name: 'Elite',
    price: '$29',
    period: '/mo',
    disabled: true,
    description: 'For coaches managing athletes — everything in Pro, plus a roster.',
    features: [
      'Manage up to 25 athletes',
      'Athlete readiness dashboard',
      'Encrypted coach DMs',
      '14-day forecast horizon',
      'Priority support & API',
    ],
    cta: (
      <Button disabled style={{ width: '100%' }}>
        Coming soon
      </Button>
    ),
  },
};
