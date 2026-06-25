import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { PricingTierCard } from '../components/PricingTierCard';
import { Button } from '../components/Button';

const meta = { title: 'Native/PricingTierCard' } satisfies Meta;
export default meta;

type Story = StoryObj;

export const Free: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <PricingTierCard
        name="Free"
        price="Free"
        description="Track your energy and see the basics. No card required."
        features={['Daily energy score', '100 events / day', '1 AI insight / day', '1 data source']}
        cta={<Button title="Get started" style={{ width: '100%' }} />}
      />
    </View>
  ),
};

export const ProFeatured: Story = {
  render: () => (
    <View style={{ width: 320, padding: 12 }}>
      <PricingTierCard
        name="Pro"
        price="$12"
        period="/mo"
        featured
        ribbonLabel="Most popular"
        description="The full attribution engine — unlimited everything."
        features={[
          'Unlimited events & logging',
          'Unlimited AI insights',
          '72h energy forecast',
          'CGM & cohort comparison',
          'CSV / PDF export · 2yr history',
        ]}
        cta={<Button variant="primary" title="Upgrade to Pro" style={{ width: '100%' }} />}
      />
    </View>
  ),
};

export const Elite: Story = {
  render: () => (
    <View style={{ width: 320 }}>
      <PricingTierCard
        name="Elite"
        price="$29"
        period="/mo"
        description="For coaches managing athletes — everything in Pro, plus a roster."
        features={[
          'Manage up to 25 athletes',
          'Athlete readiness dashboard',
          'Encrypted coach DMs',
          '14-day forecast horizon',
          'Priority support & API',
        ]}
        cta={<Button title="Upgrade to Elite" style={{ width: '100%' }} />}
      />
    </View>
  ),
};
