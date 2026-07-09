# SDD — `MetaphorWidget`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/MetaphorWidget.tsx` · `packages/ui-native/src/components/MetaphorWidget.tsx` ·
> no web CSS partner — all styling is inline SVG attributes (`.lk-metaphor` on the root is a bare hook class, like `.lk-daywheel`).
> **Exports:** `MetaphorWidget`, types `MetaphorWidgetProps`, `MetaphorWidgetVariant`, `MetaphorHabit`, `MetaphorMeal`, `MetaphorCamp` — **not yet re-exported from either `src/index.ts`** (the charts-program export wave lands separately).
> **Status:** Built. **Parity:** 🟡 same API & geometry; the breath-pacer orb is a 19s SMIL grow/shrink loop on web vs a **static mid-size orb** on native, the mountain YOU pulse is SMIL vs a static dot + halo ring, and every `shine` glow is `blur` on web vs a Gaussian-blurred duplicate shape on native (`FeGaussianBlur`; the bloom `drop-shadow` stays an unblurred faint duplicate).
> **Stories:** `packages/ui/src/stories/MetaphorWidget.stories.tsx` (`Charts/MetaphorWidget`) · `packages/ui-native/src/stories/MetaphorWidget.stories.tsx` (`Native/MetaphorWidget`).

---

## 1. Overview

The **catalog metaphor-widget family** (`lockin90-design/charts/metaphor-charts.html`, MT-01…MT-12; MT-02/04/08 are numbering gaps) — a value drawn as the **object it measures**: strain as a thermometer, a fast as an hourglass, habits as a garden, the 90-day program as a mountain, hydration as a bottle filling up, the food log as a strip of macro plates, breathwork as a growing orb and its summary curve. Nine variants share the fixed **320×150 viewBox** (pad l10 r12 t16 b14). Levels/positions arrive **normalized 0–1**; readouts/pills are preformatted strings. With no data props each variant renders its catalog card exactly.

Catalog-ID mapping:

| Catalog ID | `variant` | Key props (defaults = the card) |
| --- | --- | --- |
| MT-01 thermometer | `'thermometer'` (default) | `level 0.62` · `reading '14.2'` · `sub` · `pill` · SELECT `target`/`targetLabel` tick · `shine` = bulb glow |
| MT-03 fasting-hourglass | `'fasting-hourglass'` | `remaining 0.35` · `reading '4H 20M'` · `sub` · `pill` |
| MT-05 habit-garden | `'habit-garden'` | `habits` ×6 (`{name, weeks, color}`) · `caption` note |
| MT-06 plant-stages | `'plant-stages'` | `stages` ×5 · `pill 'YOUR MEDITATE PLANT · WEEK 4'` |
| MT-07 mountain-route | `'mountain-route'` | `route` profile · `camps` ×3 (`summit` flag) · `progress 0.62` · `progressLabel` · `shine` = line halo |
| MT-09 hydration-bottle | `'hydration-bottle'` | `level 0.6` · `glasses 8` · `reading '1.6 L'` · `sub` · `pill` |
| MT-10 meal-plates | `'meal-plates'` | `meals` ×4 (`{time, at, macros [pro, carb, fat], kcal}`) · `legend` |
| MT-11 breath-pacer | `'breath-pacer'` | `pattern [4, 7, 8]` · `centerLabel 'BREATHE'` · `caption` (derived) |
| MT-12 breath-session | `'breath-session'` | `bpm` 14→7 · `calmThreshold 8` · `markerAt 7` · `markerLabel` · `axisLabels` · `caption` legend (derived) |

## 2. API contract

