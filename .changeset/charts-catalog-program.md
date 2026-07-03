---
"@lockin90/ui": minor
"@lockin90/ui-native": minor
---

**Charts catalog program — the full `lockin90-design/charts/` design catalog (251 variants /
35 families) lands in the kit, web + native in lockstep.** Ask-by-ID map: catalog ID →
component + `variant` + SELECT-option props lives in `docs/sdd/CHART-MAP.md`
(plan: `docs/sdd/CHARTS-PLAN.md`).

**Extends 9 existing chart primitives** with catalog `variant` unions + option props
(all previous defaults unchanged):

- `LineChart` — `variant` (solid/gradient/veil/tide-split/glass-fill/curve-styles/dash-dot/
  stroke-weight/neon/aurora-halo/ghost-echo/bead-chain/comet-head/peak-flag + marker/compare/
  band/forecast forms), multi-`series`, `curve`, `pattern`, gradient stops, labels.
- `BarChart` — `variant` (spectrum/zone/lollipop/diverging-tide/stacked/grouped-pair/value-caps/
  fade-history/today-pulse/rank-rows/waterfall/goal-bars/sparkbar-micro), legend.
- `ProgressBar` — `variant` (zone-progress/step-cells/milestone-line/ghost-compare/
  overflow-badge/head-pill/countdown-drain).
- `Ring` — `variant` (score/dual/triple/thin-halo/dashed-track/pulse/delta), `zone`, `delta`.
- `Gauge` — `sweep`, `ticks`, `cap`, `shine`, `zone`, `label`/`showValue`.
- `DonutChart` — `variant` (duo-split/split-arcs/zone-share/hero-arc/callout-arcs/…),
  `hero`, `callouts`, nested `innerSegments`, `shine`.
- `Heatmap` — `variant` grid/strip, `scale` (zone/spectrum/diverge), row/col labels,
  day letters, dots, glass, focus row, today ring/pulse, `showValues`.
- `Hypnogram` — `variant` (hypnogram/efficiency-bars/sleep-week/bedtime-drift/night-coach).
- `PhaseWheel` — `variant` (circadian/phase-wheel/coach-wheel/phase-strip), cycle `phases`.

**Adds 27 new chart components** (same names/props/variants on both platforms; web = inline
SVG + `lk-*` classes, native = `react-native-svg`, glow via wide faint duplicate shapes):

`AreaChart`, `BeeswarmChart`, `BiomarkerRange` (promoted cross-platform from the admin
`ReferenceRangeBar` family), `BodyBattery`, `BulletChart`, `CaffeineClock`, `ChartState`
(skeleton/loading/empty/locked/error/partial-sync chart states), `ComboChart`, `CompareChart`,
`CompositeChart`, `DayWheel`, `DistributionChart`, `EnvironmentChart`, `FunnelChart` (promoted
cross-platform; the legacy web-only `@lockin90/ui/admin` FunnelChart is unchanged),
`MetaphorWidget`, `RadarChart`, `RoseChart`, `SankeyChart`, `ScatterChart`, `SessionChart`
(+ `DEFAULT_SESSION_ZONES`), `StatTile`, `SupplementChart`, `TimelineChart`, `UnitChart`,
`VitalsStrip`, `WatchComplication`, `ZonePyramid`.

Every chart is tokens-driven, takes real data via props, supports the catalog SELECT options
as props and the `shine` glow modifier, and ships a Storybook story per platform reproducing
its catalog card.
