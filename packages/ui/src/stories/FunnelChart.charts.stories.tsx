import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { FunnelChart, type FunnelStage } from '../components/FunnelChart';

/* Story data reproduces the funnel catalog cards
   (lockin90-design/charts/funnel-charts.html · FN-01/03/04/05) so parity vs
   the design page is verifiable by eye. NOT the admin operator funnel — that
   story lives at Primitives/FunnelChart (`@lockin90/ui/admin`). */

const STAGES: FunnelStage[] = [
  { label: 'SIGNED UP', value: 1 },
  { label: 'CONNECTED DEVICE', value: 0.72 },
  { label: 'FIRST SYNC', value: 0.58 },
  { label: 'DAY-7 ACTIVE', value: 0.34 },
];

/* FN-05 ghosts = the catalog's derived previous period (min(1, v·0.85 + 0.06)) */
const COMPARE_STAGES: FunnelStage[] = [
  { label: 'SIGNED UP', value: 1, prev: 0.91 },
  { label: 'CONNECTED DEVICE', value: 0.72, prev: 0.672 },
  { label: 'FIRST SYNC', value: 0.58, prev: 0.553 },
  { label: 'DAY-7 ACTIVE', value: 0.34, prev: 0.349 },
];

/* catalog-card width, so the stories read like the design page */
const withCardWidth: Decorator = (Story) => (
  <div style={{ maxWidth: 420 }}>
    <Story />
  </div>
);

const meta = {
  title: 'Charts/FunnelChart',
  component: FunnelChart,
  parameters: { layout: 'padded' },
  decorators: [withCardWidth],
} satisfies Meta<typeof FunnelChart>;
export default meta;

/** FN-01 band-funnel — centered trapezoid bands, solid spectrum-token fill. */
export const FN01BandFunnel: StoryObj<typeof meta> = {
  args: { stages: STAGES, title: 'ONBOARDING · THIS MONTH' },
};

/** FN-01 fill SELECT — faint glass bands, labels take the stage color. */
export const FN01Glass: StoryObj<typeof meta> = {
  args: { stages: STAGES, fill: 'glass', title: 'ONBOARDING · THIS MONTH' },
};

/** FN-03 bar-funnel — left-aligned bars + % + coral per-stage drop labels. */
export const FN03BarFunnel: StoryObj<typeof meta> = {
  args: { stages: STAGES, variant: 'bar-funnel', title: 'FUNNEL · STAGE DROP' },
};

/** FN-04 zone-funnel — bar color = conversion zone (good / warn / bad). */
export const FN04ZoneFunnel: StoryObj<typeof meta> = {
  args: { stages: STAGES, variant: 'zone-funnel', title: 'FUNNEL HEALTH' },
};

/** FN-05 compare-funnel — thin bars over white-14% previous-period ghosts. */
export const FN05CompareFunnel: StoryObj<typeof meta> = {
  args: { stages: COMPARE_STAGES, variant: 'compare-funnel', title: 'FUNNEL VS LAST MONTH' },
};

/** The catalog glow modifier — soft color glow behind the bands. */
export const Shine: StoryObj<typeof meta> = {
  args: { stages: STAGES, shine: true, title: 'ONBOARDING · THIS MONTH' },
};
