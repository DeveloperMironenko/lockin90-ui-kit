# SDD — `BarChart` (+ `BarItem`, `BarChartVariant`, `BarChartLegendItem` types)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/BarChart.tsx` · `packages/ui-native/src/components/BarChart.tsx` ·
> web CSS `packages/ui/src/styles/components/bc.css` (`.lk-bc*` classic · `.lk-bcv*` variants).
> **Exports:** `BarChart`, type `BarItem`, type `BarChartProps` (plus in-file `BarChartVariant`, `BarChartLegendItem`).
> **Status:** Shipped. **Parity:** 🟡 same API & visuals; the classic `gradient` prop is platform-shaped (web CSS string ↔ native tuple) and the BC-17 pulse ring animates on web only.
> **Stories:** `packages/ui/src/stories/BarChart.stories.tsx` · `packages/ui-native/src/stories/BarChart.stories.tsx` — variant stories named by catalog ID (`BC01Bars` …).

---

## 1. Overview

The kit's only sanctioned **vertical bar chart**, in two modes:

- **Classic (no `variant`)** — a flex row of gradient-filled columns sized by `value / max`, value label above, mono label below; `highlight: true` bars get a brighter mint gradient + glow. The weekday-energy strip is the canonical use. **Not an SVG.**
- **Catalog variants (`variant="…"`)** — an inline-SVG chart on the design catalog's **320×150 geometry** (plot inset l10 r12 t16 b14), implementing the 15 named forms from `lockin90-design/charts/bar-charts.html` (BC-01…BC-24). The SVG scales uniformly to the container width, so the render matches the catalog card at any size.

For a single horizontal progress bar use `BarFill`/`ProgressBar`; for a 100%-stacked horizontal composition use `StackedBar`; HR zones → `ZoneBar`.

### Catalog ID → variant map

| ID | `variant` | Form | Extra props used |
| --- | --- | --- | --- |
| BC-01 | `bars` | rounded rx3 bars | `color` / `gradientStops` / `glass` (COLOR SELECT) · density = `bars.length` (7/12/24) · `shine` |
| BC-04 | `spectrum-bars` | bar hue by x-position (lime→magenta) | — |
| BC-05 | `zone-bars` | color = value zone (≥62% mint · ≥38% amber · else coral) | — |
| BC-08 | `lollipop` | 2px stem + 3.4px head dot | `color` (default `--cyan`) |
| BC-11 | `diverging-tide` | ± around the 50% midline, mint/coral | `legend` |
| BC-12 | `stacked` | stacked segments — **outer corners rounded, seams square** | `series` (2–3 = segment SELECT) · `legend` (colors drive segments) |
| BC-14 | `grouped-pair` | two series side-by-side (mint / violet 85%) | `series` (2) · `legend` |
| BC-15 | `value-caps` | mono value labels above every 2nd bar (n≤10) | `color` |
| BC-16 | `fade-history` | opacity ramps 25%→100% toward newest | — |
| BC-17 | `today-pulse` | all bars 30%, today 100% + pulse dot above | `BarItem.highlight` picks the bar (default last) |
| BC-18 | `rank-rows` | horizontal ranked pills, spectrum order (top 6, sorted desc) | `BarItem.label` = row label |
| BC-19 | `waterfall` | floating ± steps + connector ticks — values are the **running level** | `waterfallStart` |
| BC-20 | `goal-bars` | bars + dashed `--zone-mid` GOAL rule | `goal` (also usable on other variants) |
| BC-22 | `sparkbar-micro` | no grid, bw 0.5, rx1 micro bars for stat cards | `grid` defaults `false` |
| BC-24 | `forecast-bars` | past solid · future outlined dashed · NOW rule | `forecastFrom` (first projected index) |

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `bars` | `BarItem[]` | `DEFAULT_BARS` (weekday M–S) | ✓ | ✓ | drawn left → right; variant density = `bars.length` |
| `max` | `number` | max visible value | ✓ | ✓ | value ↔ 100% height (stacked → max bar **total**); denom floored at 1 |
| `height` | `number` | `150` | ✓ | ✓ | **classic only** — variants keep the 320×150 catalog aspect |
| `showValues` | `boolean` | `true` (classic) | ✓ | ✓ | classic: label above each bar · variants: opt-in caps every 2nd bar (`value-caps` has them always) |
| **`gradient`** | web `string` · native `[string, string]` | cyan→accent 180° | ✓ | ✓ | **classic only, platform-shaped** |
| `variant` | `BarChartVariant` | — | ✓ | ✓ | see the ID map above |
| `color` | `string` | `--mint` (`lollipop` → `--cyan`) | ✓ | ✓ | variant solid fill (web `var()` / native hex) |
| `gradientStops` | `string[]` | — | ✓ | ✓ | variant vertical fill gradient, top→bottom (overrides `color`) |
| `glass` | `boolean` | `false` | ✓ | ✓ | variant glass fill `rgba(255,255,255,.14)` |
| `series` | `number[][]` | — | ✓ | ✓ | `stacked` (2–3) / `grouped-pair` (2); `series[k][i]` = series k, bar i; replaces `bars` as data |
| `legend` | `BarChartLegendItem[]` | — | ✓ | ✓ | dot legend top-right; its colors also color `series` segments (else mint/violet/cyan) |
| `title` | `string` | — | ✓ | ✓ | mono context label top-left (classic web: passthrough HTML tooltip) |
| `goal` | `number` | — | ✓ | ✓ | dashed GOAL rule at `goal/max` |
| `forecastFrom` | `number` | — | ✓ | ✓ | index of the first dashed forecast bar + NOW rule |
| `waterfallStart` | `number` | first bar value | ✓ | ✓ | waterfall starting level |
| `shine` | `boolean` | `false` | ✓ | ✓ | glow underlay (web blur(5px) dup · native wider faint dup) |
| `grid` | `boolean` | `true` (`sparkbar-micro` → `false`) | ✓ | ✓ | 25/50/75 gridlines + baseline |
| `className` / _rest_ | `HTMLAttributes<HTMLDivElement>` | — | ✓ | — | web only |
| `style` | `CSSProperties` / `StyleProp<ViewStyle>` | — | ✓ | ✓ | merged onto the root |

