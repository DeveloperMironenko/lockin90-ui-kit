# SDD — `TimelineChart`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/TimelineChart.tsx` · `packages/ui-native/src/components/TimelineChart.tsx` —
> fully inline-styled; `.lk-tlc` / `.lk-tlc--<variant>` are hook classes only (no CSS partner file).
> **Exports:** `TimelineChart`, types `TimelineChartProps`, `TimelineChartVariant`, `TimelineMarkerStyle`, `TimelineFeedLayout`, `TimelineEvent`, `TimelineSpan`, `TimelineLane`, `TimelineCluster`, `TimelineMilestone`, `TimelineAxisLabel`, `TimelineZoneStop`.
> **Status:** Shipped. **Parity:** 🟡 same API & geometry; the render substrate differs by necessity — web = SVG + HTML overlays with CSS `drop-shadow`/`blur` and an SMIL pulse, native = SVG + View overlays with `shadow*` glow, an `Animated` pulse ring, and shine as a wider faint duplicate (no filters).
> **Stories:** `packages/ui/src/stories/TimelineChart.stories.tsx` (`Charts/TimelineChart`) · `packages/ui-native/src/stories/TimelineChart.stories.tsx` (`Native/TimelineChart`).

---

## 1. Overview

The **catalog timeline family** (`lockin90-design/charts/timeline-charts.html`, TL-01…TL-20) — events, spans and journeys through the day: sixteen variants in a **320×`height` viewBox** (default 150). Section A puts events on a horizontal rail (`event-line` with dot/pin/pill markers, `now-strip` past/future split, `planned-hollow` dashed future rings, `zone-strip` energy band, `spark-under` context sparkline, `heat-ticks` hour-quality barcode); section B lays out spans (`range-blocks` day segments, `multi-lane` BODY/MIND/LIFE tracks, `gantt-mini` phases with dependency elbows, `duration-brackets` named windows, `cluster-bubbles` density, `ticks-24h` precise hour scale); section C covers feeds & journeys (`feed` vertical log — single-side or alternating, `milestone-flags` pennants, `journey-line` THE 90-day rail, `now-zone-strip` the full today widget). All positions are **0–1 fractions of the visible window**.

The SVG stretches (`preserveAspectRatio="none"`); everything that must stay round or legible — dots, rings, bubbles, milestone rings, pennants, pulses, mono notes, chip pills — renders as **overlays positioned by percentage** (web absolutely-positioned `<span>`s, native zero-size anchor `View`s), so markers never distort with container width.

**Catalog-ID mapping** (story names carry the IDs):

| ID | `variant` | Key props |
| --- | --- | --- |
| TL-01 | `event-line` | `events` + SELECT `markers`: `'dots' \| 'pins' \| 'pills'` |
| TL-04 | `now-strip` | `events` + `now` (default 0.6) |
| TL-05 | `planned-hollow` | `events` + `now` (default 0.5) — future = dashed hollow rings |
| TL-06 | `zone-strip` | `events` + `zoneStops` |
| TL-07 | `spark-under` | `events` + `spark` (default catalog wave, seed 77) |
| TL-08 | `heat-ticks` | `heat` (default catalog noisy, seed 31; 25 ticks) |
| TL-09 | `range-blocks` | `spans` |
| TL-10 | `multi-lane` | `lanes` |
| TL-11 | `gantt-mini` | `spans` (phase rows) |
| TL-12 | `duration-brackets` | `spans` (windows) |
| TL-13 | `cluster-bubbles` | `clusters` |
| TL-14 | `ticks-24h` | `events` + `axisLabels` |
| TL-15 | `feed` | `events` (rows with `time`) + SELECT `layout`: `'single-side' \| 'alternating'` |
| TL-17 | `milestone-flags` | `events` (flags) |
| TL-18 | `journey-line` | `progress` + `progressLabel` + `milestones` |
| TL-20 | `now-zone-strip` | `events` + `now` (default 0.55) + `zoneStops` |

## 2. API contract

