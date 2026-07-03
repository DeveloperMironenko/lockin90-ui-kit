import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { colors } from '@lockin90/tokens';
import { ComboChart } from '../components/ComboChart';

/* Story data reproduces the combo catalog cards
   (lockin90-design/charts/combo-charts.html · CB-01/04/05) so parity vs the
   design page — and the web twin — is verifiable by eye. */

/* CB-01 SELECT pairs (the catalog's SLEEPH/HRV + KCAL/WEIGHT arrays) */
const SLEEPH = [0.65, 0.7, 0.5, 0.75, 0.6, 0.8, 0.7, 0.55, 0.72, 0.66, 0.78, 0.62, 0.74, 0.7];
const HRV = [0.55, 0.6, 0.45, 0.62, 0.5, 0.7, 0.64, 0.42, 0.6, 0.55, 0.68, 0.5, 0.66, 0.72];
const KCAL = [0.6, 0.72, 0.55, 0.66, 0.8, 0.62, 0.58, 0.74, 0.6, 0.68, 0.55, 0.7, 0.64, 0.6];
const WEIGHT = [0.8, 0.79, 0.78, 0.78, 0.77, 0.75, 0.75, 0.73, 0.72, 0.72, 0.7, 0.69, 0.68, 0.66];

const meta = { title: 'Native/ComboChart' } satisfies Meta;
export default meta;

/** CB-01 bars-line — THE dual-metric dashboard chart: violet training bars +
 *  mint energy line + stacked legend pills + '14 DAYS' caption. */
export const CB01BarsLine: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <ComboChart variant="bars-line" title="TRAINING × ENERGY" />
    </View>
  ),
};

/** CB-01 SELECT — the sleep×HRV metric pair (cyan bars, violet line). */
export const CB01SleepHrv: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <ComboChart
        variant="bars-line"
        title="SLEEP × HRV"
        bars={{ label: 'SLEEP H', data: SLEEPH, color: colors.cyan, max: 1 }}
        line={{ label: 'HRV', data: HRV, color: colors.violet, max: 1 }}
      />
    </View>
  ),
};

/** CB-01 SELECT — the kcal×weight pair: faint lime bars, white weight line
 *  + the dashed amber 'GOAL 78KG' rule. */
export const CB01KcalWeight: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <ComboChart
        variant="bars-line"
        title="KCAL × WEIGHT"
        bars={{ label: 'KCAL', data: KCAL, color: colors.lime, max: 1, opacity: 0.4 }}
        line={{ label: 'WEIGHT', data: WEIGHT, color: colors.text, max: 1 }}
        goal={0.62}
        goalLabel="GOAL 78KG"
      />
    </View>
  ),
};

/** CB-04 area-line — mint energy area + amber strain line — strain spikes
 *  where energy dips. */
export const CB04AreaLine: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <ComboChart variant="area-line" title="ENERGY × STRAIN" />
    </View>
  ),
};

/** CB-05 bars-plan — mint volume bars + dashed white stepped plan line
 *  (the progressive-overload ramp) + note pill. */
export const CB05BarsPlan: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <ComboChart variant="bars-plan" title="LIFTED VS PLAN" />
    </View>
  ),
};

/** The catalog glow modifier — wider faint duplicate line (no filters). */
export const Shine: StoryObj = {
  render: () => (
    <View style={{ width: 360 }}>
      <ComboChart variant="bars-line" title="TRAINING × ENERGY" caption="" shine />
    </View>
  ),
};
