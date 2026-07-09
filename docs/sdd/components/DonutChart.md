# SDD — `DonutChart` (+ `DonutSegment` type)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/DonutChart.tsx` · `packages/ui-native/src/components/DonutChart.tsx` ·
> web CSS `packages/ui/src/styles/components/donut.css` (`.lk-donut*`).
> **Exports:** `DonutChart`, type `DonutSegment`, type `DonutChartProps`.
> **Status:** Shipped (extended with the catalog **share arcs**, pie-charts PC-01…PC-13). **Parity:** 🟡 same API & math; web shine is a `blur()` duplicate + web-only arc transition; native shine is a Gaussian-blurred duplicate arc (`FeGaussianBlur`); color is `var()` (web) vs hex (native).
> **Stories:** `packages/ui/src/stories/DonutChart.stories.tsx` · `packages/ui-native/src/stories/DonutChart.stories.tsx` (catalog stories `PC01DuoSplit` … `PC13NestedArcs`).

---

## 1. Overview

Proportional composition as a ring — **two renderers behind one API**:

- **`variant="donut"` (default, legacy)** — stroke-dasharray arcs on one circle over a faint track ring, small fixed gap; the macro-breakdown donut. Unchanged.
- **Share arcs (every other variant)** — the catalog's pie replacement: luminous **round-cap segmented stroke arcs with cap-compensated real gaps**, no track, no fills. Tiny segments render as **dots**.

| Catalog ID | `variant` | Extra props |
| --- | --- | --- |
| PC-01 `duo-split` | `duo-split` | 2 segments (mint + glass remainder), center stat |
| PC-02 `split-arcs` | `split-arcs` | 2–5 spectrum-ordered segments (SELECT = your `segments`) |
| PC-04 `zone-share` | `zone-share` | segment colors = `--zone-*` verdict tokens |
| PC-05 `hero-arc` | `hero-arc` | `hero` (defaults 0) → +4px & shine, others 30% |
| PC-07 `callout-arcs` | `callout-arcs` | `callouts` (default on) → leader lines + chip pills from `label` |
| PC-09 `thin-share` | `thin-share` | thickness defaults 6 — halo weight |
| PC-11 `mini-multiples` | `mini-multiples` | one small ring (size 72 / sw 8); **compose 3 side by side** + day captions (see stories) |
| PC-13 `nested-arcs` | `nested-arcs` | `innerSegments` coarse ring + outer `segments` shaded via per-segment `opacity` + callouts |

`DonutSegment` (`value`, `color`, `label?`, `opacity?`) is the shared descriptor. Distinct from `Ring` (single 0–100 progress) and `Gauge` (min/max dial).

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `segments` | `DonutSegment[]` | Carbs/Protein/Fat | ✓ | ✓ | drawn clockwise from 12 o'clock |
| `variant` | `'donut' \| 'duo-split' \| 'split-arcs' \| 'zone-share' \| 'hero-arc' \| 'callout-arcs' \| 'thin-share' \| 'mini-multiples' \| 'nested-arcs'` | `'donut'` | ✓ | ✓ | `donut` = legacy renderer; all others = share arcs |
| `size` | `number` | `120` (`72` mini-multiples) | ✓ | ✓ | overall diameter |
| `thickness` | `number` | `14` legacy · `13` share · `6` thin-share · `8` mini | ✓ | ✓ | ring stroke width |
| `gap` | `number` | `2` legacy · `5` share | ✓ | ✓ | degrees; share arcs grow every gap by the cap overhang (below) |
| `track` | `string` | `'rgba(255,255,255,0.07)'` | ✓ | ✓ | legacy only — share arcs draw no track |
| `hero` | `number` | `0` for `hero-arc`, else — | ✓ | ✓ | hero index: +4px stroke, shine; others dim to 30% |
| `shine` | `boolean` | on for `hero-arc`, else `false` | ✓ | ✓ | glow underlay behind full-opacity segments |
| `callouts` | `boolean` | on for `callout-arcs`/`nested-arcs` | ✓ | ✓ | leader lines + chip pills from `segment.label`; reserves **34px** per side (ring shrinks) |
| `innerSegments` | `DonutSegment[]` | — | ✓ | ✓ | `nested-arcs` inner coarse ring at `~0.47·r`, sw `round(0.9·thickness)`, 6° base gap |
| `children` | `ReactNode` | — | ✓ | ✓ | center content; omit → summed total |
| `className` / `style` / _rest_ | | — | web / both / web | | substrate |

**`DonutSegment`:** `value: number` (∝ share), `color: string`, `label?: string` (a11y / legends / callout chip text), `opacity?: number` (per-segment override — PC-13 family shading; also respected by the legacy renderer).

- **Share-arc math (the catalog `arcRing`, ported verbatim):**
  `capDeg = (thickness / r) · 180/π` (the round-cap angular overhang) · `gapT = capDeg + gap` · `avail = max(0, 360 − n·gapT)` · per segment: `sweep = frac·avail`, arc from `a + gapT/2 + capDeg/2` to `a + gapT/2 + sweep − capDeg/2`, then `a += gapT + sweep`. **`a1 ≤ a0` → the segment renders as a dot** (`r = swi/2` at the mid angle). Hero: `swi = thickness + 4`; non-hero opacity `0.3` unless `segment.opacity` set.
