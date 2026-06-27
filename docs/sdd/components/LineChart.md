# SDD — `LineChart` (+ `LineMarker` type)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/LineChart.tsx` · `packages/ui-native/src/components/LineChart.tsx` ·
> web CSS `packages/ui/src/styles/components/lc.css` (`.lk-lc*`).
> **Exports:** `LineChart`, type `LineMarker`, type `LineChartProps`.
> **Status:** Shipped. **Parity:** 🟡 same API & curve math; web stretch-SVG (`preserveAspectRatio="none"`) vs native measured SVG; web has `ariaLabel`, native adds a `PAD_X` x-inset; web-only line glow.
> **Stories:** `packages/ui/src/stories/LineChart.stories.tsx` · `packages/ui-native/src/stories/LineChart.stories.tsx`.

---

## 1. Overview

A **generic line / area chart** — a smooth (Catmull-Rom) or straight gradient/solid line over a faint area fill and horizontal grid, with optional round marker dots + floating label tags, an x-axis row, an optional right y-axis, an **uncertainty `band` ribbon**, and a dashed **forecast tail** (`dashedFromIndex`). The energy-over-day / forecast line is the canonical use.

**Markers are HTML/View overlays** positioned by percentage (not SVG) so they stay perfectly circular despite the stretched SVG. `LineMarker` (`{ index, color?, label? }`) is a secondary export — it anchors a dot (and optional tag) on a data index.

The only sanctioned line/area chart; for tiny inline trends use `Sparkline`, for categorical bars use `BarChart`.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `data` | `number[]` | `DEFAULT_DATA` (16-pt curve) | ✓ | ✓ | y-values, auto-scaled to the plot |
| `axis` | `string[]` | `['9am','12pm','3pm','6pm','9pm']` | ✓ | ✓ | x labels under the chart |
| `color` | `string` | `var(--mint)` / `colors.mint` | ✓ | ✓ | line + area color |
| `gradient` | `string[]` | — | ✓ | ✓ | ≥2-stop horizontal stroke gradient; overrides `color` for the stroke |
| `area` | `boolean` | `true` | ✓ | ✓ | faint area fill under the line |
| `smooth` | `boolean` | `true` | ✓ | ✓ | Catmull-Rom smoothing vs straight segments |
| `height` | `number` | `180` | ✓ | ✓ | plot height in px (also viewBox height) |
| `markers` | `LineMarker[]` | — | ✓ | ✓ | round overlay dots + optional tags |
| `grid` | `boolean` | `true` | ✓ | ✓ | faint horizontal gridlines |
| `yAxis` | `boolean` | `false` | ✓ | ✓ | right-edge value labels |
| `yTicks` | `number[]` | derived (~4) | ✓ | ✓ | explicit y ticks; else evenly-spaced across min..max |
| `band` | `{ upper: number[]; lower: number[]; color?: string }` | — | ✓ | ✓ | filled uncertainty ribbon (expands the shared y-scale) |
| `dashedFromIndex` | `number` | — | ✓ | ✓ | from this index on, the line renders dashed (forecast) |
| **`ariaLabel`** | `string` | — | ✓ | — | **web only** — `<svg aria-label>` |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only (wrapper) |
| _rest_ | `HTMLAttributes<HTMLDivElement>` | — | ✓ | — | web only |

- **Scale (identical both sides):** y spans `data` min..max, expanded to `data ∪ band.upper ∪ band.lower` when a band is present so the ribbon never clips; that one scale is shared across line/band/ticks. Points map inverted (max → top, min → bottom) with `PAD_Y = 14`.
- **Smoothing:** Catmull-Rom → cubic bézier, tension `1/6` (shared `smoothPath`/`linePath` helpers). Dashed split slices the points at `dashedFromIndex` (boundary point in both halves).

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web | Native |
| --- | --- | --- |
| Line | `stroke = color`/gradient, width `3`, round caps/joins | same |
| Line glow | `.lk-lc-line { drop-shadow(0 0 8px rgba(52,245,197,.35)) }` | — (no glow) |
| Dashed tail | `stroke-dasharray "6 6"`, `.lk-lc-line--dashed { opacity .85 }` | dash `"6 6"`, `opacity 0.85` |
| Area fill | vertical gradient `color` `0.26 → 0` opacity | same (`gradientUnits=userSpaceOnUse`) |
| Grid | `.lk-lc-grid line` `stroke var(--border)` 1, opacity .6 | `stroke colors.border` 1, opacity 0.6 |
| Band ribbon | `.lk-lc-band` fill `band.color ?? color`, `fillOpacity .14` | same |
| Marker dot | `.lk-lc-dot` `11px`, `2px border var(--bg-0)`, `box-shadow 0 0 8px rgba(255,255,255,.35)` | `11px`, `2px border colors.bg0`, white shadow |
| Marker tag | `.lk-lc-tag` `9px var(--font-mono)`, `1px currentColor`, `bg var(--glass-2)` | `fonts.mono 9px`, border dot color, `bg colors.glass2` |
| Y ticks / axis | `.lk-lc-ytick` / `.lk-lc-axis` `var(--font-mono)`, `var(--text-faint)` | `fonts.mono`, `colors.textFaint` |
| Gutter | `--lk-lc-gutter: 40px` | `Y_GUTTER = 36`; `PAD_X = 14` x-inset |

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Solid line | `solidLine` path | same |
| Forecast tail | `dashLine` dashed path past `dashedFromIndex` | same |
| Area on/off | `area` toggles the fill path | same |
| Band | ribbon drawn behind area/line/markers | same |
| Y-axis | canvas shrinks by the gutter; ticks pinned by % | same (measured width − `Y_GUTTER`) |
| Markers | HTML overlays at `%` positions | View overlays at `%` positions |
| Pre-measure (native) | n/a | SVG not drawn until `canvasW > 0` |

