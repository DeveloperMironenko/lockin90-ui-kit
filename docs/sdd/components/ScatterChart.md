# SDD — `ScatterChart`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/ScatterChart.tsx` · `packages/ui-native/src/components/ScatterChart.tsx` ·
> web CSS `packages/ui/src/styles/components/scatter.css` (`.lk-sct*`).
> **Exports:** `ScatterChart`, types `ScatterChartProps`, `ScatterPoint`, `ScatterChartVariant`.
> **Status:** Shipped. **Parity:** 🟡 same API & geometry; the TODAY pulse is an animated CSS ring + `drop-shadow` on web vs a static dot + faint halo ring on native, and `shine` is CSS `drop-shadow` vs a wider faint duplicate circle (RN SVG filters are patchy).
> **Stories:** `packages/ui/src/stories/ScatterChart.stories.tsx` (`Charts/ScatterChart`) · `packages/ui-native/src/stories/ScatterChart.stories.tsx` (`Native/ScatterChart`).

---

## 1. Overview

The **catalog scatter/bubble family** (`lockin90-design/charts/scatter-charts.html`, SC-01…SC-07) — the correlation explorer ("what moves what") for product surfaces. Points arrive **normalized 0–1** on both axes and are drawn as dots in the fixed **320×150 viewBox** with mono axis captions and the catalog grid; seven variants layer the analytical furniture on top: a dashed `--cyan` least-squares fit with a **computed R² pill**, third-variable bubbles with dark rims and a size key, a dashed quadrant decision map, zone-verdict dot colors, a dimmed-history TODAY lime pulse, and a dense 40%-opacity cloud with a dashed centroid ring. With no `points` it renders the catalog SC-01 demo cloud (deterministic `mulberry32(11)`, 26 points, corr 0.75).

Catalog-ID mapping:

| Catalog ID | `variant` | Card props (see stories) |
| --- | --- | --- |
| SC-01 mint-scatter | `'mint-scatter'` (default) | seed 11 cloud · `title 'SLEEP → ENERGY · 26 NIGHTS'` |
| SC-02 trend-fit | `'trend-fit'` | seed 22 cloud · fit line + computed `fitLabel` |
| SC-03 bubble-dose | `'bubble-dose'` | seed 33 · corr −0.5 · `xLabel 'CAFFEINE AFTER 14:00 →'` `yLabel '↑ SLEEP SCORE'` · `sizeLabel` key |
| SC-04 quadrant-map | `'quadrant-map'` | seed 44 · corr 0.55 · `xLabel 'TRAINING LOAD →'` `yLabel '↑ RECOVERY'` · `quadrantLabels` |
| SC-05 zone-dots | `'zone-dots'` | seed 55 cloud · dot color = y-zone |
| SC-06 today-marker | `'today-marker'` | seed 66 cloud · `highlight 12` · `todayLabel` |
| SC-07 density-cloud | `'density-cloud'` | seed 77 · n 90 · dot radius presets to 2 · `centroidLabel` |

## 2. API contract

Same prop API on both platforms; only the container props are platform-shaped.

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `variant` | `'mint-scatter' \| 'trend-fit' \| 'bubble-dose' \| 'quadrant-map' \| 'zone-dots' \| 'today-marker' \| 'density-cloud'` | `'mint-scatter'` | ✓ | ✓ | SC-01 … SC-07 |
| `points` | `ScatterPoint[]` | catalog SC-01 demo cloud | ✓ | ✓ | normalized 0–1 |
| `xLabel` | `string` | `'SLEEP HOURS →'` | ✓ | ✓ | bottom-right mono caption; `''` hides it |
| `yLabel` | `string` | `'↑ ENERGY'` | ✓ | ✓ | top-left mono caption; `''` hides it |
| `title` | `string` | — | ✓ | ✓ | top-center mono caption; omit → no caption |
| `color` | `string` | `'var(--mint)'` / `colors.mint` | ✓ | ✓ | dot color token; **ignored by `zone-dots`** (the zone owns the color) |
| `dotRadius` | `number` | `3` (`density-cloud` presets `2`) | ✓ | ✓ | viewBox px; ignored by `bubble-dose` (z owns the radius) |
| `highlight` | `number` | — | ✓ | ✓ | `today-marker` — index into `points`, drawn last as the lime pulse + chip; out-of-range/fractional ignored |
| `todayLabel` | `string` | `'TODAY'` | ✓ | ✓ | chip over the highlighted point; `''` hides the chip (pulse stays) |
| `fitLabel` | `string` | computed (`R² 0.64 · STRONG`) | ✓ | ✓ | `trend-fit` chip; default = real R² (2 dp) + `≥0.5 STRONG / ≥0.25 MODERATE / else WEAK` |
| `sizeLabel` | `string` | `'SIZE = CAFFEINE MG'` | ✓ | ✓ | `bubble-dose` size-key chip, top-right; `''` hides it |
| `quadrantLabels` | `[string, string, string, string]` | `['LOW X · HIGH Y', 'SWEET SPOT', 'DANGER', 'HIGH X · LOW Y']` | ✓ | ✓ | `quadrant-map` captions [TL, TR, BL, BR] |
| `centroidLabel` | `string` | `'TYPICAL YOU'` | ✓ | ✓ | `density-cloud` chip over the centroid ring; `''` hides it |
| `shine` | `boolean` | `false` | ✓ | ✓ | soft per-dot glow in the dot color (catalog glow modifier) |
| `grid` | `boolean` | `true` | ✓ | ✓ | 3 interior grid lines + baseline; captions stay |
| `ariaLabel` | `string` | `'Correlation scatter plot'` | ✓ | ✓ | web `aria-label` / native `accessibilityLabel` |
| `className` | `string` | — | ✓ | — | web only, merged onto `.lk-sct` |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only, container style |
| _rest_ | `Omit<HTMLAttributes<HTMLDivElement>, 'title' \| 'children'>` | — | ✓ | — | spreads to the root `<div>`; the HTML `title` attr is repurposed as the caption prop |

