# SDD — `Hypnogram` (+ `SleepStage`, `HypnogramSegment` types)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Hypnogram.tsx` · `packages/ui-native/src/components/Hypnogram.tsx` ·
> web CSS `packages/ui/src/styles/components/hypnogram.css` (`.lk-hyp*`).
> **Exports:** `Hypnogram`, type `SleepStage`, type `HypnogramSegment`, type `HypnogramProps`.
> **Status:** Shipped. **Parity:** 🟡 same API/visual; web stretch-SVG (`preserveAspectRatio="none"`) vs native measured-width SVG; web has an `ariaLabel` prop native lacks; bar-gradient opacity tail differs.
> **Stories:** `packages/ui/src/stories/Hypnogram.stories.tsx` · `packages/ui-native/src/stories/Hypnogram.stories.tsx`.

---

## 1. Overview

A **sleep-stage timeline**. Four horizontal bands — **Awake / REM / Light / Deep**, top → bottom — each hold rounded capsule bars whose widths are proportional to each segment's `minutes`. Thin vertical connectors link consecutive stage transitions so the eye follows the descent/ascent like a stepped line. A left gutter holds the stage labels; an x-axis time row sits below.

Secondary type exports:
- **`SleepStage`** = `'awake' | 'rem' | 'light' | 'deep'` (the band order, deep at the bottom).
- **`HypnogramSegment`** = `{ stage: SleepStage; minutes: number }` — one contiguous stretch; `minutes` drives the drawn width.

The only sanctioned sleep-architecture chart; for a generic line use `LineChart`, for circadian phases use `PhaseWheel`.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `segments` | `HypnogramSegment[]` | `DEFAULT_SEGMENTS` (12-stretch night) | ✓ | ✓ | chronological; widths ∝ `minutes` |
| `height` | `number` | `160` | ✓ | ✓ | plot height in px (also the viewBox height) |
| `axis` | `string[]` | `['11p','1a','3a','5a','7a']` | ✓ | ✓ | x-axis time labels under the chart |
| `showStageLabels` | `boolean` | `true` | ✓ | ✓ | left-gutter Awake/REM/Light/Deep labels |
| **`ariaLabel`** | `string` | — | ✓ | — | **web only** — accessible chart description (`<svg aria-label>`) |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only (wrapper) |
| _rest_ | `HTMLAttributes<HTMLDivElement>` | — | ✓ | — | web only |

- **Geometry (identical both sides):** `VB_W = 560`, `PAD_Y = 14`, `GAP = 4`, `BAR_H = 12` (all viewBox units). `total = Σmax(0,minutes) || 1`; `drawable = VB_W − (segments−1)·GAP`. Each bar width `= (minutes/total)·drawable`; its y is `bandY(stage)` (evenly spaced `PAD_Y … height−PAD_Y` across the 4 stages). Capsules are `rx=ry=BAR_H/2`. Connectors are vertical lines at the midpoint between adjacent bars, from `prev.cy` → `b.cy`.
- **Native gutter:** `STAGE_GUTTER = 48px` reserved on the left when `showStageLabels`; the SVG width is the measured container width minus the gutter (`onLayout`).

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web | Native |
| --- | --- | --- |
| Stage colors | `awake var(--warn)` · `rem var(--violet)` · `light var(--cyan)` · `deep var(--indigo)` | `colors.warn / violet / cyan / indigo` |
| Bar fill | per-stage vertical `linearGradient`, stops `0.95 → 0.6` opacity | per-stage gradient, stops `0.95 → 0.85` opacity |
| Bar glow | `.lk-hyp-bars rect { drop-shadow(0 0 6px rgba(124,92,255,.28)) }` | — (no glow) |
| Connectors | `.lk-hyp-links line` `stroke var(--border-2)` 1.5 opacity .8 | `stroke colors.border2` 1.5 opacity 0.8 |
| Stage labels | `.lk-hyp-stage` `10px var(--font-mono)` `ls .02em` `var(--text-faint)` | `fonts.mono 10px` `ls 0.2` `colors.textFaint` |
| Axis labels | `.lk-hyp-axis` `9.5px var(--font-mono)` `var(--text-faint)` | `fonts.mono 9.5px colors.textFaint` |
| Gutter | `--lk-hyp-gutter: 48px` | `STAGE_GUTTER = 48` |
| SVG | `preserveAspectRatio="none"`, `width:100%`, `overflow:visible` | `preserveAspectRatio="none"`, `width = measured − gutter` |

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Default | bands + capsules + connectors | same |
| No stage labels | `showStageLabels=false` → no gutter, axis un-indented | same |
| No axis | `axis=[]` → axis row omitted | same |
| Zero-minute segment | width clamps to 0 (still positioned) | same |
| Pre-measure (native) | n/a | SVG not drawn until `canvasW > 0` |