No hover/focus/disabled — presentational.

## 5. Web ↔ native parity

**Verdict: 🟡 same API & curve math, rendering substrate + a couple props differ.** Identical props, defaults (`color var(--mint)`, `height 180`, `smooth`, `area`, `grid`), the same scale/smoothing/band/dashed logic (shared helper functions), stroke width, dash pattern, and area-gradient opacity. Differences:

- **SVG sizing:** web uses a fixed `viewBox 0 0 560 height` + `preserveAspectRatio="none"` + `width:100%` (browser stretches it); native measures via `onLayout` and sets SVG `width` (minus `Y_GUTTER` when `yAxis`). Same fixed viewBox, same stretch.
- **`PAD_X` inset (native only):** native insets x by `PAD_X = 14` so round caps + marker dots don't clip at the edges (web relies on CSS `overflow:visible`). This shifts marker `%` positions slightly between platforms — cosmetic.
- **`ariaLabel` prop:** web only (use a wrapping `accessibilityLabel` on native).
- **Gutter width:** web `40px` vs native `36px`. **Line glow:** web `drop-shadow` only.
- **Markers:** HTML overlays (web) vs absolutely-positioned `View`s (native) — both stay circular.

No capability gap — fully usable on both; the chart shape is equivalent.

## 6. Composition & usage

- **Used for:** energy-over-day, forecast lines (with `band` + `dashedFromIndex`), any single time series on a `Card`.
- **Composes from:** nothing — leaf primitive. Use `LineMarker` to flag peaks/events; pair with `Stat`/`DeltaPill` for the headline figure.

```tsx
// web — forecast with uncertainty band + dashed tail + a peak marker
<LineChart
  data={series}
  band={{ upper, lower }}
  dashedFromIndex={11}
  markers={[{ index: 9, label: 'Peak' }]}
  yAxis
  ariaLabel="Energy forecast across the day"
/>

// native — straight, no area
<LineChart data={series} smooth={false} area={false} color={colors.cyan} />
```

## 7. Accessibility

- **Web:** the `<svg>` has `role="img"` + the optional `ariaLabel`. Always describe the trend/shape (a chart without an `aria-label` reads as an unlabeled image).
- **Native:** no built-in label; wrap in a `View` with `accessibilityRole="image"` + `accessibilityLabel`.
- Marker tags use `--font-mono` on `--glass-2`; keep `label`s short. The line/area inherit `color`/`gradient` from tokens for contrast against the void surface.

## 8. Usage rules — Do / Don't

**Do**
- Use `band` for forecasts with uncertainty (it auto-expands the y-scale so it never clips).
- Use `dashedFromIndex` to mark where measured data ends and forecast begins.
- Use `gradient` (≥2 stops) for a spectrum stroke; otherwise a single `color`.
- Pass a descriptive `ariaLabel` (web) / `accessibilityLabel` (native wrapper).

**Don't**
- ✗ Don't hand-roll a line/area SVG — use `LineChart`.
- ✗ Don't pass `ariaLabel` on native (web-only) — wrap with `accessibilityLabel`.
- ✗ Don't render SVG-circle markers — markers are HTML/View overlays by design (so they stay round under the non-uniform stretch).
- ✗ Don't hardcode the line/area/grid colors — source them from tokens.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom polyline/area SVG duplicates this primitive — import `LineChart`.
- **New need → add to BOTH platforms.** Need a second series, point tooltips, or a native `ariaLabel`? Add it to web and native with the same prop name + tokens — never a one-off.
- **Tokens only.** Line/area/grid/marker colors come from `@lockin90/tokens`; hardcoded values break on renames.
- **Parity gate.** Before shipping, confirm the web phone-width and native charts show the same curve, band, dashed tail, markers, and axes — only the SVG-sizing path, the native `PAD_X` inset, the gutter px, and the web glow/`ariaLabel` may differ.
