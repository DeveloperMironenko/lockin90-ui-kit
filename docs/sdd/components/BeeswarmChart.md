# SDD — `BeeswarmChart`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/BeeswarmChart.tsx` · `packages/ui-native/src/components/BeeswarmChart.tsx` ·
> web CSS `packages/ui/src/styles/components/beeswarm.css` (`.lk-swarm*`).
> **Exports:** `BeeswarmChart`, types `BeeswarmChartProps`, `BeeswarmChartVariant`, `BeeswarmPoint`, `BeeswarmGroup`, `BeeswarmTick`.
> **Status:** Shipped. **Parity:** 🟡 same API & look; the BW-02 TODAY pulse animates on web (CSS ring) but is a static duplicate halo on native, and glows blur on web vs wider faint duplicates on native.
> **Stories:** `packages/ui/src/stories/BeeswarmChart.stories.tsx` (`Charts/BeeswarmChart`) · `packages/ui-native/src/stories/BeeswarmChart.stories.tsx` (`Native/BeeswarmChart`).

---

## 1. Overview

The **catalog beeswarm family** (`lockin90-design/charts/beeswarm-charts.html`, BW-01…BW-04) for product surfaces: **every session is a dot** — your whole history in one swarm along a value axis. Four variants drawn in a fixed **320×150 viewBox**; dot placement is the catalog's **greedy collision-free `swarm()`** ported verbatim (sort by x; for each dot try vertical offsets 0, ±STEP, ±2·STEP…; keep the first that doesn't collide with an already-placed dot).

| Catalog ID | Props | Card |
| --- | --- | --- |
| BW-01 `history-swarm` | `variant="history-swarm"` (default) + `points` (`series`/`ring`) | sessions on the duration axis · colored by type · this week ringed white · legend |
| BW-02 `score-swarm` | `variant="score-swarm"` + `points` (`hero`) | daily scores on 0–100, zone-colored · TODAY pulses with a pill |
| BW-03 `pr-swarm` | `variant="pr-swarm"` + `points` (`hero`) | faint white dots · the PR glows mint + pill — one hero dot |
| BW-04 `month-swarm` | `variant="month-swarm"` + `groups` | two swarms stacked on a shared axis + mean ticks + delta pill |

## 2. API contract

Same prop API on both platforms; only the container props are platform-shaped.

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `variant` | `'history-swarm' \| 'score-swarm' \| 'pr-swarm' \| 'month-swarm'` | `'history-swarm'` | ✓ | ✓ | BW-01 / 02 / 03 / 04 |
| `points` | `BeeswarmPoint[]` | catalog demo (seeds 7/11/13) | ✓ | ✓ | the swarm dots — all variants except `month-swarm` |
| `groups` | `BeeswarmGroup[]` | catalog JUN/MAY (seeds 21/22) | ✓ | ✓ | `month-swarm` only; first two rows drawn (first = current) |
| `domain` | `[number, number]` | per variant: `[15,95]` · `[0,100]` · `[55,115]` · `[15,95]` | ✓ | ✓ | value → x mapping |
| `ticks` | `BeeswarmTick[]` | per variant (20M–80M · 0–100 · 60–100KG · 30M–70M) | ✓ | ✓ | axis ticks (`{ value, label }`) |
| `seriesLabels` | `string[]` | `['STRENGTH','CARDIO','MOBILITY']` | ✓ | ✓ | `history-swarm` legend (pairs with `palette`) |
| `palette` | `string[]` | `--violet` / `--cyan` / `--lime` | ✓ | ✓ | `history-swarm` series colors (tokens) |
| `note` | `string` | derived | ✓ | ✓ | the pill: BW-02 `'TODAY · 72'` (hero value), BW-03 `'PR · 110'`, BW-04 `'+6 MIN AVG'` (mean delta); `''` hides |
| `caption` | `string` | derived | ✓ | ✓ | BW-01 bottom-right `'○ = THIS WEEK'` (only when some point has `ring`); `''` hides |
| `endLabel` | `string` | `'SQUAT'` (only with default points) | ✓ | ✓ | BW-03 dim label right of the swarm |
| `title` | `string` | — | ✓ | ✓ | top-left mono caption (`'ALL WORKOUTS · 60 DAYS'`) |
| `shine` | `boolean` | `false` | ✓ | ✓ | soft glow underlay behind every dot (catalog glow modifier) |
| `ariaLabel` | `string` | `'Beeswarm chart'` | ✓ | ✓ | web `aria-label` / native `accessibilityLabel` |
| `className` | `string` | — | ✓ | — | web only, merged onto `.lk-swarm` |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only, container style |
| _rest_ | `Omit<HTMLAttributes<HTMLDivElement>, 'title' \| 'children'>` | — | ✓ | — | spreads to the root `<div>` |

