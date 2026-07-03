# SDD — `CompositeChart`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/CompositeChart.tsx` · `packages/ui-native/src/components/CompositeChart.tsx` ·
> no web CSS partner — all styling is inline SVG attributes (`.lk-composite` on the root is a bare hook class, like `.lk-daywheel`).
> **Exports:** `CompositeChart`, types `CompositeChartProps`, `CompositeChartVariant`, `CompositeTreemapItem`, `CompositeHorizonRow`, `CompositeGoalNode` — **not yet re-exported from either `src/index.ts`** (the charts-program export wave lands separately).
> **Status:** Built. **Parity:** 🟡 same API & geometry; every `shine` glow is `blur()` on web vs a wider faint duplicate shape on native.
> **Stories:** `packages/ui/src/stories/CompositeChart.stories.tsx` (`Charts/CompositeChart`) · `packages/ui-native/src/stories/CompositeChart.stories.tsx` (`Native/CompositeChart`).

---

## 1. Overview

The **catalog composite family** (`lockin90-design/charts/composite-charts.html`, CM-01/03/05/07; CM-02/04/06 are numbering gaps) — density + structure charts that pack many numbers into one compact **320×150** canvas: the time-budget **treemap**, the many-metrics **horizon rows**, the **calendar of micro-charts** and the **goal tree** of linked rings. Values are 0–1 (goal rings 0–100, treemap shares in %). With no data props each variant renders its catalog card (the defaults carry the page's `TREE` split, wave-11/22/33/44 ×40 horizon rows, seed `r·7+c+5` calendar days and the 74 → 80/55/90 goal tree).

Catalog-ID mapping:

| Catalog ID | `variant` | SELECT props (defaults = the card) |
| --- | --- | --- |
| CM-01 treemap | `'treemap'` (default) | `items` ×6 · `coloring: 'time' \| 'zone'` · `shine` glows tiles > 20% |
| CM-03 horizon-rows | `'horizon-rows'` | `rows` ×4 · `mode: 'absolute' \| 'deviation'` · `legend` caption |
| CM-05 calendar-micro | `'calendar-micro'` | `days` ×28 · `cell: 'spark' \| 'bars'` · `weekLabels 'MTWTFSS'` |
| CM-07 goal-tree | `'goal-tree'` | `root` + `branches` ×3 · `shine` glows the root ring |

## 2. API contract

Same prop API on both platforms; only the container props are platform-shaped.

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `variant` | `'treemap' \| 'horizon-rows' \| 'calendar-micro' \| 'goal-tree'` | `'treemap'` | ✓ | ✓ | CM-01 / CM-03 / CM-05 / CM-07 |
| `items` | `CompositeTreemapItem[]` | catalog `TREE` ×6 | ✓ | ✓ | `{label, value %, color?}` — see layout note in §3 |
| `coloring` | `'time' \| 'zone'` | `'time'` | ✓ | ✓ | CM-01 SELECT: own hues / share verdicts (> 20% high · > 10% mid · else low) |
| `rows` | `CompositeHorizonRow[]` | catalog 4 × 40 | ✓ | ✓ | `{label, color?, values 0–1[]}` — any row count/length |
| `mode` | `'absolute' \| 'deviation'` | `'absolute'` | ✓ | ✓ | CM-03 SELECT: raw values / folded `\|v − 0.5\|·2` vs baseline |
| `days` | `number[][]` | catalog 28 seeded days | ✓ | ✓ | one 0–1 series per day, 7 per row; **the default depends on `cell`** (wave ×10 for spark, noisy ×6 for bars — the two catalog cards) |
| `cell` | `'spark' \| 'bars'` | `'spark'` | ✓ | ✓ | CM-05 SELECT: micro-chart kind, zone-colored |
| `weekLabels` | `string` | `'MTWTFSS'` | ✓ | ✓ | one letter per column under the grid |
| `root` | `CompositeGoalNode` | ENERGY 74 mint | ✓ | ✓ | `{label, value 0–100, color?}` — chip above, value centered |
| `branches` | `CompositeGoalNode[]` | catalog 3 | ✓ | ✓ | child rings; x spread `70 … W−70` (single child centers) — **not `children`** (React reserves it) |
| `legend` | `string` | per-mode derived | ✓ | ✓ | horizon bottom-right caption; `''` hides |
| `title` | `string` | per-variant | ✓ | ✓ | top-left mono caption |
| `shine` | `boolean` | `false` | ✓ | ✓ | treemap hero tiles (> 20%) / goal-tree root glow (no-op on horizon + calendar) |
| `width` / `height` | `number` | `320` / `150` | ✓ | ✓ | rendered px — the viewBox scales to fit |
| `className` | `string` | — | ✓ | — | web only, merged onto `.lk-composite` |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only, container style |
| _rest_ | `Omit<SVGProps<SVGSVGElement>, 'width' \| 'height' \| 'children' \| 'mode'>` | — | ✓ | — | spreads to the root `<svg>` (the SVG `mode` attr is repurposed as the horizon SELECT) |

## 3. Visual spec (tokens — never hardcode)

Geometry is the catalog's, in viewBox units (`W 320 · H 150 · pad l10 r12 t16 b14`).

| Element | Spec (both platforms) |
| --- | --- |
| Labels / chips | `--font-mono` 8.5 (chips 8, day numerals 6.5), tracking `.06em`/`.05em` (native `0.5`/`0.4`), `--text-faint`; chip = rect h13 rx6.5 `rgba(8,10,18,0.78)` (`--bg-0` @ 78%) + tinted hairline @ 0.35 |
| Treemap tiles | rounded rects rx6, 1.5 inset, **fill = tile color @ 0.28 + stroke 1.2 @ 0.8** (the "28% fills + tinted borders"); big tiles (> 52×24) get name (tile color) + `value%` (`--text-dim`); mid tiles (> 34 wide) a centered 4-char name |
| Treemap layout | **6 items → the catalog's fixed slice-and-dice template** (`TREE_SLOTS`, big left column + right stack), k-th largest item → k-th largest slot; **any other count → generic alternating slice-and-dice** (split the longer axis by value share) |
| Treemap zone coloring | `value > 20` → `--zone-high`, `> 10` → `--zone-mid`, else `--zone-low` (share thresholds in %, NOT the 0–1 `zoneOf`) |
| Horizon rows | row pitch `plotH/n`, band height pitch−8; **two stacked layers** of the same polygon-area — layer 0 opacity 0.22 (values 0–0.5), layer 1 opacity 0.57 (0.5–1 folded down); end-anchored row label at x 50 in the row color; baseline `white-10%`; plot x `56 … 302` |
| Horizon deviation | per-point `\|v − 0.5\|·2` before folding — distance from baseline, direction discarded (the caption says so) |
| Calendar grid | 7 columns × `ceil(n/7)` rows, 4px gaps, cells rx5 `white-3%` + stroke `white-10%`; day numeral top-left `white-40%`; weekday letters at the bottom |
| Calendar cells | spark: monotone smooth 1.4 round, stroke `zoneOf(last)` · bars: width 60% of slot, rx1, fill `zoneOf(v)` @ 0.85; `zoneOf`: ≥ 0.62 high / ≥ 0.38 mid / low |
| Goal tree | root ring r14 w4.5 at (160, 38) — track `white-10%` + round-cap arc `root.color`; center `round(value)` 10px display 700; child rings r12 w4 at y 92, centers 8.5px mono; bezier connectors `white-18%` 1.4 (`C x 68, kx 62`); chips above root (y 14) / below children (y 116) |
| Shine | web `blur(6px)` duplicates — hero tiles @ 0.5, root circle r15 @ 0.5; native wider duplicates without blur — tiles +3px rx8 @ 0.22, root circle r19 @ 0.25 |

## 4. States

Pure render — no hover/press/focus/disabled states, no client hooks.

| State | Behavior |
| --- | --- |
| Default | bare `<CompositeChart variant="…"/>` reproduces the catalog card |
| Empty (`items: []` / `rows: []` / `days: []` / `branches: []`) | frame + captions render — no marks, no crash (a lone `branches` entry centers) |
| Non-6 treemap counts | generic slice-and-dice layout (documented divergence from the fixed card template) |
| Oversized values | goal `value` clamps 0–100; horizon/calendar values are expected 0–1 (folding clamps each layer) |
| `legend=''` / `root.label=''` | hides the caption / root chip |
| Reduced motion | fully static — nothing animates on either platform |

## 5. Web ↔ native parity

**🟡 same API, platform-shaped implementation.** Identical geometry, layout algorithms (template + fallback), zone thresholds, defaults and the same seeded default data (both port the catalog PRNG). The real differences:

- **Shine substrate** — web `blur(6px)` glow duplicates; native **wider faint duplicates** (tiles inflated 3px, root ring r19) because RN SVG filters are unreliable on device.
- **Container** — web `svg[role=img]` + `className`/SVGProps rest; native `View accessibilityRole="image"` wrapping `Svg` + `style`.
- **Label styling channel** — web inline `style={{ fontFamily, letterSpacing }}`; native `fontFamily/letterSpacing` props on `Svg.Text`.

## 6. Composition & usage

Standalone chart — composes nothing from the kit; typically a `Card` body. Reach for it when **many numbers must share one small canvas**: the week's time budget, an admin wall of metrics, a month at a glance, the goal→habits rollup. For a single metric's trend use `LineChart`; for one month of single values use `Heatmap month-cal`; for plain rings use `Ring`.

```tsx
// web — CM-01: real time budget, zone verdicts
<CompositeChart items={budget.map((b) => ({ label: b.name.toUpperCase(), value: b.pct }))}
  coloring="zone" title="WHERE THE WEEK WENT" />
```

```tsx
// native — CM-07: identical props
<CompositeChart variant="goal-tree"
  root={{ label: 'ENERGY 80 BY DAY 90', value: energyScore, color: colors.mint }}
  branches={habits.map((h) => ({ label: h.name.toUpperCase(), value: h.compliancePct, color: colors.cyan }))} />
```

## 7. Accessibility

- **Web:** root `<svg role="img">` with a computed per-variant `aria-label` (e.g. `"GOAL → HABITS: ENERGY 80 BY DAY 90, 3 habits"`). Override via `aria-label` in rest.
- **Native:** root `View` with `accessibilityRole="image"` + the same computed label.
- Non-interactive — no focus/keyboard surface; fully static (reduced-motion safe).
- These are **density** charts: in-cell text runs 6.5–8.5 viewBox px — keep the rendered width ≥ ~320px or move the conclusion into surrounding real text. Zone color is the only per-cell channel on `calendar-micro` and `coloring="zone"` — pair with a caption when the verdict is load-bearing.

## 8. Usage rules — Do / Don't

**Do**
- Give the treemap **percent** values that sum to ~100 (they're drawn as `value%`), and prefer exactly 6 tiles — that's the catalog template.
- Normalize horizon/calendar data to 0–1 before passing; keep rows the same length and days in calendar order (index 0 = day 1, 7 per row).
- Use `mode="deviation"` when the story is "how far from baseline", not "how high" — and keep the derived caption (it explains the folding).
- Give goal-tree values 0–100 (they're also the center readouts); uppercase the chip labels like the catalog.
- Override colors with **tokens only** (`var(--violet)` / `colors.violet`).

**Don't**
- Don't feed the treemap raw hours/minutes — convert to % shares first.
- Don't use `coloring="zone"` thresholds for anything but share verdicts — 0–1 zone encoding belongs to the calendar cells (`zoneOf`).
- Don't exceed ~6 horizon rows or ~35 calendar days — bands/cells drop below legibility at catalog scale.
- Don't draw month single-value grids with `calendar-micro` — that's `Heatmap month-cal`; this one is for a **chart per day**.
- Don't hardcode hex in `items[].color`/`rows[].color`/node colors.

## 9. Anti-patterns & lookalike ban

- **No hand-rolled composites.** Any treemap/horizon/calendar-of-charts/goal-ring-tree on a product surface is this component — never a local SVG lookalike.
- **New composite form → both platforms.** A new density layout (e.g. a sunburst, a matrix of rings) is added here (or as a new mapped family), web + native in the same unit of work, same prop names — never a one-off in an app.
- **Tokens only** — spectrum/zone/text tokens throughout; the internal alphas (tile fill 28%, band layers 22/57%, cell glass 3%, connectors 18%) live **inside** the component.
- **Don't re-derive the layout** (TREE_SLOTS template, horizon fold math, cell pitch, ring radii 14/12 at (160, 38)/(x, 92)) in app code — the component is the single source of the catalog spec.
- **Parity gate:** any change ships only after the web story and the native story are compared side-by-side against `composite-charts.html`.
