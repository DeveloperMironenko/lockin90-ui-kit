# SDD — `UnitChart`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/UnitChart.tsx` · `packages/ui-native/src/components/UnitChart.tsx` ·
> web CSS `packages/ui/src/styles/components/unitchart.css` (`.lk-unit*`).
> **Exports:** `UnitChart`, types `UnitChartProps`, `UnitChartVariant`, `UnitSegment`, `UnitPictogramRow`, `UnitPictogramIcon`, `UnitHabitRow`.
> **Status:** Shipped. **Parity:** 🟡 same API & look; the UN-01 TODAY pulse animates on web (CSS ring) but is a static duplicate halo on native, and `shine` blurs on web vs a wider faint duplicate on native.
> **Stories:** `packages/ui/src/stories/UnitChart.stories.tsx` (`Charts/UnitChart`) · `packages/ui-native/src/stories/UnitChart.stories.tsx` (`Native/UnitChart`).

---

## 1. Overview

The **catalog unit/waffle family** (`lockin90-design/charts/unit-charts.html`, UN-01…UN-05) for product surfaces: percentages and streaks as **countable units** — every dot is a day, a dose, a session. Five variants drawn in a fixed **320×150 viewBox** with mono catalog labels, a top-right display-face stat and derived captions. `waffle-90` is THE program waffle (90 dots, filled fill ramps toward today, TODAY pulses lime).

| Catalog ID | Props | Card |
| --- | --- | --- |
| UN-01 `waffle-90` | `variant="waffle-90"` (default) + `total`/`done`/`columns` | 90 dots (15×6) · fill ramps toward today · lime TODAY pulse + caption |
| UN-02 `waffle-share` | `variant="waffle-share"` + `segments` | 10×10 squares partitioned by zone colors + dot legend |
| UN-03 `pictogram-rows` | `variant="pictogram-rows"` + `rows` | icon rows (dumbbell/moon/cup glyphs) · done 100% vs remaining 18% + counts |
| UN-04 `day-dots` | `variant="day-dots"` + `days` | 7 big 10px dots · done = fill + dark check · pending outline + day letters + pill |
| UN-05 `habit-grid` | `variant="habit-grid"` + `habits` | 3 habit rows × 7 day dots, each row its own hue |

## 2. API contract

Same prop API on both platforms; only the container props are platform-shaped.

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `variant` | `'waffle-90' \| 'waffle-share' \| 'pictogram-rows' \| 'day-dots' \| 'habit-grid'` | `'waffle-90'` | ✓ | ✓ | UN-01 / 02 / 03 / 04 / 05 |
| `total` | `number` | `90` | ✓ | ✓ | `waffle-90` — total dots (one per program day) |
| `done` | `number` | `56` | ✓ | ✓ | `waffle-90` — days completed; dot index `done` is TODAY (pulses lime) |
| `columns` | `number` | `15` | ✓ | ✓ | `waffle-90` — grid columns; rows derive as `ceil(total/columns)`; dots fill column-major |
| `color` | `string` | `'var(--mint)'` / `colors.mint` | ✓ | ✓ | `waffle-90` fill / `day-dots` dot color (token) |
| `segments` | `UnitSegment[]` | catalog GOOD 52 / OK 31 / ROUGH 17 | ✓ | ✓ | `waffle-share` grid shares (values sum to ≤100; leftover cells stay faint) |
| `rows` | `UnitPictogramRow[]` | catalog TRAINING / SLEEP 8H+ / NO-CAFF trio | ✓ | ✓ | `pictogram-rows` tallies |
| `days` | `(boolean \| 0 \| 1)[]` | `[1,1,1,1,1,0,0]` | ✓ | ✓ | `day-dots` — 7 day flags, Monday first |
| `dayLabels` | `string` | `'MTWTFSS'` | ✓ | ✓ | one char per day, under `day-dots` / `habit-grid` dots |
| `habits` | `UnitHabitRow[]` | catalog MEDITATE / LIFT / SUNLIGHT | ✓ | ✓ | `habit-grid` rows |
| `title` | `string` | — | ✓ | ✓ | top-left mono caption (`'90-DAY LOCK-IN'`); omit → none |
| `stat` | `string` | derived | ✓ | ✓ | top-right mint display stat; `waffle-90` derives `'62%'` from done/total; `''` hides |
| `caption` | `string` | derived | ✓ | ✓ | bottom faint line; `waffle-90` derives `'EACH DOT = A DAY · 56 OF 90 LOCKED IN'`; `''` hides |
| `note` | `string` | derived | ✓ | ✓ | `day-dots` chip-pill (`'5 OF 7 · ON TRACK'` — derived from flags); `''` hides |
| `shine` | `boolean` | `false` | ✓ | ✓ | soft glow underlays (catalog glow modifier) — every 7th filled UN-01 dot / behind each on UN-04 dot |
| `ariaLabel` | `string` | `'Unit chart'` | ✓ | ✓ | web `aria-label` / native `accessibilityLabel` |
| `className` | `string` | — | ✓ | — | web only, merged onto `.lk-unit` |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only, container style |
| _rest_ | `Omit<HTMLAttributes<HTMLDivElement>, 'title' \| 'children' \| 'color'>` | — | ✓ | — | spreads to the root `<div>`; HTML `title`/`color` attrs are repurposed as props |

