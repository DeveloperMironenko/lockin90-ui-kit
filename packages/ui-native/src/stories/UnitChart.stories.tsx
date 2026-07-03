import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { UnitChart } from '../components/UnitChart';

/* Story data reproduces the unit-chart catalog cards
   (lockin90-design/charts/unit-charts.html · UN-01…UN-05) so parity vs the
   design page — and the web twin — is verifiable by eye. */

const meta = { title: 'Native/UnitChart' } satisfies Meta;
export default meta;

/** UN-01 waffle-90 — THE program waffle: 90 dots (15×6), filled mint ramps
 *  toward today, lime TODAY dot (static halo on native) + caption. */
export const UN01Waffle90: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <UnitChart variant="waffle-90" total={90} done={56} title="90-DAY LOCK-IN" />
    </View>
  ),
};

/** UN-02 waffle-share — 10×10 squares partitioned by zone colors + dot legend. */
export const UN02WaffleShare: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <UnitChart
        variant="waffle-share"
        title="DAY QUALITY · 100 DAYS"
        segments={[
          { label: 'GOOD', value: 52 },
          { label: 'OK', value: 31 },
          { label: 'ROUGH', value: 17 },
        ]}
      />
    </View>
  ),
};

/** UN-03 pictogram-rows — icon tallies (dumbbell/moon/cup), done vs remaining 18%. */
export const UN03PictogramRows: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <UnitChart
        variant="pictogram-rows"
        title="THIS WEEK · UNITS"
        rows={[
          { label: 'TRAINING', total: 5, done: 3, icon: 'dumbbell' },
          { label: 'SLEEP 8H+', total: 7, done: 5, icon: 'moon' },
          { label: 'NO-CAFF DAYS', total: 7, done: 4, icon: 'cup' },
        ]}
      />
    </View>
  ),
};

/** UN-04 day-dots — 7 big dots · done = mint + dark check · pending outline
 *  + day letters + derived '5 OF 7 · ON TRACK' pill. */
export const UN04DayDots: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <UnitChart variant="day-dots" title="HABIT · THIS WEEK" days={[true, true, true, true, true, false, false]} />
    </View>
  ),
};

/** UN-05 habit-grid — 3 habit rows × 7 day dots, each row its own hue. */
export const UN05HabitGrid: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <UnitChart
        variant="habit-grid"
        title="HABITS × DAYS"
        habits={[
          { label: 'MEDITATE', days: [1, 1, 0, 1, 1, 1, 0] },
          { label: 'LIFT', days: [1, 0, 1, 0, 1, 0, 0] },
          { label: 'SUNLIGHT', days: [1, 1, 1, 1, 0, 1, 1] },
        ]}
      />
    </View>
  ),
};

/** The catalog glow modifier — wider faint duplicate dots (no filters on native). */
export const Shine: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <UnitChart variant="waffle-90" total={90} done={56} title="90-DAY LOCK-IN" shine />
    </View>
  ),
};
