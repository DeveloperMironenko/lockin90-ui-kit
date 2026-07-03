# SDD — `Hypnogram` (+ `SleepStage`, `HypnogramSegment`, `HypnogramVariant`, `EfficiencyInterval`, `SleepNight` types)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Hypnogram.tsx` · `packages/ui-native/src/components/Hypnogram.tsx` ·
> web CSS `packages/ui/src/styles/components/hypnogram.css` (`.lk-hyp*`).
> **Exports:** `Hypnogram`, types `SleepStage`, `HypnogramSegment`, `HypnogramProps`, `HypnogramVariant`, `EfficiencyInterval`, `SleepNight` (the three new types await their `src/index.ts` re-export line — index owned by the charts-program integrator).
> **Status:** Shipped. **Parity:** 🟡 same API/visual; web stretch-SVG + %-positioned HTML overlays vs native measured-width SVG + px-positioned RN overlays; web `ariaLabel` prop native lacks; shine = CSS glow (web) vs wider faint duplicate shapes (native).
> **Stories:** `packages/ui/src/stories/Hypnogram.stories.tsx` · `packages/ui-native/src/stories/Hypnogram.stories.tsx` (`SL01Shine`, `SL04EfficiencyBars`, `SL05SleepWeek`, `SL06BedtimeDrift`, `SL07NightCoach`, `SL07DataOnly`).

---

## 1. Overview

The **sleep-chart family** (catalog `lockin90-design/charts/sleep-charts.html`). The default variant is a **sleep-stage timeline**: four horizontal bands — Awake / REM / Light / Deep, top → bottom — holding rounded capsule bars whose widths are proportional to each segment's `minutes`, with thin vertical connectors linking stage transitions. Catalog variants extend the same component (never lookalikes):

| Catalog ID | Variant / component | Form |
| --- | --- | --- |
| SL-01 | `variant="hypnogram"` (default) | stage bands + capsules + connectors |
| SL-02 | → **`StackedBar`** (not Hypnogram) | 100% stacked stage bar + H:M per stage |
| SL-03 | → **`Ring`** (not Hypnogram) | violet→mint score ring + stage mini-bars |
| SL-04 | `variant="efficiency-bars"` | violet asleep bars up / amber awake bars down from the midline · ASLEEP/AWAKE tags · clock axis |
| SL-05 | `variant="sleep-week"` | 7 duration bars (violet ≥ target−30m, amber under) + dashed mint TARGET rule + day letters |
| SL-06 | `variant="bedtime-drift"` | BED (violet, coral when late) + WAKE (amber) dots joined per day · mint CONSISTENT WINDOW band |
| SL-07 | `variant="night-coach"` | hypnogram + dashed wake-window rule · optional mint `recommendation` pill (data-only when omitted) |

Secondary type exports: **`SleepStage`** `'awake'|'rem'|'light'|'deep'`; **`HypnogramSegment`** `{ stage, minutes }`; **`HypnogramVariant`** (the five variant names); **`EfficiencyInterval`** `{ asleepMinutes, awakeMinutes }` (one night bucket, SL-04); **`SleepNight`** `{ bed, wake }` clock hours (SL-06 — values < 12 read as next-morning, so `bed: 0.5` = 12:30am, `wake: 6.9` = 6:54am).

## 2. API contract

