# SDD — `DistributionChart`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/DistributionChart.tsx` · `packages/ui-native/src/components/DistributionChart.tsx` ·
> web CSS `packages/ui/src/styles/components/dist.css` (`.lk-dst*`).
> **Exports:** `DistributionChart`, types `DistributionChartProps`, `DistributionChartVariant`, `DistributionBell`, `BoxRow`, `RidgeRow`.
> **Status:** Shipped. **Parity:** 🟡 same API & geometry; web `shine` is a CSS `blur(5px)` underlay + CSS-animated YOU pulse ring, native draws a wider faint duplicate stroke + static dot/halo ring (RN SVG filters/SMIL are unreliable on device).
> **Stories:** `packages/ui/src/stories/DistributionChart.stories.tsx` (`Charts/DistributionChart`) · `packages/ui-native/src/stories/DistributionChart.stories.tsx` (`Native/DistributionChart`).

---

## 1. Overview

The **catalog distribution family** (`lockin90-design/charts/distribution-charts.html`, DS-01…DS-07) — "where you sit in the spread": six variants drawn in a fixed **320×150 viewBox** with mono catalog labels and chip-pill tags. `histogram` (default) bins raw samples into opacity-ramped bars; `bell-percentile` is THE percentile chart (bell + veil fill + mint YOU rule + pill); `cohort-bells` overlays your curve on a dashed cohort curve (privacy-safe compare); `box-rows` stacks horizontal box-whisker rows for science/admin surfaces; `violin` shapes a symmetric KDE violin (two-peak days visible) with a MEDIAN rule; `ridgeline` stacks drifting week-curves whose opacity ramps to newest. Curves can be **parametric** (`bell` / `ridge[].bell`, `mu`/`sigma` in normalized 0–1 x units) or **derived from raw `values`** (histogram bins, mean/std bell, Gaussian-KDE violin/ridge profiles with Silverman bandwidth) normalized into `xRange`. The catalog page's dead `candles` renderer has no CFG card, so **there is no DS-06** — unported by design.

**Catalog-ID mapping** (story names carry the IDs):

| ID | `variant` | Data props |
| --- | --- | --- |
| DS-01 | `histogram` | `values` + `bins` + `xRange` + `axisLabels` |
| DS-02 | `bell-percentile` | `bell` or `values` + `percentile` + `youLabel` + `caption` |
| DS-03 | `cohort-bells` | `bell`/`values` + `cohortBell` + `youLabel`/`cohortLabel` |
| DS-04 | `box-rows` | `rows: BoxRow[]` |
| DS-05 | `violin` | `values` (KDE) + `medianLabel` |
| DS-07 | `ridgeline` | `ridge: RidgeRow[]` + `driftLabel` |

## 2. API contract