Same prop API on both platforms; only the container props are platform-shaped.

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `variant` | `TimelineChartVariant` | `'event-line'` | ✓ | ✓ | TL-01 … TL-20 |
| `events` | `TimelineEvent[]` | catalog day WAKE→WIND-DOWN (feed/flags/ticks-24h have their own defaults) | ✓ | ✓ | rail events · `feed` rows · `milestone-flags` |
| `spans` | `TimelineSpan[]` | catalog BLOCKS / GANTT / BRACKETS per variant | ✓ | ✓ | `range-blocks` / `gantt-mini` / `duration-brackets` |
| `lanes` | `TimelineLane[]` | catalog BODY/MIND/LIFE | ✓ | ✓ | `multi-lane` only |
| `clusters` | `TimelineCluster[]` | catalog 3/7/2/5 | ✓ | ✓ | `cluster-bubbles`; radius `6 + count·1.6` |
| `markers` | `'dots' \| 'pins' \| 'pills'` | `'dots'` | ✓ | ✓ | TL-01 SELECT; applies to any rail variant |
| `layout` | `'single-side' \| 'alternating'` | `'single-side'` | ✓ | ✓ | TL-15 SELECT |
| `now` | `number` | `0.6` / `0.55` / `0.5` per variant, else off | ✓ | ✓ | NOW rule + pulse; past/future split |
| `nowLabel` | `string` | `'NOW'` | ✓ | ✓ | caption above the NOW rule |
| `zoneStops` | `TimelineZoneStop[]` | catalog low→high→mid→low @ 0.25 | ✓ | ✓ | zone band gradient (`zone-strip` / `now-zone-strip`) |
| `spark` | `number[]` | catalog wave (seed 77, n 24) on `spark-under` | ✓ | ✓ | 0–1 values; drawable on any rail variant |
| `heat` | `number[]` | catalog noisy (seed 31, n 25) | ✓ | ✓ | tick color = `zoneOf(v)` (≥0.62 high · ≥0.38 mid · low) |
| `progress` | `number` | `0.62` | ✓ | ✓ | `journey-line` position, clamped 0–1 |
| `progressLabel` | `string` | `'DAY 56 · 62%'` | ✓ | ✓ | chip riding the journey position; `''` hides |
| `milestones` | `TimelineMilestone[]` | START / DAY 30 / DAY 60 / DAY 90 | ✓ | ✓ | journey rings; passed = `progress ≥ at` |
| `title` | `string` | `'TODAY'` (`'TODAY · LOG'` / `'PROGRAM PHASES'` / `'MILESTONES · 90D'` / `'90-DAY PROGRAM'`) | ✓ | ✓ | top-left mono caption; `''` hides |
| `axisLabels` | `TimelineAxisLabel[]` | 6AM/NOON/11PM (ticks-24h: 6AM/NOON/6PM) | ✓ | ✓ | hour captions under the rail |
| `shine` | `boolean` | `false` | ✓ | ✓ | journey-rail glow underlay + glow behind rail dots |
| `height` | `number` | `150` | ✓ | ✓ | viewBox + px height; `feed` auto-grows to fit rows (`36 + (n−1)·26 + 36`) |
| `ariaLabel` | `string` | — | ✓ | ✓ | web `aria-label` on the svg / native `accessibilityLabel` |
| `className` | `string` | — | ✓ | — | web only, merged onto `.lk-tlc .lk-tlc--<variant>` |
| `style` | `CSSProperties` / `StyleProp<ViewStyle>` | — | ✓ | ✓ | web merges onto the root div; native container style |
| _rest_ | `HTMLAttributes<HTMLDivElement>` | — | ✓ | — | spreads to the root `<div>` |

**`TimelineEvent`** — `{ at?, label?, color?, time? }`: `at` 0–1 (unused by `feed`, which lays rows in array order); `color` defaults `--mint`; `time` is the feed's rail-side caption.
**`TimelineSpan`** — `{ from, to, label?, color? }`. **`TimelineLane`** — `{ name, spans }`. **`TimelineCluster`** — `{ at, count, color? }`. **`TimelineMilestone`** — `{ at, label }`. **`TimelineAxisLabel`** — `{ at, label }`. **`TimelineZoneStop`** — `{ offset, color, opacity? }`.

## 3. Visual spec (tokens — never hardcode)

Geometry is the catalog's, in viewBox units: `W 320 · pad l10 r12 t16 b14`; rail `AX = 16`, `AW = 282`, `ax(f) = AX + AW·f`; main rail y = `height/2 + 4`.