Same prop API on both platforms; only the container props are platform-shaped.

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `variant` | 9-name union (§1) | `'thermometer'` | ✓ | ✓ | picks the metaphor |
| `level` | `number` | `0.62` / `0.6` | ✓ | ✓ | thermometer liquid / bottle fill, 0–1 (clamped) |
| `remaining` | `number` | `0.35` | ✓ | ✓ | hourglass sand remaining 0–1; the stream hides < 0.03 |
| `reading` | `string` | per-variant | ✓ | ✓ | big display readout next to the vessel |
| `sub` | `string` | per-variant | ✓ | ✓ | dim line under the reading |
| `pill` | `string` | per-variant | ✓ | ✓ | chip-pill text; `''` hides |
| `pillColor` | `string` | per-variant | ✓ | ✓ | pill tint (thermo/hourglass amber · bottle cyan · stages mint) |
| `target` | `number \| null` | `null` | ✓ | ✓ | thermometer TARGET tick 0–1 on the tube scale |
| `targetLabel` | `string` | `'TARGET'` | ✓ | ✓ | label next to the tick (coral) |
| `glasses` | `number` | `8` | ✓ | ✓ | bottle tick count; lit ticks = `round(level·glasses)` |
| `habits` | `MetaphorHabit[]` | catalog 6 | ✓ | ✓ | garden plants; stage = `min(4, weeks)`, streak caption = `weeks·7 + 'D'` |
| `stages` | `string[]` | catalog 5 | ✓ | ✓ | stage captions; plant `i` renders stage `min(4, i)`, last = full mint |
| `route` | `[number, number][]` | catalog profile | ✓ | ✓ | mountain `[x, y]` points 0–1; camps/YOU y is interpolated on it |
| `camps` | `MetaphorCamp[]` | D30/D60/D90 | ✓ | ✓ | `{at, label, summit?}` — summit flag lime, camps cyan |
| `progress` | `number` | `0.62` | ✓ | ✓ | YOU position along the route |
| `progressLabel` | `string` | `'YOU · DAY 56'` | ✓ | ✓ | YOU chip; `''` hides |
| `meals` | `MetaphorMeal[]` | catalog 4 | ✓ | ✓ | `macros` are `[protein, carbs, fat]` fractions summing to 1 |
| `legend` | `boolean` | `true` | ✓ | ✓ | meal-plates FAT/CARB/PRO legend, top-right |
| `pattern` | `[number, number, number]` | `[4, 7, 8]` | ✓ | ✓ | breath in/hold/out seconds — times the web loop, labels both |
| `centerLabel` | `string` | `'BREATHE'` | ✓ | ✓ | pacer orb label |
| `bpm` | `number[]` | catalog 14→7 | ✓ | ✓ | session curve; **fixed 5–16 bpm y-domain** (`(v−5)/11`, clamped) |
| `calmThreshold` | `number` | `8` | ✓ | ✓ | calm-zone top edge (bpm) + derived `CALM ZONE <N/MIN` caption |
| `markerAt` | `number \| null` | `7` | ✓ | ✓ | index of the calm-reached dot (clamped); `null` hides dot + chip |
| `markerLabel` | `string` | `'CALM REACHED · 6:40'` | ✓ | ✓ | marker chip; `''` hides the chip, keeps the dot |
| `axisLabels` | `string[]` | `['0:00', '5:00', '10:00']` | ✓ | ✓ | spread evenly; first start- / last end-anchored |
| `caption` | `string` | per-variant/derived | ✓ | ✓ | garden top-center note · pacer bottom note (`'4-7-8 · RING GROWS ON INHALE'`) · session top-right legend (`'BREATHS/MIN 14 → 7'`) |
| `title` | `string` | per-variant | ✓ | ✓ | top-left mono caption; pacer derives `BREATHE · ${pattern}` |
| `shine` | `boolean` | `false` | ✓ | ✓ | thermometer bulb glow + mountain line halo (no-op elsewhere) |
| `width` / `height` | `number` | `320` / `150` | ✓ | ✓ | rendered px — the viewBox scales to fit |
| `className` | `string` | — | ✓ | — | web only, merged onto `.lk-metaphor` |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only, container style |
| _rest_ | `Omit<SVGProps<SVGSVGElement>, 'width' \| 'height' \| 'children' \| 'target'>` | — | ✓ | — | spreads to the root `<svg>` (the SVG `target` attr is repurposed as the tick prop) |

## 3. Visual spec (tokens — never hardcode)

Geometry is the catalog's, in viewBox units (`W 320 · H 150 · pad l10 r12 t16 b14`). Glass/white alphas below are the catalog's literals and live inside the component.