Same prop API on both platforms; only the container props are platform-shaped.

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `variant` | `DistributionChartVariant` | `'histogram'` | ✓ | ✓ | DS-01 … DS-07 (no DS-06) |
| `values` | `number[]` | catalog sample (seed 11; violin seed 21 bimodal) | ✓ | ✓ | raw samples — binned (`histogram`), mean/std bell (`bell-percentile`/`cohort-bells`), KDE (`violin`) |
| `bins` | `number` | `14` | ✓ | ✓ | `histogram` bin count |
| `xRange` | `[number, number]` | data min…max, else `[40, 100]` | ✓ | ✓ | sample domain; drives `norm()` for every derived shape |
| `axisLabels` | `[string, string]` | rounded `xRange` ends | ✓ | ✓ | `histogram` x-end captions |
| `bell` | `DistributionBell` | derived from `values`, else catalog card | ✓ | ✓ | parametric YOUR curve (`bell-percentile` `{0.5, 0.2}` / `cohort-bells` `{0.6, 0.16}`) |
| `cohortBell` | `DistributionBell` | `{mu 0.42, sigma 0.22, amp 0.7}` | ✓ | ✓ | `cohort-bells` dashed reference curve |
| `percentile` | `number` | `0.72` | ✓ | ✓ | YOU-rule x, 0–1 (`bell-percentile`) |
| `youLabel` | `string` | `'YOU · P82'` / `'YOU · SHIFTED RIGHT'` | ✓ | ✓ | YOU pill; per-variant catalog default |
| `cohortLabel` | `string` | `'COHORT'` | ✓ | ✓ | cohort pill (`cohort-bells`) |
| `caption` | `string` | — | ✓ | ✓ | bottom-center faint caption (`bell-percentile`); catalog card uses `'HRV DISTRIBUTION · YOUR 90 DAYS'` |
| `rows` | `BoxRow[]` | catalog ENERGY/HRV/SLEEP/STRAIN rows | ✓ | ✓ | `box-rows` only |
| `ridge` | `RidgeRow[]` | catalog W1…W4 drifting gaussians | ✓ | ✓ | `ridgeline` only, oldest first |
| `medianLabel` | `string` | `` `MEDIAN ${round(median(values))}` `` | ✓ | ✓ | `violin` pill |
| `driftLabel` | `string` | `'PEAK SHIFTING RIGHT'` | ✓ | ✓ | `ridgeline` top-right pill; `''` hides |
| `color` | `string` | per-variant (see §3) | ✓ | ✓ | main hue override; solidifies the violin gradient |
| `title` | `string` | — | ✓ | ✓ | top-left mono caption |
| `shine` | `boolean` | `false` | ✓ | ✓ | glow underlay behind the bell line + YOU pulse marker (`bell-percentile`; underlay also on `cohort-bells`) |
| `grid` | `boolean` | `true` | ✓ | ✓ | catalog hairline grid — histogram / bell / cohort / violin only (box/ridge never grid, per catalog) |
| `ariaLabel` | `string` | `'Distribution chart'` | ✓ | ✓ | web `aria-label` / native `accessibilityLabel` |
| `className` | `string` | — | ✓ | — | web only, merged onto `.lk-dst` |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only, container style |
| _rest_ | `Omit<HTMLAttributes<HTMLDivElement>, 'title' \| 'children'>` | — | ✓ | — | spreads to the root `<div>`; HTML `title` attr repurposed as the caption prop |

**`DistributionBell`** — `{ mu: number; sigma: number; amp?: number }`: normalized x units (0–1 across the plot); `amp` = peak height as a fraction of plot height (default 0.85; ignored by `ridge` rows — peaks normalize).
**`BoxRow`** — `{ name, min, q1, median, q3, max, color? }`: all five stats 0–1; `color` falls back to the catalog cycle `--mint → --cyan → --violet → --zone-mid`.
**`RidgeRow`** — `{ label, values?, bell? }`: raw `values` are KDE-shaped, else the parametric `bell` (default `{0.5, 0.16}`).

Both sides use `useId()` for gradient ids (veil / violin / per-ridge fills) — multiple instances never collide.

## 3. Visual spec (tokens — never hardcode)

Geometry is the catalog's, in viewBox units: `W 320 · H 150 · pad l10 r12 t16 b14 · plot 298×120`. Bell y: `y(t) = (H−14) − amp·120·exp(−((t−mu)/sigma)²)`, monotone-smoothed (Fritsch–Carlson, the catalog `smoothPath`).

