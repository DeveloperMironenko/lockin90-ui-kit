# SDD — `CompareChart`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/CompareChart.tsx` · `packages/ui-native/src/components/CompareChart.tsx` ·
> web CSS `packages/ui/src/styles/components/compare.css` (`.lk-cmp*`).
> **Exports:** `CompareChart`, types `CompareChartProps`, `CompareChartVariant`, `CompareMetric`, `RankSeries`, `LadderStep`.
> **Status:** Shipped. **Parity:** 🟡 same API & geometry; `shine` is a CSS `blur(5px)` underlay and the ladder NOW pulse is a CSS-animated expanding ring on web vs a Gaussian-blurred duplicate stroke (`FeGaussianBlur`, real RN-SVG filters) + static halo ring on native (no SMIL).
> **Stories:** `packages/ui/src/stories/CompareChart.stories.tsx` (`Charts/CompareChart`) · `packages/ui-native/src/stories/CompareChart.stories.tsx` (`Native/CompareChart`).

---

## 1. Overview

The **catalog before/after compare family** (`lockin90-design/charts/compare-charts.html`, CP-01…CP-07) for product surfaces — "the 90-day payoff chart": seven variants drawn in a fixed **320×150 viewBox** with mono catalog labels and chip-pill tags. `slope-panel` (default) draws one slope per metric between two day columns (up = own hue, down = coral); `dumbbell-rows` draws dim-start → solid-end dot pairs; `bump-ranks` draws monotone-smooth rank lines over lanes; `delta-arrows` draws signed arrow bars off a center zero-line; `mirror-bars` mirrors before (dim) / after (hued) bars around a center spine; `cohort-slopes` puts the hero metric's 3.5px slope over faint cohort ghost slopes with an optional badge chip; `ladder-steps` climbs milestone dots with a pulsing NOW. All values live on a **0–1 normalized scale**; the printed delta is `round((after − before) × 100)`, signed.

**Catalog-ID mapping** (story names carry the IDs):

| ID | `variant` | Data props |
| --- | --- | --- |
| CP-01 | `slope-panel` | `metrics` (first 4) + `startLabel`/`endLabel` |
| CP-02 | `dumbbell-rows` | `metrics` + `legend` |
| CP-03 | `bump-ranks` | `series` + `columns` |
| CP-04 | `delta-arrows` | `metrics` |
| CP-05 | `mirror-bars` | `metrics` + `startLabel`/`endLabel` |
| CP-06 | `cohort-slopes` | hero = `metrics[0]` + `cohort` ghosts + `badge` |
| CP-07 | `ladder-steps` | `steps` |

## 2. API contract

Same prop API on both platforms; only the container props are platform-shaped.

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `variant` | `CompareChartVariant` | `'slope-panel'` | ✓ | ✓ | CP-01 … CP-07 |
| `metrics` | `CompareMetric[]` | catalog METRICS (see below) | ✓ | ✓ | slope-panel (first 4) / dumbbell-rows / delta-arrows / mirror-bars / cohort-slopes (hero = `metrics[0]`) |
| `series` | `RankSeries[]` | catalog bump series | ✓ | ✓ | `bump-ranks` only; rank 1 = top lane |
| `steps` | `LadderStep[]` | catalog ladder steps | ✓ | ✓ | `ladder-steps` only |
| `cohort` | `Array<{ before: number; after: number }>` | — | ✓ | ✓ | `cohort-slopes` faint ghost slopes; omit → hero only |
| `title` | `string` | — | ✓ | ✓ | top-left mono caption, `--text-faint`; omit → no caption |
| `startLabel` | `string` | `'DAY 1'` | ✓ | ✓ | left column caption (slope variants) / `← DAY 1` mirror caption |
| `endLabel` | `string` | `'DAY 90'` | ✓ | ✓ | right column caption / `DAY 90 →` mirror caption |
| `badge` | `string` | — | ✓ | ✓ | `cohort-slopes` hero chip-pill, top-center (e.g. `'ENERGY +26 IN 90 DAYS'`) |
| `columns` | `string[]` | `W1…Wn` | ✓ | ✓ | `bump-ranks` x captions |
| `legend` | `string` | `'DIM = DAY 1 · SOLID = DAY 90'` | ✓ | ✓ | `dumbbell-rows` footer, centered; `''` hides it |
| `shine` | `boolean` | `false` | ✓ | ✓ | glow duplicate under the **slope lines** (slope-panel / cohort-slopes only, per the catalog) |
| `ariaLabel` | `string` | `'Before / after comparison'` | ✓ | ✓ | web `aria-label` / native `accessibilityLabel` |
| `className` | `string` | — | ✓ | — | web only, merged onto `.lk-cmp` |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only, container style |
| _rest_ | `Omit<HTMLAttributes<HTMLDivElement>, 'title' \| 'children'>` | — | ✓ | — | spreads to the root `<div>`; the HTML `title` attr is repurposed as the caption prop |