| Element | Spec (both platforms) |
| --- | --- |
| Labels / chips | `--font-mono` 8.5 (chips 8), tracking `.06em`/`.05em` (native `0.5`/`0.4`), `--text-faint`; chip = rect h13 rx6.5 fill `rgba(8,10,18,0.78)` (`--bg-0` @ 78%) + tinted hairline @ 0.35 |
| Readings | `--font-display` 700 — thermo **26** (colored by level), hourglass/bottle **24** (`--text` / `--cyan`) |
| Thermometer | tube 12×92 rx6 + bulb r11, glass `white-5%` + stroke `white-25%` 1.4; liquid column w7 rx3.5 + bulb r8 @ 0.95, color: `level ≥ 0.72` → `--zone-low`, `≥ 0.4` → `--zone-mid`, else `--cyan` (**heat is inverted zone logic — hot = bad**); 5 scale ticks; target tick `--zone-low` 1.4 |
| Hourglass | frame path (46 wide, 92 tall) glass `white-4%` + `white-25%`; sand `--zone-mid` — top triangle @ 0.85 scaled by `remaining`, bottom @ 0.55 by `1 − remaining`; stream dashed `2 3` w1.2 @ 0.7 |
| Garden plants | mound `white-12%`; stem w2 round; ≤3 leaves @ 0.85; stage 4+ bloom r3.2 `--lime` + glow; stage 0 = sprout dot r2 @ 0.7; plant x spread `P.l+30 … (plotW−50)`, baseY 114 |
| Plant stages | same plant at stage `min(4, i)`; non-final colors = mint @ `0.4 + i·0.15` (web `rgba(52,245,197,α)`, native `#34F5C5` + alpha hex) |
| Mountain | polyline (not smoothed) `--indigo` 2.2 round + vertical veil `--indigo` 0.35→0.02; camp flags: stem `white-35%` 1.2 + pennant `l9 3.5-9 3.5z` `--cyan` (summit `--lime`); YOU = mint pulse dot + end-anchored chip |
| Bottle | neck `white-18%` + body 42×96 rx12 glass `4.5%`/`white-24%`; liquid wave path clipped to the body, vertical `--cyan` 0.85→0.4; 3 bubble outlines `white-40%` 0.8; glass ticks w1.2 — lit `--cyan`, rest `white-20%`, every 4th longer |
| Meal plates | rail `white-14%` 1.5 round at y 85; plates r13 glass + macro arcs r9 w5 butt with 2° gaps — **[PRO mint · CARB cyan · FAT violet]**; stem + `--text` dot on the rail; kcal above (`--text-dim`), time under (`--text-faint`) |
| Breath pacer | guide rings r24/34/44 `white-7%`; orb fill `--cyan` @ 0.22 + ring stroke 2 — web SMIL r `18;44;44;18;18`, keyTimes `0; in/T; (in+hold)/T; 0.95; 1`, dur `T = in+hold+out`; native static r **31**; phase labels IN `--cyan` / HOLD `--text-dim` / OUT `--violet` at x 236 |
| Breath session | grid (3 faint rules + baseline); calm zone rect `--cyan` @ 0.07 below `calmThreshold`; monotone smooth curve `--cyan` 2.2 round; marker dot r3.4 + cyan chip |
| Shine | web: bulb `blur(5px)` r9 @ 0.6 · mountain line stroke w7 @ 0.45 `blur(5px)`; native: same duplicates (bulb r9 @ 0.6 · line w7 @ 0.45) under `FeGaussianBlur stdDeviation 2.5` |

## 4. States

Pure render — no hover/press/focus/disabled states, no client hooks (only `useId` for gradient/clip ids).

