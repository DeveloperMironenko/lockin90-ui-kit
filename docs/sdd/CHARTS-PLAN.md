# Charts program — implement the design-catalog chart library in the kit (web + native)

**Source of truth:** `lockin90-design/charts/` — 251 named variants across 35 families (deduplicated:
one variant per chart FORM; colors / counts / states are SELECT options). Each catalog page is a working
SVG reference implementation: the `CFG` array + renderer in the page source **is the spec**, and
`lockin90-design/charts/README.md` is the index. Machine-readable matrix:
`chart-variant-matrix.json` (mirrored in this folder).

**Contract**

- One kit component per family — NO duplicates. If a primitive already covers the family
  (see mapping below) it is EXTENDED with the catalog variants; a new component is added only where
  nothing exists. Never create a lookalike (kit hard rule #2).
- Variant prop: `variant?: '<catalog-name>'` (the catalog names, e.g. `'forecast-fan'`), plus option
  props for each SELECT in the spec (`color`, `segments`, `state`, …). Catalog ID ↔ component+props
  mapping lives in `CHART-MAP.md` next to this file so "build LC-46" resolves mechanically.
- Both platforms in the same unit of work, same prop API (kit hard rule #3):
  web = inline `<svg>` + `lk-*` CSS partner file; native = `react-native-svg`.
  Copy-templates: `Ring` (arcs/radial), `Sparkline` (line+gradient+useId), `LineChart`/`PkChart`
  (axes/markers/bands), `BarChart`/`StackedBar` (bars), `Gauge`/`PhaseWheel` (sweeps).
- Tokens only. Web `var(--x)`, native `colors.x` from `@lockin90/tokens`. Zone logic: value ≥0.62 →
  `zone-high`, ≥0.38 → `zone-mid`, else `zone-low` (same as catalog `zoneOf`).
- Native glow: a **Gaussian-blurred duplicate shape** via real `<Filter><FeGaussianBlur>` (react-native-svg 15, Fabric) — see the "Native glow/shadow substrate" rule in `components/CONVENTIONS.md`. (Supersedes the old "wider faint duplicate, never SVG filters" rule.)
- `shine` is a boolean prop on every chart (the catalog's glow-underlay modifier).
- Deliverables per component: web tsx (+css if needed), native tsx, both `src/index.ts` exports,
  story per platform, 9-section SDD (`docs/sdd/components/<X>.md` per TEMPLATE.md),
  `COMPONENT-INVENTORY.md` §3 row + dated additions bullet, changeset (one for the whole program).
- Charts take real data via props (arrays/objects) — the catalog's synthetic data goes into the STORIES,
  reproducing the catalog card so parity vs the design page is verifiable by eye.

**Family → component mapping (35 families)**

EXTEND existing (10):
| Family (variants) | Component | Notes |
|---|---|---|
| line-charts (32) | `LineChart` | absorb solid/gradient/veil/curve/dash/weight/neon + markers/compare/bands/forecast variants; `Sparkline` stays as the micro primitive |
| bar-charts (15) | `BarChart` | + diverge/stacked/grouped/lollipop/waterfall/rank-rows/goal/forecast; `StackedBar`/`ZoneBar`/`BarFill` stay as-is |
| progress-charts (8) | `ProgressBar` | + step-cells/milestones/goal-tick…/countdown |
| donut-charts (10) | `Ring` + `Gauge` | score-ring family → Ring; gauge-270/half → Gauge; delta/segment/legend donuts → `DonutChart` |
| pie-charts (8) | `DonutChart` | share-arc variants (segmented stroke arcs, callouts, nested PC-13) |
| heatmap-charts (13) | `Heatmap` | + calendars, hour×day, corr-matrix, focus/today-ring |
| sleep-charts (7) | `Hypnogram` + new `SleepChart` wrapper only if needed — prefer variants on Hypnogram + map SL-02→StackedBar, SL-03→Ring in CHART-MAP |
| cycle-charts (3) | `PhaseWheel` | + strip + coach variants |
| funnel-charts (4) | `FunnelChart` (admin, web-only) | promote cross-platform: move to shared + add native twin |
| biomarker-charts (5) | `ReferenceRangeBar` (admin, web-only) | promote cross-platform as `BiomarkerRange` family |

NEW components (25):
`AreaChart` (area-stacks) · `SankeyChart` · `TimelineChart` · `SessionChart` · `RadarChart` ·
`ScatterChart` · `DistributionChart` · `DayWheel` (radial) · `CompareChart` · `UnitChart` ·
`SupplementChart` · `BodyBattery` · `MetaphorWidget` · `StatTile` · `CompositeChart` ·
`BulletChart` · `VitalsStrip` · `BeeswarmChart` · `ZonePyramid` · `ComboChart` ·
`WatchComplication` · `CaffeineClock` · `EnvironmentChart` · `ChartState` · `RoseChart`

**Waves** (fan-out agents, main agent verifies `pnpm typecheck && pnpm build && pnpm test` after each):
W1 extensions → W2 new core charts → W3 domain widgets. Storybook build at the end.