- **Geometry:** `c = size/2`; `r = max(10, (size − thickness)/2 − (callouts ? 34 : 0))`. Angles: catalog convention — 0° = 12 o'clock, clockwise (no group rotation in the share path).
- **Callout chips:** leader line `r+sw/2+2 → +13`; chip `w = label.length·5.35 + 12`, h 13, rx 6.5, x clamped into the box; text 8px mono in the segment color.
- **Legacy math** unchanged (dasharray/offset chain, gap trim capped at each arc's length).

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web | Native |
| --- | --- | --- |
| Share arcs | `<path>` round caps, `stroke = segment.color`, per-arc `opacity` | `react-native-svg` `<Path>` |
| Dots (tiny segments) | `<circle r=swi/2>` at the mid angle | `<Circle>` |
| Shine | wider (+5) duplicate, `blur(5px)`, 45% — only on `opacity === 1` segments | same wider (+5) duplicate at 45%, `FeGaussianBlur stdDeviation 2.5` |
| Callout line | `.lk-donut-callout line` — `color-mix(var(--text) 30%)` 1px | `colors.text` at 30% |
| Callout chip | rect `color-mix(var(--bg-0) 78%)` bg + segment-color hairline 35% / text 8px `var(--font-mono)` | `${colors.bg0}C7` bg + `strokeOpacity 0.35` / `fonts.mono` 8 |
| Legacy track/arcs | as before (`rotate(-90)` group, round caps, `.lk-donut-seg` 0.7s dasharray transition) | as before |
| Center | `.lk-donut-center` absolute overlay; `.lk-donut-total` 26px `--font-display` | mirrored `styles.center`/`styles.total` |
| SVG depth | `.lk-donut-svg` `drop-shadow(0 0 6px rgba(0,0,0,.35))` | — |

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Share default | gap-compensated arcs, no track | same |
| Tiny segment | dot at mid angle | same |
| Hero | +4px + shine; others 30% | same |
| Per-segment `opacity` | overrides the hero dim (nested shading) | same |
| Callouts | lines + chips; unlabeled segments get none | same |
| Nested | inner ring + outer ring + callouts | same |
| Zero/negative segment | zero sweep → dot of zero share is skipped naturally (legacy: filtered) | same |
| All zero | `total` floors to 1 | same |

No hover/focus/disabled — presentational.

## 5. Web ↔ native parity

**Verdict: 🟡 same API & math, platform-shaped shine.** The `shareArcs()` function is byte-for-byte identical on both sides (cap compensation, dots, hero, opacity), same variant defaults, same callout geometry and chip sizing. Differences:

- **Shine:** web blurred duplicate (`filter: blur(5px)`); native Gaussian-blurred duplicate via `FeGaussianBlur stdDeviation 2.5` (see CONVENTIONS.md). Slightly tighter halo on native.
- **Legacy arc transition + SVG drop-shadow:** web-only polish.
- **Color literal:** web `var()`; native hex (`bg0`+alpha for chips). App code reads 1:1.
- **Text substrate:** web SVG `<text>` styled by `.lk-donut-callout`; native `SvgText` with `fonts.mono` — same size/anchor.

No capability gap.

## 6. Composition & usage

- **Used for:** macro breakdowns (legacy), goal done-vs-left, zone shares, time splits, two-level day composition.
- **Composes from:** nothing — leaf primitive. Center via `children`; **legends stay external** (`Chip`/`KeyValue` rows using each segment's `label` + `color`); PC-11 = three mini DonutCharts in a row + captions (see `PC11MiniMultiples` story).

```tsx
// web — PC-02 split-arcs (macro split, center stat)
<DonutChart
  variant="split-arcs"
  segments={[
    { value: 45, color: 'var(--mint)', label: 'PROTEIN' },
    { value: 33, color: 'var(--cyan)', label: 'CARBS' },
    { value: 22, color: 'var(--violet)', label: 'FAT' },
  ]}
/>

// native — PC-13 nested-arcs (inner coarse split + shaded outer breakdown)
<DonutChart
  variant="nested-arcs"
  size={210}
  thickness={10}
  innerSegments={[{ value: 50, color: colors.mint }, { value: 30, color: colors.cyan }, { value: 20, color: colors.violet }]}
  segments={[
    { value: 20, color: colors.mint, label: 'DEEP', opacity: 1 },
    { value: 13, color: colors.mint, label: 'REM', opacity: 0.68 },
    /* … */
  ]}
/>
```

## 7. Accessibility

- **Web:** the `<svg>` has `role="img"` + an auto-built `aria-label` listing each segment's `label` + rounded % (both renderers). Always supply `label`s.
- **Native:** provide an external legend or an `accessibilityLabel` on a wrapping `View`.
- Callout chip text is 8px decorative duplication of the legend — don't make it the only naming surface for screen readers (the aria-label covers it on web).

## 8. Usage rules — Do / Don't

**Do**
- Resolve catalog asks via §1: PC-ID → variant + props.
- Keep ≤5 segments (catalog rule) and give every segment a `label`.
- Let tiny segments become dots — that's the honest rendering, don't inflate values.
- Size up (`size ≥ 180`) when `callouts` are on — the ring shrinks by 34px/side.

**Don't**
- ✗ Don't hand-roll segmented stroke arcs or the cap-compensation math — use `DonutChart`.
- ✗ Don't use pie **fills** — this system renders composition as strokes only.
- ✗ Don't pass CSS `var()` colors on native — pass hex.
- ✗ Don't use it for single progress (`Ring`) or a min/max dial (`Gauge`).
- ✗ Don't build an in-component legend — compose one next to the chart.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom dasharray ring or a re-derived `arcRing` will drift from the cap-compensation spec — import `DonutChart`.
- **New need → add to BOTH platforms.** Percent labels around the ring, hairline mode, or animation parity ship to web and native together.
- **Tokens only.** Segment/track/chip colors from `@lockin90/tokens`.
- **Parity gate.** Before shipping, confirm web phone-width ≡ native: same arcs, gaps, dots, hero, callouts, center — only the shine substrate + color-literal form may differ.
