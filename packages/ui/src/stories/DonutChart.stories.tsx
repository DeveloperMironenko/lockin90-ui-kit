import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { DonutChart } from '../components/DonutChart';

const meta = {
  title: 'Primitives/DonutChart',
  component: DonutChart,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof DonutChart>;
export default meta;

/** spectrum-ordered trio (the catalog TRIO) */
const TRIO = ['var(--mint)', 'var(--cyan)', 'var(--violet)'];

/** big number + mono sub, Ring-style center */
function Center({ big, sub }: { big: ReactNode; sub?: string }) {
  return (
    <>
      <span className="lk-display lk-tnum" style={{ fontSize: 22, lineHeight: 1, color: 'var(--text)' }}>
        {big}
      </span>
      {sub ? (
        <span
          className="lk-mono"
          style={{
            fontSize: 9,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--text-faint)',
          }}
        >
          {sub}
        </span>
      ) : null}
    </>
  );
}

/** dot + mono label legend rows (external, per the SDD) */
function Legend({ items }: { items: { label: string; pct: number; color: string }[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center' }}>
      {items.map((it) => (
        <div key={it.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: 4, background: it.color }} />
          <span className="lk-mono" style={{ fontSize: 10, color: 'var(--text-dim)' }}>
            {it.label} · {it.pct}%
          </span>
        </div>
      ))}
    </div>
  );
}

/** Defaults: 50/30/20 cyan·lime·violet, center shows the summed total. */
export const Default: StoryObj<typeof meta> = { args: {} };

/** A big Ring-style number + label in the center via `children`. */
export const WithCenter: StoryObj<typeof meta> = {
  render: (args) => (
    <DonutChart {...args} size={160} thickness={18}>
      <span
        className="lk-display lk-tnum"
        style={{ fontSize: 40, lineHeight: 1, color: 'var(--text)' }}
      >
        76
      </span>
      <span
        className="lk-mono"
        style={{
          fontSize: 10,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--text-faint)',
        }}
      >
        score
      </span>
    </DonutChart>
  ),
};

/* ---- catalog reproductions (pie-charts / share arcs PC-01…PC-13) --------- */

/** PC-01 duo-split — 2 round-cap arc segments · mint + glass remainder · center stat + legend. */
export const PC01DuoSplit: StoryObj<typeof meta> = {
  render: () => (
    <div style={{ display: 'flex', gap: 24 }}>
      <DonutChart
        variant="duo-split"
        size={116}
        segments={[
          { value: 68, color: 'var(--mint)', label: 'DONE' },
          { value: 32, color: 'rgba(255,255,255,0.14)', label: 'LEFT' },
        ]}
      >
        <Center big="68%" sub="DONE" />
      </DonutChart>
      <Legend
        items={[
          { label: 'DONE', pct: 68, color: 'var(--mint)' },
          { label: 'LEFT', pct: 32, color: 'rgba(255,255,255,0.14)' },
        ]}
      />
    </div>
  ),
};

/** PC-02 split-arcs — SELECT 2–5 segments · spectrum-ordered · real gaps · center stat. */
export const PC02SplitArcs: StoryObj<typeof meta> = {
  render: () => (
    <div style={{ display: 'flex', gap: 24 }}>
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
      <Legend
        items={[
          { label: 'PROTEIN', pct: 45, color: TRIO[0]! },
          { label: 'CARBS', pct: 33, color: TRIO[1]! },
          { label: 'FAT', pct: 22, color: TRIO[2]! },
        ]}
      />
    </div>
  ),
};

/** PC-04 zone-share — segments = zone verdicts · center day count + legend. */
export const PC04ZoneShare: StoryObj<typeof meta> = {
  render: () => (
    <DonutChart
      variant="zone-share"
      size={116}
      segments={[
        { value: 52, color: 'var(--zone-high)', label: 'GOOD' },
        { value: 31, color: 'var(--zone-mid)', label: 'OK' },
        { value: 17, color: 'var(--zone-low)', label: 'ROUGH' },
      ]}
    >
      <Center big="30" sub="DAYS" />
    </DonutChart>
  ),
};

/** PC-05 hero-arc — hero segment +4px & shine · others 30% — the arc "explode". */
export const PC05HeroArc: StoryObj<typeof meta> = {
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
export const PC07CalloutArcs: StoryObj<typeof meta> = {
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

/** PC-09 thin-share — slim 6px segments — halo weight + legend. */
export const PC09ThinShare: StoryObj<typeof meta> = {
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
export const PC11MiniMultiples: StoryObj<typeof meta> = {
  render: () => (
    <div style={{ display: 'flex', gap: 26 }}>
      {(
        [
          { day: 'MON', fracs: [62, 38] },
          { day: 'TUE', fracs: [45, 30, 25] },
          { day: 'WED', fracs: [80, 20] },
        ] as const
      ).map(({ day, fracs }) => (
        <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <DonutChart
            variant="mini-multiples"
            segments={fracs.map((v, i) => ({ value: v, color: TRIO[i]! }))}
          >
            <span className="lk-display lk-tnum" style={{ fontSize: 15, color: 'var(--text)' }}>
              {fracs[0]}
            </span>
          </DonutChart>
          <span className="lk-mono" style={{ fontSize: 9, color: 'var(--text-faint)' }}>
            {day}
          </span>
        </div>
      ))}
    </div>
  ),
};

/** PC-13 nested-arcs — TWO concentric rings: inner coarse split + outer
 *  breakdown shaded by family + leader-line chip labels. */
export const PC13NestedArcs: StoryObj<typeof meta> = {
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
        { value: 20, color: 'var(--mint)', label: 'DEEP', opacity: 1 },
        { value: 13, color: 'var(--mint)', label: 'REM', opacity: 0.68 },
        { value: 17, color: 'var(--mint)', label: 'LIGHT', opacity: 0.42 },
        { value: 18, color: 'var(--cyan)', label: 'STRENGTH', opacity: 1 },
        { value: 12, color: 'var(--cyan)', label: 'CARDIO', opacity: 0.6 },
        { value: 20, color: 'var(--violet)', label: 'OTHER', opacity: 0.85 },
      ]}
    >
      <span className="lk-mono" style={{ fontSize: 10, color: 'var(--text-dim)' }}>
        24H
      </span>
    </DonutChart>
  ),
};
