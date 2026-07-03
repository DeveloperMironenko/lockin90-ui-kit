import type { Meta, StoryObj } from '@storybook/react-vite';
import { LineChart } from '../components/LineChart';

const meta = {
  title: 'Primitives/LineChart',
  component: LineChart,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof LineChart>;
export default meta;

export const Default: StoryObj<typeof meta> = {};

export const Sharp: StoryObj<typeof meta> = { args: { smooth: false } };

export const WithMarkers: StoryObj<typeof meta> = {
  args: { markers: [{ index: 9, color: 'var(--zone-low)', label: 'peak' }] },
};

export const WithYAxis: StoryObj<typeof meta> = {
  args: {
    yAxis: true,
    data: [280, 286, 292, 288, 296, 302, 308, 305, 300, 296, 290, 284],
    axis: ['Mon', 'Wed', 'Fri', 'Sun'],
  },
};

// Actual (solid) → forecast (dashed) with an uncertainty ribbon that widens over
// the forecast horizon, plus an event marker at the forecast boundary.
export const Forecast: StoryObj<typeof meta> = {
  args: {
    color: 'var(--accent)',
    // indices 0..6 are observed; 6..11 are the forecast continuation
    data: [60, 64, 71, 78, 84, 88, 90, 93, 95, 96, 95, 92],
    dashedFromIndex: 6,
    band: {
      // ribbon hugs the line over the actuals, fans out over the forecast
      upper: [60, 64, 71, 78, 84, 88, 92, 98, 103, 107, 110, 112],
      lower: [60, 64, 71, 78, 84, 88, 88, 88, 87, 85, 80, 72],
    },
    markers: [{ index: 6, color: 'var(--accent)', label: 'now' }],
    axis: ['9am', '12pm', '3pm', '6pm', '9pm'],
  },
};

/* ============================================================================
   Catalog variants — LC-01…LC-56 from lockin90-design/charts/line-charts.html.
   The synthetic data below is a faithful port of the catalog's `genData`
   (same mulberry32 seeds), so every story reproduces its catalog card.
   ========================================================================== */

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const clamp = (v: number) => Math.max(0.03, Math.min(0.97, v));

function genData(kind: 'wave' | 'trend' | 'circadian' | 'noisy', seed: number, n = 24): number[] {
  const rnd = mulberry32(seed);
  const v: number[] = [];
  if (kind === 'wave') {
    const ph = rnd() * 6;
    const f = 1.15 + rnd() * 0.5;
    const amp = 0.2 + rnd() * 0.08;
    const base = 0.48 + rnd() * 0.12;
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      v.push(clamp(base + Math.sin(t * Math.PI * 2 * f + ph) * amp + Math.sin(t * 19 + ph) * 0.045 + (rnd() - 0.5) * 0.05));
    }
  } else if (kind === 'trend') {
    let x = 0.22 + rnd() * 0.1;
    for (let i = 0; i < n; i++) {
      x += 0.028 + (rnd() - 0.45) * 0.075;
      x = clamp(x);
      v.push(x);
    }
  } else if (kind === 'circadian') {
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      const g1 = 0.55 * Math.exp(-(((t - 0.42) / 0.16) ** 2)); // late-morning peak
      const g2 = 0.3 * Math.exp(-(((t - 0.78) / 0.1) ** 2)); // evening bump
      const d1 = -0.16 * Math.exp(-(((t - 0.62) / 0.07) ** 2)); // afternoon dip
      v.push(clamp(0.18 + g1 + g2 + d1 + (rnd() - 0.5) * 0.035));
    }
  } else {
    const b2 = 0.5 + (rnd() - 0.5) * 0.1;
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      v.push(clamp(b2 + Math.sin(t * Math.PI * 2.2 + rnd()) * 0.12 + (rnd() - 0.5) * 0.26));
    }
  }
  return v;
}

/** widening forecast fan from index `fi` (the catalog's `cfg.fan` derivation) */
const fanFrom = (data: number[], fi: number, slope = 0.028) => ({
  upper: data.map((v, i) => (i < fi ? v : clamp(v + (i - fi) * slope))),
  lower: data.map((v, i) => (i < fi ? v : clamp(v - (i - fi) * slope))),
});

/** catalog card geometry: 0..1 scale, ~150px plot, no x-axis row */
const CAT = { height: 150, axis: [] as string[], yDomain: [0, 1] as [number, number] };

/* ---- A · solids / B · gradients ---- */
export const LC01Solid: StoryObj<typeof meta> = {
  render: () => <LineChart variant="solid" data={genData('wave', 11)} {...CAT} />,
};
export const LC09Gradient: StoryObj<typeof meta> = {
  render: () => <LineChart variant="gradient" data={genData('circadian', 9, 34)} {...CAT} />,
};

