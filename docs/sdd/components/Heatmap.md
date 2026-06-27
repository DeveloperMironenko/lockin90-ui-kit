# SDD — `Heatmap` (+ `lerpColor` util, `HeatmapCell` type)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Heatmap.tsx` · `packages/ui-native/src/components/Heatmap.tsx` ·
> web CSS `packages/ui/src/styles/components/heatmap.css` (`.lk-heatmap*`).
> **Exports:** `Heatmap`, `lerpColor` (hex-interpolation util), type `HeatmapCell`, type `HeatmapProps`.
> **Status:** Shipped. **Parity:** 🟡 same API, math & shared `lerpColor`; **not SVG** — web CSS grid vs native flex-wrap; web has hover polish native lacks.
> **Stories:** `packages/ui/src/stories/Heatmap.stories.tsx` · `packages/ui-native/src/stories/Heatmap.stories.tsx`.

---

## 1. Overview

A **compact grid/strip of intensity-colored cells**. One primitive covers two shapes:

- **`grid`** (default) — square calendar cells (`columns=7` reads as a week / month grid), each with an optional centered day `label`, plus `today` (accent border) and `flag` (low-zone ring + dot) markers.
- **`strip`** — a denser contribution/compliance row (`columns=30`-ish) where cells flex to share one row equally.

Each cell's background **interpolates the `colorFrom → colorTo` ramp** by its normalized `value / max` (or a custom `colorScale`). **Not an SVG** — it's a layout of `<div>`/`View` cells.

**Secondary export `lerpColor(from, to, t)`** is the exact ramp function the component uses (parses `#rgb`/`#rrggbb`, clamps `t∈[0,1]`, returns an `rgb(...)` string). `HeatmapCell` is the cell descriptor. Both are reused by callers building custom scales/legends.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `cells` | `HeatmapCell[]` | `DEFAULT_CELLS` (11-day sample) | ✓ | ✓ | laid out left→right, top→bottom |
| `columns` | `number` | `7` | ✓ | ✓ | 7 = calendar week; ~30 = wrapping strip |
| `cellSize` | `number` | `28` | ✓ | ✓ | square edge (grid) / fixed height (strip) in px |
| `gap` | `number` | `4` | ✓ | ✓ | gap between cells in px |
| `radius` | `number` | `grid`→`var(--r-sm)`/`radii.sm`; `strip`→`4` | ✓ | ✓ | cell corner radius in px |
| `colorFrom` | `string` | `'#2B1F5C'` (dark violet) | ✓ | ✓ | low-intensity ramp end (hex) |
| `colorTo` | `string` | `'#34F5C5'` (mint) | ✓ | ✓ | high-intensity ramp end (hex) |
| `colorScale` | `(value: number) => string` | — | ✓ | ✓ | override the ramp; receives normalized `t∈[0,1]` |
| `variant` | `'grid' \| 'strip'` | `'grid'` | ✓ | ✓ | layout shape |
| `max` | `number` | `1` | ✓ | ✓ | value mapping to full intensity; denom floored at 1 |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `CSSProperties` / `StyleProp<ViewStyle>` | — | ✓ | ✓ | merged onto the root |
| _rest_ | `HTMLAttributes<HTMLDivElement>` | — | ✓ | — | web only |

**`HeatmapCell`:** `value: number` (intensity, normalized `value/max`), `label?: string` (centered day number, grid only), `flag?: boolean` (low-zone ring + dot), `today?: boolean` (accent border).

- Cell color: `colorScale ? colorScale(t) : lerpColor(colorFrom, colorTo, t)` where `t = clamp01(value/max)`.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web | Native |
| --- | --- | --- |
| Layout | `display:grid`, `grid-template-columns: repeat(--hm-cols, --hm-size)`; strip → `repeat(cols, 1fr)` | flex-row; grid pins `width = cols·cellSize + (cols−1)·gap` + `flexWrap`; strip cells `flex:1` |
| Cell radius | `var(--hm-radius, var(--r-sm, 10px))`; strip `4px` | `radii.sm` (grid) / `4` (strip) |
| `today` | `border var(--accent)` + `box-shadow 0 0 0 1px var(--accent)` | `borderColor colors.accent` |
| `flag` ring | `border var(--zone-low)` | `borderColor colors.zoneLow` |
| Flag dot | top-right `5px`, `var(--zone-low)` + `box-shadow 0 0 6px` | `5px colors.zoneLow` + shadow `radius 6`, `elevation 4` |
| Label | `10px` `lk-mono`, `rgba(255,255,255,.75)`, 600 | `fonts.mono 10px`, `rgba(255,255,255,0.75)`, 600 |
| Hover | cell `translateY(-2px) brightness(1.2)`; strip `+scaleY(1.1)` `0.18s var(--ease)` | — (no hover) |

