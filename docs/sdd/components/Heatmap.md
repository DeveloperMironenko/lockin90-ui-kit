# SDD — `Heatmap` (+ `lerpColor` util, `HeatmapCell` type)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Heatmap.tsx` · `packages/ui-native/src/components/Heatmap.tsx` ·
> web CSS `packages/ui/src/styles/components/heatmap.css` (`.lk-heatmap*`).
> **Exports:** `Heatmap`, `lerpColor` (hex-interpolation util), type `HeatmapCell`, type `HeatmapProps`.
> **Status:** Shipped (extended with the catalog heatmap family, HM-01…HM-15). **Parity:** 🟡 same API, math & shared `lerpColor`; **not SVG** — web CSS grid + `color-mix` vs native flex-wrap + rgba; web has hover polish + animated today-pulse (native dot is static).
> **Stories:** `packages/ui/src/stories/Heatmap.stories.tsx` · `packages/ui-native/src/stories/Heatmap.stories.tsx` (catalog stories `HM01HeatGrid` … `HM15TodayRing`, with the catalog's deterministic `gridData` ported).

---

## 1. Overview

A **compact grid/strip of intensity-colored cells**. One primitive covers the legacy shapes (`grid` calendar / `strip` contribution row, `colorFrom→colorTo` ramp) **and** the whole catalog heatmap family:

| Catalog ID | Ask | Props |
| --- | --- | --- |
| HM-01 `heat-grid` | week × hours | 7×16 cells + `rowLabels` + `scale` SELECT: `'zone'` / `'var(--mint)'` / `'spectrum'` |
| HM-03 `streak-year` | GitHub streak | 30 cols, micro `cellSize`, `scale="var(--mint)"` |
| HM-04 `month-cal` | month grid | day-number `label`s + `labelPosition="corner"` + `dayLetters` |
| HM-06 `dot-matrix` | soft density | `dots` (size AND opacity encode the value) |
| HM-07 `glass-grid` | quiet heat | `glass` (glass cells, border opacity = value) |
| HM-08 `gap-aware` | honest gaps | cell `missing: true` → dashed empty slot |
| HM-09 `hour-day` | 24h × 7d | 24 cols + `scale="spectrum"` + `colLabels` hour marks |
| HM-10 `week-strips` | program month | 5×7, `radius={6}`, `rowLabels={['W1'…]}` + `dayLetters` |
| HM-11 `corr-matrix` | correlations | `scale="diverge"` + `showValues` (signed coefficients) + row/col labels |
| HM-12 `diverge-heat` | vs baseline | `scale="diverge"` (mint above 0.5 / coral below, opacity = magnitude) |
| HM-13 `focus-row` | one day's story | `focusRow={i}` (others dim to 22%) |
| HM-14 `value-cells` | scorecard | big cells + `showValues="pct"` (dark text on hot cells) |
| HM-15 `today-ring` | anchored on now | cell `today` + `todayColor="var(--text)"` + `todayPulse` |

**Secondary export `lerpColor(from, to, t)`** is the legacy ramp function (hex → `rgb()`), unchanged. `HeatmapCell` gains `missing` and `display`.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `cells` | `HeatmapCell[]` | 11-day sample | ✓ | ✓ | left→right, top→bottom |
| `columns` | `number` | `7` | ✓ | ✓ | |
| `cellSize` / `gap` | `number` | `28` / `4` | ✓ | ✓ | px |
| `radius` | `number` | grid `--r-sm`/`radii.sm` · strip `4` | ✓ | ✓ | |
| `colorFrom` / `colorTo` | `string` (hex) | `#2B1F5C` / `#34F5C5` | ✓ | ✓ | legacy ramp — **ignored when `scale` is set** |
| `colorScale` | `(t: number) => string` | — | ✓ | ✓ | legacy ramp override |
| `variant` | `'grid' \| 'strip'` | `'grid'` | ✓ | ✓ | layout shape |
| `max` | `number` | `1` | ✓ | ✓ | normalization ceiling |
| `scale` | `'zone' \| 'spectrum' \| 'diverge' \|` color string | — | ✓ | ✓ | catalog fills (§3); a color string = single hue (web `var()`, native **hex**) |
| `rowLabels` | `string[]` | — | ✓ | ✓ | left captions, one per row (40px column) |
| `colLabels` | `{ at: number; label: string }[]` | — | ✓ | ✓ | captions above specific columns |
| `dayLetters` | `boolean \| string` | — | ✓ | ✓ | `true` = `'MTWTFSS'` under the columns |
| `dots` | `boolean` | `false` | ✓ | ✓ | HM-06 circles, `d = cellSize·(0.35 + t·0.65)` |
| `glass` | `boolean` | `false` | ✓ | ✓ | HM-07 `--glass` cells + value-opacity border |
| `focusRow` | `number` | — | ✓ | ✓ | HM-13 — other rows ×0.22 opacity |
| `showValues` | `boolean \| 'pct'` | — | ✓ | ✓ | in-cell mono text: `'pct'` → `round(t·100)`; `true` + diverge → signed `(t−0.5)·2` (1 dp); else `t` (1 dp); `cell.display` overrides |
| `shine` | `boolean` | `false` | ✓ | ✓ | glow on hot cells (`t > 0.78`) |
| `todayColor` | `string` | `var(--accent)` / `colors.accent` | ✓ | ✓ | today ring tint (HM-15 → `--text`) |
| `todayPulse` | `boolean` | `false` | ✓ | ✓ | dot above the today cell (web animates, reduced-motion safe) |
| `labelPosition` | `'center' \| 'corner'` | `'center'` | ✓ | ✓ | HM-04 numerals = `corner` |
| `className` / `style` / _rest_ | | — | web / both / web | | substrate |

**`HeatmapCell`:** `value`, `label?`, `flag?`, `today?`, **`missing?`** (dashed empty slot — never fake zeros), **`display?`** (explicit `showValues` text).

- **Catalog fills (`heatFill`, both platforms):** `zone` → verdict token at `0.25 + t·0.75`; `spectrum` → indigo/violet/cyan/mint by quartile at `0.35 + t·0.65`; `diverge` → mint (≥0.5) / `--zone-low` at `min(1, 0.1 + |t−0.5|·1.7)`; color string → that hue at `0.08 + t·0.92`.
- **Opacity substrate:** web = `color-mix(in srgb, <token> N%, transparent)` (tokens stay tokens); native = `rgba()` from the hex token.
- Legacy path (`scale` unset) renders **exactly as before**.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web | Native |
| --- | --- | --- |
| Layout | CSS grid (`repeat(--hm-cols, --hm-size)`); framed mode wraps in `.lk-heatmap-frame` (3×2 grid: colLabels / rowLabels+cells / letters) | flex-wrap grid; framed mode = column of [colLabels row, row of [labels col, grid], letters row] |
| Axis text | `.lk-heatmap-collabels/-rowlabels/-letters` — 9px `--font-mono` `--text-faint`, rowLabels column 40px right-aligned | `fonts.mono` 9 `colors.textFaint`, `ROW_LABELS_W = 40` |
| Zone/spectrum/diverge fills | tokens via `color-mix` | token hex via `rgba` |
| Dots | `.lk-heatmap-dot` circle inside a transparent cell | inner round `View` |
| Glass | `background: var(--glass)`; `borderColor: color-mix(color, 0.25+t·0.75)` | `colors.glass` + rgba border |
| Missing | `.lk-heatmap-cell--missing` — dashed 1px `--border-2`, no bg, no hover lift | `borderStyle: 'dashed'`, `colors.border2` |
| Hot-cell text | `.lk-heatmap-label--dark` → `--void` when `scale` && `t > 0.55` | `colors.void` |
| Corner numeral | `.lk-heatmap-label--corner` — 8px, top 2 / left 3, white 55% | mirrored |
| Today ring | `--lk-hm-today` var (default `--accent`) border + 1px ring | `todayColor ?? colors.accent` border |
| Today pulse | `.lk-heatmap-pulse` mint dot above + `::after` wave 1.8s (reduced-motion: hidden) | static mint glow dot (shadow) |
| Shine | inline `box-shadow: 0 0 8px color-mix(...)` on `t > 0.78` | shadow props (`shadowRadius 6`, `elevation 4`) |
| Hover | lift + brighten (unchanged) | — |

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Legacy ramp | inline `background` from `lerpColor`/`colorScale` (unchanged) | same |
| Scale fills | token + opacity per §2 | same |
| `missing` | dashed empty slot, no value | same |
| `focusRow` | row full strength, others 22% | same (legacy path dims via cell opacity) |
| `today` / `todayPulse` | ring (+ animated pulse) | ring (+ static dot) |
| `flag` | low-zone ring + dot (unchanged) | same |
| Values | mono text, dark on hot cells | same |

No focus/disabled/loading — presentational.

## 5. Web ↔ native parity

**Verdict: 🟡 same API + math, layout & opacity substrate differ.** Identical props, defaults, `heatFill` thresholds, value-text rules, 40px label column, and the shared `lerpColor`. Differences:

- **Layout primitive:** web CSS grid + a CSS-grid frame; native flex-wrap + stacked Views. Same visual result.
- **Opacity:** web `color-mix` over `var()` tokens; native `rgba()` over hex tokens → native single-hue `scale` strings must be **hex** (like `colorFrom/To`).
- **Today pulse:** web animates the expanding wave (reduced-motion safe); native draws a static glowing dot.
- **Hover (web only):** lift/brighten. Cosmetic.
- **Shine:** box-shadow vs RN shadow props — both a soft halo.

No capability gap — the data render is equivalent.

## 6. Composition & usage

- **Used for:** week/month calendars, streaks, hour×day energy maps, correlation matrices, scorecards, compliance strips.
- **Composes from:** nothing — leaf primitive. Pair with `lerpColor`/`heat` tokens for external legends; wrap in `Card` for a titled panel.

```tsx
// web — HM-09 hour-day (24×7 spectrum with hour marks)
<Heatmap
  cells={hourCells} columns={24} cellSize={10} gap={1.8} radius={2}
  scale="spectrum" rowLabels={DAYS}
  colLabels={[{ at: 0, label: '12A' }, { at: 6, label: '6A' }, { at: 12, label: '12P' }, { at: 18, label: '6P' }]}
/>

// native — HM-11 corr-matrix (diverging + signed values)
<Heatmap cells={corr} columns={5} cellSize={34} gap={3} scale="diverge" showValues
  rowLabels={['SLEEP','HRV','TRAIN','FOOD','MOOD']}
  colLabels={[{ at: 0, label: 'SLP' }, { at: 1, label: 'HRV' }, { at: 2, label: 'TRN' }, { at: 3, label: 'FOOD' }, { at: 4, label: 'MOOD' }]}
/>
```

## 7. Accessibility

- **Web:** the root (grid or frame) has `role="img"`; per-cell `label` doubles as a `title` tooltip; axis rows are `aria-hidden` (decorative duplication) — supply an overall `aria-label` via `...rest` summarizing period/metric.
- **Native:** add an `accessibilityLabel` on a wrapping `View`.
- Dark-on-hot value text (`--void` on ≥55% token fills) keeps in-cell numbers legible; `missing` cells intentionally carry **no** value — don't paint them as zeros.

## 8. Usage rules — Do / Don't

**Do**
- Resolve catalog asks via §1: HM-ID → props row.
- Mark absent data with `missing` (HM-08) — never substitute `value: 0`.
- Set `max` to the true ceiling; use `scale` for token-driven fills, the legacy ramp for bespoke two-color ramps.
- Keep `rowLabels` short (≤6 mono chars — the column is 40px).

**Don't**
- ✗ Don't hand-roll a grid-of-colored-divs, a calendar grid, or a corr-matrix — use `Heatmap`.
- ✗ Don't pass non-hex single-hue `scale` strings on native (web `var()` is fine).
- ✗ Don't fake zeros for sensor gaps — `missing` exists for honesty.
- ✗ Don't rely on hover or the animated pulse for meaning (web-only motion).

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom contribution grid / month calendar / matrix duplicates this primitive — import `Heatmap` and reuse `lerpColor`/`scale`.
- **New need → add to BOTH platforms.** Cell tooltips, a built-in legend, or week-number gutters ship to web and native with the same prop name + tokens.
- **Tokens only.** Scale fills, today/flag/missing colors and axis text come from `@lockin90/tokens`; the legacy ramp ends are shared constants — don't fork per app.
- **Parity gate.** Before shipping, confirm web phone-width ≡ native: same cells, fills, labels, gaps, focus dim, today ring — only hover/pulse motion and the color-literal form may differ.
