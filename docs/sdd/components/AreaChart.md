# SDD — `AreaChart`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/AreaChart.tsx` · `packages/ui-native/src/components/AreaChart.tsx` ·
> web CSS `packages/ui/src/styles/components/area.css` (`.lk-area*`).
> **Exports:** `AreaChart`, types `AreaChartProps`, `AreaSeries`, `AreaMultiple`, `AreaChartVariant`.
> **Status:** Shipped. **Parity:** 🟡 same API & look; `shine` blurs the mint underlay on web (`filter: blur(5px)`) vs a Gaussian-blurred duplicate stroke on native (`FeGaussianBlur`, real RN-SVG Fabric filters).
> **Stories:** `packages/ui/src/stories/AreaChart.stories.tsx` (`Charts/AreaChart`) · `packages/ui-native/src/stories/AreaChart.stories.tsx` (`Native/AreaChart`).

---

## 1. Overview

The **catalog stacked-area family** (`lockin90-design/charts/area-charts.html`, AR-01/03/04/05/06/07) for product surfaces: composition over time — what the energy is made of. Six variants drawn in a fixed **320×150 viewBox** with mono catalog labels: cumulative bands with smooth (Fritsch–Carlson monotone) top edges and straight closed bottoms, a top-right dot legend or chip-pill labels inside the bands, an optional NOW rule and a mint edge glow. Values are **raw positive numbers** — the component normalizes them (max column total → 94% of the plot height), so counts, kcal or 0–1 fractions all work.

Catalog-ID mapping (**AR-02 does not exist** — a numbering gap in the catalog):

| Catalog ID | Props | Card |
| --- | --- | --- |
| AR-01 `stack` | `variant="stack"` (default) + `series` SELECT of 2–4 layers | stacked areas + edge strokes + legend |
| AR-03 `percent-stack` | `variant="percent-stack"` | every column normalized to a full column — shares, not amounts |
| AR-04 `stream-center` | `variant="stream-center"` | streamgraph — stack centered on the midline |
| AR-05 `effect-stack` | `variant="effect-stack"` + `now` | chip labels INSIDE the bands + NOW rule — the effect-pipeline chart |
| AR-06 `fade-stack` | `variant="fade-stack"` | each band fades 55%→12% vertically |
| AR-07 `mini-multiples` | `variant="mini-multiples"` + `multiples` | 3 small duo-stacks side by side + day captions |

## 2. API contract

Same prop API on both platforms; only the container props are platform-shaped.

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `variant` | `'stack' \| 'percent-stack' \| 'stream-center' \| 'effect-stack' \| 'fade-stack' \| 'mini-multiples'` | `'stack'` | ✓ | ✓ | AR-01 / 03 / 04 / 05 / 06 / 07 |
| `series` | `AreaSeries[]` | catalog trio demo (SLEEP CREDIT / FOOD / CAFFEINE) | ✓ | ✓ | stacked layers, **bottom first**; 2–4 layers (first four drawn); ignored by `mini-multiples` |
| `multiples` | `AreaMultiple[]` | 3 demo duo-stacks (MON/TUE/WED) | ✓ | ✓ | `mini-multiples` only; first three panels drawn |
| `title` | `string` | — | ✓ | ✓ | top-left mono caption (e.g. `'ENERGY SOURCES · TODAY'`); omit → no caption |
| `now` | `number` | — | ✓ | ✓ | data index (clamped/rounded) → vertical NOW rule + caption (AR-05) |
| `nowLabel` | `string` | `'NOW'` | ✓ | ✓ | NOW rule caption |
| `legend` | `boolean` | `true`; `effect-stack` → `false` | ✓ | ✓ | top-right dot legend, first word of each name; `mini-multiples` never draws one |
| `shine` | `boolean` | `false` | ✓ | ✓ | mint glow along the stack's top edge (catalog `cfg.shine`) |
| `grid` | `boolean` | `true` | ✓ | ✓ | 3 interior rows + baseline (the catalog grid) |
| `ariaLabel` | `string` | `'Stacked area chart'` | ✓ | ✓ | web `aria-label` / native `accessibilityLabel` |
| `className` | `string` | — | ✓ | — | web only, merged onto `.lk-area` |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only, container style |
| _rest_ | `Omit<HTMLAttributes<HTMLDivElement>, 'title' \| 'children'>` | — | ✓ | — | spreads to the root `<div>`; the HTML `title` attr is repurposed as the caption prop |