/* ---- C · area fills ---- */
export const LC15Veil: StoryObj<typeof meta> = {
  render: () => <LineChart variant="veil" data={genData('wave', 15)} {...CAT} />,
};
export const LC19TideSplit: StoryObj<typeof meta> = {
  render: () => <LineChart variant="tide-split" data={genData('noisy', 19, 32)} baseline={0.5} {...CAT} />,
};
export const LC20GlassFill: StoryObj<typeof meta> = {
  render: () => <LineChart variant="glass-fill" data={genData('wave', 20)} {...CAT} />,
};

/* ---- D · geometry (SELECT curve · pattern · weight) ---- */
export const LC21CurveStyles: StoryObj<typeof meta> = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <LineChart variant="curve-styles" curve="smooth" data={genData('wave', 21)} {...CAT} />
      <LineChart variant="curve-styles" curve="linear" data={genData('wave', 21)} {...CAT} />
      <LineChart variant="curve-styles" curve="step" data={genData('wave', 21)} {...CAT} />
    </div>
  ),
};
export const LC24DashDot: StoryObj<typeof meta> = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <LineChart variant="dash-dot" pattern="dashed" data={genData('trend', 24)} {...CAT} />
      <LineChart variant="dash-dot" pattern="dotted" weight={3} data={genData('trend', 24)} {...CAT} />
    </div>
  ),
};
export const LC26StrokeWeight: StoryObj<typeof meta> = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <LineChart variant="stroke-weight" weight={1} color="var(--text-faint)" data={genData('noisy', 26, 48)} {...CAT} />
      <LineChart variant="stroke-weight" weight={2.5} data={genData('noisy', 26, 48)} {...CAT} />
      <LineChart variant="stroke-weight" weight={4.5} data={genData('noisy', 26, 48)} {...CAT} />
    </div>
  ),
};

/* ---- E · glow & effects ---- */
export const LC28Neon: StoryObj<typeof meta> = {
  render: () => <LineChart variant="neon" data={genData('wave', 28)} {...CAT} />,
};
export const LC30AuroraHalo: StoryObj<typeof meta> = {
  render: () => <LineChart variant="aurora-halo" data={genData('circadian', 30, 34)} {...CAT} />,
};
export const LC32GhostEcho: StoryObj<typeof meta> = {
  render: () => <LineChart variant="ghost-echo" data={genData('wave', 32)} {...CAT} />,
};

/* ---- F · markers & annotations ---- */
export const LC33BeadChain: StoryObj<typeof meta> = {
  render: () => <LineChart variant="bead-chain" data={genData('wave', 33, 14)} {...CAT} />,
};
export const LC34CometHead: StoryObj<typeof meta> = {
  render: () => <LineChart variant="comet-head" data={genData('trend', 34)} {...CAT} />,
};
export const LC35PeakFlag: StoryObj<typeof meta> = {
  render: () => <LineChart variant="peak-flag" data={genData('circadian', 35, 34)} {...CAT} />,
};
export const LC36NowSplit: StoryObj<typeof meta> = {
  // catalog now: 0.62 of 34 points → index 20
  render: () => <LineChart variant="now-split" data={genData('circadian', 36, 34)} now={20} {...CAT} />,
};
export const LC37GoalLine: StoryObj<typeof meta> = {
  render: () => <LineChart variant="goal-line" data={genData('trend', 37)} goal={0.72} {...CAT} />,
};
export const LC38EventPins: StoryObj<typeof meta> = {
  // catalog pins at 0.22 / 0.55 / 0.8 of 24 points → indices 5 / 13 / 18
  render: () => <LineChart variant="event-pins" data={genData('wave', 38)} pins={[5, 13, 18]} {...CAT} />,
};

/* ---- G · compare & states ---- */
export const LC39MultiCompare: StoryObj<typeof meta> = {
  render: () => (
    <LineChart variant="multi-compare" data={genData('wave', 39)} series={[{ data: genData('wave', 93) }]} {...CAT} />
  ),
};
export const LC41YouVsCohort: StoryObj<typeof meta> = {
  render: () => (
    <LineChart variant="you-vs-cohort" data={genData('wave', 43)} series={[{ data: genData('wave', 44) }]} {...CAT} />
  ),
};
export const LC42GhostPrev: StoryObj<typeof meta> = {
  render: () => (
    <LineChart variant="ghost-prev" data={genData('trend', 45)} series={[{ data: genData('trend', 46) }]} {...CAT} />
  ),
};
export const LC43CalibratingTaper: StoryObj<typeof meta> = {
  // catalog taper: 0.55 of 24 points → index 13
  render: () => <LineChart variant="calibrating-taper" data={genData('wave', 47)} taper={13} {...CAT} />,
};
export const LC44DeltaRibbon: StoryObj<typeof meta> = {
  render: () => (
    <LineChart variant="delta-ribbon" data={genData('wave', 48)} series={[{ data: genData('wave', 49) }]} {...CAT} />
  ),
};

