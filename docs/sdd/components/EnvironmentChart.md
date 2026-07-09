# SDD — `EnvironmentChart`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/EnvironmentChart.tsx` · `packages/ui-native/src/components/EnvironmentChart.tsx` ·
> no web CSS partner — all styling is inline SVG attributes (`.lk-envchart` on the root is a bare hook class, like `.lk-daywheel`).
> **Exports:** `EnvironmentChart`, types `EnvironmentChartProps`, `EnvironmentChartVariant` — **not yet re-exported from either `src/index.ts`** (the charts-program export wave lands separately).
> **Status:** Built. **Parity:** 🟡 same API & geometry; the NOW pulse is a SMIL-animated expanding ring + `drop-shadow` on web vs a static dot + faint halo ring on native, and the sun-arc `shine` is `blur()` vs a Gaussian-blurred duplicate stroke (`FeGaussianBlur`, real RN-SVG Fabric filters).
> **Stories:** `packages/ui/src/stories/EnvironmentChart.stories.tsx` (`Charts/EnvironmentChart`) · `packages/ui-native/src/stories/EnvironmentChart.stories.tsx` (`Native/EnvironmentChart`).

---

## 1. Overview

The **catalog environment family** (`lockin90-design/charts/environment-charts.html`, EN-01…EN-04) — UV, pollen, air: *when to train outside*. Four variants on the fixed **320×150 viewBox**: the sun-path arc with UV-colored segments, three hourly pollen cell rows, the stepped AQI day curve, and the stacked UV+pollen+air rows with the mint BEST WINDOW box. Hourly values arrive **normalized 0–1** (`aqi` = AQI/100), 16 cells from `startHour` (default 6 → 6:00–22:00); times are **fractional hours** (5.78 = 05:47). Verdict pills are **computed from the data by default** (NOW UV, AQI verdict, window times) with string overrides for edge copy. With no data props each variant renders its catalog card. Deciding the *actual* best window / worst pollen window is caller logic — the chart draws what it's told.

Catalog-ID mapping:

| Catalog ID | `variant` | Card props (see stories) |
| --- | --- | --- |
| EN-01 sun-uv-arc | `'sun-uv-arc'` (default) | `sunrise 5.78` · `sunset 21.2` · `now 14` · `peakUv 7` + the page's hardcoded pills `nowLabel 'NOW · UV 5'` / `peak 'UV 7 PEAK · 13:00'` (computed defaults say UV 7 / 13:29) |
| EN-02 pollen-rows | `'pollen-rows'` | `tree/grass/weed` = catalog rows · `flag 'GRASS HIGH 10–14'` — the defaults ARE the card |
| EN-03 aqi-day | `'aqi-day'` | `aqi` = catalog AQI16 · `now 14` → computed `'AQI 42 · GOOD'` — defaults |
| EN-04 outdoor-window | `'outdoor-window'` | `uv/pollen/air` = UV16/POL16/AQI16 · `windowStart 17` · `windowEnd 19.5` — defaults |

## 2. API contract

