# SDD — `BulletChart`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/BulletChart.tsx` · `packages/ui-native/src/components/BulletChart.tsx` ·
> web CSS `packages/ui/src/styles/components/bullet.css` (`.lk-bullet*`).
> **Exports:** `BulletChart`, types `BulletChartProps`, `BulletChartVariant`, `BulletRow`.
> **Status:** Shipped. **Parity:** 🟡 same API & look; `shine` blurs the duplicate bar on both — web `filter: blur(4px)`, native `FeGaussianBlur stdDeviation 2` (real RN-SVG filters).
> **Stories:** `packages/ui/src/stories/BulletChart.stories.tsx` (`Charts/BulletChart`) · `packages/ui-native/src/stories/BulletChart.stories.tsx` (`Native/BulletChart`).

---

## 1. Overview

The **catalog bullet family** (`lockin90-design/charts/bullet-charts.html`, BL-01/02/05) for product surfaces: **actual vs target vs range in one compact bar** — the KPI-row workhorse. Three variants drawn in a fixed **320×150 viewBox** with mono catalog labels. Each row stacks three translucent range bands, lays a slim value bar over them, drops a white target tick through — and when the value exceeds the scale, a **magenta overflow segment continues PAST the scale end** (the value label clears it).

| Catalog ID | Props | Card |
| --- | --- | --- |
| BL-01 `bullets` | `variant="bullets"` (default) + `rows` · SELECT `density` (16px/13px), `zoneColoring` | range bands + slim value bar + white target tick; over-target overflows magenta |
| BL-02 `single-bullet` | `variant="single-bullet"` + `rows[0]` (+`bandLabels`/`note`) | one large bullet with the anatomy labeled: LOW/OK/GOOD + TARGET pill + value |
| BL-05 `over-bullets` | `variant="over-bullets"` + `rows[].note` | the over-limit story: magenta overflow + OVER pills |

## 2. API contract

Same prop API on both platforms; only the container props are platform-shaped.

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `variant` | `'bullets' \| 'single-bullet' \| 'over-bullets'` | `'bullets'` | ✓ | ✓ | BL-01 / 02 / 05 |
| `rows` | `BulletRow[]` | catalog demo per variant (MACROS / protein / kcal+sodium) | ✓ | ✓ | `single-bullet` draws the first row only |
| `density` | `'default' \| 'compact'` | `'default'` | ✓ | ✓ | BL-01 SELECT — 16px rows 34 apart vs 13px rows 28 apart (compact draws no derived caption) |
| `zoneColoring` | `boolean` | `false` | ✓ | ✓ | BL-01 SELECT — bar color = attainment zone (`value/target`: ≥1.3 → `--zone-low` · ≥0.85 → `--zone-high` · else `--zone-mid`) instead of the metric tokens |
| `bandLabels` | `[string, string, string]` | `['LOW','OK','GOOD']` | ✓ | ✓ | `single-bullet` anatomy words under the bands |
| `note` | `string` | `'TARGET 160G'` (only with the default row) | ✓ | ✓ | `single-bullet` TARGET pill above the tick; `''` hides |
| `caption` | `string` | derived | ✓ | ✓ | bottom explainer; `bullets` derives `'TICK = DAILY TARGET · MAGENTA = OVER'` (or the zone/shine wording), `single-bullet` derives from `bandLabels`; `''` hides |
| `title` | `string` | — | ✓ | ✓ | top-left mono caption (`'MACROS · TODAY'`) |
| `shine` | `boolean` | `false` | ✓ | ✓ | soft glow underlay under each value bar (catalog glow modifier) |
| `ariaLabel` | `string` | `'Bullet chart'` | ✓ | ✓ | web `aria-label` / native `accessibilityLabel` |
| `className` | `string` | — | ✓ | — | web only, merged onto `.lk-bullet` |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only, container style |
| _rest_ | `Omit<HTMLAttributes<HTMLDivElement>, 'title' \| 'children'>` | — | ✓ | — | spreads to the root `<div>` |