**`CompareMetric`** — `{ name: string; before: number; after: number; color?: string }`: 0–1 values; `color` is a token override (web `'var(--violet)'` / native `colors.violet`), falling back to the catalog metric palette `--mint → --violet → --cyan → --zone-mid → --indigo` (wraps). Down-moves render `--zone-low` in slope-panel / dumbbell-rows / delta-arrows regardless of `color` (catalog rule).
**`RankSeries`** — `{ name: string; ranks: number[]; color?: string }`: rank 1 = top lane; lanes span to the **max rank across all series**; fallback palette `--violet → --cyan → --lime → --zone-mid`.
**`LadderStep`** — `{ label: string; value: number; state: 'done' | 'now' | 'ahead' }`: `value` is the 0–1 dot height.

Default `metrics` = the catalog METRICS: `ENERGY 0.48→0.74 --mint · SLEEP 0.55→0.68 --violet · HRV 0.40→0.62 --cyan · STRAIN 0.70→0.52 --zone-mid · WEIGHT 0.62→0.58 --indigo`. Default `series`/`steps` = the catalog bump series / ladder steps, so every variant renders alone.

## 3. Visual spec (tokens — never hardcode)

Geometry is the catalog's, in viewBox units: `W 320 · H 150 · pad l10 r12 t16 b14 · plot 298×120 · Y(v) = 16 + (1 − v)·120`. Slope/dumbbell/arrow columns: `colX(f) = 56 + 206·f` (46px gutters each side).