Same prop API on both platforms; only the container props are platform-shaped.

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `variant` | `'sun-uv-arc' \| 'pollen-rows' \| 'aqi-day' \| 'outdoor-window'` | `'sun-uv-arc'` | ✓ | ✓ | EN-01 / EN-02 / EN-03 / EN-04 |
| `sunrise` / `sunset` | `number` | `5.78` / `21.2` | ✓ | ✓ | `sun-uv-arc` — fractional hours, drawn as zero-padded `HH:MM` |
| `now` | `number \| null` | `14` | ✓ | ✓ | NOW hour — pulse on the sun arc (hidden outside sunrise–sunset) / nearest AQI point; `null` hides pulse + pills |
| `peakUv` | `number` | `7` | ✓ | ✓ | `sun-uv-arc` — day max UV; arc UV = `sin(t·π)·peakUv`, segment color cyan < 3 / amber < 6 / coral ≥ 6 |
| `nowLabel` | `string` | computed `'NOW · UV n'` | ✓ | ✓ | `sun-uv-arc` NOW caption override |
| `peak` | `string` | computed `'UV {peakUv} PEAK · {solar noon}'` | ✓ | ✓ | `sun-uv-arc` top-right pill; `''` hides it |
| `tree` / `grass` / `weed` | `number[]` | catalog rows | ✓ | ✓ | `pollen-rows` — 16 hourly 0–1 loads (extra entries sliced) |
| `flag` | `string` | `'GRASS HIGH 10–14'` | ✓ | ✓ | `pollen-rows` worst-window pill (caller computes it); `''` hides it |
| `aqi` | `number[]` | catalog AQI16 | ✓ | ✓ | `aqi-day` — 16 hourly 0–1 (AQI/100) |
| `threshold` | `number` | `0.5` | ✓ | ✓ | `aqi-day` dashed rule position (0.5 = AQI 50) |
| `thresholdLabel` | `string` | `'MODERATE >50'` | ✓ | ✓ | rule caption; `''` hides it |
| `verdict` | `string` | computed `'AQI {v·100} · GOOD/MODERATE'` | ✓ | ✓ | `aqi-day` NOW pill override; mint below `threshold`, amber at/above |
| `uv` / `pollen` / `air` | `number[]` | UV16 / POL16 / AQI16 | ✓ | ✓ | `outdoor-window` — 16 hourly 0–1 rows |
| `windowStart` / `windowEnd` | `number` | `17` / `19.5` | ✓ | ✓ | `outdoor-window` best-window bounds, fractional hours (caller computes them) |
| `windowLabel` | `string` | computed `'BEST WINDOW · {start}–{end}'` | ✓ | ✓ | window pill override |
| `startHour` | `number` | `6` | ✓ | ✓ | first hourly cell (cells span `startHour`…`startHour+16`) |
| `title` | `string` | per-variant catalog title | ✓ | ✓ | top-left mono caption (`'SUN · TODAY'` / `'POLLEN · HOURLY'` / `'AIR QUALITY'` / `'TRAIN OUTSIDE?'`) |
| `caption` | `string` | per-variant | ✓ | ✓ | bottom hint — EN-02 `'CELL BRIGHTNESS = POLLEN LOAD'`, EN-04 `'ALL THREE LOW = GO OUTSIDE'`; `''` hides it |
| `shine` | `boolean` | `false` | ✓ | ✓ | glow underlay behind the sun arc — **`sun-uv-arc` only** (no-op elsewhere, like the catalog) |
| `width` / `height` | `number` | `320` / `150` | ✓ | ✓ | rendered px — the viewBox scales to fit |
| `className` | `string` | — | ✓ | — | web only, merged onto `.lk-envchart` |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only, container style |
| _rest_ | `Omit<SVGProps<SVGSVGElement>, 'width' \| 'height' \| 'children'>` | — | ✓ | — | spreads to the root `<svg>` |

## 3. Visual spec (tokens — never hardcode)

Geometry is the catalog's, in viewBox units: `W 320 · H 150 · pad l10 r12 t16 b14 · Y(v) = 16 + (1−v)·120`.

