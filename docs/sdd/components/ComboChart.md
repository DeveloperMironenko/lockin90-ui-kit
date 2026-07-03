# SDD — `ComboChart`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/ComboChart.tsx` · `packages/ui-native/src/components/ComboChart.tsx` ·
> web CSS `packages/ui/src/styles/components/combo.css` (`.lk-combo*`).
> **Exports:** `ComboChart`, types `ComboChartProps`, `ComboChartVariant`, `ComboMetric`.
> **Status:** Shipped. **Parity:** 🟡 same API & look; `shine` blurs the wide line underlay on web (`filter: blur(5px)`) vs a wider faint duplicate stroke on native.
> **Stories:** `packages/ui/src/stories/ComboChart.stories.tsx` (`Charts/ComboChart`) · `packages/ui-native/src/stories/ComboChart.stories.tsx` (`Native/ComboChart`).

---

## 1. Overview

The **catalog combo family** (`lockin90-design/charts/combo-charts.html`, CB-01/04/05) for product surfaces: **two metrics, one canvas** — bars for one, a line for the other. Three variants drawn in a fixed **320×150 viewBox** with the catalog grid, mono labels and **stacked legend pills** naming both metrics. The metric pair and its tokens are the SELECT: workouts×energy, sleep×HRV, kcal×weight (+ goal rule)…

| Catalog ID | Props | Card |
| --- | --- | --- |
| CB-01 `bars-line` | `variant="bars-line"` (default) + `bars`/`line` metric pair (+`goal`) | bars metric + smooth line metric + stacked legend pills |
| CB-04 `area-line` | `variant="area-line"` | filled area metric + companion line — strain spikes where energy dips |
| CB-05 `bars-plan` | `variant="bars-plan"` | volume bars + dashed white stepped plan line (progressive-overload ramp) |

