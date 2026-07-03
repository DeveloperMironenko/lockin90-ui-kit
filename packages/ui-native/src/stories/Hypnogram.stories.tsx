import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { Hypnogram } from '../components/Hypnogram';

const meta = { title: 'Native/Hypnogram' } satisfies Meta;
export default meta;

export const Default: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <Hypnogram />
    </View>
  ),
};

export const NoLabels: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <Hypnogram showStageLabels={false} />
    </View>
  ),
};

export const Short: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <Hypnogram
        segments={[
          { stage: 'awake', minutes: 8 },
          { stage: 'light', minutes: 42 },
          { stage: 'deep', minutes: 55 },
          { stage: 'rem', minutes: 22 },
          { stage: 'light', minutes: 30 },
        ]}
        axis={['11p', '12a', '1a']}
      />
    </View>
  ),
};

/** SL-01 with the shine glow underlay (wider faint capsule duplicates). */
export const SL01Shine: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <Hypnogram shine />
    </View>
  ),
};

/** SL-04 · efficiency-bars — violet asleep bars up / amber awake bars down from
 *  the midline · ASLEEP/AWAKE tags · clock axis. Defaults reproduce the catalog
 *  card's deterministic night (32 buckets, 3 brief awakenings). */
export const SL04EfficiencyBars: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <Hypnogram variant="efficiency-bars" asleepLabel="ASLEEP 94%" awakeLabel="AWAKE 22 MIN" />
    </View>
  ),
};

/** SL-05 · sleep-week — 7 duration bars (violet ≥ target−30m, amber under) +
 *  dashed mint TARGET 8H rule + day letters. Catalog data. */
export const SL05SleepWeek: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <Hypnogram variant="sleep-week" week={[7.4, 6.1, 7.9, 8.2, 5.8, 8.6, 7.7]} targetHours={8} />
    </View>
  ),
};

/** SL-06 · bedtime-drift — BED (violet, coral when late) + WAKE (amber) dots
 *  joined per day · mint CONSISTENT WINDOW band. Weekend drift visible. */
export const SL06BedtimeDrift: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <Hypnogram
        variant="bedtime-drift"
        nights={[
          { bed: 22.6, wake: 6.9 },
          { bed: 22.9, wake: 6.7 },
          { bed: 22.4, wake: 7.0 },
          { bed: 22.7, wake: 6.8 },
          { bed: 24.5, wake: 7.6 },
          { bed: 25.0, wake: 7.9 },
          { bed: 22.9, wake: 7.0 },
        ]}
        consistencyWindow={[22.3, 23.5]}
      />
    </View>
  ),
};

/** SL-07 · night-coach WITH the mint recommendation pill (catalog copy). */
export const SL07NightCoach: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <Hypnogram
        variant="night-coach"
        wakeWindowAt={0.62}
        recommendation="TRY LIGHTS-OUT 22:40 · +24 MIN DEEP"
      />
    </View>
  ),
};

/** SL-07 · night-coach data-only SELECT — wake-window rule, no recommendation. */
export const SL07DataOnly: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <Hypnogram variant="night-coach" wakeWindowAt={0.62} />
    </View>
  ),
};