| Element | Spec (both platforms) |
| --- | --- |
| Labels | `--font-mono` / `fonts.mono`, **8.5** viewBox px, letter-spacing `.06em` (native `0.5`) — title/captions/legend `--text-faint`, row names `--text-dim`, deltas in the move color |
| Chip-pill tag | rect `w = len·5.35 + 12`, h 13, rx 6.5 — fill `--bg-0` @ 78% (web `color-mix(in srgb, var(--bg-0) 78%, transparent)` / native `` `${colors.bg0}C7` ``), stroke = tag color @ `strokeOpacity 0.35`, width 0.8; centered **8px** mono text (`.05em`) in the tag color; x clamped inside the padded box |
| Slopes (CP-01/06) | column rules `--text` @ 0.1, 1px; line 2px (hero 3.5px) round cap; endpoint dots r 3.2; name end-anchored at `x0 − 8`, signed delta start-anchored at `x1 + 8`; column captions at `y = 148` |
| Cohort ghosts (CP-06) | `--text` @ 0.1, 1.2px, between the two columns; hero color = `metrics[0].color ?? --mint` |
| Dumbbells (CP-02) | rows at `rh = plotH / n`; connector 2.4px @ 0.55 mint/`--zone-low` by direction; start dot r 4 `--text` @ fillOpacity 0.35, end dot r 4.6 solid; legend centered at `colX(0.5), 148` |
| Bump (CP-03) | lanes `rowY(rk) = 30 + (rk−1)·98 / max(1, laneMax−1)`; `colXX(i) = 60 + 238·i / max(1, cols−1)`; monotone-smooth lines 2.2px @ 0.85; dots r 3 (latest r 4.5); name end-anchored at x 54; `#rank` after the last dot |
| Arrows (CP-04) | zero-line at `colX(0.5)` `--text` @ 0.14, 1px; arrow bar 5px round cap @ 0.85, length `dv·206`; 7px triangle head; `%` label 14px beyond the head — mint/`--zone-low` |
| Mirror (CP-05) | spine at x 160 `--text` @ 0.18, 1.4px; left rect `w = before·118` `--text` @ fillOpacity 0.22, right rect `w = after·118` metric hue @ 0.9 — h 11, rx 5.5; name centered above the row (`--text-faint`) |
| Ladder (CP-07) | steps at `x = 34 + si·238 / max(1, n−1)`, `y = Y(value)`; connectors 2px — mint solid, or `--text` @ 0.2 dashed `4 4` toward/from an `ahead` step; dots: now → mint r 6 + pulse, done → mint @ fillOpacity 0.6 r 4.5, ahead → `--text` @ fillOpacity 0.25 r 4.5; chip at `y − 15` (`ahead` chips `--text-faint`, others `--mint`) |
| Shine | web: `.lk-cmp-shine` → `filter: blur(5px)` on a `w + 5` round-cap duplicate line @ 0.45; native: the same duplicate line (`strokeWidth + 5` @ 0.45) Gaussian-blurred via `FeGaussianBlur` stdDev 2.5 |
| NOW pulse | core dot r 3.6 mint (web + `drop-shadow(0 0 5px var(--mint))`); web ring r 3.6 stroke 1.4 animated by `.lk-cmp-pulse` (scale 1→3, fade .8→0, 1.8s infinite, `transform-box: fill-box`; reduced-motion → static @ 0.35); native static halo ring r 7, stroke 1.4 @ 0.4 (Ring precedent) |
| Sizing | web `.lk-cmp-svg`: `width 100%; height auto; overflow visible`; native root: `width '100%', aspectRatio 320/150` |

Catalog raw whites are token-mapped: `rgba(255,255,255,.1/.14/.18/.2/.22/.25/.35)` → `--text` / `colors.text` + matching stroke/fill-opacity (LineChart NOW-rule precedent); `rgba(52,245,197,.6)` → `--mint` @ fillOpacity 0.6.

## 4. States

Pure render — no hover/press/focus/disabled states, no client hooks.

| State | Behavior |
| --- | --- |
| Default | draws the chosen variant from `metrics`/`series`/`steps` (catalog defaults) |
| Empty (`metrics: []` etc.) | renders the variant's frame (columns/spine/captions + `title`) — no rows, no crash |
| Single column/step | bump `cols`/ladder `n` denominators clamp at 1 — no divide-by-zero |
| Down-move | slope/dumbbell/arrow renders `--zone-low` with a `−` delta (U+2212) |
| Reduced motion (web) | `.lk-cmp-pulse` freezes to a static ring @ opacity 0.35 |

## 5. Web ↔ native parity

**🟡 same API, platform-shaped implementation.** Identical geometry, data model, colors, and label layout (both compute from the same catalog constants; `monotonePath` is the same Fritsch–Carlson port on both sides). The real differences:

- **Shine substrate** — web blurs a wider duplicate line (`filter: blur(5px)`, catalog `C.blur`); native Gaussian-blurs the same duplicate (`strokeWidth + 5`, `strokeOpacity 0.45`, `FeGaussianBlur stdDeviation 2.5` — see CONVENTIONS.md). Halo softness differs marginally; does not block use.
- **NOW pulse substrate** — web animates the ring (CSS scale 1→3 / fade, reduced-motion safe); native shows a **static halo ring** (r 7, stroke 1.4 @ 0.4 — the `Ring` pulse precedent; no SMIL/JS animation). The web core dot also carries a `drop-shadow` glow that native omits.
- **Label styling channel** — web styles `<text>` via `.lk-cmp-label`/`.lk-cmp-tag` (CSS); native passes `fontSize/fontFamily/letterSpacing` props on `Svg.Text` (`0.5`/`0.4` ≈ `.06em`/`.05em`).
- **Container** — web `div[role=img]` + `className`/rest; native `View accessibilityRole="image"` + `style`.