| Element | Spec (both platforms) |
| --- | --- |
| Rail axis | `--text` @ 0.14, 1.5px round cap; hour captions 16px below, `--text-faint` (edge labels start/end-anchored) |
| Mono notes | `--font-mono` / `fonts.mono`, **8.5px**, `.06em` (native `0.5`) — title/hours/NOW/lane names/inline labels |
| Chip pills | HTML/View pill: `padding 2px 6px`, r 999, bg `--bg-0` @ 78% (web `color-mix` / native `` `${colors.bg0}C7` ``), border 1px = color @ 35% (native `` `${color}59` ``), 8px mono text in the color |
| Event dots | Ø 8 overlay circles in the event color (`--mint` fallback); future @ 0.35 on now variants; `shine` adds `drop-shadow(0 0 4px c)` (web) / `shadow*` + elevation 3 (native) |
| Pins (TL-01) | stem `--text` @ 0.3 up 18px; glow head Ø 6.8 at `y−21`; base dot Ø 4 `--text` |
| Hollow rings (TL-05) | Ø 9.5 dashed 1.5px border in the event color |
| Zone band (TL-06/20) | rect `AX…AX+AW`, h 10, rx 5, horizontal gradient from `zoneStops` (defaults `--zone-low/high/mid/low` @ 0.25) |
| Spark (TL-07) | monotone path `--text` @ 0.1, 1.5px over the full plot |
| Heat ticks (TL-08) | ±7px verticals, 2.4px round cap, stroke = `zoneOf(v)` |
| Range blocks (TL-09) | h 16, rx 8, color @ 0.8; label in dark ink `--void` only when block > 46px wide; axis at `y+14` |
| Lanes (TL-10) | rows at `42 + li·32`; lane rule `--text` @ 0.07 from `AX+34`; pills h 14, rx 7 @ 0.85, min-width 8 |
| Gantt (TL-11) | rows at `46 + ri·30`, h 16, rx 4 @ 0.85, `--void` ink labels; dependency elbow `--text` @ 0.25, 1px, dash `2 2` |
| Brackets (TL-12) | ⊓ outline 1.4px in the span color from `y−12` to `y−18`; chip at `y−28` |
| Bubbles (TL-13) | r `6 + count·1.6`; border 1.2px color; fill color @ 25% (web `color-mix` / native `` `${c}40` ``); count in 9px mono `--text` |
| 24h ticks (TL-14) | 25 ticks, bold every 6h (±6px @ 0.3) vs ±3px @ 0.12; events Ø 6.8 |
| Feed (TL-15) | rail x 46 (alternating: W/2) `--text` @ 0.14; rows at `36 + i·26`; glow dot Ø 7.2; time note `--text-faint` |
| Flags (TL-17) | stem `--text` @ 0.3 1.2px; 30×12 pennant `M0 0L30 6L0 12Z` @ 0.9; chip below at `y+24` |
| Journey (TL-18) | track `--text` @ 0.1, 6px round; progress = `--lime`→`--mint` gradient 6px; milestone rings Ø 11 (passed = `--mint` fill; ahead = `--bg-1` + `--text` @ 25% border); mint pulse + chip at the head |
| NOW | rule `--text` @ 0.25 from `y−26` to `y+20`; pulse dot r 3.6 `--text` + expanding ring; `nowLabel` at `y−32` `--text-dim` |
| Shine (journey) | web wider 11px mint duplicate @ 0.5 with `blur(6px)`; native same duplicate @ 0.3, **no blur** (Ring precedent) |

Deterministic defaults are catalog ports: `genData('wave', 77, 24)` spark, `genData('noisy', 31, 25)` heat, the WAKE→WIND-DOWN event day, BLOCKS/LANES/GANTT/BRACKETS/CLUSTERS/MILESTONES tables.

## 4. States

Pure render — no hover/press/focus/disabled states; the only client behavior is the pulse loop (and native width measurement).

| State | Behavior |
| --- | --- |
| Default | draws the chosen variant from `events`/`spans`/`lanes`/`clusters` (catalog defaults) |
| Past/future (`now` set) | `now-strip`/`now-zone-strip` dim future dots to 0.35; `planned-hollow` swaps future dots for dashed rings; any rail variant gains the NOW rule when `now` is passed |
| Empty arrays | rail/axis/title still render — no markers, no crash |
| `feed` overflow | height auto-grows to fit all rows |
| Reduced motion (web) | SMIL pulse replaced by a static halo ring (r 7 @ 0.4) via the `useMotionOK` gate |
| Pre-layout (native) | Svg waits for the measured width (`onLayout`) — overlays render immediately |

## 5. Web ↔ native parity

**🟡 same API, platform-shaped implementation.** Both sides build the *same* mark/overlay lists from the same catalog constants — geometry, colors, data model and label layout are identical. The real differences:

