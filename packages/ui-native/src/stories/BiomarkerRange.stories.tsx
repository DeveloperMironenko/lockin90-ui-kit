import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { BiomarkerRange, type BiomarkerMarker } from '../components/BiomarkerRange';

const meta = {
  title: 'Native/BiomarkerRange',
  component: BiomarkerRange,
} satisfies Meta<typeof BiomarkerRange>;
export default meta;

type Story = StoryObj<typeof BiomarkerRange>;

/* The catalog PANEL (biomarker-charts.html), on real-ish scales — the drawn
   fractions match the design page so parity is verifiable by eye. */
const VIT_D: BiomarkerMarker = {
  name: 'VIT D',
  value: 48,
  min: 0,
  max: 86,
  low: 30,
  high: 60,
  unit: 'NG/ML',
  history: [17, 26, 38, 45, 48],
  dates: ['JAN', 'MAR', 'MAY', 'JUL', 'NOW'],
};
const FERRITIN: BiomarkerMarker = {
  name: 'FERRITIN',
  value: 22,
  min: 0,
  max: 120,
  low: 36,
  high: 90,
  unit: 'UG/L',
  history: [48, 38, 30, 22],
};
const HBA1C: BiomarkerMarker = {
  name: 'HBA1C',
  value: 5.2,
  min: 3,
  max: 8.5,
  low: 4.1,
  high: 6,
  display: '5.2%',
  history: [5.3, 5.2, 5.25, 5.2],
};
const LDL: BiomarkerMarker = {
  name: 'LDL',
  value: 4.4,
  min: 0,
  max: 5.6,
  low: 0.8,
  high: 3.4,
  unit: 'MMOL',
  history: [3.0, 3.6, 4.1, 4.4],
};
const PANEL = [VIT_D, FERRITIN, HBA1C, LDL];

/** BR-01 `panel-rows` — THE lab-results screen: 4 marker rows, FERRITIN
 *  flagged LOW and LDL flagged HIGH in coral. */
export const BR01PanelRows: Story = {
  render: () => (
    <View style={{ width: 360 }}>
      <BiomarkerRange markers={PANEL} title="BLOOD PANEL · JUN" />
    </View>
  ),
};

/** BR-02 `single-marker` — the anatomy labeled: LOW/OPTIMAL/HIGH zones, range
 *  numbers 30/60, value dot (static halo on native) + big '48 NG/ML' result. */
export const BR02SingleMarker: Story = {
  render: () => (
    <View style={{ width: 360 }}>
      <BiomarkerRange
        variant="single-marker"
        markers={[{ ...VIT_D, name: 'VITAMIN D' }]}
        title="VITAMIN D · DETAIL"
      />
    </View>
  ),
};

/** BR-03 `marker-trend` — is the protocol working? VIT D improving (↑ mint),
 *  FERRITIN worsening (↓ coral), HBA1C flat (→ dim). */
export const BR03MarkerTrend: Story = {
  render: () => (
    <View style={{ width: 360 }}>
      <BiomarkerRange variant="marker-trend" markers={[VIT_D, FERRITIN, HBA1C]} title="PANEL + TRENDS" />
    </View>
  ),
};

/** BR-04 `panel-grid` — full-panel overview: 2×3 verdict tiles, out-of-range
 *  tiles (FERRITIN, LDL) get a coral border. */
export const BR04PanelGrid: Story = {
  render: () => (
    <View style={{ width: 360 }}>
      <BiomarkerRange
        variant="panel-grid"
        markers={[
          ...PANEL,
          { name: 'B12', value: 480, min: 0, max: 960, low: 240, high: 670 },
          { name: 'TSH', value: 1.8, min: 0, max: 5, low: 1, high: 3 },
        ]}
        title="6 MARKERS · GRID"
      />
    </View>
  ),
};

/** BR-05 `range-history` — the recovery story: 5 test dates climbing INTO the
 *  shaded reference band, with the DEFICIENT + context pills. */
export const BR05RangeHistory: Story = {
  render: () => (
    <View style={{ width: 360 }}>
      <BiomarkerRange
        variant="range-history"
        markers={[VIT_D]}
        title="VIT D · 6 MONTHS"
        flag="DEFICIENT"
        note="VIT D · SUPPLEMENTED SINCE FEB"
      />
    </View>
  ),
};

/** The `shine` glow modifier — wider faint duplicate dots (no SVG filters). */
export const PanelRowsShine: Story = {
  render: () => (
    <View style={{ width: 360 }}>
      <BiomarkerRange markers={PANEL} title="BLOOD PANEL · JUN" shine />
    </View>
  ),
};
