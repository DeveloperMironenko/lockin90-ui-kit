import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { ZonePyramid } from '../components/ZonePyramid';

/* The component's default zones ARE the catalog demo data
   (lockin90-design/charts/pyramid-charts.html ZONES), so the stories
   reproduce the design cards — and the web twin — by eye. */

const meta = { title: 'Native/ZonePyramid' } satisfies Meta;
export default meta;

/** PY-01 zone-pyramid — THE weekly intensity-distribution card: centered bars
 *  Z5→Z1, width = time, % left / h:mm right, zone letter inside wide bars. */
export const PY01ZonePyramid: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <ZonePyramid variant="zone-pyramid" title="TIME IN ZONE · WEEK" caption="9H 11M TOTAL · BASE-HEAVY = GOOD" />
    </View>
  ),
};

/** PY-02 target-pyramid — dashed white target outline per zone + the derived
 *  amber 'Z3 +40M OVER' pill at the worst overage. */
export const PY02TargetPyramid: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <ZonePyramid variant="target-pyramid" title="VS POLARIZED PLAN" caption="DASHED = 80/20 POLARIZED TARGET" />
    </View>
  ),
};

/** PY-03 mirror-pyramid — this week right (solid) vs last week left (32%),
 *  zone letters on the spine + derived delta pill. */
export const PY03MirrorPyramid: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <ZonePyramid variant="mirror-pyramid" title="WEEK VS WEEK" />
    </View>
  ),
};

/** Real-data example — minutes only; %, h:mm, total caption all derive. */
export const PY01Derived: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <ZonePyramid
        variant="zone-pyramid"
        title="TIME IN ZONE · WEEK"
        zones={[
          { label: 'Z5', minutes: 24 },
          { label: 'Z4', minutes: 58 },
          { label: 'Z3', minutes: 96 },
          { label: 'Z2', minutes: 170 },
          { label: 'Z1', minutes: 232 },
        ]}
      />
    </View>
  ),
};

/** The catalog glow modifier — wider faint duplicate bars (no filters). */
export const Shine: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <ZonePyramid variant="zone-pyramid" title="TIME IN ZONE · WEEK" caption="" shine />
    </View>
  ),
};
