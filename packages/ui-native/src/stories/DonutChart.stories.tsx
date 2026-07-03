import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View, Text } from 'react-native';
import { colors, fonts } from '@lockin90/tokens';
import { DonutChart } from '../components/DonutChart';

const meta = { title: 'Native/DonutChart' } satisfies Meta;
export default meta;

type Story = StoryObj;

/** spectrum-ordered trio (the catalog TRIO) */
const TRIO = [colors.mint, colors.cyan, colors.violet];

/** big number + mono sub, Ring-style center */
function Center({ big, sub }: { big: string; sub?: string }) {
  return (
    <>
      <Text style={{ fontFamily: fonts.display, fontSize: 22, lineHeight: 24, color: colors.text }}>
        {big}
      </Text>
      {sub ? (
        <Text
          style={{
            fontFamily: fonts.mono,
            fontSize: 9,
            letterSpacing: 1.1,
            textTransform: 'uppercase',
            color: colors.textFaint,
          }}
        >
          {sub}
        </Text>
      ) : null}
    </>
  );
}

/** Defaults: 50/30/20 cyan / lime / violet, center shows the summed total. */
export const Default: Story = {
  render: () => <DonutChart />,
};

/** A big score number + label in the center via `children`. */
export const WithCenter: Story = {
  render: () => (
    <DonutChart size={160} thickness={18}>
      <Text style={{ fontSize: 40, lineHeight: 40, color: '#fff' }}>76</Text>
      <Text
        style={{
          fontSize: 10,
          letterSpacing: 1.2,
          color: 'rgba(255,255,255,0.5)',
        }}
      >
        SCORE
      </Text>
    </DonutChart>
  ),
};

export const CustomSegments: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 16 }}>
      <DonutChart
        segments={[
          { value: 70, color: '#34F5C5', label: 'Done' },
          { value: 30, color: 'rgba(255,255,255,0.12)', label: 'Remaining' },
        ]}
      />
    </View>
  ),
};

/* ---- catalog reproductions (pie-charts / share arcs PC-01…PC-13) --------- */

/** PC-01 duo-split — 2 round-cap arc segments · mint + glass remainder · center stat. */
export const PC01DuoSplit: Story = {
  render: () => (
    <DonutChart
      variant="duo-split"
      size={116}
      segments={[
        { value: 68, color: colors.mint, label: 'DONE' },
        { value: 32, color: 'rgba(255,255,255,0.14)', label: 'LEFT' },
      ]}
    >
      <Center big="68%" sub="DONE" />
    </DonutChart>
  ),
};

/** PC-02 split-arcs — SELECT 2–5 segments · spectrum-ordered · real gaps · center stat. */
export const PC02SplitArcs: Story = {
  render: () => (
    <DonutChart
      variant="split-arcs"
      size={116}
      segments={[
        { value: 45, color: TRIO[0]!, label: 'PROTEIN' },
        { value: 33, color: TRIO[1]!, label: 'CARBS' },
        { value: 22, color: TRIO[2]!, label: 'FAT' },
      ]}
    >
      <Center big="2140" sub="KCAL" />
    </DonutChart>
  ),
};

/** PC-04 zone-share — segments = zone verdicts · center day count. */
export const PC04ZoneShare: Story = {
  render: () => (
    <DonutChart
      variant="zone-share"
      size={116}
      segments={[
        { value: 52, color: colors.zoneHigh, label: 'GOOD' },
        { value: 31, color: colors.zoneMid, label: 'OK' },
        { value: 17, color: colors.zoneLow, label: 'ROUGH' },
      ]}
    >
      <Center big="30" sub="DAYS" />
    </DonutChart>
  ),
};

/** PC-05 hero-arc — hero segment +4px & shine · others 30% — the arc "explode". */
export const PC05HeroArc: Story = {
  render: () => (
    <DonutChart
      variant="hero-arc"
      size={116}
      hero={0}
      segments={[
        { value: 44, color: TRIO[0]!, label: 'SLEEP' },
        { value: 30, color: TRIO[1]!, label: 'FOOD' },
        { value: 26, color: TRIO[2]!, label: 'STRESS' },
      ]}
    >
      <Center big="44%" sub="SLEEP" />
    </DonutChart>
  ),
};

/** PC-07 callout-arcs — leader lines + chip-pill labels around the ring + center stat. */
export const PC07CalloutArcs: Story = {
  render: () => (
    <DonutChart
      variant="callout-arcs"
      size={190}
      segments={[
        { value: 48, color: TRIO[0]!, label: 'SLEEP' },
        { value: 33, color: TRIO[1]!, label: 'TRAINING' },
        { value: 19, color: TRIO[2]!, label: 'OTHER' },
      ]}
    >
      <Center big="16H" sub="AWAKE" />
    </DonutChart>
  ),
};

/** PC-09 thin-share — slim 6px segments — halo weight. */
export const PC09ThinShare: Story = {
  render: () => (
    <DonutChart
      variant="thin-share"
      size={116}
      segments={[
        { value: 40, color: TRIO[0]!, label: 'DEEP' },
        { value: 35, color: TRIO[1]!, label: 'LIGHT' },
        { value: 25, color: TRIO[2]!, label: 'BREAKS' },
      ]}
    >
      <Center big="5.2H" sub="FOCUS" />
    </DonutChart>
  ),
};

/** PC-11 mini-multiples — 3 small arc rings + lead-share center + day labels
 *  (composition: three mini DonutCharts side by side). */
export const PC11MiniMultiples: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 26 }}>
      {(
        [
          { day: 'MON', fracs: [62, 38] },
          { day: 'TUE', fracs: [45, 30, 25] },
          { day: 'WED', fracs: [80, 20] },
        ] as const
      ).map(({ day, fracs }) => (
        <View key={day} style={{ alignItems: 'center', gap: 6 }}>
          <DonutChart
            variant="mini-multiples"
            segments={fracs.map((v, i) => ({ value: v, color: TRIO[i]! }))}
          >
            <Text style={{ fontFamily: fonts.display, fontSize: 15, color: colors.text }}>
              {fracs[0]}
            </Text>
          </DonutChart>
          <Text style={{ fontFamily: fonts.mono, fontSize: 9, color: colors.textFaint }}>{day}</Text>
        </View>
      ))}
    </View>
  ),
};

/** PC-13 nested-arcs — TWO concentric rings: inner coarse split + outer
 *  breakdown shaded by family + leader-line chip labels. */
export const PC13NestedArcs: Story = {
  render: () => (
    <DonutChart
      variant="nested-arcs"
      size={210}
      thickness={10}
      innerSegments={[
        { value: 50, color: TRIO[0]! },
        { value: 30, color: TRIO[1]! },
        { value: 20, color: TRIO[2]! },
      ]}
      segments={[
        { value: 20, color: colors.mint, label: 'DEEP', opacity: 1 },
        { value: 13, color: colors.mint, label: 'REM', opacity: 0.68 },
        { value: 17, color: colors.mint, label: 'LIGHT', opacity: 0.42 },
        { value: 18, color: colors.cyan, label: 'STRENGTH', opacity: 1 },
        { value: 12, color: colors.cyan, label: 'CARDIO', opacity: 0.6 },
        { value: 20, color: colors.violet, label: 'OTHER', opacity: 0.85 },
      ]}
    >
      <Text style={{ fontFamily: fonts.mono, fontSize: 10, color: colors.textDim }}>24H</Text>
    </DonutChart>
  ),
};