(CB-02/03 don't exist — numbering gaps in the catalog.)

## 2. API contract

Same prop API on both platforms; only the container props are platform-shaped.

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `variant` | `'bars-line' \| 'area-line' \| 'bars-plan'` | `'bars-line'` | ✓ | ✓ | CB-01 / 04 / 05 |
| `bars` | `ComboMetric` | catalog pair per variant (TRAIN MIN / ENERGY / LIFTED) | ✓ | ✓ | the bars metric — drawn as the **filled area** on `area-line` |
| `line` | `ComboMetric` | catalog pair per variant (ENERGY / STRAIN / PLAN) | ✓ | ✓ | the line metric — drawn as **dashed steps** on `bars-plan` |
| `title` | `string` | — | ✓ | ✓ | top-left mono caption (`'TRAINING × ENERGY'`) |
| `goal` | `number` | — | ✓ | ✓ | dashed amber rule, in the **line metric's units** (the kcal×weight card) |
| `goalLabel` | `string` | `'GOAL'` | ✓ | ✓ | goal pill (`'GOAL 78KG'`); `''` hides the pill, the rule stays |
| `caption` | `string` | `'14 DAYS'` (only default `bars-line`) | ✓ | ✓ | bottom-left faint label; `''` hides |
| `note` | `string` | `'PROGRESSIVE OVERLOAD'` (only default `bars-plan`) | ✓ | ✓ | chip-pill near the baseline; `''` hides |
| `legend` | `boolean` | `true` | ✓ | ✓ | stacked pills top-right: `'BARS · TRAIN MIN'` / `'LINE · ENERGY'` (prefix per variant: BARS·LINE / AREA·LINE / BARS·STEPS) |
| `grid` | `boolean` | `true` | ✓ | ✓ | 3 interior rows + baseline (the catalog grid) |
| `shine` | `boolean` | `false` | ✓ | ✓ | glow underlay along the smooth companion line (catalog `cfg.shine`); no-op on the dashed plan |
| `ariaLabel` | `string` | `'Combo chart'` | ✓ | ✓ | web `aria-label` / native `accessibilityLabel` |
| `className` | `string` | — | ✓ | — | web only, merged onto `.lk-combo` |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only, container style |
| _rest_ | `Omit<HTMLAttributes<HTMLDivElement>, 'title' \| 'children'>` | — | ✓ | — | spreads to the root `<div>` |

**`ComboMetric`** — `{ label; data; color?; max?; opacity? }`:
- `label` — the legend-pill name; the pill reads `'<GEOMETRY> · <label>'`.
- `data` — raw values, one per step; a bars value ≤ 0 skips its bar (rest days). Each metric spreads across the full plot width on its own length.
- `color` — token override. Defaults: `bars-line` violet bars / mint line · `area-line` mint area / amber (`--zone-mid`) line · `bars-plan` mint bars / white-70% steps (`--text` at 0.7, pill in `--text-dim`).
- `max` — the value that maps to the plot top. Default `max(data)/0.94` (catalog headroom); pass `1` for ready-made 0–1 fractions. The two metrics scale **independently** (dual-axis semantics).
- `opacity` — bars fill opacity (default 0.55; the kcal card uses 0.4).

## 3. Visual spec (tokens — never hardcode)

Geometry is the catalog's, in viewBox units: `W 320 · H 150 · pad l10 r12 t16 b14 · plot 298×120`.

| Element | Spec (both platforms) |
| --- | --- |
| Normalization | per metric: `data[i]/max` → plot-height fraction; default `max = max(data)/0.94` |
| Bars | width `plotW/n·0.5`, centered on `xAt(i)`, rx `min(3, bw/2)`, fill = bars color at `opacity` (default **0.55**), from value to baseline; `v ≤ 0` skips |
| Smooth lines | Fritsch–Carlson monotone (the catalog `smoothPath` port), **2.2px**, round cap |
| Area (CB-04) | the smooth top edge closed to the baseline corners, fill = area color at **0.14**, plus the 2.2px edge line |
| Plan steps (CB-05) | catalog `steps()`: per-step horizontals `x±bw/2` (bw `plotW/n`) joined by short risers, **1.6px**, dash `4 3`, `--text` at strokeOpacity 0.7 (or the passed token, opaque) |
| Goal rule | horizontal 1.2px `--zone-mid`, dash `4 4`, at `goal/lineMax`; pill 10 above at `P.l+8`, start-anchored |
| Legend pills | catalog `tag()` chips at (`W−P.r−4`, 24) and (…, 40), end-anchored, in each metric's color: rect w `len·5.35+12`, h 13, rx 6.5, fill `--bg-0` at 78%, tinted hairline 0.35/0.8px, centered 8px mono text |
| Grid | 3 interior rows at plot 25/50/75%, `--border` at strokeOpacity 0.55 (catalog white-5%); baseline `--border` full |
| Labels | `--font-mono` / `fonts.mono`, **8.5** viewBox px, letter-spacing `.06em` (native `0.5`), `--text-faint` |
| Note pill | chip at (`P.l+66`, `H−22`) in `--text-dim` |
| Shine | 7px round-cap duplicate of the companion line at opacity 0.45 — **blurred 5px on web** (`.lk-combo-shine`), plain wider duplicate at 0.3 on native |
| Sizing | web `.lk-combo-svg`: `width 100%; height auto; overflow visible`; native root: `width '100%', aspectRatio 320/150` |

## 4. States

Pure render — no hover/press/focus/disabled states, no client hooks.

| State | Behavior |
| --- | --- |
| Default | the catalog pair for the chosen variant (train×energy / energy×strain / lifted×plan) |
| Empty metric (`data: []`) | that metric simply doesn't draw (no crash); grid/title/legend still render |
| Zero/negative bars values | the bar is skipped (the catalog's rest-day gap) |
| Different lengths | each metric spreads its own length across the full width (they stay time-aligned only if lengths match — keep them equal) |
| `goal` beyond `line.max` | the rule maps above the plot top (overflow is visible by design) |
| `caption=''` / `note=''` / `goalLabel=''` / `legend={false}` | the respective annotation is hidden |

## 5. Web ↔ native parity

**🟡 same API, platform-shaped implementation.** Identical geometry, normalization, monotone smoothing, steps port, legend/goal/note layout — both compute from the same catalog constants. The real differences:

- **Shine substrate** — web blurs the 7px underlay (`.lk-combo-shine`, `filter: blur(5px)`, opacity 0.45); native draws the same stroke **unblurred** at 0.3 (the `Ring` glow precedent) because RN SVG filters are unreliable on device.
- **Label styling channel** — web styles `<text>` via `.lk-combo-label` / `.lk-combo-tag`; native passes `fontSize/fontFamily/letterSpacing` props on `Svg.Text`.
- **Container** — web `div[role=img]` + `className`/rest; native `View accessibilityRole="image"` + `style`.

## 6. Composition & usage

Standalone chart — composes nothing from the kit; typically placed inside a `Card`/`MetricTile` body. The dual-metric dashboard hero (training×energy), recovery pairs (sleep×HRV), nutrition-vs-outcome (kcal×weight + goal), plan adherence (lifted×plan).

```tsx
// web — CB-01 with a real pair + goal rule
<ComboChart variant="bars-line" title="KCAL × WEIGHT"
  bars={{ label: 'KCAL', data: kcal, color: 'var(--lime)', opacity: 0.4 }}
  line={{ label: 'WEIGHT', data: weightKg, max: 90 }}
  goal={78} goalLabel="GOAL 78KG" />
```

```tsx
// native — identical props (CB-05)
<ComboChart variant="bars-plan" title="LIFTED VS PLAN"
  bars={{ label: 'LIFTED', data: liftedKg }}
  line={{ label: 'PLAN', data: planKg }}
  note="PROGRESSIVE OVERLOAD" />
```

## 7. Accessibility

- **Web:** root `<div role="img" aria-label={ariaLabel}>`; the `<svg>` is `aria-hidden` (in-SVG text is decorative). Pass a data-bearing `ariaLabel` ("Training minutes vs energy, 14 days: energy trends up on training days").
- **Native:** root `View` with `accessibilityRole="image"` + `accessibilityLabel={ariaLabel}`.
- Non-interactive — no focus/keyboard surface. In-chart text scales with the container; keep charts ≥ ~300px wide or move critical numbers into surrounding real text.
- Color is not the only channel: geometry differs per metric (bars vs line vs dashed steps) AND both are named in the legend pills.

## 8. Usage rules — Do / Don't

**Do**
- Keep the two metrics the **same length** so steps stay time-aligned; feed raw units per metric and let each scale independently (or pin with `max`).
- Put the *count/volume* metric in `bars` and the *state/outcome* metric in `line` — the catalog pairs read that way.
- Express `goal` in the **line metric's units** — it maps through the line scale.
- Override colors with **tokens only** (`var(--lime)` / `colors.lime`).

**Don't**
- Don't normalize one metric into the other's units to fake a shared axis — this is a dual-axis chart; the legend pills carry the units story.
- Don't pass more than two metrics — a third series belongs to `LineChart`/`AreaChart`, not here.
- Don't rebuild the plan line with `LineChart` dashes — `bars-plan` steps are stepped on purpose (a plan holds level, then jumps).
- Don't hardcode hex in `color` overrides, and don't restyle `.lk-combo-*` per app.

## 9. Anti-patterns & lookalike ban

- **No hand-rolled combos.** Any bars+line, area+line or bars+plan dual-metric canvas on a product surface is this component — never a local SVG lookalike or two stacked kit charts pretending to share a canvas.
- **New variant → both platforms.** A new combo form (e.g. line+dots events) is added here, web + native in the same unit of work, with the same prop name — never a one-off in an app.
- **Tokens only** — spectrum/zone/text/border tokens throughout; the plan's "white" is `--text` at 0.7 (no raw hex in app code, ever).
- **Don't fork the smoothing or the steps** — `monotonePath`/`stepsPath` are catalog ports; apps never re-implement them to "match".
- **Parity gate:** any change ships only after the web story and the native story are compared side-by-side against `combo-charts.html`.
