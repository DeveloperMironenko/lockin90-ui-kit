# SDD — `BiomarkerRange`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/BiomarkerRange.tsx` · `packages/ui-native/src/components/BiomarkerRange.tsx` ·
> web CSS `packages/ui/src/styles/components/biomarker.css` (`.lk-bmr-*`).
> **Exports:** `BiomarkerRange`, types `BiomarkerRangeProps`, `BiomarkerRangeVariant`, `BiomarkerMarker`, `BiomarkerTrend`.
> **Status:** Shipped. **Parity:** 🟡 same API, platform-shaped glow/pulse — web shine/pulse are CSS `drop-shadow` + keyframes; native draws a Gaussian-blurred duplicate dot via `FeGaussianBlur` (real RN-SVG filters) and a static halo (no animation).
> **Stories:** `packages/ui/src/stories/BiomarkerRange.stories.tsx` · `packages/ui-native/src/stories/BiomarkerRange.stories.tsx`.

---

## 1. Overview

The **lab-panel reference-range chart** for product surfaces — "lab results the readable way: a dot inside its reference range." One component implements the whole catalog biomarker family (`lockin90-design/charts/biomarker-charts.html`, BR-01…BR-05) in the catalog's fixed 320×150 viewBox:

| Variant | Catalog | Form |
| --- | --- | --- |
| `panel-rows` *(default)* | BR-01 | marker rows: faint scale + mint reference band + value dot (mint in-range / coral out) + LOW/HIGH flag above out-of-range dots — THE lab-results screen |
| `single-marker` | BR-02 | one large row with the anatomy labeled: LOW/OPTIMAL/HIGH zones, range numbers, pulsing value dot + big result readout |
| `marker-trend` | BR-03 | rows + last-4-tests spark and direction arrow per marker (improving mint / worsening coral / flat dim) |
| `panel-grid` | BR-04 | 2×3 tiles: name + OK/LOW/HIGH verdict + mini range row + value; out-of-range tiles get a coral border |
| `range-history` | BR-05 | one marker over test dates: dots + connecting line crossing INTO the shaded reference band — the recovery story |

**Supersedes the admin `ReferenceRangeBar` for product surfaces.** The web-only admin bar (`@lockin90/ui/admin`, `packages/ui/src/admin/ReferenceRangeBar.tsx`, `.lk-refrangebar-*`) remains as-is for the operator console's catalogs/lab-tests panel; it is NOT deprecated there and has no native twin. Any *product* (frontend/mobile) lab-range UI uses `BiomarkerRange` — never the admin bar, never a lookalike.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `markers` | `BiomarkerMarker[]` | catalog PANEL (VIT D / FERRITIN / HBA1C / LDL) | ✓ | ✓ | `single-marker` / `range-history` draw `markers[0]` only |
| `variant` | `'panel-rows' \| 'single-marker' \| 'marker-trend' \| 'panel-grid' \| 'range-history'` | `'panel-rows'` | ✓ | ✓ | catalog BR-01…BR-05 |
| `title` | `string` | — | ✓ | ✓ | top-left faint mono caption (e.g. `'BLOOD PANEL · JUN'`) |
| `caption` | `string` | per-variant catalog caption | ✓ | ✓ | bottom legend; defaults: `panel-rows` `'BAND = REFERENCE RANGE · DOT = YOUR VALUE'`, `marker-trend` `'SPARK = LAST 4 TESTS'`, `single-marker` derived `'NAME · OPTIMAL low–high'`; pass `''` to hide |
| `note` | `string` | — | ✓ | ✓ | `range-history` only: mint context pill, top-right |
| `flag` | `string` | — | ✓ | ✓ | `range-history` only: coral state pill at the first test point |
| `shine` | `boolean` | `false` | ✓ | ✓ | glow on the value dots (the catalog glow modifier) |
| `ariaLabel` | `string` | `'Biomarker reference ranges'` | ✓ | ✓ | root `aria-label` / `accessibilityLabel` |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only (container View) |
| _rest_ | `Omit<HTMLAttributes<HTMLDivElement>, 'title' \| 'children'>` | — | ✓ | — | web spreads to the root `<div>`; HTML `title` is omitted (the prop is the chart caption) |

`BiomarkerMarker` (the shared data shape — real values on a display scale, per the catalog `PANEL` semantics):

| Field | Type | Notes |
| --- | --- | --- |
| `name` | `string` | short mono row label (`'VIT D'`) |
| `value` | `number` | latest measured value |
| `min` / `max` | `number` | display-scale floor/ceiling — the drawn track's edges (positions = `(v − min)/(max − min)`, clamped 0–1) |
| `low` / `high` | `number` | reference-range bounds — the mint band; `value < low` → LOW, `> high` → HIGH |
| `unit?` | `string` | readout suffix (`48` + `'NG/ML'` → `'48 NG/ML'`) |
| `display?` | `string` | preformatted readout override (`'5.2%'`) |
| `history?` | `number[]` | past tests oldest → newest (last ≈ `value`); `marker-trend` sparks `slice(-4)`, `range-history` plots all |
| `dates?` | `string[]` | per-test x-axis labels for `range-history` (`['JAN','MAR','MAY','JUL','NOW']`) |
| `trend?` | `'improving' \| 'worsening' \| 'flat'` | explicit `marker-trend` verdict override |