/* ---- H · statistical ---- */
export const LC45ConfidenceVeil: StoryObj<typeof meta> = {
  render: () => {
    const data = genData('wave', 50);
    return (
      <LineChart
        variant="confidence-veil"
        data={data}
        band={{ upper: data.map((v) => clamp(v + 0.09)), lower: data.map((v) => clamp(v - 0.09)) }}
        {...CAT}
      />
    );
  },
};
export const LC46ForecastFan: StoryObj<typeof meta> = {
  render: () => {
    const data = genData('circadian', 51, 34);
    // catalog now/fan: 0.6 of 34 points → index 20
    return <LineChart variant="forecast-fan" data={data} now={20} fan={fanFrom(data, 20)} {...CAT} />;
  },
};
export const LC47RangeBand: StoryObj<typeof meta> = {
  render: () => {
    const data = genData('wave', 52);
    const r2 = mulberry32(52 + 7); // the catalog derives the range with seed+7
    const upper = data.map((v) => clamp(v + 0.09 + r2() * 0.07));
    const lower = data.map((v) => clamp(v - 0.09 - r2() * 0.07));
    return <LineChart variant="range-band" data={data} band={{ upper, lower }} {...CAT} />;
  },
};
export const LC48RawVsAvg: StoryObj<typeof meta> = {
  render: () => <LineChart variant="raw-vs-avg" data={genData('noisy', 53, 48)} {...CAT} />,
};
export const LC49AnomalySpark: StoryObj<typeof meta> = {
  render: () => <LineChart variant="anomaly-spark" data={genData('noisy', 61, 40)} {...CAT} />,
};
export const LC50ZoneRibbon: StoryObj<typeof meta> = {
  render: () => <LineChart variant="zone-ribbon" data={genData('circadian', 56, 34)} {...CAT} />,
};

/* ---- I · extensions ---- */
export const LC51DayFade: StoryObj<typeof meta> = {
  render: () => <LineChart variant="day-fade" data={genData('circadian', 77, 34)} {...CAT} />,
};
export const LC52ForecastHorizon: StoryObj<typeof meta> = {
  render: () => {
    const data = genData('circadian', 83, 34);
    // catalog now/fan: 0.55 of 34 points → index 18
    return (
      <LineChart
        variant="forecast-horizon"
        data={data}
        now={18}
        fan={fanFrom(data, 18)}
        labels={[
          { index: 7, text: 'ACTUAL', color: 'var(--mint)', dy: -12 },
          { index: 28, text: 'FORECAST', color: 'var(--violet)', dy: -16 },
        ]}
        {...CAT}
      />
    );
  },
};
export const LC54ZoneForecast: StoryObj<typeof meta> = {
  render: () => {
    const data = genData('circadian', 97, 34);
    return (
      <LineChart
        variant="zone-forecast"
        data={data}
        now={20}
        fan={fanFrom(data, 20)}
        labels={[
          { index: 8, text: 'ACTUAL', dy: -12 },
          { index: 28, text: 'FORECAST', dy: -14 },
        ]}
        {...CAT}
      />
    );
  },
};
export const LC56CoachForecast: StoryObj<typeof meta> = {
  render: () => {
    // the catalog's coach derivation: base day, caffeine-crash hit, counterfactual,
    // and a recommended path from NOW climbing back toward the counterfactual.
    const base = genData('circadian', 83, 34);
    const g = (t: number, c: number, w: number) => Math.exp(-(((t - c) / w) ** 2));
    const nowIdx = 20; // 0.6 of 34 points
    const current = base.map((v, i) => clamp(v - 0.18 * g(i / 33, 0.58, 0.09)));
    const counterfactual = base.map((v) => clamp(v + 0.02));
    const recommended = counterfactual
      .map((v, i) => clamp(Math.min(current[nowIdx] + (i - nowIdx) * 0.045, v + 0.02)))
      .slice(nowIdx);
    return (
      <LineChart
        variant="coach-forecast"
        data={current}
        now={nowIdx}
        series={[
          { data: counterfactual, label: 'WITHOUT CAFFEINE CRASH', labelIndex: 14 },
          { data: recommended, fromIndex: nowIdx, label: 'RECOMMENDED', labelDy: -12 },
        ]}
        {...CAT}
      />
    );
  },
};