**`UnitSegment`** — `{ label: string; value: number; color?: string }`: one `waffle-share` share; `value` = cell count of 100 (segments fill the grid in order); color defaults cycle `--mint` → `--zone-mid` → `--zone-low`.

**`UnitPictogramRow`** — `{ label; total; done; icon?; iconPath?; color? }`: one tally row; `icon` = built-in `'dumbbell' | 'moon' | 'cup'` glyph (24×24 stroke paths from the catalog), `iconPath` = custom 24×24 stroke path override; colors default cycle `--cyan` → `--violet` → `--zone-mid`; icons default cycle dumbbell → moon → cup.

**`UnitHabitRow`** — `{ label; days: (boolean|0|1)[]; color? }`: one `habit-grid` row; hue defaults cycle `--mint` → `--cyan` → `--lime`.

## 3. Visual spec (tokens — never hardcode)

Geometry is the catalog's, in viewBox units: `W 320 · H 150 · pad l10 r12 t16 b14 · plot 298×120`.

| Element | Spec (both platforms) |
| --- | --- |
| Title / captions / day letters / counts | `--font-mono` / `fonts.mono`, **8.5** viewBox px, letter-spacing `.06em` (native `0.5`); title + captions `--text-faint`, tally labels `--text-dim`, counts in the row color |
| Stat readout | `--font-display` / `fonts.display`, **12px / 700**, `--mint`, top-right at (`W−P.r−2`, 12) |
| UN-01 grid | `columns` (15) × derived rows; gap 4; dot Ø `(298−30−4·(cols−1))/cols` ≈ 14.1; origin (`P.l+16`, `P.t+10`); filled = `color` at opacity `0.5 + 0.5·(i/done)` (the ramp), pending = `--glass-2`; TODAY (index `done`) = `--lime` pulse dot r 3.6 |
| UN-02 grid | 10×10 cells 9.8px, gap 3, rx 2, opacity 0.9, centered block +20 right; unassigned cells `--glass-2`; legend dots r 4 at x 226, rows 22 apart, mono `'GOOD 52'` in `--text-dim` |
| UN-03 rows | rows 34 apart from `P.t+16`; label right-aligned at `P.l+74`; glyphs at `P.l+86 + u·26`, `scale(0.9)`, stroke 1.8 round, done opacity 1 / remaining **0.18**; count `done/total` after the row in the row color |
| UN-04 strip | 7 dots r 10 at y `H/2+4`, x `P.l+34 + u·38`; done = fill `color` + dark check (`--bg-0`, stroke 2); pending = outline `--border-2` (catalog white-20%); day letters +24 below; chip-pill top-right |
| UN-05 board | rows 30 apart from `P.t+18`; label right-aligned at `P.l+64` in the row hue; dots r 8 at `P.l+78 + d·30`, on = fill hue opacity 0.9 / off = outline `--border-2`; day letters at `H−4` |
| Chip-pill (`note`) | catalog `tag()`: rect w `len·5.35+12`, h 13, rx 6.5, fill `--bg-0` at 78% (web `fillOpacity`, native alpha), tinted hairline stroke `0.35`/0.8px, centered 8px mono text; x clamped to `[P.l−4, W−P.r−w+4]` |
| Pulse (UN-01 TODAY) | web `.lk-unit-pulsecore` (drop-shadow 5px currentColor) + `.lk-unit-pulsering` (r 3.6 → ×3.05, fade 0.8→0 over 1.8s, reduced-motion → hidden); native = static core r 3.6 + halo ring r 7 at strokeOpacity 0.4 |
| Shine | web `filter: blur(4–5px)` faint duplicate circles (opacity 0.5); native wider faint duplicate at opacity 0.35 — never SVG filters |
| Sizing | web `.lk-unit-svg`: `width 100%; height auto; overflow visible`; native root: `width '100%', aspectRatio 320/150` |

## 4. States

Pure render — no hover/press/focus/disabled states, no client hooks.

