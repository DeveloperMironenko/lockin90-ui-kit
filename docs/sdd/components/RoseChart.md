# SDD — `RoseChart`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/RoseChart.tsx` · `packages/ui-native/src/components/RoseChart.tsx` ·
> no CSS partner file — visuals ride inline SVG attributes (`.lk-rose` on the root is a bare hook class).
> **Exports:** `RoseChart`, types `RoseChartProps`, `RosePetal`, `RoseVariant`.
> **Status:** Shipped. **Parity:** 🟡 same API & geometry; `shine` is a blurred duplicate petal @ 0.5 on both — web `filter: blur(5px)`, native `FeGaussianBlur stdDeviation 2.5` (real RN-SVG filters).
> **Stories:** `packages/ui/src/stories/RoseChart.stories.tsx` (`Charts/RoseChart`) · `packages/ui-native/src/stories/RoseChart.stories.tsx` (`Native/RoseChart`).

---

## 1. Overview

The **catalog rose family** (`lockin90-design/charts/rose-charts.html`, RS-01…RS-03) — Nightingale petals, "the radar's louder sibling": petals fan clockwise from 12 o'clock, **length = value**, over three faint ring guides, so the weak petal is obvious at a glance. Values arrive **normalized 0–1** and grow each petal from the 10px hub to the 52px rim in the fixed **320×150 viewBox**; three variants change what the petals mean: the spectrum-colored life-balance wheel with rim labels + a dim `note`, the 7-petal week where mint **opacity carries the score** and today renders solid, and the week-over-week compare where filled violet petals sit over last week's white dashed outlines. With no `petals` it renders the catalog card's data (CATS six-category balance / DAYS seven-day week).

Catalog-ID mapping:

| Catalog ID | `variant` | Card props (see stories) |
| --- | --- | --- |
| RS-01 balance-rose | `'balance-rose'` (default) | CATS petals (TRAIN 0.85 … RECOVER 0.75) · `note 'MIND LAGS · 50%'` |
| RS-02 week-rose | `'week-rose'` | DAYS petals (M 0.6 … S 0.7) · today = last · `todayLabel` pill + `caption` |
| RS-03 rose-compare | `'rose-compare'` | CATS petals + `compare [0.6, 0.8, 0.7, 0.65, 0.45, 0.6]` · legend pills |

## 2. API contract