| Element | Spec (both platforms) |
| --- | --- |
| Default hues | histogram `--mint` · bell-percentile `--cyan` · cohort-bells + violin `--violet` (violin fill = `--violet`→`--cyan` @ 0.35 horizontal gradient) · ridgeline `--mint`; YOU rule/pill always `--mint` |
| Grid | 3 interior hairlines at 25/50/75% `--border` @ strokeOpacity 0.55 + baseline `--border` full (catalog's white .05/.09 token-mapped) |
| Labels | `--font-mono` / `fonts.mono`, **8.5** viewBox px, `.06em` (native `0.5`) — title/axis/caption `--text-faint`, box names in row color |
| Chip-pill tag | rect `w = len·5.35 + 12`, h 13, rx 6.5 — fill `--bg-0` @ 78% (web `color-mix`, native `` `${colors.bg0}C7` ``), stroke = tag color @ 0.35, width 0.8; centered 8px mono text; x clamped inside the padded box |
| Histogram (DS-01) | bar `x = 10 + bi·step + 2`, `w = step − 4`, rx 3, `opacity = 0.35 + 0.6·(count/max)`, max height `plot − 8`; zero bins skipped |
| Bell (DS-02) | veil = area under the curve, vertical gradient color 0.22 → 0.02; line 2.5px round cap; YOU rule `--mint` 1.6px from `t+6` to baseline; pill at `t+12` |
| Cohort (DS-03) | cohort curve `--text` @ 0.35, 1.8px, dash `5 4`; YOUR curve 2.5px; pills at 32% / 68% of the plot |
| Box rows (DS-04) | row pitch `120/n`; whisker line `--text` @ 0.25, caps @ 0.35 (±4px); IQR rect h 14, rx 4, fill @ 0.3 + 1.2px stroke; median 2px, ±7px |
| Violin (DS-05) | KDE at 41 samples, peak-normalized to `plotH/2 − 8`; outline 1.4px in the main hue; MEDIAN rule `--text` 1.6px ±26px; pill `--text-dim` at `cy − 36` |
| Ridgeline (DS-07) | rows at `base = 16 + 26 + ri·28`, curve height 30px, x from `l+30` to `plot−6`; per-row vertical fill color 0.02→0.2; stroke 1.5px `opacity = 0.5 + ri·0.16`; W-labels end-anchored `--text-faint` |
| Shine | web `.lk-dst-shine` → `filter: blur(5px)` on a 7.5px round-cap duplicate @ 0.45; native duplicate 7.5px @ `strokeOpacity 0.45`, no blur |
| YOU pulse (shine) | core dot r 3.6 `--mint` (+ web `drop-shadow(0 0 5px var(--mint))`); web ring animated by `.lk-dst-pulse` (scale 1→3, fade .8→0, 1.8s, `transform-box: fill-box`; reduced-motion → static @ 0.35); native static halo ring r 7 @ 0.4 |
| Sizing | web `.lk-dst-svg`: `width 100%; height auto; overflow visible`; native root `width '100%', aspectRatio 320/150` |

Deterministic defaults are catalog ports: mulberry32 seed 11 → 200 avg-of-4 draws scaled into 40–100 (DS-01); seed 21 → bimodal mix ≈ the catalog's 0.45/0.75 violin peaks (DS-05).

## 4. States

Pure render — no hover/press/focus/disabled states; the only client behavior is the web pulse animation.

| State | Behavior |
| --- | --- |
| Default | draws the chosen variant from `values`/`bell`/`rows`/`ridge` (catalog defaults) |
| Derived-from-data | `values` present → bell `mu = norm(mean)`, `sigma = max(std/span, 0.04)`; violin KDE bandwidth `max(0.02, 1.06·σ·n^−0.2)`; histogram indices clamped into range |
| Empty (`rows: []` / `ridge: []`) | renders grid/title only — no rows, no crash; `values: []` yields flat profiles |
| `grid: false` | hairlines off (box-rows/ridgeline never draw them regardless) |
| Reduced motion (web) | `.lk-dst-pulse` freezes to a static ring @ opacity 0.35 |

## 5. Web ↔ native parity

**🟡 same API, platform-shaped implementation.** Identical geometry, data derivation (same mulberry32/KDE/monotone ports), colors and pill layout. The real differences:

- **Shine substrate** — web blurs the wide duplicate (`.lk-dst-shine`, catalog `C.blur`); native draws it un-blurred at the same width/opacity (RN SVG filters unreliable). Halo softness differs marginally.
- **YOU pulse substrate** — web ring animates via CSS (reduced-motion safe); native shows a **static dot + halo ring** (r 7 @ 0.4 — the `Ring` precedent, documented in-file). No SMIL/JS loop on native by design.
- **Label styling channel** — web styles `<text>` via `.lk-dst-label`/`.lk-dst-tag` (dist.css); native passes `fontSize/fontFamily/letterSpacing` props on `Svg.Text` (`0.5`/`0.4` ≈ `.06em`/`.05em`).
- **Pill fill** — web `color-mix(in srgb, var(--bg-0) 78%, transparent)` vs native `` `${colors.bg0}C7` `` (same 78%).
- **Container** — web `div.lk-dst[role=img]` + `className`/rest; native `View accessibilityRole="image"` + `style` with `aspectRatio`.

## 6. Composition & usage

Standalone chart — composes nothing from the kit; typically placed inside a `Card`/`MetricTile` body. Percentile stories ("where you sit"), cohort compares, science/admin range panels, week-over-week drift.

```tsx
// web — DS-02 percentile card from real samples
<DistributionChart
  variant="bell-percentile"
  values={hrvHistory}
  xRange={[40, 100]}
  percentile={0.82}
  youLabel="YOU · P82"
  title="WHERE YOU SIT"
  caption="HRV DISTRIBUTION · YOUR 90 DAYS"
/>
```

```tsx
// native — identical props (DS-04 metric ranges)
<DistributionChart
  variant="box-rows"
  title="METRIC RANGES · 30D"
  rows={[
    { name: 'ENERGY', min: 0.3, q1: 0.45, median: 0.58, q3: 0.7, max: 0.88, color: colors.mint },
    { name: 'HRV', min: 0.2, q1: 0.38, median: 0.5, q3: 0.62, max: 0.8, color: colors.cyan },
  ]}
/>
```

## 7. Accessibility

- **Web:** root `<div role="img" aria-label={ariaLabel}>`; the `<svg>` is `aria-hidden` — pass a data-bearing `ariaLabel` ("Your HRV sits at the 82nd percentile of your 90 days").
- **Native:** root `View` with `accessibilityRole="image"` + `accessibilityLabel={ariaLabel}`.
- Non-interactive — no focus/keyboard surface. In-chart text scales with the container (8.5 viewBox px ≈ 9.6px at 360w); keep ≥ ~300px wide or restate the number in surrounding real text.
- The web pulse respects `prefers-reduced-motion`; native is static by construction.
- Color is not the only channel: the YOU rule + pill carry the percentile as text, box rows print their names, the ridge pill states the drift.

## 8. Usage rules — Do / Don't

**Do**
- Pass raw samples in their real units with an explicit `xRange` — the component normalizes; `axisLabels` then match the domain for free.
- Use `bell-percentile` for you-vs-your-history, `cohort-bells` for you-vs-others (it's the privacy-safe compare — curves only, no individual points).
- Give `bell` explicitly when the backend already computed the distribution — don't ship 10k samples to derive `mu`/`sigma` client-side.
- Order `ridge` rows oldest → newest — the opacity ramp (0.5 → 1) encodes recency.
- Override colors with **tokens only** (`var(--violet)` / `colors.violet`).

**Don't**
- Don't mix domains: `values`, `bell.mu`/`sigma` (0–1) and `xRange` must describe the same scale.
- Don't use `shine` outside the bell variants — the pulse/glow is a `bell-percentile` (+ `cohort-bells` underlay) affordance by catalog design.
- Don't ask for candles (DS-06) — the catalog has no such card; the family intentionally omits it.
- Don't hardcode hex in `color`/`rows[].color`, and don't restyle `.lk-dst-label`/`.lk-dst-tag` per app.

## 9. Anti-patterns & lookalike ban

- **No hand-rolled distributions.** Any histogram, percentile bell, cohort overlay, box plot, violin or ridgeline on a product surface is this component — never a local SVG lookalike.
- **New variant → both platforms.** A new distribution form is added here, web + native in the same unit of work, with the same prop names — never a one-off in an app.
- **Tokens only** — spectrum/zone/text/border tokens throughout; the catalog's raw whites are `--text`/`--border` + opacity inside the component, never re-derived in app code.
- **Substrate diffs stay documented, not widened** — don't bolt SVG filters or a JS pulse loop onto native; the diffs in §5 are the accepted contract.
- **Parity gate:** any change ships only after the web story and the native story are compared side-by-side against `distribution-charts.html`.
