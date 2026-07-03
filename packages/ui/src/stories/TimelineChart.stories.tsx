import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { TimelineChart } from '../components/TimelineChart';

/* Story data reproduces the timeline catalog cards
   (lockin90-design/charts/timeline-charts.html · TL-01…TL-20) so parity vs
   the design page is verifiable by eye. The component's default events /
   spans / lanes / clusters / milestones / spark / heat ARE the catalog data
   (WAKE→WIND-DOWN day, mulberry32 seeds 77/31), so most stories only pick the
   variant — titles, NOW anchors and axis captions default per the catalog. */

/* catalog-card width, so the stories read like the design page */
const withCardWidth: Decorator = (Story) => (
  <div style={{ maxWidth: 420 }}>
    <Story />
  </div>
);

const meta = {
  title: 'Charts/TimelineChart',
  component: TimelineChart,
  parameters: { layout: 'padded' },
  decorators: [withCardWidth],
} satisfies Meta<typeof TimelineChart>;
export default meta;

/* ---------- A · event lines ---------- */

/** TL-01 event-line — plain dots on the day rail (SELECT MARKERS: dots). */
export const TL01EventLine: StoryObj<typeof meta> = {
  args: {},
};

/** TL-01 event-line · pins — icon pins with glow heads on stems. */
export const TL01EventLinePins: StoryObj<typeof meta> = {
  args: { markers: 'pins' },
};

/** TL-01 event-line · pills — chip pills alternating above/below the rail. */
export const TL01EventLinePills: StoryObj<typeof meta> = {
  args: { markers: 'pills' },
};

/** TL-04 now-strip — past dots 100%, future 35%, NOW rule + pulse at 0.6. */
export const TL04NowStrip: StoryObj<typeof meta> = {
  args: { variant: 'now-strip' },
};

/** TL-05 planned-hollow — past filled dots, planned dashed hollow rings. */
export const TL05PlannedHollow: StoryObj<typeof meta> = {
  args: { variant: 'planned-hollow' },
};

/** TL-06 zone-strip — 10px energy zone band under the axis + events. */
export const TL06ZoneStrip: StoryObj<typeof meta> = {
  args: { variant: 'zone-strip' },
};

/** TL-07 spark-under — faint white-10% energy sparkline behind the strip. */
export const TL07SparkUnder: StoryObj<typeof meta> = {
  args: { variant: 'spark-under' },
};

/** TL-08 heat-ticks — 25 vertical ticks colored by hourly value zone. */
export const TL08HeatTicks: StoryObj<typeof meta> = {
  args: { variant: 'heat-ticks' },
};

/* ---------- B · spans & lanes ---------- */

/** TL-09 range-blocks — rounded 16px span pills + dark inline labels. */
export const TL09RangeBlocks: StoryObj<typeof meta> = {
  args: { variant: 'range-blocks' },
};

/** TL-10 multi-lane — 3 named lanes (BODY/MIND/LIFE), 14px span pills. */
export const TL10MultiLane: StoryObj<typeof meta> = {
  args: { variant: 'multi-lane' },
};

/** TL-11 gantt-mini — 3 phase bars + dashed dependency elbows. */
export const TL11GanttMini: StoryObj<typeof meta> = {
  args: { variant: 'gantt-mini' },
};

/** TL-12 duration-brackets — bracket outlines + chip labels over the axis. */
export const TL12DurationBrackets: StoryObj<typeof meta> = {
  args: { variant: 'duration-brackets' },
};

/** TL-13 cluster-bubbles — bubbles sized by event count, numeral inside. */
export const TL13ClusterBubbles: StoryObj<typeof meta> = {
  args: { variant: 'cluster-bubbles' },
};

/** TL-14 ticks-24h — 24 hour-ticks (bold every 6h) + hour labels + events. */
export const TL14Ticks24h: StoryObj<typeof meta> = {
  args: { variant: 'ticks-24h' },
};

/* ---------- C · feeds & journeys ---------- */

/** TL-15 feed — vertical event feed, rail left (SELECT LAYOUT: single-side). */
export const TL15Feed: StoryObj<typeof meta> = {
  args: { variant: 'feed' },
};

/** TL-15 feed · alternating — centered rail, chips alternating sides. */
export const TL15FeedAlternating: StoryObj<typeof meta> = {
  args: { variant: 'feed', layout: 'alternating' },
};

/** TL-17 milestone-flags — flag pennants on stems + chip labels under. */
export const TL17MilestoneFlags: StoryObj<typeof meta> = {
  args: { variant: 'milestone-flags' },
};

/** TL-18 journey-line — lime→mint progress rail, milestone rings, DAY pill. */
export const TL18JourneyLine: StoryObj<typeof meta> = {
  args: { variant: 'journey-line' },
};

/** TL-20 now-zone-strip — zone band + past/future dots + NOW pulse at 0.55. */
export const TL20NowZoneStrip: StoryObj<typeof meta> = {
  args: { variant: 'now-zone-strip' },
};

/** The catalog glow modifier — blurred wider rail duplicate on the journey. */
export const Shine: StoryObj<typeof meta> = {
  args: { variant: 'journey-line', shine: true },
};