**`AreaSeries`** — `{ name: string; data: number[]; color?: string }`:
- `name` — legend entry (first word) and the `effect-stack` chip text.
- `data` — raw positive values, one per time step; series should share a length (the shortest wins; negatives clamp to 0).
- `color` — per-layer token override (web `'var(--lime)'` / native `colors.lime`); defaults to the catalog trio + lime: `--mint` → `--cyan` → `--violet` → `--lime`.

**`AreaMultiple`** — `{ caption: string; series: AreaSeries[] }`: one AR-07 panel; the first two series form the duo stack (default fills `--mint` + `--violet`), `caption` prints centered under the panel.

## 3. Visual spec (tokens — never hardcode)

Geometry is the catalog's, in viewBox units: `W 320 · H 150 · pad l10 r12 t16 b14 · plot 298×120`.

| Element | Spec (both platforms) |
| --- | --- |
| Normalization | raw values → plot-height fractions: max column TOTAL = **0.94** of plotH (catalog headroom); `percent-stack` instead fills EVERY column to **0.92**; `stream-center` adds `(0.94 − colTotal)/2` per column after normalization |
| Bands | smooth top edge (Fritsch–Carlson monotone port of the catalog `smoothPath`) + straight reversed bottom edge, closed. Fill = series color `opacity 0.5`, stroke = series color `1px` / `strokeOpacity 0.5` |
| Fade (AR-06) | per-band vertical gradient of the band color, `55% → 12%` opacity, path `opacity 1` (stroke unchanged); `useId`-based gradient ids |
| Labels | `--font-mono` / `fonts.mono`, **8.5** viewBox px, letter-spacing `.06em` (native `0.5`) — title + AR-07 day captions `--text-faint`, legend + NOW caption `--text-dim` |
| Chip tags (AR-05) | catalog `tag()`: rect w = `len·5.35 + 12`, h 13, rx 6.5, fill = **bg-0 at 78%** (web `color-mix(in srgb, var(--bg-0) 78%, transparent)`, native `` `${colors.bg0}C7` ``), stroke = band color `strokeOpacity 0.35` / `0.8px`; centered **8px** mono text in the band color; x clamped to `[P.l−4, W−P.r−w+4]`; anchored at index `floor(n·(0.25 + bi·0.22))`, y = band vertical middle |
| Legend | top-right, reversed (topmost layer first), laid right-to-left from x 306: mono first-word in `--text-dim` at y 11, dot r 3 at y 8.2 in the layer color; slot width `len·5.6 + 8` + 8px gap |
| Grid | 3 interior rows at plot 25/50/75%, `--border` at `strokeOpacity 0.55` (the catalog's white-5%); baseline at y 136, `--border` full (white-9% ≡ the token) |
| NOW rule (AR-05) | vertical 1px `--text` at `strokeOpacity 0.25` (catalog white-25% → text token, the LineChart NOW-rule precedent) from y `P.t−2` to the baseline; caption above at y 11 |
| Shine | mint (`--mint`) top edge of the LAST band: 7.5px round-cap underlay at `opacity 0.45` — **blurred on both** (web `.lk-area-shine` 5px, native `FeGaussianBlur stdDeviation 2.5`) — under a crisp 2.2px mint line |
| Mini-multiples (AR-07) | panel `mi` at x `P.l + mi·(plotW/3 + 2)`, width `plotW/3 − 10` (≈89.3); y maps into `plotH − 20`; duo fills `--mint` + `--violet` at `opacity 0.45`, **no stroke**; captions centered at y `H−2`; all three panels share ONE 0.94 scale so days are comparable |
| Sizing | web `.lk-area-svg`: `width 100%; height auto; overflow visible` (aspect kept by the viewBox); native root: `width '100%', aspectRatio 320/150` |

## 4. States

Pure render — no hover/press/focus/disabled states, no client hooks beyond `useId`.

| State | Behavior |
| --- | --- |
| Default | draws all layers of the chosen variant |
| Empty (`series: []`) | renders the empty frame (grid + `title` if given) — no bands, no legend, no crash |
| Single series | renders one band (the SELECT intent is 2–4, but 1 is safe) |
| Unequal lengths | the shortest series' length wins; extra points are ignored |
| Zero/negative values | negatives clamp to 0; an all-zero column renders flat (`percent-stack` leaves a zero-total column empty) |
| `now` out of range | index rounds and clamps to `[0, n−1]` |

## 5. Web ↔ native parity

**🟡 same API, platform-shaped implementation.** Identical geometry, stacking math, colors and label layout (both compute from the same catalog constants and the same private `monotonePath` port). The real differences:

- **Shine substrate** — web blurs the 7.5px mint underlay with `.lk-area-shine` (`filter: blur(5px)`, the catalog's `blur()`); native blurs the same underlay with a real `FeGaussianBlur` (`stdDeviation 2.5`; see CONVENTIONS.md). Halo softness differs marginally; does not block use.
- **Label styling channel** — web styles `<text>` via `.lk-area-label` / `.lk-area-tag-text` (CSS `.06em`/`.05em`); native passes `fontSize/fontFamily/letterSpacing` props on `Svg.Text` (`0.5`/`0.4`).
- **Tag pill fill** — same bg-0-at-78% value, expressed as `color-mix` on web vs the `#RRGGBBAA` suffix (`C7`) on native.
- **Container** — web `div[role=img]` + `className`/rest; native `View accessibilityRole="image"` + `style`.

## 6. Composition & usage

Standalone chart — composes nothing from the kit; typically placed inside a `Card`/`MetricTile` body. Energy-source composition (the today screen's effect pipeline), share-of-mix analytics, editorial stream visuals, day-over-day composition comparison.

```tsx
// web — AR-05, the effect-pipeline chart
<AreaChart variant="effect-stack" title="WHAT POWERS TODAY" now={18}
  series={[
    { name: 'SLEEP CREDIT', data: sleepCredit },
    { name: 'FOOD', data: food },
    { name: 'CAFFEINE', data: caffeine },
  ]} />
```

```tsx
// native — identical props (AR-07)
<AreaChart variant="mini-multiples" title="SOURCES · 3 DAYS"
  multiples={[
    { caption: 'MON', series: [{ name: 'SLEEP CREDIT', data: monSleep }, { name: 'FOOD', data: monFood }] },
    { caption: 'TUE', series: [{ name: 'SLEEP CREDIT', data: tueSleep }, { name: 'FOOD', data: tueFood }] },
    { caption: 'WED', series: [{ name: 'SLEEP CREDIT', data: wedSleep }, { name: 'FOOD', data: wedFood }] },
  ]} />
```

## 7. Accessibility

- **Web:** root `<div role="img" aria-label={ariaLabel}>`; the `<svg>` is `aria-hidden` (in-SVG text is decorative — the label carries the meaning). Pass a data-bearing `ariaLabel` ("Energy sources today: sleep credit leads, caffeine fades after 3pm").
- **Native:** root `View` with `accessibilityRole="image"` + `accessibilityLabel={ariaLabel}`.
- Non-interactive — no focus/keyboard surface. In-chart text scales with the container (8.5 viewBox px ≈ 9.6px at 360w); keep charts ≥ ~300px wide or move critical numbers into surrounding real text.
- Color is not the only channel: every layer is named (legend or in-band chip), and stacking order is stated by the data order, not just hue.

## 8. Usage rules — Do / Don't

**Do**
- Pass series **bottom layer first** in one consistent unit (all kcal, all fractions…) — the component normalizes, so only relative size matters.
- Use `percent-stack` when the question is the mix, `stream-center` for editorial silhouettes, `effect-stack` (+`now`) for the today-screen pipeline, `mini-multiples` for day-over-day comparison.
- Override layer colors with **tokens only** (`var(--lime)` / `colors.lime`).
- Reproduce catalog cards in tests/stories with the catalog seeds (see the stories) when checking parity.

**Don't**
- Don't pre-normalize to percentages AND use `percent-stack` — it re-normalizes every column anyway; feed raw values.
- Don't pass more than 4 layers (extras are dropped) or mix `series` with `mini-multiples` (the variant ignores `series`).
- Don't expect a legend on `mini-multiples` — the panels are captioned instead; the AR-05 chips replace the legend by default.
- Don't hardcode hex in `color` overrides, and don't restyle `.lk-area-label` / `.lk-area-tag-text` per app.

## 9. Anti-patterns & lookalike ban

- **No hand-rolled stacks.** Any stacked-area, streamgraph or duo-stack multiple on a product surface is this component — never a local SVG lookalike.
- **New variant → both platforms.** A new area form (e.g. a ridge stack) is added here, web + native in the same unit of work, with the same prop name — never a one-off in an app.
- **Tokens only** — spectrum/text/border tokens throughout; the tag pill's bg-0-at-78% is the catalog value expressed through the `--bg-0` token on both platforms (no raw hex in app code, ever).
- **Don't fork the smoothing** — the private `monotonePath` is the catalog port; apps never re-implement the curve or the 0.94/0.92 normalization to "match" it.
- **Parity gate:** any change ships only after the web story and the native story are compared side-by-side against `area-charts.html`.