| Prop | Type | Default | Web | Native | Variant | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `variant` | `HypnogramVariant` | `'hypnogram'` | ✓ | ✓ | — | catalog SL-01/04/05/06/07 |
| `segments` | `HypnogramSegment[]` | `DEFAULT_SEGMENTS` (12-stretch night) | ✓ | ✓ | hypnogram · night-coach | chronological; widths ∝ `minutes` |
| `height` | `number` | `160` | ✓ | ✓ | all | plot height in px (also the viewBox height) |
| `axis` | `string[]` | per-variant (see below) | ✓ | ✓ | all | x-axis labels row under the chart |
| `showStageLabels` | `boolean` | `true` | ✓ | ✓ | hypnogram · night-coach | left-gutter Awake/REM/Light/Deep; ignored by the others |
| `shine` | `boolean` | `false` | ✓ | ✓ | all | glow underlay (catalog shine modifier) |
| `intervals` | `EfficiencyInterval[]` | `DEFAULT_INTERVALS` (32 catalog buckets) | ✓ | ✓ | efficiency-bars | asleep up / awake down per bucket |
| `asleepLabel` | `string` | `'ASLEEP 94%'` | ✓ | ✓ | efficiency-bars | top-right violet tag |
| `awakeLabel` | `string` | `'AWAKE 22 MIN'` | ✓ | ✓ | efficiency-bars | bottom-right amber tag |
| `week` | `number[]` | `[7.4, 6.1, 7.9, 8.2, 5.8, 8.6, 7.7]` | ✓ | ✓ | sleep-week | hours slept per day, one bar each |
| `targetHours` | `number` | `8` | ✓ | ✓ | sleep-week | dashed mint rule + `TARGET {n}H` tag; bar amber when `< target − 0.5` |
| `days` | `string[]` | `['M','T','W','T','F','S','S']` | ✓ | ✓ | sleep-week · bedtime-drift | letters centered under columns (sliced to column count) |
| `nights` | `SleepNight[]` | `DEFAULT_NIGHTS` (Fri/Sat drift late) | ✓ | ✓ | bedtime-drift | per-day bed/wake clock hours |
| `consistencyWindow` | `[number, number]` | `[22.3, 23.5]` | ✓ | ✓ | bedtime-drift | mint band, bed-time clock hours |
| `lateBedAfter` | `number` | `24` | ✓ | ✓ | bedtime-drift | bed later than this → coral dot |
| `windowLabel` | `string` | `'CONSISTENT WINDOW'` | ✓ | ✓ | bedtime-drift | mint tag over the band, right edge |
| `wakeWindowAt` | `number` | `0.62` | ✓ | ✓ | night-coach | 0–1 fraction of the night (clamped) |
| `wakeWindowLabel` | `string` | `'WAKE WINDOW OPENS'` | ✓ | ✓ | night-coach | amber tag centered on the rule |
| `recommendation` | `string` | — | ✓ | ✓ | night-coach | mint pill bottom-right; omit = data-only SELECT |
| **`ariaLabel`** | `string` | — | ✓ | — | all | **web only** — `<svg aria-label>` |
| `className` | `string` | — | ✓ | — | all | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | all | native only (wrapper) |
| _rest_ | `HTMLAttributes<HTMLDivElement>` | — | ✓ | — | all | web only |

- **`axis` default per variant:** `hypnogram`/`night-coach` → `['11p','1a','3a','5a','7a']`; `efficiency-bars` → `['11PM','3AM','7AM']` (fractions 0/0.5/1 via the space-between row); `sleep-week`/`bedtime-drift` → `[]` (day letters via `days` instead).
- **100% backward compatible:** the pre-variant API (`segments`, `height`, `axis`, `showStageLabels`, `ariaLabel`) renders SL-01 unchanged by default.
- **Geometry (identical both sides, viewBox units, `VB_W = 560`):**
  - SL-01/07 capsules: `PAD_Y 14 · GAP 4 · BAR_H 12`; `drawable = 560 − (n−1)·4`; width `∝ minutes/total`; y = `bandY(stage)` evenly spaced `14 … height−14`. Connectors at the midpoint between adjacent bars.
  - SL-04: `mid = height/2`, amplitude `height/2 − 10`; `unit = max(asleep+awake)` across buckets; `step = 560/n`, bar `x = i·step + step·0.18`, `w = step·0.64`, `rx 2`. Asleep up `∝ asleepMinutes/unit`, awake down `∝ awakeMinutes/unit`.
  - SL-05: `weekMax = max(target + 1.5, maxDur + 0.9)` (defaults → 9.5); `y(v) = 4 + (1 − v/weekMax)·(height − 5)`; baseline at `height − 1`; gridlines at 25/50/75%; bar `x = i·step + step·0.22`, `w = step·0.56`, `rx 4`; target rule dash `5 4`.
  - SL-06: night axis `nightHour(h) = h < 12 ? h+24 : h`, scale `[min − 0.6 … max + 0.6]` over `24 … height−8` (24px top pad so the window tag fits; earlier at top); columns at fractions `0.114 … 0.9866` (`DRIFT_X0/X1`); band `x = 0.10·560`, `w = 0.87·560`; joins 2px; dots 8px HTML/RN overlays.
  - SL-07: rule at `clamp01(wakeWindowAt)·560`, `y 2 … height−2`, dash `3 4`.