**`ScatterPoint`** — `{ x: number; y: number; z?: number }`: `x`/`y` normalized 0–1 in plot space; `z` 0–1 drives the `bubble-dose` radius `2 + (z ?? 0.5) × 6` (2–8 viewBox px).

## 3. Visual spec (tokens — never hardcode)

Geometry is the catalog's, in viewBox units: `W 320 · H 150 · pad l10 r12 t16 b14 · plot 298×120`.
**Point mapping** (the page's `PX()`): `x = 10 + 8 + 282·px` · `y = 16 + 6 + 108·(1 − py)` — an 8/6px inner inset keeps dots off the frame.

| Element | Spec (both platforms) |
| --- | --- |
| Grid | 3 interior lines at plot 25/50/75%, `--border` at `strokeOpacity 0.55` (≈ the catalog's white-5%) + full-opacity `--border` baseline at y 136 |
| Labels | `--font-mono` / `fonts.mono`, **8.5** viewBox px, tracking `.06em` (native `0.5`) — title (x 160, y 11), x-caption (end-anchored x 306, y 148), y-caption (start-anchored x 12, y 24), all `--text-faint` |
| Dots | r `dotRadius` (3; cloud 2), fill `color` (default `--mint`), opacity **0.85** (`density-cloud` 0.4 · `today-marker` non-highlight 0.28) |
| Bubbles (SC-03) | r `2 + (z ?? 0.5)·6`, dark rim stroke = `--bg-0` @ 60% (web `color-mix`, native `${colors.bg0}99` — the catalog's `rgba(8,10,18,0.6)`), width 1 |
| Fit line (SC-02) | least-squares over the points, drawn x 0.06→0.94 with y clamped 0.03–0.97; `--cyan`, width 2, dash `6 4`, opacity 0.9; chip end-anchored at (x₁−4, y₁−12) in `--cyan`. R² = Pearson r², `toFixed(2)`; degenerate variance → r² 0; < 2 points → no line |
| Quadrants (SC-04) | dashed midlines (`3 4`, width 1) crossing at the plot center (159, 76), stroke = `--text` @ 12% (native `${colors.text}1F` — the catalog's white-12%); captions at x plot-25/75%, y 30 & 130: TL/BR `--text-faint`, TR `--mint`, BL `--zone-low` |
| Zone dots (SC-05) | catalog `zoneOf(y)`: `≥ 0.62` → `--zone-high`, `≥ 0.38` → `--zone-mid`, else `--zone-low` |
| TODAY pulse (SC-06) | lime dot r 3.6 + `drop-shadow(0 0 5px var(--lime))` (`.lk-sct-pulse-dot`) + expanding ring `.lk-sct-pulse` (r 3.6, stroke 1.4, scale 1→3 / opacity .8→0, 1.8s ∞, `transform-box: fill-box`); native: static dot r 3.6 + halo ring r 7, stroke 1.4 @ 0.4 (the `Ring` pulse precedent). Chip at (x, y−16) `--lime` |
| Centroid (SC-07) | ring at the mean point, r 16, `--cyan`, stroke 1.2, dash `3 3`; chip at (cx, cy−24) `--cyan` |
| Chips (catalog `tag()`) | rect w `len·5.35+12`, h 13, rx 6.5, fill `--bg-0` @ 78% (native `${colors.bg0}C7`), stroke = chip color @ 0.35, width 0.8; centered **8px** mono text (`.lk-sct-tag`, tracking `.05em` / native `0.4`); x clamps into the padded box |
| Shine | web `.lk-sct-shine` → `drop-shadow(0 0 4px var(--lk-sct-glow))`, glow color set inline per dot; native: duplicate circle behind, r+3, `fillOpacity 0.35` |
| Sizing | web `.lk-sct-svg`: `width 100%; height auto; overflow visible`; native root: `width '100%', aspectRatio 320/150` |

## 4. States

Pure render — no hover/press/focus/disabled states, no client hooks.

| State | Behavior |
| --- | --- |
| Default | draws the grid, captions and the chosen variant's layers |
| Empty (`points: []`) | renders the frame + captions — no dots, no centroid/fit, no crash |
| Out-of-range `highlight` | ignored (also fractional/negative) — no pulse, nothing dims differently |
| Degenerate fit data | < 2 points → no fit line; zero x/y variance → R² reads 0.00 |
| Reduced motion (web) | `.lk-sct-pulse` stops animating and sits at opacity 0.35 |

## 5. Web ↔ native parity

**🟡 same API, platform-shaped implementation.** Identical geometry, data model, colors, chip math and draw order (both port the same catalog `draw()`). The real differences:

- **TODAY pulse** — web animates the ring via CSS (`.lk-sct-pulse`, scale 1→3 fade, reduced-motion safe) and glows the dot with `drop-shadow`; native draws a **static dot + faint halo ring** (r 7 @ 0.4) per the `Ring` pulse precedent — no SMIL/JS animation. Motion-only diff; does not block use.
- **Shine substrate** — web CSS `drop-shadow(0 0 4px …)`; native a **wider faint duplicate circle** (r+3, `fillOpacity 0.35`) because RN SVG filters are unreliable on device.
- **Label styling channel** — web styles `<text>` via `.lk-sct-label`/`.lk-sct-tag` (CSS); native passes `fontSize/fontFamily/letterSpacing` props on `Svg.Text` (`0.5`/`0.4` ≈ `.06em`/`.05em`).
- **Container** — web `div[role=img]` + `className`/rest; native `View accessibilityRole="image"` + `style`.

## 6. Composition & usage

Standalone chart — composes nothing from the kit; typically placed inside a `Card`/`MetricTile` body. Correlation surfaces: sleep↔energy, caffeine↔sleep dose/response, training-load↔recovery quadrants, "where today lands" context.

```tsx
// web — SC-02: fit line + computed R² pill over real data
<ScatterChart variant="trend-fit" title="SLEEP → ENERGY · FITTED"
  points={nights.map((n) => ({ x: n.sleepHours / 12, y: n.energy / 100 }))} />
```

```tsx
// native — SC-06: identical props
<ScatterChart variant="today-marker" highlight={points.length - 1}
  points={points} title="WHERE TODAY LANDS" />
```

## 7. Accessibility

- **Web:** root `<div role="img" aria-label={ariaLabel}>`; the `<svg>` is `aria-hidden` (in-SVG text is decorative — the label carries the meaning). Pass a data-bearing `ariaLabel` ("Sleep vs energy, 26 nights, strong positive correlation").
- **Native:** root `View` with `accessibilityRole="image"` + `accessibilityLabel={ariaLabel}`.
- Non-interactive — no focus/keyboard surface. In-chart text scales with the container (8.5 viewBox px ≈ 9.6px at 360w); keep charts ≥ ~300px wide or move the conclusion into surrounding real text.
- The pulse ring honors `prefers-reduced-motion` (web); color is not the only channel on `zone-dots`' verdicts only — pair it with a caption when the verdict is load-bearing.

## 8. Usage rules — Do / Don't

**Do**
- Normalize your data to 0–1 **before** passing it (`x: hours / maxHours`) — the component never rescales.
- Let `trend-fit` compute the R² label from the data; only override `fitLabel` for precomputed server-side stats.
- Use `today-marker`'s `highlight` for "current observation vs history"; keep the highlighted point inside `points`.
- Override `color` with **tokens only** (`var(--cyan)` / `colors.cyan`).
- Reproduce catalog cards in stories/tests with the seeds in the story files when checking parity.

**Don't**
- Don't pass raw-unit data (hours, mg, scores) — everything is 0–1 plot space.
- Don't hand a `fitLabel` that contradicts the drawn line — the line is always the real least-squares fit.
- Don't use `dotRadius` to fake bubbles — `bubble-dose` + `z` is the three-variable form (with the size-key chip).
- Don't hardcode hex in `color`, and don't restyle `.lk-sct-label`/`.lk-sct-tag` per app.

## 9. Anti-patterns & lookalike ban

- **No hand-rolled scatters.** Any correlation dot/bubble plot on a product surface is this component — never a local SVG lookalike.
- **New variant → both platforms.** A new scatter form (e.g. connected-scatter trail) is added here, web + native in the same unit of work, with the same prop name — never a one-off in an app.
- **Tokens only** — spectrum/zone/text/border tokens throughout; the catalog's dark rim/chip/midline alphas are expressed **through** tokens (`--bg-0` @ 60/78%, `--text` @ 12%) inside the component, never in app code.
- **Don't re-derive the geometry** (PX inset, chip width math, zone thresholds) in app code — the component is the single source of the catalog spec.
- **Parity gate:** any change ships only after the web story and the native story are compared side-by-side against `scatter-charts.html`.