| State | Behavior |
| --- | --- |
| Default | bare `<MetaphorWidget variant="…"/>` reproduces the catalog card |
| Empty (`habits: []` / `meals: []` / `bpm: []` / `route: []`) | frame + captions render — no marks, no crash (route interpolation guards `length 0`) |
| Out-of-range | `level`/`remaining` clamp 0–1; `markerAt` clamps into `bpm`; `bpm` values clamp into the 5–16 domain |
| Hidden affordances | `pill=''` / `progressLabel=''` / `markerLabel=''` / `caption=''` / `legend={false}` / `target={null}` / `markerAt={null}` each remove their mark |
| Reduced motion (web) | **not honored** — the pacer SMIL loop and the YOU pulse animate regardless (SMIL can't be CSS-gated; the catalog gates via `motion.js ?still=1`). Motion-sensitive surfaces should avoid `breath-pacer` or accept the loop |

## 5. Web ↔ native parity

**🟡 same API, platform-shaped implementation.** Identical geometry, data model, colors, defaults and draw order (both port the same catalog `draw()`). The real differences:

- **Breath-pacer orb** — web runs the 19s SMIL grow/shrink loop timed by `pattern`; native renders a **static mid-size orb (r 31)** — no SMIL/JS animation substrate. Motion-only diff; the phase labels and copy are identical.
- **Mountain YOU pulse** — web SMIL expanding ring + `drop-shadow`; native static dot + faint halo ring (r 7 @ 0.4), the `Ring` precedent.
- **Glows** — web `blur()`/`drop-shadow()` (bulb shine, line halo, bloom); native **Gaussian-blurred duplicate shapes** via `FeGaussianBlur stdDeviation 2.5` (bulb r9 @ 0.6, line w7 @ 0.45 — see CONVENTIONS.md); the bloom halo stays an unblurred faint duplicate (r5 @ 0.35).
- **Stage alphas** — web `rgba(52,245,197,α)` literal vs native `#34F5C5` + computed alpha hex — same rendered color.
- **Container** — web `svg[role=img]` + `className`/SVGProps rest; native `View accessibilityRole="image"` wrapping `Svg` + `style`.

## 6. Composition & usage

Standalone widget — composes nothing from the kit; typically placed inside a `Card` body on habit/fasting/hydration/food/breath surfaces. This is the **playful, object-shaped** end of the chart library: for plain trends use `LineChart`/`Sparkline`, for plain progress `ProgressBar`/`Ring`.

```tsx
// web — MT-09: live hydration
<MetaphorWidget variant="hydration-bottle" level={ml / goalMl} glasses={8}
  reading={`${(ml / 1000).toFixed(1)} L`} sub={`OF ${(goalMl / 1000).toFixed(1)} L`}
  pill={`NEXT GLASS · ${nextAt}`} />
```

```tsx
// native — MT-05: identical props
<MetaphorWidget variant="habit-garden"
  habits={habits.map((h) => ({ name: h.name.toUpperCase(), weeks: h.streakWeeks,
    color: h.broken ? colors.zoneLow : colors.mint }))} />
```

## 7. Accessibility

- **Web:** root `<svg role="img">` with a computed per-variant `aria-label` (e.g. `"WATER · TODAY: 1.6 L, 5 of 8 glasses"`). Override via `aria-label` in rest when the computed text isn't enough.
- **Native:** root `View` with `accessibilityRole="image"` + the same computed label.
- Non-interactive — no focus/keyboard surface. The pacer's SMIL loop ignores `prefers-reduced-motion` (§4) — gate at the surface level for motion-sensitive users.
- Color is a load-bearing channel (thermometer heat, wilted plants, macro arcs) — the readings/pills/streak captions carry the same story in text; keep them on.

## 8. Usage rules — Do / Don't

**Do**
- Normalize levels to 0–1 **before** passing (`ml / goal`, `elapsedFraction`) — the component never rescales vessels.
- Preformat readings/pills yourself (`'1.6 L'`, `'EATING OPENS 12:30'`) — they are drawn verbatim, uppercase mono like the catalog.
- Keep `macros` in **[protein, carbs, fat]** order — the arc colors and legend assume it.
- Give `bpm` real breaths/min values (5–16 renders; outside clamps) and keep `markerAt` an index into it.
- Override colors with **tokens only** (`var(--cyan)` / `colors.cyan`).

**Don't**
- Don't pass raw units as `level`/`remaining`/`progress` — everything positional is 0–1.
- Don't use the thermometer color ramp for generic zone verdicts — heat is **inverted** (high = coral); zone charts (`BarChart zone-bars`, `Ring zone`) own the normal mapping.
- Don't hand-position camps off the route — their y comes from `route` interpolation; move the profile, not the flag.
- Don't rebuild the pacer as a real-time animated session screen — this is the widget-scale pacer; a live session UI is its own feature.

## 9. Anti-patterns & lookalike ban

- **No hand-rolled metaphors.** Any thermometer/hourglass/garden/mountain/bottle/plates/breath-orb widget on a product surface is this component — never a local SVG lookalike.
- **New metaphor → both platforms.** A new object form (e.g. the catalog's unbuilt MT numbers, a battery — see `BodyBattery` first) is added here, web + native in the same unit of work, same prop names — never a one-off in an app.
- **Tokens only** — spectrum/zone/text tokens throughout; the glass alphas (tube 5%, frame 4%, body 4.5%, strokes 18–40%) live **inside** the component, never in app code.
- **Don't re-derive the geometry** (tube at x 86, hourglass cx 88, bottle 80/26/42×96, rail y 85, orb (118, 78), readings column x 170/176) in app code — the component is the single source of the catalog spec.
- **Parity gate:** any change ships only after the web story and the native story are compared side-by-side against `metaphor-charts.html`.