| Element | Spec (both platforms) |
| --- | --- |
| Sun arc (EN-01) | horizon line y 112 `--text` @ 12% w1 (web `color-mix`, native `${colors.text}1F`); 40 segments on `sunPt(t) = (30 + t·258, 112 − sin(t·π)·70)`, stroke `uvColor(sin(t·π)·peakUv)` w 3.2 round — **cyan `--cyan` < 3 / amber `--zone-mid` < 6 / coral `--zone-low` ≥ 6**; NOW pulse in `--text` + `nowLabel` in `--text-dim` 12 above; times at (30/288, 124) + SUNRISE/SUNSET at 136 in `--text-faint`; peak pill at (302, 26) in `--zone-low`, end-anchored |
| Cell rows (EN-02/04) | x0 84, cell w 13 (−1.5 gap), h 9, rx 2.5, rows y 48/74/100 (EN-02) · 44/64/84 (EN-04); fill `loadColor(v)` — **mint < 0.34 / amber < 0.67 / else coral** (LOW is good — inverse of `zoneOf`), opacity `0.16 + 0.62·v`; row names mono `--text-dim` end-anchored at x 76 |
| AQI curve (EN-03) | grid: 3 faint lines `--text` @ 5% (`0D`) + baseline `--border`; stepped path — per-point horizontals x±8.6 at `Y(v)`, x = 30 + i·17.2; area to the baseline `--cyan` @ 0.12; line `--cyan` w2; threshold rule dashed `4 4` `--zone-mid` w1 @ 0.7 + caption above-left; NOW pulse `--cyan` + verdict pill (`--mint` good / `--zone-mid` not) |
| Window box (EN-04) | x `84 + (windowStart−startHour)·13 − 3`, y 30, w `(windowEnd−windowStart)·13 + 6`, h 64, rx 8 — fill `--mint` @ 0.08 + stroke `--mint` w 1.2; pill at the box center x, y 110 in `--mint` |
| Hour captions | `'{h}:00'` at `startHour + 0/4/8/12/16`, x = x0 + k·cw — y 124 (EN-02) / 130 (EN-04) / 147 (EN-03) |
| Labels / pills | labels `--font-mono` / `fonts.mono` 8.5 viewBox px, tracking `.06em` (native `0.5`), `--text-faint`; heading at (12, 11) start-anchored; chip-pills (catalog `tag()`): rect w `len·5.35+12`, h 13, rx 6.5, fill `--bg-0` @ 78% (native `${colors.bg0}C7`), stroke = pill color @ 0.35 w 0.8, 8px mono text, x clamped into the padded box |
| NOW pulse | dot r 3.6 + web `drop-shadow(0 0 5px c)` + SMIL ring r 3.6→11 / opacity .8→0, 1.8s ∞ — native static halo ring r 7 stroke 1.4 @ 0.4 (the `Ring`/`DayWheel` precedent) |
| Shine (EN-01) | web: duplicate segments w 8 @ 0.4 `blur(5px)` under the arc; native: the same duplicates @ 0.4, blurred with `FeGaussianBlur stdDeviation 2.5` |
| Sizing | both roots render at `width`/`height` (default 320×150) — explicit px like `DayWheel` |

## 4. States

Pure render — no hover/press/focus/disabled states, no client hooks.

