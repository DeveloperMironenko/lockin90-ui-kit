# SDD — `BarChart` (+ `BarItem` type)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/BarChart.tsx` · `packages/ui-native/src/components/BarChart.tsx` ·
> web CSS `packages/ui/src/styles/components/bc.css` (`.lk-bc*`).
> **Exports:** `BarChart`, type `BarItem`, type `BarChartProps`.
> **Status:** Shipped. **Parity:** 🟡 same API & visuals; the `gradient` default-fill prop is platform-shaped (web CSS string ↔ native `[string, string]` tuple).
> **Stories:** `packages/ui/src/stories/BarChart.stories.tsx` · `packages/ui-native/src/stories/BarChart.stories.tsx`.

---

## 1. Overview

A **generic vertical bar chart** — a flex row of columns, each a gradient-filled bar sized by `value / max` of the chart area, with an optional value label above and a mono/uppercase label below. **Not an SVG**: it is a flexbox layout (web `display:flex`, native `flexDirection:'row'`), bars are gradient `<div>`/`LinearGradient` rectangles. The weekday-energy strip on dashboards is the canonical use.

- Highlighted bars (`highlight: true`) get a **brighter mint gradient + soft glow** and a brighter value/label.
- Per-bar `color` overrides the shared `gradient`.
- `BarItem` (the bar descriptor) is a secondary export consumed by callers building `bars`.

It is the only sanctioned vertical-bar primitive; for a single horizontal progress bar use `BarFill`/`ProgressBar`, for a stacked composition use `StackedBar`.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `bars` | `BarItem[]` | `DEFAULT_BARS` (weekday M–S) | ✓ | ✓ | drawn left → right |
| `max` | `number` | max bar value | ✓ | ✓ | value mapping to 100% height; denom floored at 1 |
| `height` | `number` | `150` | ✓ | ✓ | chart-area height in px (web `--bc-h`) |
| `showValues` | `boolean` | `true` | ✓ | ✓ | value label above each bar |
| **`gradient`** | web `string` · native `[string, string]` | web `linear-gradient(180deg, var(--cyan), var(--accent))` · native `[colors.cyan, colors.accent]` | ✓ | ✓ | **platform-shaped** — CSS background string vs top→bottom stop tuple |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `CSSProperties` / `StyleProp<ViewStyle>` | — | ✓ | ✓ | merged onto the root |
| _rest_ | `HTMLAttributes<HTMLDivElement>` | — | ✓ | — | web only |

**`BarItem`:** `value: number` (height ∝ `value/max`), `label?: string` (mono/uppercase/faint below), `color?: string` (override fill — web any CSS background, native a solid hex), `highlight?: boolean`.

- Each bar's `pct` is `clamp(value/denom, 0, 1)`. Web sets `--bc-pct` (CSS computes `height: pct * --bc-h`); native computes `barHeight = pct * height` directly.
- Fill resolution: `color ?? (highlight ? HIGHLIGHT_GRADIENT : gradient)`. Highlight default — web `var(--grad-mint)`, native `gradients.mint.stops[0..1]`.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web | Native |
| --- | --- | --- |
| Default fill | `--cyan → --accent` 180° | `colors.cyan → colors.accent` (start `{0,0}`→end `{0,1}`) |
| Highlight fill | `--grad-mint` | `gradients.mint.stops` |
| Bar radius | `8px 8px 4px 4px` | TL/TR `8`, BL/BR `4` |
| Bar border | `1px var(--border)` | `1px colors.border` |
| Highlight glow | `box-shadow 0 0 18px rgba(52,245,197,.22)`, border→transparent | `shadowColor colors.mint`, opacity `.22`, radius `18`, `elevation 8`, border→transparent |
| Value label | `11px var(--text-dim)`, `lk-mono`; HL → `var(--zone-high)` | `fonts.mono 11px colors.textDim`; HL → `colors.zoneHigh` |
| Bottom label | `10px var(--text-faint)` uppercase `ls .04em`, `lk-mono`; HL → `var(--text-dim)` | `fonts.mono 10px colors.textFaint` uppercase `ls .4`; HL → `colors.textDim` |