**`BeeswarmPoint`** — `{ value: number; series?: number; ring?: boolean; hero?: boolean }`: `value` maps onto `domain`; `series` indexes `palette` (BW-01); `ring` = white "this week" outline (BW-01); `hero` marks TODAY (BW-02, default = last point) / the PR (BW-03, default = max value).

**`BeeswarmGroup`** — `{ label: string; values: number[]; color?: string }`: one BW-04 row; defaults first row `--mint` (opaque), second `--text` at 50% fill.

**`BeeswarmTick`** — `{ value: number; label: string }`.

## 3. Visual spec (tokens — never hardcode)

Geometry is the catalog's, in viewBox units: `W 320 · H 150 · pad l10 r12 t16 b14`. Per-variant layout (x0 / x1 / swarm center / axis y): history `26/226/74/126` · score `26/292/78/130` · pr `26/250/76/126` · month `46/292/52+106/136`.

| Element | Spec (both platforms) |
| --- | --- |
| Swarm packing | pack radius **R 3.1**, step `2R+0.6`, min distance `2R+0.4`, ≤24 vertical offsets; deterministic — same data → same swarm. BW-04 packs with R 3.1 but **draws r 2.8** |
| Dots | BW-01: r 3.1 in `palette[series]` at opacity 0.85; ring = `--text` stroke 1.2 at 0.95. BW-02: zone tokens (`--zone-high/mid/low` at ≥62 / ≥38 / else, 0–100 scale) at 0.8. BW-03: `--text` at 0.35. BW-04: first row `--mint` 0.85, second `--text` 50% fill at 0.7 |
| Hero (BW-02) | pulse dot r 3.6 in `--text` + expanding ring; mint pill 16 above |
| Hero (BW-03) | mint glow r 7 (blur 4px web / faint duplicate native) under a mint r 4.2 core; mint pill at (x−2, y−18) |
| Mean ticks (BW-04) | vertical 1.6px line ±15 around the row center in the row color (second row effectively 45%) |
| Axis | hairline `--text` at strokeOpacity 0.12; ticks ±2px at 0.2; labels 11 below in `--text-faint` |
| Legend (BW-01) | dots r 3.5 at x 246, rows 18 apart from y 46; labels at x 254 in `--text-dim`; caption at (246, 106) |
| Labels | `--font-mono` / `fonts.mono`, **8.5** viewBox px, letter-spacing `.06em` (native `0.5`) |
| Chip pills | catalog `tag()`: rect w `len·5.35+12`, h 13, rx 6.5, fill `--bg-0` at 78%, tinted hairline 0.35/0.8px, centered 8px mono text; x clamped to `[P.l−4, W−P.r−w+4]` |
| Pulse (BW-02) | web `.lk-swarm-pulsecore` (drop-shadow 5px currentColor) + `.lk-swarm-pulsering` (scale ×3.05, fade 0.8→0 over 1.8s, reduced-motion → hidden); native static core r 3.6 + halo ring r 7 at strokeOpacity 0.4 |
| Shine | duplicate circle r `R+2.5` behind each dot — web `blur(4px)` at opacity 0.4, native unblurred at 0.3 |
| Sizing | web `.lk-swarm-svg`: `width 100%; height auto; overflow visible`; native root: `width '100%', aspectRatio 320/150` |

## 4. States

Pure render — no hover/press/focus/disabled states, no client hooks.

| State | Behavior |
| --- | --- |
| Default | swarms the catalog demo data (deterministic seeds — dot-for-dot page parity) |
| Empty (`points: []`) | axis + title only; no hero, no pill, no crash |
| No `hero` flagged | BW-02 heroes the last point; BW-03 heroes the max value |
| Values outside `domain` | dots map past the axis ends (the axis does not clamp) — pass a domain that covers the data |
| Dense data | a dot whose 24 offsets all collide takes the last tried offset instead of being dropped (the catalog drops it — we never lose data) |
| `note=''` / `caption=''` | the pill / legend line is hidden |

