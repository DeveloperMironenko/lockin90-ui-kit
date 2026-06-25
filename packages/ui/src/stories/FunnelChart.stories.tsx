import type { Meta, StoryObj } from '@storybook/react-vite';
import { FunnelChart, type FunnelStep } from '../admin/FunnelChart';

const meta = {
  title: 'Primitives/FunnelChart',
  component: FunnelChart,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof FunnelChart>;
export default meta;

/* A 5-step onboarding funnel (signup → activated) with per-step drop-offs,
   spectrum tiers and step icons — the "connect data source" stage carries the
   largest (>20%) drop, rendered in the bad/intervene tone. */
const onboarding: FunnelStep[] = [
  { id: 'signup', label: 'Signup', sublabel: 'account created', icon: 'user', count: 412, conversionPct: 100, tier: 0 },
  { id: 'verify', label: 'Verify email', sublabel: '6-digit code', icon: 'mail', count: 388, conversionPct: 94.2, dropPct: 5.8, tier: 1 },
  { id: 'connect', label: 'Connect data source', sublabel: 'Oura / WHOOP / Apple', icon: 'data-source', count: 301, conversionPct: 73.1, dropPct: 21.1, tier: 2 },
  { id: 'profile', label: 'Complete profile', sublabel: 'goals · body · baseline', icon: 'checkCircle', count: 264, conversionPct: 64.1, dropPct: 9.0, tier: 3 },
  { id: 'activated', label: 'Activated', sublabel: '3+ days logged in 1st wk', icon: 'flame', count: 240, conversionPct: 58.3, dropPct: 9.1, tier: 4 },
];

/** Default: 5-step onboarding funnel with tiers, icons and drop-off pills. */
export const Default: StoryObj<typeof meta> = {
  args: { steps: onboarding },
};

/** With the tier/threshold legend row below the funnel. */
export const WithLegend: StoryObj<typeof meta> = {
  args: { steps: onboarding, legend: true },
};

/** A short 3-step engagement funnel (broadcast sent → opened → clicked). */
export const Engagement: StoryObj<typeof meta> = {
  args: {
    steps: [
      { id: 'sent', label: 'Sent', sublabel: 'broadcast b-218', icon: 'send', count: 2580, conversionPct: 100, tier: 2 },
      { id: 'opened', label: 'Opened', sublabel: 'unique opens', icon: 'mail', count: 1156, conversionPct: 44.8, dropPct: 55.2, tier: 4 },
      { id: 'clicked', label: 'Clicked through', sublabel: 'tapped the CTA', icon: 'target', count: 317, conversionPct: 12.3, dropPct: 32.5, tier: 5 },
    ],
  },
};