- **Native gutter:** `STAGE_GUTTER = 48px` (staged variants with labels only); SVG width = measured − gutter (`onLayout`).

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web | Native |
| --- | --- | --- |
| Stage colors | `awake var(--warn)` · `rem var(--violet)` · `light var(--cyan)` · `deep var(--indigo)` | `colors.warn / violet / cyan / indigo` |
| Capsule fill | per-stage vertical gradient, opacity `0.95 → 0.6` | per-stage gradient `0.95 → 0.85`, id via `useId()` |
| Night canvas (SL-04/06) | `.lk-hyp-night` `var(--violet)` op `.05`, `rx 8` | `colors.violet` op `0.05` |
| SL-04 bars | `.lk-hyp-eff-up` `var(--violet)` `.8` · `.lk-hyp-eff-down` `var(--zone-mid)` `.95` | `colors.violet .8` / `colors.zoneMid .95` |
| SL-05 bars | inline `var(--violet)` (≥ target−0.5) / `var(--zone-mid)`, `.lk-hyp-week-bar` op `.9` | `colors.violet` / `colors.zoneMid`, op `0.9` |
| SL-05 grid / baseline | `.lk-hyp-grid line` `var(--border)` op `.55` · `.lk-hyp-base` `var(--border)` | `colors.border` op `0.55` / `1` |
| Target rule | `.lk-hyp-target` `var(--mint)` op `.85` dash `5 4` | `colors.mint`, same dash |
| SL-06 band / joins | `.lk-hyp-window` `var(--mint)` op `.07` · `.lk-hyp-join` `var(--border-2)` 2px | `colors.mint .07` / `colors.border2` 2px |
| SL-06 dots | `.lk-hyp-dot` 8px round; bed `var(--violet)` (late → `var(--zone-low)`), wake `var(--zone-mid)` | same via `colors.*`, RN Views |
| SL-07 rule | `.lk-hyp-rule` `var(--zone-mid)` op `.7` dash `3 4` | `colors.zoneMid`, same |
| Tags/pills | `.lk-hyp-tag` `var(--font-mono)` 9px, pad `3px 7px`, `var(--r-pill)`, border `currentColor`, bg `var(--bg-1)` (`color-mix` 80% where supported) | `fonts.mono` 9, `radii.pill`, solid `colors.bg1`, tinted border |
| Side/day labels | `.lk-hyp-side` 10px · `.lk-hyp-day` 9.5px `var(--text-faint)` mono | `fonts.mono`, `colors.textFaint` |
| Stage/axis labels | 10px / 9.5px `var(--font-mono)` `var(--text-faint)` | `fonts.mono`, `colors.textFaint` |
| Shine (web) | `--lk-hyp-glow` set inline per mark → `drop-shadow(0 0 7px …)` on rects, `box-shadow 0 0 8px` on dots (same pattern as `.lk-ring-arc`'s `--lk-ring-glow`) | — |
| Shine (native) | — | wider faint duplicates: capsules +`SHINE_PAD 4`/side op `0.35`; SL-04/05 bars +2/side; dots 16px halo op `0.35` — **never SVG filters** (Ring precedent) |
| SVG | `preserveAspectRatio="none"`, `width:100%`, `overflow:visible` | `preserveAspectRatio="none"`, width = measured (− gutter when staged) |

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Default | SL-01 bands + capsules + connectors | same |
| Per-variant | SL-04/05/06/07 as §1; bare render works (catalog-mirroring defaults) | same |
| Shine off/on | base violet drop-shadow / per-mark colored glow | no glow / duplicate-shape glow |
| No stage labels | staged variants: no gutter, axis un-indented | same |
| No axis | `axis=[]` → axis row omitted (SL-05/06 default) | same |
| Data-only coach | `recommendation` omitted → no mint pill | same |
| Zero-minute segment/bucket | width/height clamps to 0 | same |
| Pre-measure (native) | n/a | SVG + overlays not drawn until `canvasW > 0` |

No hover/focus/disabled — presentational.

## 5. Web ↔ native parity

**Verdict: 🟡 same API & geometry; rendering substrate + two props differ.** Identical variant set, band order, token mapping, all §2 geometry constants, defaults, tag copy, and day-letter/dot layout. Differences:

- **SVG sizing:** web fixed `viewBox 0 0 560 height` + `preserveAspectRatio="none"` stretch; native measures via `onLayout` and sizes the Svg (same viewBox, same non-uniform stretch). Same result.
- **Overlays:** tags, dots, day letters and BED/WAKE labels are HTML positioned by `%` (web) vs RN Views positioned in px from the measured width (native) — substrate-only; keeps text/dots undistorted on both.
- **Shine:** web = CSS `drop-shadow`/`box-shadow` in the mark's color; native = a wider, fainter duplicate shape behind the mark (RN cannot do SVG filters — same approach as native `Ring`'s glow arc, `strokeWidth + 8`, `strokeOpacity 0.35`).
- **`ariaLabel` prop:** web only; native wraps with `accessibilityLabel`.
- **Capsule gradient tail:** web `0.95 → 0.6`, native `0.95 → 0.85` (intentional brightness fix, pre-existing). Minor.

