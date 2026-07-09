# SDD — `Sparkline`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Sparkline.tsx` · `packages/ui-native/src/components/Sparkline.tsx` ·
> web CSS `packages/ui/src/styles/components/spark.css` (`.lk-spark*`).
> **Exports:** `Sparkline`, type `SparklineProps`.
> **Status:** Shipped. **Parity:** 🟡 same API & shape; the trailing-dot glow is a CSS `drop-shadow` on web (absent on native), and native adds horizontal padding so the dot/ends don't clip.
> **Stories:** `packages/ui/src/stories/Sparkline.stories.tsx` · `packages/ui-native/src/stories/Sparkline.stories.tsx`.

---

## 1. Overview

A **generic mini trend line**. Normalizes `data` (oldest → newest) into a `width × height` box (`min` → bottom, `max` → top, with a touch of vertical padding) and draws it as a rounded polyline. Optionally fills the area beneath with a faint gradient of `color`, and marks the last point with a glowing dot. It's the inline spark for PR/roster cards, KPI tiles, and list rows — the smallest "show me the trend" primitive.

Distinct from `LineChart` (axes, ticks, tooltips) and `PkChart` (model-driven): `Sparkline` is decorative micro-trend only, no axes.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `data` | `number[]` | `[40,44,42,50,55,53,62,68,72]` | ✓ | ✓ | series, oldest→newest; auto-scaled |
| `width` | `number` | `120` | ✓ | ✓ | box width in px |
| `height` | `number` | `32` | ✓ | ✓ | box height in px |
| `color` | `string` | web `'var(--mint)'` · native `colors.mint` | ✓ | ✓ | line/fill/dot color |
| `fill` | `boolean` | `false` | ✓ | ✓ | faint area gradient of `color` under the line |
| `dot` | `boolean` | `true` | ✓ | ✓ | glowing dot at the last point |
| `strokeWidth` | `number` | `2` | ✓ | ✓ | line stroke width |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only (wrapper View) |
| _rest_ | `SVGProps<SVGSVGElement>` (web, `Omit<…,'children'\|'fill'\|'color'\|'width'\|'height'>`) | — | ✓ | — | web spreads to the `<svg>` |

- Web `Sparkline` **is** the `<svg>` (spreads SVG attrs); native wraps the `<Svg>` in a sized `<View>` (`{width,height}` + `style`).
- Dot radius is `strokeWidth + 1` on both.

## 3. Visual spec (tokens — never hardcode)

| Element | Web | Native |
| --- | --- | --- |
| Line | `stroke=color`, `strokeWidth`, round caps/joins; `<path>` | same, drawn as `<Polyline>` |
| Crisp stroke | `.lk-spark-line { vector-effect: non-scaling-stroke }` (constant width under non-uniform scale) | n/a — viewBox = box size, no non-uniform scaling |
| Area fill | `linearGradient` `color` 0.28 → 0 (vertical) | same stops |
| Trailing dot | `<circle r=strokeWidth+1 fill=color>`, glow `.lk-spark-dot { filter: drop-shadow(0 0 4px currentColor) }` | `<Circle r=strokeWidth+1 fill=color>`, **no glow filter** |
| Box | `.lk-spark { display:block; overflow:visible }` (dot/glow spill past edges) | `<View style={{width,height}}>` (clips) |
| Scaling | `preserveAspectRatio="none"` — line stretches to fill the box | viewBox = `0 0 width height` (no stretch) |

- **Vertical padding:** `PAD = 3` on both (`innerH = height − 6`); min → bottom, max → top.
- **Horizontal padding:** web spreads x across the **full** width (`0 … width`); native pads by `padX = strokeWidth + dotR` and spreads across `innerW = width − 2·padX` so the trailing dot and end stroke stay fully inside the clipping View.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Default | line + trailing dot | same |
| `fill` | adds the area gradient under the line | same |
| `dot=false` | line only | same |
| Single point (`data.length≤1`) | web x=0; native x centered in padded width | flat dot/short line |
| Empty (`data=[]`) | no points → nothing drawn | same |

Static, decorative — no hover/focus/disabled/loading.

## 5. Web ↔ native parity

**Verdict: 🟡 same API, platform-shaped clipping + glow.** Identical props, normalization (min→bottom / max→top, `PAD=3`), and area-gradient stops (0.28→0). Differences are substrate-only:

- **Trailing-dot glow:** web adds `drop-shadow(0 0 4px currentColor)` on the dot; native renders a plain filled `<Circle>` — the kit's Fabric blur-filter pattern hasn't been applied here. Cosmetic — line + dot still read identically.
- **Clipping vs padding:** web's `<svg>` is `overflow:visible` so the dot/ends spill freely; native's wrapper `<View>` clips, so native pre-pads horizontally (`padX`) to keep them inside. The line shape is the same; native loses a few px of horizontal spread to the padding.
- **Stretch:** web stretches via `preserveAspectRatio="none"` + `non-scaling-stroke`; native sizes its viewBox to the box, so no stretch is needed.
- **className ↔ style:** universal substrate; callers read 1:1.

No capability gap blocks use.

## 6. Composition & usage

- **Used in:** KPI tiles (`MetricTile`), list/roster rows, leaderboard cards — anywhere a number wants a trailing micro-trend.
- **Composes:** none (self-contained SVG).

```tsx
// web — filled mint spark in a KPI tile
<Sparkline data={[12, 18, 15, 22, 30, 28, 36]} fill color="var(--mint)" />

// native — same, wider, no dot
<Sparkline data={[12, 18, 15, 22, 30, 28, 36]} width={160} dot={false} />
```

## 7. Accessibility

- **Web:** the `<svg>` is `aria-hidden="true"` — Sparkline is **decorative**; always pair it with the real number/label nearby (it conveys no value on its own to AT).
- **Native:** the `<Svg>` carries no a11y label by default — same rule: the trend is supplementary, the figure must be readable text.
- **Color:** never encode the only signal in the line color; the adjacent value/delta carries the meaning.

## 8. Usage rules — Do / Don't

**Do**
- Pass `data` oldest → newest; the last point is the "now" dot.
- Use `fill` for emphasis in a tile; keep it off for dense rows.
- Match `color` to the metric's tone token.

**Don't**
- ✗ Don't use `Sparkline` as the sole carrier of a value — it's decorative; show the number too.
- ✗ Don't reach for it when you need axes/ticks/tooltips — use `LineChart`.
- ✗ Don't hardcode the line/fill color — pass a token value.
- ✗ Don't rely on the dot glow on native — it's a web-only cosmetic.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A hand-rolled inline polyline re-doing the min/max normalization + trailing dot is a parity violation — import `Sparkline`.
- **New need → both platforms.** A new marker, threshold line, or multi-series option ships to web **and** native with the same prop name + tokens.
- **Tokens only.** `color` must be a token value; the area gradient derives from it — no raw hex.
- **Parity gate.** Before shipping, confirm the web phone-width spark ≡ native spark (same data, fill, dot) — accepting the documented dot-glow and horizontal-padding substrate differences.
