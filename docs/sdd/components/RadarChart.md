# SDD — `RadarChart`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/RadarChart.tsx` · `packages/ui-native/src/components/RadarChart.tsx` ·
> no web CSS partner — the SVG is styled entirely via inline attributes/style (`.lk-radar` is a bare hook class).
> **Exports:** `RadarChart`, types `RadarChartProps`, `RadarVariant`, `RadarFill`, `RadarSeries`.
> **Status:** Shipped. **Parity:** 🟡 same API & geometry; `shine` is a `blur(5px)` wider duplicate edge on web vs an
> unblurred wider faint duplicate on native (RN SVG filters are patchy), and the gradient fill's glow color is solid accent on native.
> **Stories:** `packages/ui/src/stories/RadarChart.stories.tsx` (`Charts/RadarChart`) · `packages/ui-native/src/stories/RadarChart.stories.tsx` (`Native/RadarChart`).

---

## 1. Overview

The **catalog radar/spider family** (`lockin90-design/charts/radar-charts.html`, RD-01…RD-07) — the body-balance
wheel: 5 factors, one shape. A pentagon grid (3 concentric rings + spokes + mono axis labels at R+11) drawn in the
fixed **320×150 viewBox**, with one or more 0–1 value polygons on top (13% fill + 2px round-join edge + r 2.8 vertex
dots). Six variants layer the story furniture: a dashed violet 80% target pentagon with YOU/TARGET pills, a text-35%
dashed cohort ghost, zone-colored vertex dots on a neutral shape, a 3-week opacity trail, and three R30 mini radars
with day captions. With no data props it renders the catalog RD-01 card (seed-11 values, the 5 default factors).

Catalog-ID mapping:

| Catalog ID | `variant` | Card props (see stories) |
| --- | --- | --- |
| RD-01 balance-radar | `'balance-radar'` (default) | seed 11 values · `score '72 BALANCED'` · SELECT FILL → `fillStyle 'solid' / 'gradient'` |
| RD-02 target-overlay | `'target-overlay'` | seed 22 values · `compare` defaults to the 80% pentagon |
| RD-03 cohort-ghost | `'cohort-ghost'` | seed 33 values · `compare` = seed 40 × 0.85 ghost |
| RD-04 zone-vertices | `'zone-vertices'` | seed 44 values |
| RD-06 weeks-trail | `'weeks-trail'` | `trail` = seeds 66/69/72 × 0.7/0.85/1 |
| RD-07 mini-triples | `'mini-triples'` | `series` = seeds 11/22/33 · MON/TUE/WED |

## 2. API contract

Same prop API on both platforms; only the container props are platform-shaped.

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `variant` | `'balance-radar' \| 'target-overlay' \| 'cohort-ghost' \| 'zone-vertices' \| 'weeks-trail' \| 'mini-triples'` | `'balance-radar'` | ✓ | ✓ | RD-01 … RD-07 |
| `axes` | `string[]` | `['SLEEP','TRAIN','FOOD','STRESS','LIGHT']` | ✓ | ✓ | clockwise from 12 o'clock; the count sets the polygon |
| `values` | `number[]` | catalog seed-11 shape | ✓ | ✓ | your shape, 0–1, **one per axis** |
| `compare` | `number[]` | RD-02 all `0.8` · RD-03 `values × 0.85` | ✓ | ✓ | the dashed overlay (target / cohort ghost) |
| `trail` | `number[][]` | catalog W1→W3 (seeds 66/69/72 × 0.7/0.85/1) | ✓ | ✓ | `weeks-trail` value sets, **oldest→newest** |
| `series` | `RadarSeries[]` | catalog MON/TUE/WED minis | ✓ | ✓ | `mini-triples` — the small radars + captions |
| `fillStyle` | `'solid' \| 'gradient'` | `'solid'` | ✓ | ✓ | RD-01 SELECT FILL; `gradient` = mint→violet edge over accent 13% |
| `color` | `string` | `'var(--mint)'` / `colors.mint` | ✓ | ✓ | shape token for `solid`; also the trail + minis + YOU pill |
| `score` | `string` | — | ✓ | ✓ | RD-01 bold display readout, top-right (e.g. `'72 BALANCED'`) |
| `youLabel` | `string` | `'YOU'` (`weeks-trail` `'W1 → Wn'`) | ✓ | ✓ | chip-pill for your shape (RD-02/03/06) |
| `compareLabel` | `string` | RD-02 `'TARGET'` / RD-03 `'COHORT'` | ✓ | ✓ | chip-pill for the overlay |
| `title` | `string` | per-variant catalog caption | ✓ | ✓ | top-left mono caption; `''` hides it |
| `shine` | `boolean` | `false` | ✓ | ✓ | glow underlay behind the shape edge (catalog blur modifier) |
| `width` / `height` | `number` | `320` / `150` | ✓ | ✓ | rendered px — the viewBox scales to fit |
| `className` | `string` | — | ✓ | — | web only, merged onto `.lk-radar` |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only, container style |
| _rest_ | `Omit<SVGProps<SVGSVGElement>, 'width' \| 'height' \| 'children' \| 'color' \| 'fill' \| 'values'>` | — | ✓ | — | spreads to the root `<svg>` (an explicit `aria-label` overrides the computed one) |