**`BulletRow`** — `{ label; value; max?; target?; ranges?; color?; display?; displayColor?; note? }`:
- `value` / `max` — the actual and the scale end (`max` default `1` for ready-made fractions; pass real units — `value: 132, max: 150` grams). `value > max` triggers the magenta overflow.
- `target` — the white tick, same units.
- `ranges` — `[low, ok]` band boundaries, same units; default `[0.45, 0.75]·max`.
- `color` — value-bar token; defaults cycle `--mint` → `--cyan` → `--violet` → `--indigo` (overridden by `zoneColoring`).
- `display` / `displayColor` — the right value text (`'132/150G'`), default `--text-dim`.
- `note` — the `over-bullets` OVER pill text (`'OVER +180 KCAL'`).

## 3. Visual spec (tokens — never hardcode)

Geometry is the catalog's, in viewBox units: `W 320 · H 150 · pad l10 r12 t16 b14`; bar box `BX 78 · BW 174` (labels left of it, values right of it).

| Element | Spec (both platforms) |
| --- | --- |
| Range bands | three stacked full-height pills (rx `h/2`), all `--text`: full scale at fillOpacity **0.045**, `[0..ok]` at **0.05**, `[0..low]` at **0.06** (the catalog's translucent whites; the base band ≡ `--glass`) |
| Value bar | height `h·0.44`, rx `bh/2`, from `BX`, width `min(value/max, 1)·BW`, in the row color |
| Overflow | `value > max`: a separate segment at `BX+BW+2`, width `min(frac−1, 0.11)·BW`, fill `--magenta`; the value label shifts right past it |
| Target tick | vertical 2px `--text` at strokeOpacity **0.85**, overshooting the band ±2.5 |
| Row heights | `default` 16 (rows y 40 + i·34) · `compact` 13 (y 34 + i·28) · single 22 (y 66) · over 20 (y 56 + i·48) |
| Labels | `--font-mono` / `fonts.mono`, **8.5** viewBox px, letter-spacing `.06em` (native `0.5`); row labels end-anchored at `BX−8` in `--text-dim`; values start-anchored after the box; captions/band words `--text-faint` |
| Anatomy (BL-02) | band words centered under each band's midpoint at y 92; TARGET pill above the tick at y 34 in `--text-dim`; caption at y 118 |
| OVER pills (BL-05) | catalog `tag()` chips in `--magenta` at `BX+BW−10`, alternating above (−26) / below (+26) the row |
| Chip pills | rect w `len·5.35+12`, h 13, rx 6.5, fill `--bg-0` at 78%, tinted hairline 0.35/0.8px, centered 8px mono text; x clamped to `[P.l−4, W−P.r−w+4]` |
| Shine | duplicate bar inflated 2px each way at opacity 0.5 — web `.lk-bullet-shine` (`blur(4px)`); native the same rect at 0.5, Gaussian-blurred (`FeGaussianBlur stdDeviation 2`) |
| Sizing | web `.lk-bullet-svg`: `width 100%; height auto; overflow visible`; native root: `width '100%', aspectRatio 320/150` |

## 4. States

Pure render — no hover/press/focus/disabled states, no client hooks.

| State | Behavior |
| --- | --- |
| Default | the catalog demo rows for the chosen variant |
| Empty (`rows: []`) | title (+ derived caption on `bullets`) only — no rows, no crash; `single-bullet` renders nothing but the title |
| On/under target | no overflow segment; value label sits at `BX+BW+8` |
| Over the scale (`value > max`) | magenta overflow (capped at 11% of the scale) + shifted value label |
| No `target` | no tick; `zoneColoring` falls back to the row color; the BL-02 TARGET pill is skipped |
| Negative value | clamps to 0 (empty bar) |
| `caption=''` / `note=''` | the explainer / pill is hidden |
| Row overflow | rows lay out downward; the 150-high box fits 3 default / 4 compact / 2 over rows — keep within that |

## 5. Web ↔ native parity

**🟡 same API, platform-shaped implementation.** Identical geometry, band math, attainment thresholds, overflow behavior and label layout — both compute from the same catalog constants and share the private `Bullet` row renderer shape. The real differences:

- **Shine substrate** — web blurs the duplicate bar (`.lk-bullet-shine`, `filter: blur(4px)`, opacity 0.5); native Gaussian-blurs the same duplicate at 0.5 via `FeGaussianBlur stdDeviation 2` in a padded `userSpaceOnUse` region (see CONVENTIONS.md).
- **Label styling channel** — web styles `<text>` via `.lk-bullet-label` / `.lk-bullet-tag`; native passes `fontSize/fontFamily/letterSpacing` props on `Svg.Text`.
- **Container** — web `div[role=img]` + `className`/rest; native `View accessibilityRole="image"` + `style`.

## 6. Composition & usage

Standalone chart — composes nothing from the kit; typically placed inside a `Card` body or a KPI row. Macro trackers, daily-goal stacks (steps/kcal/water/sleep), limit stories (kcal, sodium, caffeine), single-KPI detail/teaching views.

```tsx
// web — BL-01 with real units
<BulletChart title="MACROS · TODAY"
  rows={[
    { label: 'PROTEIN', value: 132, max: 150, target: 120, ranges: [75, 120], display: '132/150G' },
    { label: 'CARBS', value: 155, max: 250, target: 200, ranges: [125, 200], display: '155/250G' },
    { label: 'FAT', value: 78, max: 70, target: 56, ranges: [35, 56], display: '78/70G' },
  ]} />
```

```tsx
// native — identical props (BL-05)
<BulletChart variant="over-bullets" title="OVER TARGET"
  rows={[
    { label: 'KCAL', value: 2380, max: 2200, target: 1800, display: '2380', note: 'OVER +180 KCAL' },
    { label: 'SODIUM', value: 2.8, max: 2.4, target: 1.7, display: '2.8G', note: 'OVER +0.5G' },
  ]} />
```

## 7. Accessibility

- **Web:** root `<div role="img" aria-label={ariaLabel}>`; the `<svg>` is `aria-hidden` (in-SVG text is decorative). Pass a data-bearing `ariaLabel` ("Macros today: protein 132 of 150g on target, fat 78g over the 70g limit").
- **Native:** root `View` with `accessibilityRole="image"` + `accessibilityLabel={ariaLabel}`.
- Non-interactive — no focus/keyboard surface. In-chart text scales with the container; keep charts ≥ ~300px wide or move critical numbers into surrounding real text.
- Color is not the only channel: over-target is signaled by geometry (the overflow past the scale end) and pills/values, not just magenta; every row is labeled + numbered.

## 8. Usage rules — Do / Don't

**Do**
- Pass real units via `max` (`value: 132, max: 150`) — bands, tick and overflow all normalize together; `display` carries the human-formatted text.
- Use `zoneColoring` when the question is "on plan?" across mixed metrics, metric tokens when each row IS a known metric.
- Use `compact` density for ≥4 rows; keep `default` for the 3-row macro card.
- Put limit metrics in `over-bullets` with per-row `note` pills — the magenta overflow is the story.

**Don't**
- Don't clamp values yourself — over-target MUST overflow past the scale end (that's the family's signature); pre-clamping hides the story.
- Don't use `ranges` as min/max bounds — they are the LOW/OK band boundaries under the bar, not the scale.
- Don't exceed the row budget (3 default / 4 compact / 2 over) — rows run off the fixed 150-high viewBox.
- Don't hardcode hex in `color`/`displayColor`, and don't restyle `.lk-bullet-*` per app.

## 9. Anti-patterns & lookalike ban

- **No hand-rolled bullets.** Any actual-vs-target KPI bar with range bands on a product surface is this component — never a local `ProgressBar` + tick hack or raw SVG lookalike.
- **New variant → both platforms.** A new bullet form (e.g. a delta-bullet) is added here, web + native in the same unit of work, with the same prop name — never a one-off in an app.
- **Tokens only** — zone/spectrum/text/magenta tokens throughout; the bands are `--text` at the documented opacities, the tick `--text` at 0.85 (no raw hex in app code, ever).
- **Don't repurpose `--magenta`** — in this family magenta means *over the limit*, nothing else; keep the semantic.
- **Parity gate:** any change ships only after the web story and the native story are compared side-by-side against `bullet-charts.html`.