## 5. Web ↔ native parity

**🟡 same API, platform-shaped implementation.** Identical placement (`swarm()` is the same verbatim port on both sides), geometry, zone thresholds, default seeds and label layout. The real differences:

- **TODAY pulse (BW-02)** — web animates the expanding ring via `.lk-swarm-pulsering` CSS (reduced-motion safe); native draws a **static duplicate halo** (r 7 ring at 0.4). Motion differs; the read does not.
- **Glow substrate** — the BW-03 PR glow and the `shine` underlays blur on web (`filter: blur(4px)`, opacity 0.4–0.6); native draws the same shapes **unblurred and fainter** (0.3–0.35) — the `Ring` glow precedent; RN SVG filters are unreliable on device.
- **Label styling channel** — web styles `<text>` via `.lk-swarm-label` / `.lk-swarm-tag`; native passes `fontSize/fontFamily/letterSpacing` props on `Svg.Text`.
- **Pill fill** — web `fill="var(--bg-0)" fillOpacity={0.78}`; native `fill={colors.bg0} fillOpacity={0.78}` — same value, same channel.
- **Container** — web `div[role=img]` + `className`/rest; native `View accessibilityRole="image"` + `style`.

## 6. Composition & usage

Standalone chart — composes nothing from the kit; typically placed inside a `Card` body. Training-history overviews, "where does today sit" score cards, PR celebration cards, month-over-month compares.

```tsx
// web — BW-02, today inside your own distribution
<BeeswarmChart variant="score-swarm" title="ENERGY SCORES · 50 DAYS"
  points={history.map((v, i) => ({ value: v, hero: i === history.length - 1 }))} />
```

```tsx
// native — identical props (BW-04)
<BeeswarmChart variant="month-swarm" title="JUN VS MAY"
  groups={[
    { label: 'JUN', values: junMinutes },
    { label: 'MAY', values: mayMinutes },
  ]} />
```

## 7. Accessibility

- **Web:** root `<div role="img" aria-label={ariaLabel}>`; the `<svg>` is `aria-hidden`. Pass a data-bearing `ariaLabel` ("Energy scores, 50 days: today 72, above your median").
- **Native:** root `View` with `accessibilityRole="image"` + `accessibilityLabel={ariaLabel}`.
- The pulse ring is decorative and disabled under `prefers-reduced-motion` on web.
- Non-interactive — no focus/keyboard surface; individual dots are not focusable (the swarm is a distribution picture, not a data table).
- Color is not the only channel: BW-01 types are legend-named, heroes carry text pills, BW-04 rows are labeled.

## 8. Usage rules — Do / Don't

**Do**
- Pass raw values + a `domain` that covers them (`[0,100]` for scores, minute ranges for durations) — the component maps, the swarm packs.
- Flag exactly one `hero` for BW-02/BW-03 when the default (last / max) isn't the story you're telling.
- Use `ring` for "recent" membership (this week) on BW-01 — not a second color.
- Override `palette`/`ticks` with **tokens** and real units; let `note` derive when the hero value IS the message.

**Don't**
- Don't pre-sort or pre-jitter the points — `swarm()` owns placement; feeding y positions is impossible by design.
- Don't exceed ~60 dots per row — the swarm saturates its 24 offsets and flattens into a bar (split into groups instead).
- Don't use `month-swarm` with more than two groups (only the first two rows draw) or `points` with it (ignored).
- Don't hardcode hex in `palette`/`color`, and don't restyle `.lk-swarm-*` per app.

## 9. Anti-patterns & lookalike ban

- **No hand-rolled swarms.** Any strip-plot / jittered dot distribution on a product surface is this component — never a local SVG lookalike with `Math.random()` jitter (it breaks determinism AND collides).
- **New variant → both platforms.** A new swarm form (e.g. a weekday-swarm) is added here, web + native in the same unit of work, with the same prop name — never a one-off in an app.
- **Tokens only** — spectrum/zone/text tokens throughout; "white" dots are `--text` at documented opacities (no raw hex in app code, ever).
- **Don't fork the packing** — the greedy `swarm()` is the catalog port; apps never re-implement or "tune" it (R/step/minD are the family's fingerprint).
- **Parity gate:** any change ships only after the web story and the native story are compared side-by-side against `beeswarm-charts.html`.
