import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gauge } from '../components/Gauge';

const meta = {
  title: 'Primitives/Gauge',
  component: Gauge,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Gauge>;
export default meta;

export const Default: StoryObj<typeof meta> = {
  args: { value: 78, label: 'ENERGY' },
};

export const Zones: StoryObj<typeof meta> = {
  args: {
    value: 78,
    label: 'TODAY',
    zones: [
      { to: 34, color: 'var(--zone-low)' },
      { to: 67, color: 'var(--zone-mid)' },
      { to: 100, color: 'var(--zone-high)' },
    ],
  },
};

export const Ticks: StoryObj<typeof meta> = {
  args: { value: 64, label: 'SCORE', ticks: 7 },
};

export const Sizes: StoryObj<typeof meta> = {
  args: { value: 64 },
  render: () => (
    <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
      <Gauge size={96} value={38} thickness={8} sweep={180} label="LOW" />
      <Gauge size={130} value={64} thickness={11} label="MID" />
      <Gauge
        size={170}
        value={88}
        thickness={16}
        label="HIGH"
        zones={[
          { to: 34, color: 'var(--zone-low)' },
          { to: 67, color: 'var(--zone-mid)' },
          { to: 100, color: 'var(--zone-high)' },
        ]}
      />
    </div>
  ),
};

/* ---- catalog reproductions (donut-charts DN-13 / DN-14) ------------------ */

/** DN-13 gauge-270 — 270° gauge (opens down) · red→amber→green arc · 5 ticks. */
export const DN13Gauge270: StoryObj<typeof meta> = {
  args: {
    value: 62,
    size: 150,
    thickness: 11,
    sweep: 270,
    gradient: ['var(--zone-low)', 'var(--zone-mid)', 'var(--zone-high)'],
    ticks: 5,
    tickPosition: 'out',
    cap: false,
    label: 'STRAIN',
  },
};

/** DN-14 half-gauge — 180° semicircle · round caps · stat under the arc. */
export const DN14HalfGauge: StoryObj<typeof meta> = {
  args: {
    value: 44,
    size: 140,
    thickness: 12,
    sweep: 180,
    color: 'var(--cyan)',
    cap: false,
    label: 'HYDRATION',
  },
};

/** Zone verdict coloring — arc + readout track the value's zone. */
export const ZoneVerdict: StoryObj<typeof meta> = {
  args: { value: 64 },
  render: () => (
    <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
      <Gauge value={24} zone label="LOW" size={120} />
      <Gauge value={52} zone label="MID" size={120} />
      <Gauge value={81} zone label="HIGH" size={120} shine />
    </div>
  ),
};
