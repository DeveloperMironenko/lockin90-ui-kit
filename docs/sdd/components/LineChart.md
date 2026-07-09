# SDD — `LineChart` (+ `LineMarker`, `LineSeries`, `LineLabel`, `GradientStop` types)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/LineChart.tsx` · `packages/ui-native/src/components/LineChart.tsx` ·
> web CSS `packages/ui/src/styles/components/lc.css` (`.lk-lc*`).
> **Exports:** `LineChart`, types `LineMarker`, `LineChartProps` (root index) + `LineChartVariant`,
> `LineCurve`, `LinePattern`, `GradientStop`, `LineSeries`, `LineLabel` (module-level; root index
> re-export pending — index.ts untouched by the charts wave, wire in the program's export pass).
> **Status:** Shipped + extended with the **32 catalog line-chart variants** (charts program W1,
> spec = `lockin90-design/charts/line-charts.html` CFG + `docs/sdd/CHART-MAP.md` §line-charts).
> **Parity:** 🟡 same API & geometry math; web stretch-SVG + CSS glow/blur vs native measured SVG +
> Gaussian-blurred duplicate glow (real RN-SVG Fabric filters); web has `ariaLabel`, native adds a `PAD_X` x-inset.
> **Stories:** `packages/ui/src/stories/LineChart.stories.tsx` · `packages/ui-native/src/stories/LineChart.stories.tsx`
> — one story per catalog ID (`LC01Solid` … `LC56CoachForecast`), reproducing the catalog cards
> (same ported `genData` seeds, `yDomain={[0,1]}`, `height=150`).

---

## 1. Overview

A **generic line / area chart** and the kit's home for the entire line-charts catalog family. Base
behavior (unchanged): a smooth or straight gradient/solid line over a faint area fill and horizontal
grid, round overlay marker dots + tags, x-axis row, optional right y-axis, `band` ribbon and a dashed
forecast tail (`dashedFromIndex`).

`variant?: LineChartVariant` unlocks the 32 catalog forms: solids/gradients (LC-01/09), area veils +
tide-split + glass (LC-15/19/20), curve/dash/weight geometry (LC-21/24/26), neon/halo/echo glow
(LC-28/30/32), bead/comet/peak/now/goal/pin markers (LC-33…38), compare & state series
(LC-39/41/42/43/44), CI/range bands, fans, raw-vs-avg, anomalies, zone ribbons (LC-45…50) and the
forecast heroes (LC-51/52/54/56). A variant is a **preset**: it sets the catalog defaults (color,
weight, fill, markers…); any explicit prop overrides it. **No `variant` → rendering is byte-identical
to the pre-extension component** (Catmull-Rom smoothing, width 3, mint glow, 0.26→0 area fade).

Dots, captions and chip labels are **HTML/View overlays** positioned by percentage (not SVG) so they
stay round/legible despite the stretched SVG. `Sparkline` stays the micro primitive; `PkChart` etc.
are separate families.

### LC-ID → variant + option props (ask-by-ID contract)

| ID | `variant` | Option props (the catalog SELECTs) |
| --- | --- | --- |
| LC-01 | `solid` | `color` (any token) |
| LC-09 | `gradient` | `gradient` (default flux stops) |
| LC-15 | `veil` | `color` (veil fill 26%→2%) |
| LC-19 | `tide-split` | `baseline` (data units; default scale midpoint) |
| LC-20 | `glass-fill` | — (text-dim stroke, flat glass-2 fill) |
| LC-21 | `curve-styles` | `curve: 'smooth' \| 'linear' \| 'step'` |
| LC-24 | `dash-dot` | `pattern: 'dashed' \| 'dotted'` |
| LC-26 | `stroke-weight` | `weight: 1 / 2.5 / 4.5`, `color` |
| LC-28 | `neon` | `color` (7px glow) |
| LC-30 | `aurora-halo` | — (flux stroke + 12px accent-55% halo) |
| LC-32 | `ghost-echo` | `echo` (default 2 copies +7/+14px at 19%/10%) |
| LC-33 | `bead-chain` | `dots='all'` preset; n≤16 only |
| LC-34 | `comet-head` | `dots='end'` + `pulse` preset |
| LC-35 | `peak-flag` | `peaks` preset (auto PEAK/DIP) |
| LC-36 | `now-split` | `now` (data index), `nowLabel` |
| LC-37 | `goal-line` | `goal` (data units), `goalLabel` |
| LC-38 | `event-pins` | `pins: number[]` (data indices) |
| LC-39 | `multi-compare` | `series` (1–2 extra; defaults violet/lime) |
| LC-41 | `you-vs-cohort` | `series[0]` = cohort (defaults text-35% dashed 1.8px) |
| LC-42 | `ghost-prev` | `series[0]` = previous period (same hue 28%) |
| LC-43 | `calibrating-taper` | `taper` (data index), `taperLabel` |
| LC-44 | `delta-ribbon` | `series[0]` + `ribbon` preset (accent-12% fill) |
| LC-45 | `confidence-veil` | `band` (CI gradient 16%→3% + 25% edge) |
| LC-46 | `forecast-fan` | `now` + `fan` (accent 20%→2% widening fill) |
| LC-47 | `range-band` | `band` (violet 14%→3% + 30% edge lines) |
| LC-48 | `raw-vs-avg` | — (raw 1px text-16% + 5-pt moving avg 2.6px) |
| LC-49 | `anomaly-spark` | `anomalyThreshold` (default 14% of y-span) |
| LC-50 | `zone-ribbon` | — (`zoneStroke` preset, y-mapped zone gradient 3px) |
| LC-51 | `day-fade` | — (x-time gradient mint→lime→amber→coral + shine) |
| LC-52 | `forecast-horizon` | `now`, `fan`, `labels`, `futureColor` (past mint / future violet + pulse) |
| LC-54 | `zone-forecast` | `now`, `fan`, `labels` (zone stroke + neutral fan + `yEnds`) |
| LC-56 | `coach-forecast` | `now`, `series` (counterfactual + recommended context lines) |

The catalog anchors positions as **fractions**; the kit takes **data indices** (`now`, `taper`,
`pins`, `labels[].index` — compute `Math.round(frac * (n − 1))`). Values (`goal`, `baseline`,
`anomalyThreshold`, `band`/`fan` arrays) are in **data units** on the shared y-scale — pass
`yDomain` (e.g. `[0, 100]`) whenever absolute meaning matters (zone strokes, goals, baselines).

## 2. API contract

Legacy props (`data`, `axis`, `color`, `gradient`, `area`, `smooth`, `height`, `markers`, `grid`,
`yAxis`, `yTicks`, `band`, `dashedFromIndex`, web `ariaLabel`/`className`/rest, native `style`) are
unchanged — see the table; **nothing was renamed or removed**.

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `variant` | `LineChartVariant` | — | ✓ | ✓ | catalog preset; explicit props override |
| `data` | `number[]` | 16-pt demo curve | ✓ | ✓ | y-values on the shared scale |
| `axis` | `string[]` | `['9am'…'9pm']` | ✓ | ✓ | x labels; `[]` hides the row |
| `color` | `string` | preset ?? mint | ✓ | ✓ | web `var(--x)` / native `colors.x` |
| `gradient` | `string[] \| GradientStop[]` | preset | ✓ | ✓ | even spread, or explicit offsets (LC-51) |
| `area` | `boolean` | legacy on / variant preset | ✓ | ✓ | with a variant, `true` = veil fill |
| `smooth` | `boolean` | `true` | ✓ | ✓ | back-compat; prefer `curve` |
| `curve` | `'smooth'\|'linear'\|'step'` | `'smooth'` | ✓ | ✓ | LC-21; monotone-cubic when variant/curve set |
| `pattern` | `'solid'\|'dashed'\|'dotted'` | `'solid'` | ✓ | ✓ | LC-24 (dashed `7 5` / dotted `0.1 6.5` round-cap) |
| `weight` | `number` | variant 2.5 / legacy 3 | ✓ | ✓ | LC-26 |
| `shine` | `boolean` | preset | ✓ | ✓ | glow underlay: web blurred dup / native wider dup |
| `yDomain` | `[number, number]` | auto (min..max) | ✓ | ✓ | pins the y-scale |
| `height` | `number` | `180` | ✓ | ✓ | plot height px (= viewBox height) |
| `markers` | `LineMarker[]` | — | ✓ | ✓ | legacy 11px overlay dots + tags |
| `grid` / `yAxis` / `yTicks` | | `true` / `false` / derived | ✓ | ✓ | unchanged |
| `band` | `{upper,lower,color?}` | — | ✓ | ✓ | legacy solid 14%; restyled by LC-45/47 variants |
| `fan` | `{upper,lower,color?}` | — | ✓ | ✓ | full-length arrays; drawn from `now` (LC-46/52/54) |
| `dashedFromIndex` | `number` | — | ✓ | ✓ | legacy dashed tail (`6 6`); `now`/`taper` win if both |
| `now` / `nowPulse` / `nowLabel` | `number`/`boolean`/`string` | —/preset/`'NOW'` | ✓ | ✓ | rule + dot + split (future `5 5` @.75) |
| `taper` / `taperLabel` | `number`/`string` | —/`'CALIBRATING'` | ✓ | ✓ | solid→dashed, tag, no rule (LC-43) |
| `goal` / `goalLabel` | `number`/`string` | —/`'GOAL'` | ✓ | ✓ | dashed zone-mid rule + mint dots above (LC-37) |
| `baseline` | `number` | scale midpoint | ✓ | ✓ | tide-split midline (LC-19) |
| `pins` | `number[]` | — | ✓ | ✓ | 16px stems + accent glow heads (LC-38) |
| `series` | `LineSeries[]` | — | ✓ | ✓ | extra lines; per-variant style defaults |
| `ribbon` | `boolean` | preset | ✓ | ✓ | fill data↔series[0] accent-12% (LC-44) |
| `labels` | `LineLabel[]` | — | ✓ | ✓ | chip-pill annotations |
| `dots` | `'all'\|'end'\|'none'` | preset | ✓ | ✓ | LC-33/34 |
| `pulse` | `boolean` | preset | ✓ | ✓ | end-dot pulse ring |
| `peaks` | `boolean` | preset | ✓ | ✓ | auto PEAK/DIP (LC-35) |
| `anomalies` / `anomalyThreshold` | `boolean`/`number` | preset / 14% span | ✓ | ✓ | LC-49 |
| `zoneStroke` | `boolean` | preset | ✓ | ✓ | y-mapped zone gradient (userSpaceOnUse) |
| `yEnds` | `boolean` | preset | ✓ | ✓ | `100`/`0` captions (LC-54/56) |
| `futureColor` | `string` | preset | ✓ | ✓ | post-`now` stroke + fan tint (LC-52) |
| `echo` | `number` | preset | ✓ | ✓ | ghost copies (LC-32) |
| `ariaLabel` | `string` | — | ✓ | — | **web only** — `<svg aria-label>` |
| `className` / rest | | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only (wrapper) |

**`LineSeries`:** `{ data, color?, weight?=2, pattern?, dash?, opacity?, curve?, label?, labelIndex?,
labelDy?=-12, fromIndex? }` — shares the x/y scale; `fromIndex` offsets the series to start at that
main-data x slot. **`LineLabel`:** `{ index, text, color?, dy?=-12 }`. **`GradientStop`:**
`{ offset, color }`.

- **Scale:** y spans `data ∪ band ∪ fan ∪ series[].data ∪ {goal, baseline}` (never clips), or the
  explicit `yDomain`. Inverted mapping, `PAD_Y = 14`, identical both sides.
- **Smoothing:** no variant/curve → legacy Catmull-Rom (tension 1/6, byte-identical). Variant or
  `curve` set → **Fritsch–Carlson monotone cubic** — an exact port of the catalog's `smoothPath`
  (secant slopes, zero tangents at sign changes, τ = 3/√(α²+β²) limiter, h = Δx/3 control points).
  `step` = step-after (`stepPath`), `linear` = polyline.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web | Native |
| --- | --- | --- |
| Main line | preset color/gradient/zone-url, weight per preset, round caps | same |
| Legacy line glow | `.lk-lc-line` `drop-shadow(0 0 8px rgba(52,245,197,.35))` — legacy only; variants use `.lk-lc-stroke` (no glow) | — |
| Neon / halo (LC-28/30) | inline `drop-shadow(0 0 7/12px color-mix(color 80/55%, transparent))` | **Gaussian-blurred duplicate path** `w+2` @ preset alpha, `FeGaussianBlur` stdDev `r/2` (`userSpaceOnUse` region) |
| Shine | `.lk-lc-shine` dup `w+5`, blur 5px, opacity .45 | dup `w+5`, `FeGaussianBlur` stdDev 2.5, opacity .45 |
| Zone stroke | `userSpaceOnUse` v-gradient `--zone-high` 0% / `--zone-mid` 52% / `--zone-low` 100% | same, `colors.zone*` |
| Veil fill (LC-15) | v-fade `color` .26 → .02 (legacy: .26 → 0) | same |
| Glass fill (LC-20) | flat `var(--glass-2)` | `colors.glass2` |
| Tide-split (LC-19) | mint .28→.02 above / zone-low .02→.26 below via clipPaths, 2.2px clipped strokes, dashed `3 4` text-18% baseline | same (ClipPath/Rect) |
| CI band (LC-45) | v-grad .16→.03 + edge `strokeOpacity .25` w.7 | same |
| Range band (LC-47) | v-grad .14→.03 + smooth edge lines `.3` w1 | same |
| Fan (LC-46/52/54) | h-grad `fanColor` .20→.02 from `now` | same |
| Delta ribbon (LC-44) | `var(--accent)` fillOpacity .12 | `colors.accent` |
| NOW rule | `var(--text)` strokeOpacity .22 w1 (SVG line) | same |
| GOAL rule | `var(--zone-mid)` dash `5 4` opacity .8 | same |
| Echoes (LC-32) | translate(0, +7·e), opacity .28 − .09·e | same |
| Variant dots | `.lk-lc-vdot` overlays: bead 5.2 / goal-hit + pin-base 4.4 / peak + anomaly 6.4 / pin-head 6 / now + comet 7.2 px; glow = `box-shadow 0 0 6px currentColor` | Views, glow = `shadowColor/Radius 6` |
| Pulse ring | `.lk-lc-pulse` 1.8s scale 1→3 / .8→0, `prefers-reduced-motion` → static | `Animated.loop`, same timings |
| Notes | `.lk-lc-note` `--font-mono` 8.5px | `fonts.mono` 8.5 |
| Chips | `.lk-lc-chip` mono 8px, pill, `color-mix(var(--bg-0) 78%)` bg + currentColor-35% border | `colors.bg0` bg + 1px tinted border |
| Grid / axis / y-ticks / marker dot+tag / gutter | unchanged from base spec | unchanged |

- **Chip labels edge-clamp (both platforms, identical helper):** `chipAlign(x, text)` estimates the pill width
  (`text.length × 5.35 + 12`) and returns `'end'` when the right half would cross `VB_W = 560`, `'start'` when
  the left half would cross `0`, else `'center'` — so chips near the viewBox edges hug inward instead of
  clipping. Web maps the align to a CSS transform (`translate(-100%/0/-50%)`); native to a zero-size anchor
  `View` with `alignItems: 'flex-end' / 'flex-start' / 'center'`.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Legacy (no variant) | byte-identical pre-extension render | same |
| Variant preset | catalog look; explicit props override | same |
| Solid / forecast tail | `now`/`taper` split (`5 5` @.75) or legacy `dashedFromIndex` (`6 6` class) | same |
| Bands / fan / ribbon | drawn behind the line, per-variant styling | same |
| Calibrating | solid→dashed at `taper` + top tag | same |
| Pulse | animated ring; reduced-motion → static faint ring | Animated loop |
| Pre-measure (native) | n/a | SVG not drawn until `canvasW > 0` |

No hover/focus/disabled — presentational.

## 5. Web ↔ native parity

**Verdict: 🟡 same API & geometry math, substrate-shaped rendering.** Identical props/defaults on
both sides, the same monotone/Catmull/step math, split/band/fan/ribbon construction, preset tables
(web `var(--x)` ↔ native `colors.x`) and overlay sizes. Differences:

- **SVG sizing:** web fixed `viewBox 0 0 560 h` + `preserveAspectRatio="none"`; native measures via
  `onLayout`. Native insets x by `PAD_X = 14` (round caps/dots don't clip) — cosmetic x-shift.
- **Glow/shine:** web = CSS `drop-shadow` / `blur(5px)` duplicate; native = a **Gaussian-blurred duplicate
  path** via real RN-SVG Fabric filters (`<Filter filterUnits="userSpaceOnUse"><FeGaussianBlur>`, padded
  user-space regions so thin strokes don't clip — see CONVENTIONS.md). Visually equivalent halos.
- **Pulse:** CSS keyframes + `prefers-reduced-motion` (web) vs `Animated.loop` (native, no OS
  reduce-motion hook — kit-wide precedent, see DotsLoader).
- **Text/chips:** HTML spans vs zero-size anchor Views centering absolute children (Yoga static
  position); GOAL right-caption alignment may differ by ~1px.
- **`ariaLabel`** web only; **gutter** 40px web / 36px native. No capability gap.

## 6. Composition & usage

- **Used for:** every line-chart in the product — energy day-curve heroes (LC-52/54/56 on the today
  screen), goal/habit tracking (LC-37), cohort compare (LC-41), projections (LC-45/46/47).
- **Composes from:** nothing — leaf primitive. Pair with `Stat`/`DeltaPill`; `Sparkline` for micro
  trends.

```tsx
// web — LC-46 energy projection on a real 0–100 scale
<LineChart
  variant="forecast-fan"
  data={scores}                    // 34 points, 0–100
  yDomain={[0, 100]}
  now={nowIndex}
  fan={{ upper: fanHi, lower: fanLo }}
  ariaLabel="Energy forecast for today"
/>

// native — LC-41 you-vs-cohort
<LineChart
  variant="you-vs-cohort"
  data={you}
  series={[{ data: cohort }]}
  yDomain={[0, 100]}
/>
```

## 7. Accessibility

- **Web:** `<svg role="img">` + `ariaLabel` — always describe the trend AND the annotation story
  ("energy rising to a 2pm peak, forecast declining after now"). Overlay captions are real text
  (screen-reader visible); the pulse honors `prefers-reduced-motion`.
- **Native:** wrap in a `View accessibilityRole="image"` + `accessibilityLabel`.
- Zone/day-fade strokes encode meaning in color — variants pair color with position/labels
  (yEnds 100/0, NOW/GOAL captions) so color is never the only channel.

## 8. Usage rules — Do / Don't

**Do**
- Ask for charts **by catalog ID** — the LC table above maps every ID to `variant` + props.
- Pass `yDomain` whenever values have absolute meaning (scores 0–100, zone strokes, goals).
- Convert catalog fractions to data indices (`Math.round(frac * (n − 1))`) for `now`/`taper`/`pins`.
- Give `fan.upper/lower` full-length arrays (pre-`now` values are ignored — sliced at `now`).
- Use `series` + variant defaults for compare charts; override per-series only when the design says so.

**Don't**
- ✗ Don't hand-roll a line/area SVG or a lookalike variant — extend THIS component on both platforms.
- ✗ Don't hardcode colors — presets are tokens; overrides must be tokens (`var(--x)` / `colors.x`).
- ✗ Don't hand-tune the native glow filters — the blurred-duplicate pattern (region padding + stdDev) is the kit-wide contract (CONVENTIONS.md).
- ✗ Don't put demo/synthetic data in app code — real data via props (synthetic generators live in
  the stories only).
- ✗ Don't rely on auto-scale for zone-gradient variants — the zone mapping needs `yDomain`.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** All 32 catalog line forms live HERE — a new line-chart look means a new
  `variant` on **both** platforms (same prop names, tokens), never a local SVG.
- **Variant = preset, props = SELECTs.** When a catalog card offers a SELECT (color/curve/weight…),
  the matching prop is the selector — don't fork a second variant for a color change.
- **Back-compat is contractual.** Existing app usage (no `variant`) must keep rendering identically;
  never change legacy defaults when adding variants.
- **Parity gate.** Before shipping a screen, confirm web phone-width and native render the same
  curve, fills, rules, dots, chips and captions — only the documented substrate differences
  (PAD_X inset, glow technique, gutter px) may differ.