## 6. Composition & usage

Standalone chart — composes nothing from the kit; typically placed inside a `Card`/`MetricTile` body. Program-payoff summaries ("what moved in 90 days"), weekly factor rankings, cohort context, program-milestone progress.

```tsx
// web — CP-01 payoff panel with real data
<CompareChart
  title="DAY 1 → DAY 90"
  metrics={[
    { name: 'ENERGY', before: 0.48, after: 0.74, color: 'var(--mint)' },
    { name: 'SLEEP', before: 0.55, after: 0.68, color: 'var(--violet)' },
    { name: 'HRV', before: 0.4, after: 0.62, color: 'var(--cyan)' },
    { name: 'STRAIN', before: 0.7, after: 0.52, color: 'var(--zone-mid)' },
  ]}
/>
```

```tsx
// native — identical props (CP-07 program ladder)
<CompareChart
  variant="ladder-steps"
  title="PROGRAM LADDER"
  steps={[
    { label: 'BASELINE', value: 0.25, state: 'done' },
    { label: 'OPTIMIZING', value: 0.68, state: 'now' },
    { label: 'LOCKED IN', value: 0.9, state: 'ahead' },
  ]}
/>
```

## 7. Accessibility

- **Web:** root `<div role="img" aria-label={ariaLabel}>`; the `<svg>` is `aria-hidden` (in-SVG text is decorative — the label carries the meaning). Pass a data-bearing `ariaLabel` ("Energy improved 26 points in 90 days").
- **Native:** root `View` with `accessibilityRole="image"` + `accessibilityLabel={ariaLabel}`.
- Non-interactive — no focus/keyboard surface. In-chart text scales with the container (8.5 viewBox px ≈ 9.6px at 360w); keep charts ≥ ~300px wide or move critical numbers into surrounding real text.
- The pulse animation respects `prefers-reduced-motion` on web; native is static by construction.
- Color is not the only channel: every move also prints its signed delta, ladder states differ by dot size/chip tone, and direction is encoded in the arrow head/anchor.

## 8. Usage rules — Do / Don't

**Do**
- Normalize values to 0–1 before passing them — the printed delta is `round((after − before)·100)`, so 0–1 in ≙ points out.
- Use `slope-panel`/`cohort-slopes` for the program payoff, `dumbbell-rows`/`delta-arrows` for compact multi-metric moves, `bump-ranks` for shifting priorities, `ladder-steps` for journey progress.
- Override colors with **tokens only** (`var(--violet)` / `colors.violet`).
- Keep exactly one `now` step in `ladder-steps` — the pulse marks "you are here".
- Reproduce catalog cards in stories/tests with the catalog data (see the CP-## stories) when checking parity.

**Don't**
- Don't pass raw units (hours, bpm) — normalize first; the chart never auto-scales.
- Don't feed `slope-panel` more than 4 metrics expecting them all — it draws the first 4 (catalog rule); use `dumbbell-rows`/`mirror-bars` for 5.
- Don't use `shine` outside the slope variants — it's a no-op elsewhere by design.
- Don't hardcode hex in `color` overrides, and don't restyle `.lk-cmp-label`/`.lk-cmp-tag` per app.

## 9. Anti-patterns & lookalike ban

- **No hand-rolled compares.** Any before/after slope, dumbbell, bump-rank, delta-arrow, mirror-bar or milestone-ladder chart on a product surface is this component — never a local SVG lookalike.
- **New variant → both platforms.** A new compare form is added here, web + native in the same unit of work, with the same prop names — never a one-off in an app.
- **Tokens only** — spectrum/zone/text tokens throughout; the catalog's raw white opacities are expressed as `--text` + opacity inside the component, never re-derived in app code.
- **Substrate diffs stay documented, not widened** — don't "fix" the native static pulse with a JS animation loop or hand-tune the kit's `FeGaussianBlur` shine pattern per app; the diffs in §5 are the accepted contract.
- **Parity gate:** any change ships only after the web story and the native story are compared side-by-side against `compare-charts.html`.
