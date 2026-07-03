import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { CaffeineClock } from '../components/CaffeineClock';

/* Story data reproduces the caffeine catalog cards
   (lockin90-design/charts/caffeine-charts.html · CF-01…CF-03) so parity vs
   the design page is verifiable by eye — the component defaults ARE the
   catalog doses (8:30 · 120mg / the 3-dose day / the 2-cup afternoon). */

/* catalog-card width, so the stories read like the design page */
const withCardWidth: Decorator = (Story) => (
  <div style={{ maxWidth: 420 }}>
    <Story />
  </div>
);

const meta = {
  title: 'Charts/CaffeineClock',
  component: CaffeineClock,
  parameters: { layout: 'padded' },
  decorators: [withCardWidth],
} satisfies Meta<typeof CaffeineClock>;
export default meta;

/** CF-01 decay-curve — t½ 5.7h decay from the 120MG spike · amber dashed
 *  50MG sleep threshold + crossing dot · violet bedtime rule + ✓ verdict. */
export const CF01DecayCurve: StoryObj<typeof meta> = {
  args: { title: 'COFFEE 8:30 · 120MG' },
};

/** CF-02 stacked-doses — faint per-dose curves + bold white TOTAL · the late
 *  14:00 dose leaves ~54MG at bed → coral verdict. */
export const CF02StackedDoses: StoryObj<typeof meta> = {
  args: { variant: 'stacked-doses', title: '3 DOSES TODAY' },
};

/** CF-03 safe-window — mint→amber→magenta day strip + computed LAST SAFE
 *  COFFEE tick (one half-life before bed) + NOW pulse + past cups. */
export const CF03SafeWindow: StoryObj<typeof meta> = {
  args: { variant: 'safe-window', title: 'CAN I HAVE ONE MORE?' },
};

/** The catalog glow modifier — blurred mint underlay along the decay curve. */
export const Shine: StoryObj<typeof meta> = {
  args: { shine: true, title: 'COFFEE 8:30 · 120MG' },
};

/** Real-data example — a heavy day against a 22:30 bedtime (coral verdict). */
export const LateDoseDay: StoryObj<typeof meta> = {
  args: {
    doses: [
      { atH: 7, mg: 150 },
      { atH: 12.5, mg: 90 },
      { atH: 16, mg: 120 },
    ],
    variant: 'stacked-doses',
    bedH: 22.5,
    title: 'HEAVY DAY · 3 DOSES',
  },
};