- **Gaps:** `10px` between columns; `8px` within a column (value↔bar↔label).
- **Column height:** web reserves `calc(--bc-h + 30px)` so labels fit above/below; native lays out with `alignItems:'flex-end'`.
- **Web-only motion:** `.lk-bc-bar` animates `height 1.1s var(--ease)` on data change. Native has no height transition.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Default | `.lk-bc-col` > `.lk-bc-bar` | `View` col > bar |
| Highlight | `.lk-bc-hl` → mint gradient + glow, brighter labels | `barHl`/`valHl`/`labelHl` styles |
| Per-bar color | inline `background` overrides gradient | solid-color `View` instead of `LinearGradient` |
| Zero / negative value | `pct` clamps to 0 → empty column | same |
| Empty `bars` | renders an empty flex row | same |

No hover, focus, disabled, or loading states — it is presentational.

## 5. Web ↔ native parity

**Verdict: 🟡 same API, one platform-shaped prop.** Identical props (`bars`, `max`, `height`, `showValues`), identical defaults (the weekday sample, 150px height), identical bar math (`value/max` clamp), radii, borders, glow magnitude, and label typography. Differences are substrate-only:

- **`gradient` prop shape:** web takes a CSS background **string** (`linear-gradient(...)`); native takes a `[topColor, bottomColor]` **tuple** for `expo-linear-gradient`. App code reads 1:1 (same intent, different literal). The default cyan→accent vertical fill is identical visually.
- **Substrate:** web = `<div>` flex + CSS height + `lk-mono` class; native = `View`/`LinearGradient` + `StyleSheet`. Web animates bar height; native does not.
- **`color` override:** web accepts any CSS background; native expects a solid hex (renders a plain `View`).

No capability gap — fully usable and visually equivalent on both platforms.

## 6. Composition & usage

- **Used for:** weekday/period energy strips, adherence-by-day, any small categorical bar series on a `Card`.
- **Composes from:** nothing — leaf primitive. Wrap in `Card` for a titled panel; pair with a legend built from `KeyValue`/`Chip`.

```tsx
// web
<BarChart
  bars={[
    { value: 71, label: 'M' },
    { value: 79, label: 'W', highlight: true },
    { value: 61, label: 'S', color: 'var(--zone-mid)' },
  ]}
  max={100}
  height={140}
/>

// native
<BarChart
  bars={[
    { value: 71, label: 'M' },
    { value: 79, label: 'W', highlight: true },
    { value: 61, label: 'S', color: colors.zoneMid },
  ]}
  max={100}
  height={140}
/>
```

## 7. Accessibility

- The chart is **decorative-by-default**: web renders a plain `<div>` (no `role`). Provide an accessible summary in surrounding copy or an `aria-label` via `...rest` on web when the bars carry meaning.
- Value labels (`showValues`) and bottom `label`s give a sighted text readout; keep `label` short (single letters/abbreviations).
- Contrast: highlight value uses `--zone-high`/`colors.zoneHigh` on the dark surface; non-highlight uses `--text-dim`. Don't supply low-contrast custom `color`s for the fills.

## 8. Usage rules — Do / Don't

**Do**
- Pass an explicit `max` when comparing charts across cards (so bar heights are comparable).
- Use `highlight` for the single "today"/focus bar — at most one per chart.
- Use per-bar `color` from tokens (`var(--zone-mid)` / `colors.zoneMid`) for semantic bars.
- Give the native `gradient` as a 2-stop tuple; give web a `linear-gradient(...)` string.

**Don't**
- ✗ Don't hand-roll a column-of-divs bar chart — use `BarChart`.
- ✗ Don't hardcode the gradient/radius/border/glow — they come from tokens.
- ✗ Don't pass a CSS string as native `gradient` (or a tuple on web) — wrong-platform shape.
- ✗ Don't use `BarChart` for a single progress value — use `BarFill`/`ProgressBar`.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom flex-row of gradient bars re-creates this primitive and will drift from the kit — import `BarChart`.
- **New need → add a prop on BOTH platforms.** If you need axis ticks, stacked bars, or animation parity, add the prop/variant to both implementations with the same name and tokens — never a one-off local chart.
- **Tokens only.** Any fill/border/glow/label color not sourced from `@lockin90/tokens` is a bug even if it matches today (Aurora Flux token renames will break hardcoded values).
- **Parity gate.** Before shipping, confirm the web phone-width render and native render show the same bars, highlight, and labels — only the `gradient` prop literal may differ in shape.