| State | Behavior |
| --- | --- |
| Default | bare `<EnvironmentChart variant="…"/>` reproduces the catalog card (EN-01's pills excepted — the page hardcodes 'UV 5'/'13:00', the component computes from data; see §1) |
| `now={null}` | no pulse, no NOW/verdict pill (aria text drops it too) |
| `now` outside sunrise–sunset (EN-01) | pulse + caption hidden — the sun isn't on the arc |
| Empty arrays | frame + captions render — no cells/curve, no crash; oversized arrays are sliced to 16 |
| Reduced motion (web) | **not honored** — the SMIL pulse ring animates regardless (SMIL can't be CSS-gated and the styles file is frozen; the catalog gates via `motion.js ?still=1`). Motion-sensitive surfaces pass `now={null}` or accept the 1.8s ring |

## 5. Web ↔ native parity

**🟡 same API, platform-shaped implementation.** Identical geometry, data model, color scales, computed pills, defaults and draw order (both port the same catalog `draw()`). The real differences:

- **NOW pulse** — web animates an expanding SMIL ring + `drop-shadow` glow; native draws a **static dot + faint halo ring** (no SMIL/JS animation on native — the `Ring`/`DayWheel` rule). Motion-only diff; does not block use.
- **Shine substrate** — web `blur(5px)` duplicate segments @ 0.4; native the same duplicates @ 0.4 blurred with a real `FeGaussianBlur` (`stdDeviation 2.5`; see CONVENTIONS.md).
- **Container** — web `svg[role=img]` root + `className`/SVGProps rest; native `View accessibilityRole="image"` wrapping `Svg` + `style`.
- **Label styling channel** — web inline `style={{ fontFamily, letterSpacing }}` on `<text>`; native `fontFamily/letterSpacing` props on `Svg.Text` (`0.5`/`0.4` ≈ `.06em`/`.05em`).

## 6. Composition & usage

Standalone chart — composes nothing from the kit; typically placed inside a `Card`/`MetricTile` body. Environment surfaces: the daylight/UV widget on Today, allergy planning, air-quality day view, and the "train outside?" coach answer.

```tsx
// web — EN-01: real sun times + live NOW (pills computed from the data)
<EnvironmentChart sunrise={wx.sunriseH} sunset={wx.sunsetH} now={currentHour} peakUv={wx.uvMax} />
```

```tsx
// native — EN-04: identical props; the app computes the window
<EnvironmentChart variant="outdoor-window" uv={hourly.uv} pollen={hourly.pollen}
  air={hourly.aqi} windowStart={best.start} windowEnd={best.end} />
```

## 7. Accessibility

- **Web:** root `<svg role="img">` with a computed per-variant `aria-label` (e.g. `"SUN · TODAY: sun path 05:47–21:12, now · uv 7"`, `"AIR QUALITY: hourly air quality — aqi 42 · good"`). Override via `aria-label` in rest.
- **Native:** root `View` with `accessibilityRole="image"` + the same computed label.
- Non-interactive — no focus/keyboard surface. In-chart text scales with the container (8.5 viewBox px ≈ 9.6px at 360w); keep charts ≥ ~300px wide or move the verdict into surrounding real text.
- The web SMIL pulse does **not** honor `prefers-reduced-motion` (§4) — pass `now={null}` on motion-free surfaces. Color is the primary load/UV channel — the pills (peak/flag/verdict/window) carry the conclusion in text; don't hide them where the verdict is load-bearing.

## 8. Usage rules — Do / Don't

**Do**
- Normalize hourly data to 0–1 **before** passing (`aqi/100`); index 0 is `startHour`.
- Pass times as fractional hours (5.78 = 05:47) — the component formats zero-padded `HH:MM`.
- Compute the best/worst windows in app logic and hand the chart `windowStart/End` / `flag` — the chart draws, it doesn't decide.
- Prefer the computed pills; override `nowLabel`/`verdict`/`peak`/`windowLabel` only for copy the data can't express.

**Don't**
- Don't pass raw units (AQI 0–500, pollen grains) — everything is 0–1 chart space.
- Don't repurpose `loadColor`'s inverse scale for score data — high-is-good data belongs in zone-colored charts (`DayWheel`, `BarChart zone-bars`).
- Don't fake a NOW pulse by overlaying your own dot — pass `now`.
- Don't hardcode hex anywhere, and don't re-derive the UV (3/6) or load (0.34/0.67) thresholds in app code.

## 9. Anti-patterns & lookalike ban

- **No hand-rolled environment widgets.** Any sun-path/UV arc, pollen strip, AQI day curve or outdoor-window box on a product surface is this component — never a local SVG lookalike.
- **New variant → both platforms.** A new environment form (e.g. a wind/humidity row, if promoted to the catalog) is added here, web + native in the same unit of work, same prop names — never a one-off in an app.
- **Tokens only** — the white alphas (horizon 12%, grid 5%, pill fill `--bg-0` @ 78%) and the UV/load color scales live **inside** the component, never in app code.
- **Don't re-derive the geometry** (horizon 112 / amp 70, cell x0 84 / w 13, AQI step 17.2) in app code — the component is the single source of the catalog spec.
- **Parity gate:** any change ships only after the web story and the native story are compared side-by-side against `environment-charts.html`.
