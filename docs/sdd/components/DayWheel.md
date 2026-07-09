# SDD — `DayWheel`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/DayWheel.tsx` · `packages/ui-native/src/components/DayWheel.tsx` ·
> no web CSS partner — all styling is inline SVG attributes (`.lk-daywheel` on the root is a bare hook class, like `.lk-sankey`).
> **Exports:** `DayWheel`, types `DayWheelProps`, `DayWheelEvent`, `DayWheelVariant` — **not yet re-exported from either `src/index.ts`** (the charts-program export wave lands separately).
> **Status:** Built. **Parity:** 🟡 same API & geometry; the NOW pulse is a SMIL-animated expanding ring + `drop-shadow` on web vs a static dot + faint halo ring on native, and every glow (event dots, `shine`) is `drop-shadow`/`blur` vs a Gaussian-blurred duplicate shape (`FeGaussianBlur`, real RN-SVG Fabric filters).
> **Stories:** `packages/ui/src/stories/DayWheel.stories.tsx` (`Charts/DayWheel`) · `packages/ui-native/src/stories/DayWheel.stories.tsx` (`Native/DayWheel`).

---

## 1. Overview

The **catalog radial/day-wheel family** (`lockin90-design/charts/radial-charts.html`, RA-01…RA-06) — circadian data wrapped around a 24h clock, midnight at the top, time running clockwise (`angle = h/24·360`). Four variants share the fixed **320×150 viewBox** with the wheel centered at (160, 81), R 52: the event clock with a NOW hand + pulse and a digital center, 24 zone-colored radiating bars, the 24-segment quality wheel with a big center score, and the 7-ring week spiral. Hourly values arrive **normalized 0–1** (zone thresholds ≥ 0.62 high / ≥ 0.38 mid / else low, the catalog `zoneOf`). With no data props it renders its catalog card: the fixed RA-01 events + `now` 14.6, `hours` = the page's `dayVals(22)` curve, `week` = `dayVals(30+7d)`. This is the radial DATA wheel — for phase bands / cycle arcs reach for `PhaseWheel`.

Catalog-ID mapping:

| Catalog ID | `variant` | Card props (see stories) |
| --- | --- | --- |
| RA-01 clock-events | `'clock-events'` (default) | fixed `EVENTS` ×5 + `now 14.6` — the defaults ARE the card |
| RA-03 radial-bars | `'radial-bars'` | `hours dayVals(22)` — also the default `hours` |
| RA-05 zone-wheel | `'zone-wheel'` | `hours dayVals(33)` · `score '74'` (the card's seed differs from the default) |
| RA-06 radial-heat | `'radial-heat'` | `week` = `dayVals(30+7d)`, d 0–6 — the defaults ARE the card |

## 2. API contract

Same prop API on both platforms; only the container props are platform-shaped.

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `variant` | `'clock-events' \| 'radial-bars' \| 'zone-wheel' \| 'radial-heat'` | `'clock-events'` | ✓ | ✓ | RA-01 / RA-03 / RA-05 / RA-06 |
| `events` | `DayWheelEvent[]` | catalog RA-01 events | ✓ | ✓ | `clock-events` — glowing dots on the rim |
| `now` | `number \| null` | `14.6` | ✓ | ✓ | `clock-events` — NOW hour 0–24: hand + pulse + digital center; `null` hides all three |
| `hours` | `number[]` | catalog `dayVals(22)` | ✓ | ✓ | `radial-bars` + `zone-wheel` — 24 hourly 0–1 values, midnight first (extra entries sliced) |
| `score` | `string \| number` | `'74'` | ✓ | ✓ | `zone-wheel` center readout |
| `centerLabel` | `string` | `'TODAY'` | ✓ | ✓ | `zone-wheel` faint caption under the score |
| `week` | `number[][]` | catalog `dayVals(30+7d)` | ✓ | ✓ | `radial-heat` — day rings × 24 hourly 0–1 values, **innermost ring first** (catalog: Monday in) |
| `color` | `string` | `'var(--mint)'` / `colors.mint` | ✓ | ✓ | `radial-heat` segment hue (the other variants are zone/event-colored) |
| `legend` | `string` | `'RING = DAY · MON IN'` | ✓ | ✓ | `radial-heat` chip-pill, top-right; `''` hides it |
| `title` | `string` | per-variant catalog title | ✓ | ✓ | top-left mono caption (e.g. `'TODAY · AROUND THE CLOCK'`) |
| `shine` | `boolean` | `false` | ✓ | ✓ | glow underlay behind dots/bars/segments; **no-op on `radial-heat`** (168 segments would smear) |
| `width` | `number` | `320` | ✓ | ✓ | rendered px — the 320×150 viewBox scales to fit |
| `height` | `number` | `150` | ✓ | ✓ | rendered px |
| `className` | `string` | — | ✓ | — | web only, merged onto `.lk-daywheel` |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only, container style |
| _rest_ | `Omit<SVGProps<SVGSVGElement>, 'width' \| 'height' \| 'children' \| 'color'>` | — | ✓ | — | spreads to the root `<svg>` (the SVG `color` attr is repurposed as the heat hue prop) |

**`DayWheelEvent`** — `{ at: number; color?: string; label?: string }`: `at` is the clock hour 0–24 (fractional ok, 7.2 = 07:12); `color` defaults to `--accent`/`colors.accent`; `label` is the accessible name only (web renders it as the dot's `<title>` tooltip — never drawn).

## 3. Visual spec (tokens — never hardcode)

Geometry is the catalog's, in viewBox units: `W 320 · H 150 · pad l10 r12 t16 b14 · center (160, 81) · R 52 · ha(h) = h/24·360`, 0° at 12 o'clock, clockwise.

| Element | Spec (both platforms) |
| --- | --- |
| Clock frame (RA-01/03) | rim circle R 52 stroke `--border` w1 (the catalog's `rgba(255,255,255,0.09)` IS the token); 24 inward ticks R→R−3 (R−6 every 6h), stroke `--text` @ 12% (bold @ 30% — web `color-mix`, native `${colors.text}1F`/`4D`), w1; cardinals `12A/6A/12P/6P` at R+10 |
| Labels | `--font-mono` / `fonts.mono`, **8.5** viewBox px, tracking `.06em` (native `0.5`), `--text-faint`; heading top-left at (12, 11), start-anchored |
| Event dots (RA-01) | r 4, fill `event.color` (default `--accent`); web glow `drop-shadow(0 0 4px c)` — native a duplicate circle r 7 @ 0.35 behind |
| NOW (RA-01) | hand: line center→rim, `--text` @ 20% w1 (native `${colors.text}33`) · dot r 3.6 fill `--text` + web `drop-shadow(0 0 5px)` · pulse: web SMIL ring r 3.6→11 / opacity .8→0, 1.8s ∞ — native static halo ring r 7, stroke 1.4 @ 0.4 (the `Ring` precedent) · digital center `formatClock(now)` at (160, 85) in `--text-dim` |
| Bars (RA-03) | 24 lines from r 14 to `14 + v·(R−18)` (max 48), stroke `zoneOf(v)`, w 4.5, round caps, opacity 0.9 |
| Segments (RA-05) | 24 open arcs at R−6 (46), per-hour 15° minus 1.5° gaps each side, stroke `zoneOf(v)`, w 11, **opacity 0.35 + 0.6·v**; cardinals at R+8; center score 20px `--font-display` weight 700 `--text` at (160, 88) + `centerLabel` at (160, 102) |
| Heat rings (RA-06) | ring d at r `18 + d·5` (18…48), 24 arcs each, 15° minus 2° gaps, stroke `color` (default `--mint`), w 3.4, **opacity 0.06 + 0.85·v**; cardinals at 58; `legend` chip at (304, 26) in `--text-dim`, end-anchored |
| Zones | catalog `zoneOf(v)`: `≥ 0.62` → `--zone-high`, `≥ 0.38` → `--zone-mid`, else `--zone-low` |
| Chips (catalog `tag()`) | rect w `len·5.35+12`, h 13, rx 6.5, fill `--bg-0` @ 78% (web `color-mix`, native `${colors.bg0}C7` — the catalog's `rgba(8,10,18,0.78)`), stroke = chip color @ 0.35, w 0.8; centered 8px mono text (tracking `.05em` / native `0.4`); x clamps into the padded box |
| Shine | web blurred duplicates — events circle r 7 @ 0.35 `blur(3px)`, bars line w 9 @ 0.3 `blur(3px)`, wheel arc w 15 @ 0.25 `blur(4px)`; native the same duplicates blurred with `FeGaussianBlur` (dots/bars `stdDeviation 1.5`, wheel `stdDeviation 2`; events add a blurred r 7 @ 0.35 over the always-on r 7 glow) |
| Sizing | both roots render at the `width`/`height` props (default 320×150) — explicit px like `SankeyChart`, not fluid like `ScatterChart` |

## 4. States

Pure render — no hover/press/focus/disabled states, no client hooks.

| State | Behavior |
| --- | --- |
| Default | draws the frame + the chosen variant's marks; bare `<DayWheel variant="…"/>` reproduces the catalog card (RA-05 excepted — its card seed is 33, see §1) |
| Empty (`events: []` / `hours: []` / `week: []`) | frame + captions render — no dots/bars/segments, no crash |
| `now={null}` | no hand, no pulse, no digital center (aria text drops the clock too) |
| Oversized `hours` / `week` rows | sliced to 24 entries; short arrays draw fewer marks (no fill-in) |
| Reduced motion (web) | **not honored** — the SMIL pulse ring animates regardless (SMIL can't be CSS-gated and the styles file is frozen; the catalog page gates via `motion.js ?still=1`). Motion-sensitive surfaces pass `now={null}` or accept the 1.8s ring |

## 5. Web ↔ native parity

**🟡 same API, platform-shaped implementation.** Identical geometry, data model, colors, zone thresholds, defaults and draw order (both port the same catalog `draw()`). The real differences:

- **NOW pulse** — web animates an expanding SMIL ring (`<animate>` r 3.6→11 / opacity .8→0, 1.8s ∞) and glows the dot with `drop-shadow`; native draws a **static dot + faint halo ring** (r 7, stroke 1.4 @ 0.4) per the `Ring`/`ScatterChart` pulse precedent — no SMIL/JS animation. Motion-only diff; does not block use.
- **Event-dot glow** — web `drop-shadow(0 0 4px c)` per dot; native an always-on **wider faint duplicate circle** (r 7 @ 0.35); `shine` layers a Gaussian-blurred r 7 @ 0.35 duplicate behind it (`FeGaussianBlur stdDeviation 1.5`; see CONVENTIONS.md).
- **Shine substrate** — web CSS `blur(3–4px)` underlays; native the same wider duplicates blurred via `FeGaussianBlur` (`stdDeviation 1.5`/`2`; events add a blurred r 7 @ 0.35).
- **`DayWheelEvent.label`** — web renders it as the dot's `<title>` tooltip; native has no tooltip substrate — the prop is accepted but not rendered (the container label carries the meaning).
- **Container** — web `svg[role=img]` root + `className`/SVGProps rest; native `View accessibilityRole="image"` wrapping `Svg` + `style`.
- **Label styling channel** — web inline `style={{ fontFamily, letterSpacing }}` on `<text>`; native `fontSize/fontFamily/letterSpacing` props on `Svg.Text` (`0.5`/`0.4` ≈ `.06em`/`.05em`).

## 6. Composition & usage

Standalone chart — composes nothing from the kit; typically placed inside a `Card`/`MetricTile` body. Circadian surfaces: today's events around the clock, hour-by-hour energy verdicts, "when am I green vs red", the week spiral.

```tsx
// web — RA-01: today's log around the clock, live NOW
<DayWheel events={log.map((e) => ({ at: e.hour, color: 'var(--cyan)', label: e.name }))}
  now={currentHour} title="TODAY · AROUND THE CLOCK" />
```

```tsx
// native — RA-05: identical props
<DayWheel variant="zone-wheel" hours={hourlyEnergy.map((v) => v / 100)}
  score={Math.round(dayScore)} centerLabel="TODAY" />
```

## 7. Accessibility

- **Web:** root `<svg role="img">` with a computed per-variant `aria-label` (e.g. `"TODAY · AROUND THE CLOCK: 5 events on the 24h clock, now 14:36"`); event `label`s surface as `<title>` tooltips. Override via `aria-label` in rest when the computed text isn't enough.
- **Native:** root `View` with `accessibilityRole="image"` + the same computed label.
- Non-interactive — no focus/keyboard surface. In-chart text scales with the container (8.5 viewBox px ≈ 9.6px at 360w); keep wheels ≥ ~300px wide or move the conclusion into surrounding real text.
- The web SMIL pulse does **not** honor `prefers-reduced-motion` (§4) — pass `now={null}` on motion-free surfaces. Zone color is the only channel on `radial-bars`/`zone-wheel` verdicts — pair with a caption when the verdict is load-bearing.

## 8. Usage rules — Do / Don't

**Do**
- Normalize hourly data to 0–1 **before** passing it (`v / 100`) — the component never rescales; index 0 is midnight.
- Keep `week` innermost-ring-first (oldest day in) so the spiral reads outward like the catalog.
- Use fractional `at`/`now` for real clock times (7.2 = 07:12); the digital center formats it for you.
- Override `color`/event colors with **tokens only** (`var(--cyan)` / `colors.cyan`).
- Reproduce catalog cards in stories/tests with the `dayVals` seeds in the story files (22 / 33 / 30+7d) when checking parity.

**Don't**
- Don't pass raw-unit data (scores 0–100, minutes) — everything is 0–1 wheel space.
- Don't use `radial-heat`'s `color` to fake zone verdicts — `radial-bars`/`zone-wheel` own the zone encoding.
- Don't draw phase bands / cycle windows with this — that's `PhaseWheel`.
- Don't hardcode hex in `color`/`events[].color`, and don't re-derive `zoneOf` thresholds in app code.

## 9. Anti-patterns & lookalike ban

- **No hand-rolled day wheels.** Any 24h radial/clock chart on a product surface is this component — never a local SVG lookalike.
- **New variant → both platforms.** A new radial form (e.g. the catalog's polar-area or windows kinds, if promoted) is added here, web + native in the same unit of work, with the same prop name — never a one-off in an app.
- **Tokens only** — spectrum/zone/text tokens throughout; the catalog's white/dark alphas (rim 9%, ticks 12/30%, hand 20%, chip fill `--bg-0` @ 78%) live **inside** the component, never in app code.
- **Don't re-derive the geometry** (center (160, 81), R 52, bar base r 14, segment gaps, ring pitch 5) in app code — the component is the single source of the catalog spec.
- **Parity gate:** any change ships only after the web story and the native story are compared side-by-side against `radial-charts.html`.
