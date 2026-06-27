# SDD — `StackedBar` (+ `StackedSegment` type)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/StackedBar.tsx` · `packages/ui-native/src/components/StackedBar.tsx` ·
> web CSS `packages/ui/src/styles/components/stackedbar.css` (`.lk-stackbar*`).
> **Exports:** `StackedBar`, type `StackedSegment`, type `StackedBarProps`.
> **Status:** Shipped. **Parity:** ✅ identical API & visuals — substrate-only differences (CSS `flex`/grid legend vs RN `flex` legend; `className` ↔ `style`).
> **Stories:** `packages/ui/src/stories/StackedBar.stories.tsx` · `packages/ui-native/src/stories/StackedBar.stories.tsx`.

---

## 1. Overview

A **100%-stacked horizontal bar**: one linear track split into contiguous colored proportion segments, each sized by its share of the total, with an optional legend (color dot + label + value + %) below. It answers "what's the composition?" — macro split, time-by-zone, source mix. Distinct from `BarChart` (separate vertical bars) and `DonutChart` (radial composition); reach for `StackedBar` for a compact, full-width proportion strip.

`StackedSegment` (`{ value, color, label? }`) is the only secondary export — the shape of each slice.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `segments` | `StackedSegment[]` | — (required) | ✓ | ✓ | slices, left→right, sized by share |
| `height` | `number` | `10` | ✓ | ✓ | bar thickness in px |
| `rounded` | `boolean` | `true` | ✓ | ✓ | pill-rounded ends + clipped corners |
| `gap` | `number` | `2` | ✓ | ✓ | px gap between adjacent drawn segments |
| `showLegend` | `boolean` | `false` | ✓ | ✓ | render the dot+label+value+% rows below |
| `total` | `number` | — | ✓ | ✓ | denominator for shares; omit → summed segment values |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `HTMLAttributes<HTMLDivElement>` | — | ✓ | — | web spreads to the root `<div>` |

- **`StackedSegment`** — `{ value: number, color: string /* token var or hex */, label?: string }`.
- **Sizing (both):** non-positive segments are dropped; share = `value / denom` where `denom = total>0 ? total : sum || 1`; each drawn slice is `flexGrow: pct, flexBasis: 0` (proportional flex). Gap collapses to `0` when fewer than 2 segments are drawn.

## 3. Visual spec (tokens — never hardcode)

| Element | Web | Native |
| --- | --- | --- |
| Track | `display:flex`, 1px `--border`, `--glass` bg, `overflow:hidden` | `flexDirection:row`, 1px `colors.border`, `colors.glass` bg, `overflow:hidden` |
| Radius | rounded → `--lk-stackbar-r` (= `height`px, inline) on `.is-rounded`; else `--r-sm` | rounded → `height`px; else `radii.sm` |
| Segment | `min-width:2px`, `flexGrow:pct`; grow transitions 1.1s `--ease` | `minWidth:2`, `flexGrow:pct`; no transition |
| Legend row | CSS grid `13px 1fr auto auto`, 6px padding, 1px `--border` divider (last row none) | `flexDirection:row`, gap 12, 6px padding, hairline `colors.border` divider |
| Legend dot | 11px, `border-radius:3px` | 11px, `borderRadius:3` |
| Legend name | `--font-ui` 13px 600 `--text`, ellipsis | `fonts.ui` 13px 600 `colors.text`, `numberOfLines={1}` |
| Legend value | `--font-mono` 12.5px `--text-dim`, right | `fonts.mono` 12.5px `colors.textDim`, right |
| Legend pct | `--font-mono` 13px 600 `--text-faint`, right | `fonts.mono` 13px 600 `colors.textFaint`, right, `minWidth:38` |

- **Container gap:** web `.lk-stackbar { gap: 12px }` (track ↔ legend); native `wrap { gap: 12 }`. Track↔segment gap is the `gap` prop.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Default | proportional segments fill the track | same |
| `rounded=false` | square corners (`--r-sm` track) | square-ish (`radii.sm`) |
| `showLegend` | dot+label+value+% rows below | same |
| Zero/negative segment | dropped (not drawn); excluded from the gap count | same |
| Empty / all-zero | `denom` floors to 1 → empty track | same |
| `total` set | shares computed against `total` (can sum to < 100%) | same |

Static, read-only — no hover/focus/disabled. Web adds a `title` tooltip per segment (`s.label`).

## 5. Web ↔ native parity

**Verdict: ✅ identical.** Same props, same share math (drop non-positive, `flexGrow: pct / flexBasis: 0`, `denom` resolution), same gap-collapse rule, same legend content and dimensions (11px dot/3px radius, the same font sizes/weights/tones). The only differences are substrate:

- **Legend layout:** web uses a 4-column CSS **grid** (`13px 1fr auto auto`); native uses a **flex** row (`name flex:1`, `value`/`pct` right-aligned with `minWidth`). Visually equivalent rows.
- **Grow animation:** web transitions `flex-grow` over 1.1s; native sizes instantly. Cosmetic.
- **Segment tooltip / a11y label:** web sets a `title` per segment + `role="img"`+`aria-label` on the track; native sets `accessibilityRole="image"`+`accessibilityLabel` on the track (no per-segment hover tooltip — no hover on touch).
- **className ↔ style:** universal substrate.

No capability gap; the two render the same composition strip.

## 6. Composition & usage

- **Used for:** macro splits, time-by-zone, source/spend mix, any "share of total" strip.
- **Composes from:** none (self-contained track + legend).

```tsx
// web — macro split with legend
<StackedBar
  segments={[
    { value: 120, color: 'var(--mint)', label: 'Protein' },
    { value: 80,  color: 'var(--cyan)', label: 'Carbs' },
    { value: 40,  color: 'var(--violet)', label: 'Fat' },
  ]}
  showLegend
/>

// native — thin strip, no legend, fixed denominator
<StackedBar
  segments={[{ value: 7, color: colors.zoneHigh }, { value: 3, color: colors.zoneLow }]}
  total={10}
  height={8}
/>
```

## 7. Accessibility

- **Web:** the track is `role="img"` with an `aria-label` listing each segment's label + rounded %; each segment also has a `title` (hover tooltip).
- **Native:** the track is `accessibilityRole="image"` with the same composed `accessibilityLabel`.
- **Color independence:** use `showLegend` (or nearby labels) so the composition is legible without distinguishing the segment colors.
- **Contrast:** legend text uses `--text` / `--text-dim` / `--text-faint`; keep segment colors distinguishable on the `--glass` track.

## 8. Usage rules — Do / Don't

**Do**
- Give each segment a `label` when `showLegend` is on (else it falls back to "Segment N").
- Set `total` when the segments are a partial share of a known whole.
- Use token-valued `color`s per segment.

**Don't**
- ✗ Don't use `StackedBar` for separate-category bars — that's `BarChart`.
- ✗ Don't pass negative/zero segments expecting a slot — they're dropped.
- ✗ Don't hardcode segment colors as raw hex — use token values (`var(--mint)` / `colors.mint`).
- ✗ Don't hand-roll a proportion strip — extend `StackedBar` on both platforms.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom flex strip re-doing the share math + legend is a parity violation — import `StackedBar`.
- **New need → both platforms.** A new legend column, percentage formatting, or segment label option ships to web **and** native with the same prop name + tokens.
- **Tokens only.** Track border/bg are `--border`/`--glass`; segment colors must be token values — no raw hex that drifts on a rename.
- **Parity gate.** Before shipping, confirm the web phone-width strip ≡ native strip (same segments, order, legend) — the layout is equivalent so any mismatch is a real bug.