Same prop API on both platforms; only the container props are platform-shaped.

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `variant` | `'balance-rose' \| 'week-rose' \| 'rose-compare'` | `'balance-rose'` | ✓ | ✓ | RS-01 … RS-03 |
| `petals` | `RosePetal[]` | catalog CATS (`week-rose`: DAYS) | ✓ | ✓ | clockwise from 12 o'clock; petal count `n` sets the wedge step `360/n` |
| `compare` | `number[]` | `[0.6, 0.8, 0.7, 0.65, 0.45, 0.6]` | ✓ | ✓ | `rose-compare` — last period's values (dashed ghosts), matched to `petals` by index |
| `todayIndex` | `number` | last petal | ✓ | ✓ | `week-rose` — the solid "today" petal (strict index match) |
| `color` | `string` | `'var(--mint)'` / `colors.mint` (week) · `'var(--violet)'` / `colors.violet` (compare) | ✓ | ✓ | petal + pill color; `balance-rose` defaults to the spectrum by index instead |
| `note` | `string` | — | ✓ | ✓ | `balance-rose` — dim caption bottom-right (the card's `'MIND LAGS · 50%'`); omit → none |
| `todayLabel` | `string` | `'TODAY · SUN'` | ✓ | ✓ | `week-rose` chip-pill |
| `caption` | `string` | `'PETAL = DAY SCORE'` | ✓ | ✓ | `week-rose` dim caption under the pill |
| `currentLabel` | `string` | `'THIS WEEK'` | ✓ | ✓ | `rose-compare` chip-pill for the filled petals |
| `compareLabel` | `string` | `'LAST · DASHED'` | ✓ | ✓ | `rose-compare` chip-pill for the ghost |
| `title` | `string` | per-variant (`'LIFE BALANCE · WEEK'` / `'THE WEEK · 7 PETALS'` / `'WEEK VS LAST'`) | ✓ | ✓ | faint mono caption top-left |
| `shine` | `boolean` | `false` | ✓ | ✓ | glow underlay behind the petals (`week-rose`: today only) |
| `width` / `height` | `number` | `320` / `150` | ✓ | ✓ | rendered px — the viewBox scales to fit |
| `className` | `string` | — | ✓ | — | web only, merged onto `.lk-rose` |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only, wrapper `View` style |
| _rest_ | `Omit<SVGProps<SVGSVGElement>, 'width' \| 'height' \| 'children' \| 'color'>` | — | ✓ | — | spreads to the root `<svg>`; SVG's presentational `color` attr is repurposed as the color prop |

**`RosePetal`** — `{ value: number; label?: string; color?: string }`: `value` 0–1 drives the length (0 → the 10px hub, 1 → the 52px rim); `label` is the rim caption (category name / day letter); `color` overrides this petal's hue (beats `color` and the spectrum).

## 3. Visual spec (tokens — never hardcode)

Geometry is the catalog's, in viewBox units: `W 320 · H 150 · pad l10 r12 t16 b14 · center (130, 84) · hub 10 → MAXR 52`.
**Petal wedge** (the page's `petal()`): step `360/n`, `a0 = i·step + 3`, `a1 = (i+1)·step − 3` (3° trim per side), radius `10 + v·42`; the slice path runs center → rim arc (0° at 12 o'clock, clockwise); `mid = (a0+a1)/2` anchors the rim label.

| Element | Spec (both platforms) |
| --- | --- |
| Ring guides | 3 circles at 33/66/100% of the petal range (r 23.9 / 37.7 / 52), `--border` at `strokeOpacity 0.67` (≈ the catalog's white-6%), width 1, drawn under the petals |
| Petal (default) | fill = petal color @ `fillOpacity 0.3` + same-color edge `strokeWidth 1.5` |
| Balance (RS-01) | color = spectrum by index `--lime → --mint → --cyan → --indigo → --violet → --magenta`; rim labels at `MAXR+12`; `note` end-anchored at (304, 130) `--text-dim` |
| Week (RS-02) | one hue (default `--mint`); fill today **0.65** else `0.12 + v·0.25` (12–37% — opacity carries the score), edge today **2** else 1.2; day letters at `MAXR+10`, today's letter in the petal color, others `--text-faint`; TODAY pill centered at (252, 40); caption start-anchored at (252, 60) `--text-dim` |
| Compare (RS-03) | ghost petals first: `--text` @ 55% (web `color-mix`, native `${colors.text}8C` — the catalog's white-55%), `fillOpacity 0`, stroke 1.2, dash `3 3`; filled petals (default `--violet`) 0.3/1.5 on top; rim labels at `MAXR+12`; pills at (262, 34) petal color / (262, 50) `--text-dim` |
| Labels | `--font-mono` / `fonts.mono`, **8.5** viewBox px, tracking `.06em` (native `0.5`) — title start-anchored at (12, 11) `--text-faint`; rim labels middle-anchored at `polar(mid)` y+3 |
| Chips (catalog `tag()`) | rect w `len·5.35+12`, h 13, rx 6.5, fill `--bg-0` @ 78% (web `color-mix`, native `${colors.bg0}C7`), stroke = chip color @ 0.35, width 0.8; centered **8px** mono text, tracking `.05em` (native `0.4`); x clamps into the padded box |
| Shine | web: duplicate petal under the crisp one, `opacity 0.5` + `filter: blur(5px)` (the catalog's `C.blur(…, 5)`); native: the same duplicate at `opacity 0.5`, Gaussian-blurred (`FeGaussianBlur stdDeviation 2.5`) |
| Sizing | web `<svg width height viewBox>`; native `View {width, height}` wrapping `Svg` — both default 320×150 and scale the viewBox to the given px |

## 4. States

Pure render — no hover/press/focus/disabled states, no client hooks.

| State | Behavior |
| --- | --- |
| Default | title + ring guides + the chosen variant's petals and furniture |
| Empty (`petals: []`) | renders title + guides — no petals, no crash (pills still show on week/compare) |
| `value: 0` | the petal collapses to a 10px hub sliver — still visible, honestly "near zero" |
| Out-of-range `todayIndex` | no petal matches — the whole week renders as history (no solid petal) |
| `compare` shorter than `petals` | missing ghosts fall back to 0 (hub sliver outline) — never `NaN` |
| Omitted `note` / `title` override | `note` renders nothing; `title` falls back to the variant's catalog heading |

## 5. Web ↔ native parity

**🟡 same API, platform-shaped implementation.** Identical geometry (`polar`/`slicePath`/`petalGeom` are line-for-line the same port of the catalog `draw()`), same data model, defaults, colors, opacities, chip math and draw order. The real differences:

- **Shine substrate** — web blurs a duplicate petal via CSS (`filter: blur(5px)`, opacity 0.5 — the catalog's exact modifier); native draws the **same duplicate at 0.5**, Gaussian-blurred via `FeGaussianBlur stdDeviation 2.5` in a padded `userSpaceOnUse` region (see CONVENTIONS.md). Glow-texture-only diff; does not block use.
- **Label styling channel** — web sets `fontFamily`/`letterSpacing` via inline `style` on `<text>`; native passes them as `Svg.Text` props (`0.5`/`0.4` ≈ `.06em`/`.05em`).
- **Container** — web root **is** the `<svg role="img">` (+ `className`/SVG rest); native wraps `Svg` in a `View accessibilityRole="image"` (+ `style`). Same computed accessible label on both.
- Internal dash typing differs (`'3 3'` string vs `[3, 3]` array) — invisible at the API.

## 6. Composition & usage

Standalone chart — composes nothing from the kit; typically placed inside a `Card`/`MetricTile` body. Balance surfaces: the life-balance wheel on the dashboard, the week's shape in review screens, week-over-week shift in coach summaries.

```tsx
// web — RS-01: real category scores, the weak petal is obvious
<RoseChart petals={cats.map((c) => ({ label: c.name, value: c.score / 100 }))}
  note={`${weakest.name} LAGS · ${weakest.score}%`} />
```

```tsx
// native — RS-03: identical props
<RoseChart variant="rose-compare" petals={thisWeek} compare={lastWeek.map((c) => c.score / 100)} />
```

## 7. Accessibility

- **Web:** root `<svg role="img" aria-label>` — the label is computed as `` `${heading}: rose chart with ${n} petals` ``; override via the `aria-label` rest attr with a data-bearing sentence ("Life balance: mind lags at 50%").
- **Native:** wrapper `View` with `accessibilityRole="image"` + the same computed label.
- Non-interactive — no focus/keyboard surface. Rim labels are 8.5 viewBox px (≈ 9.6px at 360w); keep the chart ≥ ~300px wide or restate the verdict in surrounding real text.
- On `week-rose`, opacity is the score channel — don't rely on it alone for a load-bearing verdict; the day letters + a caption carry the story.

## 8. Usage rules — Do / Don't

**Do**
- Normalize scores to 0–1 **before** passing them (`value: score / 100`) — the component never rescales.
- Keep `petals` in clockwise order from 12 o'clock; keep `compare` index-aligned with `petals`.
- Use `note` for the one-line takeaway on `balance-rose` (the catalog card's "MIND LAGS · 50%" role).
- Override `color`/`RosePetal.color` with **tokens only** (`var(--cyan)` / `colors.cyan`).
- Reproduce the catalog cards in stories/tests with the CATS/DAYS/LAST data in the story files when checking parity.

**Don't**
- Don't pass raw-unit data (scores 0–100, hours) — everything is 0–1 petal space, and values > 1 will overflow the ring guides.
- Don't fake the compare ghost with a second `RoseChart` layered behind — `compare` is the two-period form.
- Don't force spectrum colors onto `week-rose` via per-petal overrides — one hue + opacity **is** the encoding (RS-02); category coloring is `balance-rose`'s job.
- Don't hardcode hex in `color`, and don't restyle the in-SVG labels/chips per app.

## 9. Anti-patterns & lookalike ban

- **No hand-rolled roses.** Any petal/Nightingale wheel on a product surface is this component — never a local SVG lookalike (that includes "just this once" radar-with-wedges hybrids).
- **New variant → both platforms.** A new rose form (e.g. zone-colored petals) is added here, web + native in the same unit of work, with the same prop name — never a one-off in an app.
- **Tokens only** — spectrum/text/border tokens throughout; the catalog's ghost/guide/chip alphas are expressed **through** tokens (`--text` @ 55%, `--border` @ 0.67, `--bg-0` @ 78%) inside the component, never in app code.
- **Don't re-derive the geometry** (3° wedge trim, hub 10 → 52, guide fractions, chip width math) in app code — the component is the single source of the catalog spec.
- **Parity gate:** any change ships only after the web story and the native story are compared side-by-side against `rose-charts.html`.
