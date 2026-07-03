import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { TimelineChart } from '../components/TimelineChart';

/* Story data reproduces the timeline catalog cards
   (lockin90-design/charts/timeline-charts.html · TL-01…TL-20) so parity vs
   the design page — and the web twin — is verifiable by eye. The component's
   default events / spans / lanes / clusters / milestones / spark / heat ARE
   the catalog data (WAKE→WIND-DOWN day, mulberry32 seeds 77/31); titles, NOW
   anchors and axis captions default per the catalog. */

const meta = { title: 'Native/TimelineChart' } satisfies Meta;
export default meta;

/* ---------- A · event lines ---------- */

/** TL-01 event-line — plain dots on the day rail (SELECT MARKERS: dots). */
export const TL01EventLine: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <TimelineChart />
    </View>
  ),
};

/** TL-01 event-line · pins — icon pins with glow heads on stems. */
export const TL01EventLinePins: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <TimelineChart markers="pins" />
    </View>
  ),
};

/** TL-01 event-line · pills — chip pills alternating above/below the rail. */
export const TL01EventLinePills: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <TimelineChart markers="pills" />
    </View>
  ),
};

/** TL-04 now-strip — past dots 100%, future 35%, NOW rule + pulse at 0.6. */
export const TL04NowStrip: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <TimelineChart variant="now-strip" />
    </View>
  ),
};

/** TL-05 planned-hollow — past filled dots, planned dashed hollow rings. */
export const TL05PlannedHollow: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <TimelineChart variant="planned-hollow" />
    </View>
  ),
};

/** TL-06 zone-strip — 10px energy zone band under the axis + events. */
export const TL06ZoneStrip: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <TimelineChart variant="zone-strip" />
    </View>
  ),
};

/** TL-07 spark-under — faint white-10% energy sparkline behind the strip. */
export const TL07SparkUnder: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <TimelineChart variant="spark-under" />
    </View>
  ),
};

/** TL-08 heat-ticks — 25 vertical ticks colored by hourly value zone. */
export const TL08HeatTicks: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <TimelineChart variant="heat-ticks" />
    </View>
  ),
};

/* ---------- B · spans & lanes ---------- */

/** TL-09 range-blocks — rounded 16px span pills + dark inline labels. */
export const TL09RangeBlocks: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <TimelineChart variant="range-blocks" />
    </View>
  ),
};

/** TL-10 multi-lane — 3 named lanes (BODY/MIND/LIFE), 14px span pills. */
export const TL10MultiLane: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <TimelineChart variant="multi-lane" />
    </View>
  ),
};

/** TL-11 gantt-mini — 3 phase bars + dashed dependency elbows. */
export const TL11GanttMini: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <TimelineChart variant="gantt-mini" />
    </View>
  ),
};

/** TL-12 duration-brackets — bracket outlines + chip labels over the axis. */
export const TL12DurationBrackets: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <TimelineChart variant="duration-brackets" />
    </View>
  ),
};

/** TL-13 cluster-bubbles — bubbles sized by event count, numeral inside. */
export const TL13ClusterBubbles: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <TimelineChart variant="cluster-bubbles" />
    </View>
  ),
};

/** TL-14 ticks-24h — 24 hour-ticks (bold every 6h) + hour labels + events. */
export const TL14Ticks24h: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <TimelineChart variant="ticks-24h" />
    </View>
  ),
};

/* ---------- C · feeds & journeys ---------- */

/** TL-15 feed — vertical event feed, rail left (SELECT LAYOUT: single-side). */
export const TL15Feed: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <TimelineChart variant="feed" />
    </View>
  ),
};

/** TL-15 feed · alternating — centered rail, chips alternating sides. */
export const TL15FeedAlternating: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <TimelineChart variant="feed" layout="alternating" />
    </View>
  ),
};

/** TL-17 milestone-flags — flag pennants on stems + chip labels under. */
export const TL17MilestoneFlags: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <TimelineChart variant="milestone-flags" />
    </View>
  ),
};

/** TL-18 journey-line — lime→mint progress rail, milestone rings, DAY pill. */
export const TL18JourneyLine: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <TimelineChart variant="journey-line" />
    </View>
  ),
};

/** TL-20 now-zone-strip — zone band + past/future dots + NOW pulse at 0.55. */
export const TL20NowZoneStrip: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <TimelineChart variant="now-zone-strip" />
    </View>
  ),
};

/** The catalog glow modifier — wider faint rail duplicate (no blur filters). */
export const Shine: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <TimelineChart variant="journey-line" shine />
    </View>
  ),
};