**`RadarSeries`** — `{ values: number[]; label?: string }`: one mini radar of `mini-triples`; omit `label` → no caption.

## 3. Visual spec (tokens — never hardcode)

Geometry is the catalog's, in viewBox units: `W 320 · H 150 · pad l10 r12 t16 b14 · center (160, 83) · R 48`.
Minis: `R 30`, centers `x 62 + i·98` (62/160/258), captions at `y 127` (center+44).

| Element | Spec (both platforms) |
| --- | --- |
| Frame | 3 pentagon rings at 0.33/0.66/1 of R + one spoke per axis, `--text` @ 7% (web `color-mix`, native `${colors.text}12` — the catalog's white-7%), width 1 |
| Axis labels | `--font-mono` / `fonts.mono`, **8.5** viewBox px, tracking `.06em` (native `0.5`), `--text-faint`, at `polar(R+11)` +3px y; hidden on the minis |
| Title | same mono label, start-anchored at (12, 11) |
| Shape | fill = shape color @ **0.13** (`fillOp`), edge width **2** round-join, vertex dots r **2.8** in the shape color |
| RD-01 gradient | horizontal `linearGradient` `--mint` → `--violet` edge + dots; fill `--accent` @ 0.13 |
| Score (RD-01) | `--font-display` / `fonts.display`, **12px** weight 700, `--text`, end-anchored at (306, 12) |
| Target (RD-02) | all-0.8 pentagon, `--violet`, width 1.6, dash `5 4`, no fill/dots; drawn **under** your shape |
| Ghost (RD-03) | `--text` @ 35% (native `${colors.text}59` — the catalog's white-35%), width 1.5, dash `4 4`, no fill/dots; COHORT pill in `--text-dim` |
| Zone dots (RD-04) | shape stroke `--text` @ 40% (native `${colors.text}66`), fill @ **0.06**; dots `zoneOf(v)`: `≥ 0.62` → `--zone-high`, `≥ 0.38` → `--zone-mid`, else `--zone-low` |
| Trail (RD-06) | per-set opacity `0.3 + 0.25·i`, newest `1` (catalog 30→55→100%); width 1.4, newest 2; no fills; dots + shine on the newest only; pill `'W1 → Wn'` |
| Minis (RD-07) | edge width 1.6, no dots, fill 0.13; frame without labels; `--text-faint` day captions |
| Pills (catalog `tag()`) | rect w `len·5.35+12`, h 13, rx 6.5, fill `--bg-0` @ 78% (native `${colors.bg0}C7` — the catalog's `rgba(8,10,18,0.78)`), stroke = pill color @ 0.35, width 0.8; centered **8px** mono text (tracking `.05em` / native `0.4`); end-anchored at x 304, y 26 (+ 42 for the overlay); x clamps into the padded box |
| Shine | web: duplicate edge, width `w+5`, round-join, opacity **0.45**, `style="filter: blur(5px)"` (the catalog `C.blur`); native: same duplicate at opacity **0.2**, no blur |
| Sizing | fixed `width`/`height` px on both platforms (web `<svg width height>` · native `View {width,height}` + `Svg`), default 320×150 |

## 4. States

Pure render — no hover/press/focus/disabled states, no client hooks (only `useId` for the gradient def).

| State | Behavior |
| --- | --- |
| Default | bare `<RadarChart/>` reproduces the RD-01 catalog card (minus the score, which is opt-in) |
| Empty (`values: []` / `axes: []`) | degenerate paths render nothing — no crash |
| No `compare` | RD-02 falls back to the 80% target pentagon, RD-03 to `values × 0.85` |
| `title: ''` | hides the top-left caption (defaults are the per-variant catalog captions) |
| `score` omitted | no top-right readout (only `balance-radar` ever draws it) |
| Reduced motion | n/a — the family has no animation |

## 5. Web ↔ native parity

**🟡 same API, platform-shaped implementation.** Identical geometry, data model, defaults, zone math, chip math and
draw order (both port the same catalog `frame()`/`shape()`/`draw()`). The real differences:

- **Shine substrate** — web draws a width `w+5` duplicate edge at opacity 0.45 under `filter: blur(5px)` (the
  catalog's `C.blur`); native draws the **same wider duplicate at opacity 0.2 with no blur**, because RN SVG filters
  are unreliable on device (Ring SDD precedent). Softness-only diff; does not block use.
- **Gradient glow color** — with `fillStyle="gradient"` the web glow duplicate is stroked by the gradient itself
  (blur softens it); native substitutes solid `colors.accent` for the duplicate (`glowColor`) since there is no blur
  to soften a hard gradient edge.
- **Label styling channel** — web styles `<text>` via inline `style` (`--font-mono`, `.06em`/`.05em`); native passes
  `fontFamily/letterSpacing` props on `Svg.Text` (`0.5`/`0.4` ≈ the same tracking at 8.5/8px).
- **Container** — web root `<svg role="img" aria-label=…>` + `className`/rest; native `View accessibilityRole="image"`
  + `style` wrapping the `Svg`. Both compute the same accessible name (`{heading}: radar of {axes}`).

## 6. Composition & usage

Standalone chart — composes nothing from the kit; typically placed inside a `Card`/`MetricTile` body. Balance
surfaces: the weekly-review hero wheel, plan-gap (you vs target), privacy-safe cohort compare, factor triage,
the 3-week progress story, and day-by-day mini compares.

```tsx
// web — RD-02: your factors against the 80% plan pentagon
<RadarChart variant="target-overlay" title="YOU VS TARGET"
  values={factors.map((f) => f.score / 100)} />
```

```tsx
// native — RD-06: identical props
<RadarChart variant="weeks-trail" trail={weeks.map((w) => w.factors)}
  title="BALANCE GROWING · 3 WEEKS" />
```

## 7. Accessibility

- **Web:** root `<svg role="img">` with a computed `aria-label` (`"{title}: radar of SLEEP, TRAIN, …"`); pass
  `aria-label` through rest to override with a data-bearing description ("Body balance 72, light is the strong factor").
- **Native:** root `View` with `accessibilityRole="image"` + the same computed `accessibilityLabel`.
- Non-interactive — no focus/keyboard surface. In-chart text scales with the container (8.5 viewBox px ≈ 9.6px at
  360w); keep the chart ≥ ~300px wide or move the conclusion into surrounding real text.
- On `zone-vertices` the verdict is color-only (2.8px dots) — pair it with a caption when the verdict is load-bearing.

## 8. Usage rules — Do / Don't

**Do**
- Normalize factor scores to 0–1 **before** passing them — the component never rescales.
- Pass exactly **one value per axis** (`values.length === axes.length`); the polygon angles come from the value count.
- Order `trail` oldest→newest — the opacity ramp and the vertex dots always favor the **last** entry.
- Override `color` with **tokens only** (`var(--cyan)` / `colors.cyan`).
- Reproduce catalog cards in stories/tests with the seeds in the story files when checking parity.

**Don't**
- Don't pass raw-unit data (hours, scores out of 100) — everything is 0–1 wheel space.
- Don't fake RD-02 by drawing your own dashed pentagon — `compare` + `target-overlay` is the form.
- Don't stuff week history into `compare` — multiple sets are `weeks-trail`'s `trail`, side-by-side days are `series`.
- Don't hardcode hex in `color`, and don't restyle the in-SVG labels/pills per app.

## 9. Anti-patterns & lookalike ban

- **No hand-rolled radars.** Any spider/balance-wheel on a product surface is this component — never a local SVG lookalike.
- **New variant → both platforms.** A new radar form (e.g. a 6-axis rose hybrid) is added here, web + native in the
  same unit of work, with the same prop name — never a one-off in an app.
- **Tokens only** — spectrum/zone/text tokens throughout; the catalog's white-7/35/40% strokes and dark pill fill
  are expressed **through** tokens (`--text` @ 7/35/40%, `--bg-0` @ 78%) inside the component, never in app code.
- **Don't re-derive the geometry** (polar math, R+11 label ring, chip width math, zone thresholds) in app code — the
  component is the single source of the catalog spec.
- **Parity gate:** any change ships only after the web story and the native story are compared side-by-side against
  `radar-charts.html`.