- Default ramp ends `#2B1F5C → #34F5C5` (dark-violet → mint) are component constants chosen so low cells stay distinct from the void surface.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Cell | colored `<div>` (inline `background`) | colored `View` |
| `today` | `.lk-heatmap-cell--today` accent border + ring | `cellToday` accent border |
| `flag` | `.lk-heatmap-cell--flag` ring + `.lk-heatmap-flag` dot | `cellFlag` ring + `flag` dot |
| Hover | lift + brighten (grid/strip) | n/a |
| Empty `cells` | empty grid | empty row |

No focus/disabled/loading — presentational.

## 5. Web ↔ native parity

**Verdict: 🟡 same API + math, layout substrate differs, hover web-only.** Identical props, identical defaults (`columns 7`, `cellSize 28`, `gap 4`, ramp `#2B1F5C→#34F5C5`, `max 1`), the **same `lerpColor` ramp** (exported on both), and the same `today`/`flag` semantics. Differences:

- **Layout primitive:** web uses CSS **grid** (`repeat(columns, …)`); native uses a **flex-wrap row** with the grid width computed (`columns·cellSize + gaps`) and strip cells `flex:1`. Same visual wrap behavior, different mechanism — neither is SVG.
- **Hover (web only):** cells lift + brighten on hover (and strip cells scale-Y). Native has no hover; cells are static. Cosmetic, does not block use.
- **`today` ring:** web adds an extra `box-shadow` ring on top of the border; native uses the border alone.
- **`...rest`/`className`:** web only; native takes `style`.

No capability gap — the data render is equivalent on both.

## 6. Composition & usage

- **Used for:** month/week calendars (energy-by-day), contribution/compliance strips (last-30-days adherence).
- **Composes from:** nothing — leaf primitive. Pair with `lerpColor` (or a `colorScale`) to drive an external legend; wrap in `Card` for a titled panel.

```tsx
// web — month grid with today + a flagged low day
<Heatmap columns={7} cellSize={30} cells={daysToCells(month)} max={100} />

// native — 30-day compliance strip with a custom ramp
import { Heatmap, lerpColor } from '@lockin90/ui-native';
<Heatmap
  variant="strip"
  columns={30}
  cells={last30}
  max={100}
  colorScale={(t) => lerpColor('#11151F', colors.mint, t)}
/>
```

## 7. Accessibility

- **Web:** the root has `role="img"`; each cell's `label` is set as a `title` (tooltip). Supply an overall `aria-label` via `...rest` summarizing the range/period.
- **Native:** no built-in labels — add an `accessibilityLabel` on a wrapping `View` describing the period and any flagged days.
- Labels use `rgba(255,255,255,.75)` weight-600 so the day number reads on **any** cell color; don't rely on label contrast alone for meaning — use `flag`/`today` for emphasis.

## 8. Usage rules — Do / Don't

**Do**
- Set `max` to your data's true ceiling so the ramp spans the full range.
- Use `variant="strip"` for dense linear series, `grid` for calendars.
- Reuse the exported `lerpColor` (or a `colorScale`) so external legends match the cells exactly.
- Use `flag`/`today` (token-backed) for emphasis, not custom cell colors.

**Don't**
- ✗ Don't hand-roll a grid-of-colored-divs — use `Heatmap`.
- ✗ Don't pass non-hex `colorFrom`/`colorTo` — `lerpColor` parses `#rgb`/`#rrggbb` only (use `colorScale` for anything else).
- ✗ Don't hardcode the ramp/flag/today colors elsewhere — derive them from tokens / `lerpColor`.
- ✗ Don't rely on the hover lift for meaning (web-only, absent on native).

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom calendar/contribution grid duplicates this primitive — import `Heatmap` and reuse `lerpColor`.
- **New need → add to BOTH platforms.** Need cell tooltips on native, week-day headers, or a built-in legend? Add it to web and native with the same prop name + tokens — never a one-off.
- **Tokens only.** `today`/`flag`/label colors come from `@lockin90/tokens`; the ramp ends are shared constants — don't fork them per app.
- **Parity gate.** Before shipping, confirm the web phone-width and native heatmaps show the same cells, colors (same ramp), flags, and today marker — only the web hover polish may differ.
