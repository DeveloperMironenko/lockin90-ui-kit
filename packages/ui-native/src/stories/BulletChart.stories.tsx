import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { colors } from '@lockin90/tokens';
import { BulletChart } from '../components/BulletChart';

/* The component's default rows ARE the catalog demo data
   (lockin90-design/charts/bullet-charts.html MACROS / single / over rows), so
   the stories reproduce the design cards — and the web twin — by eye. */

/* BL-01 SELECT — the catalog's compact 'day' rows (13px density) */
const DAY_ROWS = [
  { label: 'STEPS', value: 0.74, target: 0.85, color: colors.mint, display: '8.7K/10K' },
  { label: 'KCAL', value: 0.9, target: 0.85, color: colors.cyan, display: '2210' },
  { label: 'WATER', value: 0.55, target: 0.85, color: colors.indigo, display: '1.6/2.5L' },
  { label: 'SLEEP', value: 0.97, target: 0.9, color: colors.violet, display: '7H50' },
];

const meta = { title: 'Native/BulletChart' } satisfies Meta;
export default meta;

/** BL-01 bullets — THE macro-tracker rows: range bands + slim value bar +
 *  white target tick; FAT (1.12) overflows magenta past the scale end. */
export const BL01Bullets: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <BulletChart variant="bullets" title="MACROS · TODAY" />
    </View>
  ),
};

/** BL-01 SELECT — compact 13px density, four day-goal rows (no caption). */
export const BL01Compact: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <BulletChart variant="bullets" density="compact" title="TODAY · GOALS" rows={DAY_ROWS} />
    </View>
  ),
};

/** BL-01 SELECT — attainment-zone coloring: value/target ratio picks the bar
 *  token (on = zone-high · under = zone-mid · ≥1.3 over = zone-low). */
export const BL01ZoneColoring: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <BulletChart variant="bullets" zoneColoring title="MACROS · ZONES" />
    </View>
  ),
};

/** BL-02 single-bullet — one large bullet with the anatomy labeled:
 *  LOW/OK/GOOD band words + TARGET pill + mint value. */
export const BL02SingleBullet: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <BulletChart variant="single-bullet" title="PROTEIN · DETAIL" />
    </View>
  ),
};

/** BL-05 over-bullets — the over-limit story: magenta overflow past the scale
 *  end + per-row OVER pills (kcal, sodium). */
export const BL05OverBullets: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <BulletChart variant="over-bullets" title="OVER TARGET" />
    </View>
  ),
};

/** Real-data example — real units via `max` (grams); no display overrides. */
export const BL01RealUnits: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <BulletChart
        variant="bullets"
        title="MACROS · TODAY"
        rows={[
          { label: 'PROTEIN', value: 132, max: 150, target: 120, ranges: [75, 120], display: '132/150G' },
          { label: 'CARBS', value: 155, max: 250, target: 200, ranges: [125, 200], display: '155/250G' },
          { label: 'FAT', value: 78, max: 70, target: 56, ranges: [35, 56], display: '78/70G' },
        ]}
      />
    </View>
  ),
};

/** The catalog glow modifier — wider faint duplicate bars (no filters). */
export const Shine: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <BulletChart variant="bullets" title="MACROS · TODAY" shine />
    </View>
  ),
};