No hover/focus/disabled — presentational.

## 5. Web ↔ native parity

**Verdict: 🟡 same API & geometry; rendering substrate + one prop differ.** Identical band order, stage colors (token-mapped), `BAR_H`/`GAP`/`PAD_Y`/`VB_W`, the width-∝-minutes math, the connector geometry, the 48px gutter, and the default night sample. Differences:

- **SVG sizing:** web uses a fixed `viewBox 0 0 560 height` with `preserveAspectRatio="none"` and `width:100%` so the browser stretches it. Native measures the container via `onLayout` and sets the SVG `width` to `measured − STAGE_GUTTER` (same fixed viewBox, same non-uniform stretch). Same result, different sizing path.
- **`ariaLabel` prop:** web exposes it on the `<svg>`; native has no such prop (use a wrapping `accessibilityLabel`).
- **Bar gradient tail:** web stops fade `0.95 → 0.6`; native uses `0.95 → 0.85` (an intentional fix so lower bands stay bright per the source comment). Minor.
- **Bar glow:** web `drop-shadow`; native none (no cheap RN equivalent).

No capability gap — fully usable on both; the visual is equivalent.

## 6. Composition & usage

- **Used for:** the sleep detail card / sleep summary screen (last-night architecture).
- **Composes from:** nothing — leaf primitive. Pair with `Stat`/`KeyValue` (time in each stage) and `Card` for the panel.

```tsx
// web
<Hypnogram
  segments={[
    { stage: 'awake', minutes: 8 },
    { stage: 'light', minutes: 42 },
    { stage: 'deep', minutes: 55 },
    { stage: 'rem', minutes: 26 },
  ]}
  axis={['11p', '2a', '5a', '7a']}
  ariaLabel="Sleep stages from 11pm to 7am"
/>

// native (wrap for a11y instead of ariaLabel)
<View accessibilityLabel="Sleep stages from 11pm to 7am">
  <Hypnogram segments={segments} axis={['11p', '2a', '5a', '7a']} />
</View>
```

## 7. Accessibility

- **Web:** the `<svg>` has `role="img"` and the optional `ariaLabel` becomes its `aria-label`. The stage-label gutter is `aria-hidden` (visual aid only). Always pass a meaningful `ariaLabel`.
- **Native:** no built-in label; wrap in a `View` with `accessibilityRole="image"` + `accessibilityLabel` summarizing the night.
- Stage labels and axis use `--text-faint`/`colors.textFaint`; the colored capsules carry the meaning, so keep the per-stage tokens (warn/violet/cyan/indigo) intact for recognizability.

## 8. Usage rules — Do / Don't

**Do**
- Pass real `minutes` per stretch; widths are proportional, so totals self-normalize.
- Keep stages to the four canonical `SleepStage` values (the band layout assumes them).
- Pass a descriptive `ariaLabel` (web) / `accessibilityLabel` (native wrapper).
- Provide an `axis` aligned to the night's span.

**Don't**
- ✗ Don't hand-roll a sleep-stage chart — use `Hypnogram`.
- ✗ Don't pass `ariaLabel` on native (web-only prop) — wrap with `accessibilityLabel`.
- ✗ Don't recolor stages with non-token hexes — the `--warn/violet/cyan/indigo` mapping is the contract.
- ✗ Don't use it for non-sleep timelines — use `LineChart` or `DayTimelineBlocks`.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom capsules-on-bands SVG duplicates this primitive — import `Hypnogram`.
- **New need → add to BOTH platforms.** Need per-stage tooltips, a native `ariaLabel` equivalent, or glow parity? Add it to web and native with the same prop name + tokens — never a one-off.
- **Tokens only.** Stage/connector/label colors come from `@lockin90/tokens`; hardcoded hexes break on Aurora Flux renames.
- **Parity gate.** Before shipping, confirm the web phone-width and native hypnograms show the same bands, capsule widths, connectors, and axis — only the SVG-sizing path and the web glow/`ariaLabel` may differ.