- **Pulse substrate** — web uses an SMIL `<animate>` ring behind a `drop-shadow` dot, gated by `prefers-reduced-motion`; native uses an `Animated.loop` ring (scale 1→3, fade .8→0, 1.8s — same choreography). Native has no reduced-motion gate (no OS media query); web falls back to a static halo.
- **Glow substrate** — web `filter: drop-shadow(...)` on dots and `blur(6px)` on the journey shine; native `shadowColor/shadowRadius/elevation` on dots and an **un-blurred** wider faint duplicate for shine (RN SVG filters unreliable — Ring precedent).
- **Overlay substrate** — web absolutely-positioned `<span>`s with `%` left + `transform` anchoring; native zero-size anchor `View`s with `alignItems` anchoring (Yoga static position). Same visual result.
- **Dashed ring rendering** — `planned-hollow` rings are CSS `border: dashed` (web) vs RN `borderStyle: 'dashed'` (native); dash rhythm differs slightly by renderer.
- **Container** — web `div.lk-tlc[…]` + `className`/rest, `aria-label` on the inner svg; native `View accessibilityRole="image"` + `style`, Svg sized to the measured width.

## 6. Composition & usage

Standalone chart — composes nothing from the kit; typically placed inside a `Card` body on Today/History/Program screens. The day strip (TL-01/04/20), activity feeds (TL-15), and THE 90-day journey widget (TL-18).

```tsx
// web — TL-20 the full today widget
<TimelineChart
  variant="now-zone-strip"
  now={0.55}
  events={[
    { at: 0.08, label: 'WAKE', color: 'var(--mint)' },
    { at: 0.38, label: 'TRAINING', color: 'var(--cyan)' },
    { at: 0.74, label: 'MEETING', color: 'var(--violet)' },
  ]}
/>
```

```tsx
// native — identical props (TL-18 journey)
<TimelineChart
  variant="journey-line"
  progress={0.62}
  progressLabel="DAY 56 · 62%"
  milestones={[
    { at: 0, label: 'START' },
    { at: 0.33, label: 'DAY 30' },
    { at: 0.66, label: 'DAY 60' },
    { at: 1, label: 'DAY 90' },
  ]}
/>
```

## 7. Accessibility

- **Web:** the `<svg>` carries `role="img"` + `aria-label={ariaLabel}` (or `aria-hidden` when no label); overlay text is real DOM but `pointer-events: none` — pass a data-bearing `ariaLabel` ("Today's timeline: 6 events, now 2pm").
- **Native:** root `View` with `accessibilityRole="image"` + `accessibilityLabel={ariaLabel}`.
- Non-interactive — no focus/keyboard surface. Overlay text renders at true px (8.5/8px) regardless of chart width — legible even when the SVG stretches.
- Pulses respect `prefers-reduced-motion` on web; keep `nowLabel`/chips as the textual channel — color alone never carries past/future.

## 8. Usage rules — Do / Don't

**Do**
- Normalize times to 0–1 fractions of the visible window before passing (`at`, `from`/`to`, `now`, `progress`).
- Use `now-zone-strip` for the Today screen, `feed` for history logs, `journey-line` for the 90-day program header.
- Pass `axisLabels` matching your real window (the 6AM/NOON/11PM default is the catalog demo day).
- Keep `events` ≤ ~8 on a rail — chips clamp but crowd; use `cluster-bubbles` for dense periods.
- Override colors with **tokens only** (`var(--cyan)` / `colors.cyan`).

**Don't**
- Don't feed absolute timestamps or minutes — the component never scales input.
- Don't use `markers="pills"` with unlabeled events — pills only render when `label` is set.
- Don't rebuild the feed as a list component with dots — TL-15 *is* the timeline feed.
- Don't animate the NOW pulse yourself or add SVG filters on native; the substrate is fixed (§5).
- Don't hardcode hex in `color` overrides.

## 9. Anti-patterns & lookalike ban

- **No hand-rolled timelines.** Any event rail, day strip, span lane, mini gantt, activity feed or journey/progress rail on a product surface is this component — never a local SVG/View lookalike.
- **New variant → both platforms.** A new timeline form is added here, web + native in the same unit of work, with the same prop names — never a one-off in an app.
- **Tokens only** — the catalog's raw whites are expressed as `--text`/`colors.text` + opacity inside the component; dark ink on colored pills is `--void`, never `#000`.
- **Substrate diffs stay documented, not widened** — don't bolt blur filters onto native or replace the Animated pulse with SMIL; §5 is the accepted contract.
- **Parity gate:** any change ships only after the web story and the native story are compared side-by-side against `timeline-charts.html`.