**`BarItem`:** `value` (height ∝ `value/max`; waterfall = running level; rank-rows = pill length), `label?` (below bar / rank-row name), `color?` (classic fill override), `highlight?` (classic mint+glow; `today-pulse` target).

## 3. Visual spec (tokens — never hardcode)

Classic mode unchanged (see git history): cyan→accent 180° default fill, `--grad-mint` highlight, radius `8/8/4/4`, `1px --border`, mint glow `0 0 18px rgba(52,245,197,.22)`, labels `--text-dim`/`--text-faint` mono.

Variant mode (both platforms, catalog-exact):

| Aspect | Value |
| --- | --- |
| Geometry | viewBox `0 0 320 150`, plot inset l10 r12 t16 b14, bar width 0.62·step (micro 0.5), rx3 (micro rx1) |
| Grid | 25/50/75 lines `rgba(255,255,255,.05)`, baseline `.09` |
| Title/labels | 8.5px `--font-mono`/`fonts.mono`, ls .06em, `--text-faint` (`--text-dim` for legend/rank labels) |
| Spectrum | `--lime --mint --cyan --indigo --violet --magenta` (BC-04 x-ramp, BC-18 rank palette) |
| Zones | `--zone-high/mid/low` at ≥0.62 / ≥0.38 / else (catalog `zoneOf`) |
| Series palette | mint · violet(.85 grouped) · cyan — overridable via `legend[].color` |
| Diverge / waterfall | `--mint` up / `--zone-low` down; waterfall connector `rgba(255,255,255,.25)` |
| Goal rule | `--zone-mid` 1px dash 5-4 @.85 + mono GOAL label |
| NOW rule | `rgba(255,255,255,.22)` 1px + mono NOW label |
| Forecast bars | outlined `stroke-width 1.4` dash 4-3 @.8 in the bar's fill color |
| Stacked rounding | **outer corners r3 only** (top of top seg, bottom of bottom), 1px square seams — `stackSegPath()` ported from the catalog |
| Pulse (BC-17) | dot r3.6 + ring r3.6; web ring scales 1→3 @1.8s (`lkBcvPulse`, reduced-motion → static), dot glow `drop-shadow(0 0 5px)`; native: static ring r7 @.35 + wider faint dot dup (r6.5 @.25) |
| Shine | web `filter: blur(5px)` dup @.5 · native wider dup (+5px, rx4) @.35 |

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Classic default/highlight/color | unchanged (`.lk-bc*`) | unchanged |
| Variant | `.lk-bcv` > uniform-scaling `<svg>` | fixed-aspect `View` (320:150) > `Svg` |
| Zero/negative values | clamp to 0 → 2px min bar | same |
| Empty `bars`/`series` | empty plot (grid/title still render) | same |
| Reduced motion | pulse ring parks static (`prefers-reduced-motion`) | pulse is always static |