Trend derivation (when `trend` is not given): distance-outside-the-range of the spark window's last vs first test — moved **toward** the band = `improving` (mint), **away** = `worsening` (coral), unchanged (incl. in-range drift) = `flat` (dim). Arrow = raw delta sign (`↑`/`↓`), `flat` always `→`.

## 3. Visual spec (tokens — never hardcode)

All geometry in the catalog's fixed viewBox: `W=320 H=150`, `PAD {l:10, r:12, t:16, b:14}` (`charts/catalog.js`). Catalog rgba values map to the nearest token:

| Element | Web | Native | Catalog source |
| --- | --- | --- | --- |
| Scale track | `var(--glass-2)`, h 5 (BR-02: 10), rx = h/2 | `colors.glass2` | `rgba(255,255,255,.06)` |
| Reference band | `var(--mint)` op `.22` (BR-02 `.25`, BR-05 `.09`) | `colors.mint` | same |
| Value dot | r 4 (BR-02/05: 3.6), fill `var(--mint)` in-range / `var(--zone-low)` out, stroke `var(--bg-0)` op `.85` w 1.2 | `colors.mint`/`colors.zoneLow`/`colors.bg0` | `rgba(8,10,18,.85)` ring |
| LOW/HIGH flag · zone words | `var(--zone-low)`; BR-02 `HIGH` zone word is `var(--zone-mid)` | `colors.zoneLow`/`zoneMid` | same |
| Labels | `.lk-bmr-label` — `var(--font-mono)` 8.5px, tracking `.06em`; names `var(--text-dim)`, title/axis/caption `var(--text-faint)` | `fonts.mono` 8.5 / `letterSpacing 0.5` | `C.label` |
| Trend arrow | `.lk-bmr-arrow` — mono 11px, trend color (mint/`--zone-low`/`--text-dim`) | `fonts.mono` 11 | same |
| BR-02 result | `.lk-bmr-result` — `var(--font-display)` 20px w700, state color | `fonts.display` 20 `fontWeight 700` | Space Grotesk 20/700 |
| BR-04 tile | 90×48 rx 10 (= `--r-sm` at 1:1), fill `var(--glass)`, stroke `var(--border)` / out-of-range `var(--zone-low)` op `.5` | `colors.glass`/`border`/`zoneLow` | `rgba(255,255,255,.03/.08)` |
| BR-05 grid | h-lines `var(--glass)`, baseline `var(--border)` | `colors.glass`/`border` | `.05` / `.09` |
| BR-05 line | `var(--mint)` w 1.8 | `colors.mint` | same |
| Tag pill | rect h 13 rx 6.5, fill `var(--bg-0)` op `.78`, stroke = pill color op `.35` w 0.8; text mono 8px | `colors.bg0` + color | `C.tag` |
| Shine | `.lk-bmr-dot--shine { filter: drop-shadow(0 0 5px currentColor) }` (dot color set via inline `color`) | Gaussian-blurred duplicate circle r+1.5, same fill, op `.8` (`FeGaussianBlur` stdDev 2.5) | `C.blur` underlay |
| BR-02 pulse | `.lk-bmr-pulsecore` drop-shadow + `.lk-bmr-pulsering` scaling 1→3.05 / op .8→0, 1.8s infinite | static halos: r 6.5 op `.3` + r 9 op `.12` | `C.pulseDot` (r 3.6→11) |

Row geometry: BR-01 rows `y = 38 + i·27`, track 96→244; BR-03 rows `y = 42 + i·34`, track 84→204, spark x `216 + j·9`, spark y `rowY + 6 − frac·14`; BR-04 tiles `x = 16 + (i%3)·99`, `y = 28 + ⌊i/3⌋·56`; BR-05 plot 40→296, band overhangs ±6.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| In range | mint dot, dim readout, `OK` verdict (BR-04) | same |
| Out of range | coral (`--zone-low`) dot + readout, `LOW`/`HIGH` flag above the dot (BR-01), coral tile border + verdict (BR-04) | same |
| `shine` | dots glow via `drop-shadow` in their state color | Gaussian-blurred duplicate circle (r+1.5 @ 0.8, `FeGaussianBlur stdDeviation 2.5`) |
| BR-02 pulse | ring expands r 3.6→11 forever; `prefers-reduced-motion` freezes it (ring hidden) | static duplicate halo (always "reduced motion") |
| No `history` | BR-03: no spark path (needs ≥2 points), arrow from `trend` override or `→`; BR-05: single centered dot at `value` | same |
| `markers=[]` | variants render an empty (titled) canvas — no crash | same |

Static/decorative otherwise — no hover/focus/disabled.

## 5. Web ↔ native parity

**Verdict: 🟡 same API, platform-shaped glow + motion.** Identical prop API, marker shape, geometry constants, trend derivation, and label text. Differences are substrate-only:

- **Shine:** web = CSS `drop-shadow(0 0 5px currentColor)` on the dot; native = a **Gaussian-blurred duplicate circle** (r+1.5, opacity .8, `FeGaussianBlur` stdDev 2.5, padded `userSpaceOnUse` region) behind it — see CONVENTIONS.md.
- **BR-02 pulsing dot:** web animates an expanding, fading stroke ring via CSS keyframes (`.lk-bmr-pulsering`, 1.8s, reduced-motion honored). Native has no cheap way to run this without pulling in `Animated`/Reanimated for a decorative dot, so it renders a **static duplicate halo** (r 6.5 op .3 + r 9 op .12) — deliberately the "reduced-motion" rendering. Documented capability trade, not a gap that blocks use.
- **Sizing:** web root is a block `<div>` whose `<svg>` scales `width:100%; height:auto` (aspect held by the viewBox, `overflow:visible` lets shine spill); native holds `width:'100%'` + `aspectRatio: 320/150` on the container View (clips at the edge).
- **Text substrate:** web SVG `<text>` styled by `.lk-bmr-*` classes; native `SvgText` with `fonts.mono`/`fonts.display` props and absolute `letterSpacing` (0.5 ≈ .06em at 8.5px).
- **className ↔ style:** universal substrate; app code reads 1:1.

## 6. Composition & usage

- **Used for:** the lab-results screen (`panel-rows`), a marker detail/teaching view (`single-marker`), protocol check-ins (`marker-trend`), full-panel overview cards (`panel-grid`), and post-intervention journeys (`range-history`). Typically inside a `Card`.
- **Composes:** none — self-contained SVG (no `Sparkline`/`RangeBar` reuse; the catalog geometry is bespoke per variant).

```tsx
// web — the signature lab panel
<BiomarkerRange
  title="BLOOD PANEL · JUN"
  markers={[
    { name: 'VIT D', value: 48, min: 0, max: 86, low: 30, high: 60, unit: 'NG/ML' },
    { name: 'FERRITIN', value: 22, min: 0, max: 120, low: 36, high: 90, unit: 'UG/L' },
  ]}
/>

// native — one marker's recovery story
<BiomarkerRange
  variant="range-history"
  markers={[{ name: 'VIT D', value: 48, min: 0, max: 86, low: 30, high: 60, unit: 'NG/ML',
    history: [17, 26, 38, 45, 48], dates: ['JAN', 'MAR', 'MAY', 'JUL', 'NOW'] }]}
  title="VIT D · 6 MONTHS"
  flag="DEFICIENT"
  note="VIT D · SUPPLEMENTED SINCE FEB"
/>
```

## 7. Accessibility

- **Web:** root `<div role="img" aria-label={ariaLabel}>`; the `<svg>` is `aria-hidden="true"`. Pass a meaningful `ariaLabel` (e.g. `"Blood panel: ferritin low, LDL high"`) — the SVG text is not exposed.
- **Native:** container `accessibilityRole="image"` + `accessibilityLabel={ariaLabel}` — same rule.
- **Color:** out-of-range is never color-only — the coral dot is always paired with the LOW/HIGH flag (BR-01), verdict text (BR-04), or the readout itself.
- Non-interactive; no focus/hit-target concerns.

## 8. Usage rules — Do / Don't

**Do**
- Pass real scale bounds (`min`/`max`) wider than the reference range so the dot has room to sit out-of-range, like the catalog PANEL.
- Keep `history` oldest → newest with the last entry ≈ `value`; `marker-trend` windows the last 4 itself.
- Use `display` when the formatted readout isn't `value + unit` (`'5.2%'`).
- Cap markers at the variant's design: ≤4 rows (`panel-rows`), ≤3 rows (`marker-trend`), ≤6 tiles (`panel-grid`) — the fixed canvas doesn't grow.

**Don't**
- ✗ Don't use the admin `ReferenceRangeBar` on product surfaces — it's operator-console-only; this family replaces it there.
- ✗ Don't put more than one marker in `single-marker`/`range-history` expecting all to draw — they render `markers[0]`.
- ✗ Don't hand-set `trend` unless the derived verdict is genuinely wrong for the domain (e.g. a marker where "up" is always bad regardless of the band).
- ✗ Don't restyle via CSS overrides of `.lk-bmr-*` — colors are state-driven tokens inline.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A hand-rolled "dot on a band" row (a `ProgressBar` + absolute dot, or a re-drawn SVG track) is a parity violation — import `BiomarkerRange`. If you're in admin, use its `ReferenceRangeBar`; those are the only two sanctioned forms.
- **New need → both platforms.** A new variant (e.g. a BR-06), marker field, or annotation ships to `packages/ui` **and** `packages/ui-native` with the same prop name, tokens, and geometry — never a one-off on one side.
- **Tokens only.** Mint band, coral out-of-range, glass tracks, bg-0 dot rings — all token vars / `@lockin90/tokens`; the catalog's raw rgba values are mapped once here (see §3), never re-hardcoded in apps.
- **Parity gate.** Before a screen ships, diff web phone-width vs native render per variant — same rows, flags, verdicts, pills — accepting only the documented shine/pulse substrate differences.