No capability gap — fully usable on both.

## 6. Composition & usage

- **Used for:** the sleep detail card (SL-01), restlessness (SL-04), weekly duration vs target (SL-05), circadian consistency (SL-06), coach surfaces (SL-07). SL-02 → `StackedBar`, SL-03 → `Ring` — do not rebuild those here.
- **Composes from:** nothing — leaf primitive. Pair with `Stat`/`KeyValue` for the headline stat (the catalog card's `7H 40M` / `94%` header is Card chrome, not part of this chart) and `Card` for the panel.

```tsx
// web — coach night with recommendation
<Hypnogram
  variant="night-coach"
  segments={night}
  wakeWindowAt={0.62}
  recommendation="TRY LIGHTS-OUT 22:40 · +24 MIN DEEP"
  ariaLabel="Last night sleep stages with the coach wake window"
/>

// native — weekly durations vs target (wrap for a11y instead of ariaLabel)
<View accessibilityRole="image" accessibilityLabel="Hours slept per day vs an 8 hour target">
  <Hypnogram variant="sleep-week" week={[7.4, 6.1, 7.9, 8.2, 5.8, 8.6, 7.7]} targetHours={8} />
</View>
```

## 7. Accessibility

- **Web:** the `<svg>` has `role="img"` + the optional `ariaLabel`. Stage gutter and day-letter row are `aria-hidden` (visual aids). Always pass a meaningful `ariaLabel` naming the variant's story (e.g. "94% asleep, 22 minutes awake").
- **Native:** no built-in label; wrap in a `View` with `accessibilityRole="image"` + `accessibilityLabel`.
- Color carries meaning (violet asleep/on-target · amber awake/under · coral late · mint target/window) — keep the token mapping intact; tags/labels double-encode the key facts in text.

## 8. Usage rules — Do / Don't

**Do**
- Pick the variant by catalog ID (CHART-MAP.md): SL-04 restlessness, SL-05 week-vs-target, SL-06 drift, SL-07 coach.
- Pass real data (`segments` minutes, `intervals` bucket minutes, `week` hours, `nights` clock hours) — all scales self-normalize.
- Use clock hours for `nights`/`consistencyWindow`; values < 12 are next-morning (`0.5` = 12:30am).
- Localize the tag copy via `asleepLabel`/`awakeLabel`/`windowLabel`/`wakeWindowLabel`/`recommendation`.
- Pass a descriptive `ariaLabel` (web) / `accessibilityLabel` wrapper (native).

**Don't**
- ✗ Don't hand-roll any sleep chart — every SL-## form lives here (or in `StackedBar`/`Ring` for SL-02/03).
- ✗ Don't build SL-02/SL-03 as Hypnogram variants — they map to existing primitives.
- ✗ Don't pass `ariaLabel` on native (web-only prop).
- ✗ Don't recolor marks with non-token hexes — `--violet/--zone-mid/--zone-low/--mint` is the contract.
- ✗ Don't fake the coach pill with a positioned `Chip` over SL-01 — use `variant="night-coach"` + `recommendation`.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom capsules-on-bands SVG, a hand-made diverging asleep/awake bar strip, or a bed/wake dot plot duplicates this primitive — import `Hypnogram` with the right `variant`.
- **New need → add to BOTH platforms.** A new sleep variant, tag position, or state goes into web + native in the same change with the same prop names and tokens — never a one-off.
- **Tokens only.** All mark/tag/label colors come from `@lockin90/tokens`; the shine glow inherits the mark's own token color.
- **Native glow rule.** Never reach for `react-native-svg` filters — shine is a wider, fainter duplicate shape (see §3), the documented Ring approach.
- **Parity gate.** Before shipping a screen, confirm web phone-width ≡ native for the chosen variant: same bars/dots/tags, same colors, same day letters, same axis row.