| State | Behavior |
| --- | --- |
| Default | draws the chosen variant with the catalog demo data |
| Done = 0 (`waffle-90`) | all dots pending; TODAY pulse sits on dot 0; stat `'0%'` |
| Done ≥ total (`waffle-90`) | all dots filled; no TODAY pulse (index `done` is off-grid) |
| Segments < 100 (`waffle-share`) | leftover cells render faint `--glass-2` |
| Empty arrays | `rows: []` / `habits: []` render just the frame labels; `days: []` renders the pill `'0 OF 0 · ON TRACK'` unless `note` overrides |
| `stat=''` / `caption=''` / `note=''` | the respective annotation is hidden |

## 5. Web ↔ native parity

**🟡 same API, platform-shaped implementation.** Identical geometry, ramp math, hue cycles and label layout (both compute from the same catalog constants). The real differences:

- **TODAY pulse** — web animates the expanding ring via `.lk-unit-pulsering` CSS (and honors `prefers-reduced-motion`); native draws a **static duplicate halo** (r 7 ring at 0.4) because there is no cheap RN way to run the CSS pulse without Animated. Reads the same at a glance; motion differs.
- **Shine substrate** — web blurs the duplicate (`filter: blur(4–5px)`); native draws the same duplicate **unblurred and fainter** (0.35 vs 0.5) — the `Ring` glow precedent; RN SVG filters are unreliable on device.
- **Label styling channel** — web styles `<text>` via `.lk-unit-label` / `.lk-unit-tag` / `.lk-unit-stat`; native passes `fontSize/fontFamily/letterSpacing` props on `Svg.Text`.
- **Container** — web `div[role=img]` + `className`/rest; native `View accessibilityRole="image"` + `style`.

## 6. Composition & usage

Standalone chart — composes nothing from the kit; typically placed inside a `Card`/`MetricTile` body. The 90-day program hero (today screen), day-quality share cards, weekly habit tallies and the mini habit board.

```tsx
// web — UN-01, the program waffle
<UnitChart total={90} done={dayIndex} title="90-DAY LOCK-IN" />
```

```tsx
// native — identical props (UN-05)
<UnitChart variant="habit-grid" title="HABITS × DAYS"
  habits={[
    { label: 'MEDITATE', days: [1, 1, 0, 1, 1, 1, 0] },
    { label: 'LIFT', days: [1, 0, 1, 0, 1, 0, 0] },
  ]} />
```

## 7. Accessibility

- **Web:** root `<div role="img" aria-label={ariaLabel}>`; the `<svg>` is `aria-hidden` (in-SVG text is decorative). Pass a data-bearing `ariaLabel` ("90-day program: 56 of 90 days locked in").
- **Native:** root `View` with `accessibilityRole="image"` + `accessibilityLabel={ariaLabel}`.
- The pulse ring is decorative and disabled under `prefers-reduced-motion` on web.
- Non-interactive — no focus/keyboard surface. In-chart text scales with the container; keep charts ≥ ~300px wide or move critical numbers into surrounding real text.
- Color is not the only channel: done units also differ by fill/check/opacity, and every share/row is labeled with words + counts.

## 8. Usage rules — Do / Don't

**Do**
- Use `waffle-90` for the program (one dot per day, `done` = days completed — TODAY derives from it), `waffle-share` for percentages as countable units, `day-dots` for one habit's week, `habit-grid` for several.
- Keep `segments` values summing to ≤ 100 — they are cell counts, not fractions.
- Override hues with **tokens only** (`var(--lime)` / `colors.lime`); pass custom pictograms as 24×24 stroke paths via `iconPath`.
- Hide derived annotations with `''` (`stat=''`, `caption=''`, `note=''`) when the surrounding card already states them.

**Don't**
- Don't pass percentages to `done`/`total` — they are unit counts; the stat percent derives.
- Don't use `columns` to force a row count — rows derive; change `total`/`columns` together.
- Don't hand-position a "today" marker — dot index `done` IS today.
- Don't hardcode hex in `color` overrides, and don't restyle `.lk-unit-*` per app.

## 9. Anti-patterns & lookalike ban

- **No hand-rolled waffles.** Any dot-grid progress, pictogram tally or habit dot-board on a product surface is this component — never a local SVG/flexbox lookalike.
- **New variant → both platforms.** A new unit form (e.g. a month waffle) is added here, web + native in the same unit of work, with the same prop name — never a one-off in an app.
- **Tokens only** — spectrum/zone/glass/border tokens throughout; the pending-dot white-8% is `--glass-2`, the check stroke is `--bg-0` (no raw hex in app code, ever).
- **Parity gate:** any change ships only after the web story and the native story are compared side-by-side against `unit-charts.html`.