No hover/focus/disabled — presentational.

## 5. Web ↔ native parity

**Verdict: 🟡 same API, substrate-shaped rendering.** Identical prop names/defaults, identical geometry (same constants + same `stackSegPath` string math), identical token roles. Real differences:

- **Classic `gradient`:** web CSS string ↔ native `[top, bottom]` tuple (pre-existing, unchanged).
- **BC-17 pulse:** web ring animates via CSS keyframes; native renders a **static** ring + faint halo (no SMIL/Animated SVG radius without new deps). Same dot, same colors.
- **Shine:** web = blurred duplicate; native = Gaussian-blurred duplicate too, via `FeGaussianBlur stdDeviation 2.5` in a padded `userSpaceOnUse` region (real RN-SVG Fabric filters — see CONVENTIONS.md).
- Color literals: web `var(--x)` ↔ native `colors.x` hex — the kit-wide convention.

## 6. Composition & usage

- **Used for:** weekday/period energy strips (classic), and any BC-xx catalog chart on dashboards, stat cards (`sparkbar-micro`), reports (`value-caps`), plans (`forecast-bars`, `goal-bars`).
- **Composes from:** nothing — leaf primitive. Wrap in `Card`; the built-in `title`/`legend` replace ad-hoc chart headers.

```tsx
// web — BC-12 stacked, 2 segments
<BarChart
  variant="stacked"
  title="SLEEP MIX · LAST 12 NIGHTS"
  series={[deepMinutes, lightMinutes]}
  max={480}
  legend={[{ label: 'DEEP', color: 'var(--mint)' }, { label: 'LIGHT', color: 'var(--violet)' }]}
/>

// native — BC-24 forecast
<BarChart variant="forecast-bars" title="ENERGY · ACTUAL + PLAN" bars={days} max={100} forecastFrom={7} />
```

## 7. Accessibility

- Classic root is a plain `<div>`; variant web SVG is `aria-hidden` unless an `aria-label` is spread onto the root — provide one whenever the chart carries meaning (native: `accessibilityLabel` via `style`-adjacent wrapper).
- In-SVG text (title, values, labels) gives a sighted readout; keep labels short and mono-friendly.
- Zone/spectrum colors are supporting encodings — don't make color the only signal in surrounding copy.

## 8. Usage rules — Do / Don't

**Do**
- Pass an explicit `max` so heights are comparable across cards (and so catalog stories reproduce with headroom).
- Ask for charts **by catalog ID** — the ID map above resolves `BC-xx` → `variant` + props mechanically.
- Use `legend` colors to recolor `stacked`/`grouped-pair` series (tokens only).
- Give `waterfall` the running **levels** (plus `waterfallStart`), not deltas.

**Don't**
- ✗ Don't hand-roll any BC-xx form — every one is a `variant` here.
- ✗ Don't pass `height`/`gradient` expecting variant effects — they're classic-mode props (`gradientStops` is the variant gradient).
- ✗ Don't hardcode zone thresholds or spectrum hex — they're the catalog constants, sourced from tokens.
- ✗ Don't use `BarChart variant="stacked"` for a single 100% composition row — that's `StackedBar`.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A local SVG of bars/lollipops/waterfalls re-creates this primitive and will drift — import `BarChart` with the right `variant`.
- **New variant → BOTH platforms** in the same unit of work, same prop names, same catalog geometry (kit hard rule #3).
- **Tokens only.** The only literals allowed are the catalog's structural white-alphas (grid/seams/NOW rule) and the glass 14% fill.
- **Parity gate.** Before shipping a screen, confirm web phone-width ≡ native for the same variant/props — the only allowed visual difference is the static native pulse ring + duplicate-based shine.
