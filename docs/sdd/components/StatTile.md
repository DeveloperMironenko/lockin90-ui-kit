# SDD — `StatTile`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/StatTile.tsx` · `packages/ui-native/src/components/StatTile.tsx` ·
> no web CSS partner — all styling is inline SVG attributes (`.lk-stattile` on the root is a bare hook class, like `.lk-daywheel`).
> **Exports:** `StatTile`, types `StatTileProps`, `StatTileVariant`, `StatTileAccessory`, `StatTileStat`, `StatTileRow` — **not yet re-exported from either `src/index.ts`** (the charts-program export wave lands separately).
> **Status:** Built. **Parity:** 🟡 same API & geometry; the hero `shine` glow is a blurred duplicate number on web vs a wider faint duplicate (no blur) on native, and the verdict dot's `drop-shadow` is a faint halo circle on native.
> **Stories:** `packages/ui/src/stories/StatTile.stories.tsx` (`Charts/StatTile`) · `packages/ui-native/src/stories/StatTile.stories.tsx` (`Native/StatTile`).

---

## 1. Overview

The **catalog stat-tile (chartlet) family** (`lockin90-design/charts/stat-tiles.html`, ST-01/06/07/10) — KPI chartlets: **big number + delta + micro-chart**, the workhorse widgets of every dashboard. Four variants share the fixed **320×150 viewBox**. ST-01's SELECT consolidates the page's spark/bars/ring/goal/zone draw kinds into one `accessory` prop plus an optional `verdictColor` glow-dot. Numbers/deltas/labels are preformatted strings (drawn verbatim); accessory series are **auto-normalized** to their box. With no data props each variant renders its catalog card (the accessory defaults carry the page's seeded series: spark wave-21 ×16, bars noisy-31 ×8, list rows wave-11/12/13 ×16).

Catalog-ID mapping:

| Catalog ID | `variant` | Card props (see stories) |
| --- | --- | --- |
| ST-01 stat-tile | `'stat-tile'` (default) | `value '74'` + `delta '+6 VS YESTERDAY'` + `label` — SELECT `accessory`: `'none' \| 'spark' \| 'bars' \| 'ring' \| 'progress'` · optional `verdictColor` dot + `pill` |
| ST-06 hero-number | `'hero-number'` | centered 52px `value` + `delta '+6'` + insight `label`; `shine` glows it mint |
| ST-07 duo-tile | `'duo-tile'` | `stats` pair (SLEEP 7:42 / HRV 58), hairline divider |
| ST-10 stat-list | `'stat-list'` | `rows` ×3 — label + bold value + colored mini-spark |

## 2. API contract

Same prop API on both platforms; only the container props are platform-shaped.

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `variant` | `'stat-tile' \| 'hero-number' \| 'duo-tile' \| 'stat-list'` | `'stat-tile'` | ✓ | ✓ | ST-01 / ST-06 / ST-07 / ST-10 |
| `title` | `string` | per-variant | ✓ | ✓ | top-left mono caption (`ENERGY` / `ENERGY · NOW` / `LAST NIGHT` / `TODAY · GLANCE`) |
| `value` | `string` | `'74'` | ✓ | ✓ | the big number — 34px (30 with `progress` accessory), hero 52px |
| `delta` | `string` | `undefined` (hero `'+6'`) | ✓ | ✓ | chevron + mono text; omit/`''` hides |
| `deltaUp` | `boolean` | `true` | ✓ | ✓ | up = `--zone-high` chevron, down = `--zone-low` |
| `label` | `string` | hero default only | ✓ | ✓ | dim line under the number |
| `accessory` | `StatTileAccessory` | `'none'` | ✓ | ✓ | ST-01 SELECT (ignored by the other variants) |
| `data` | `number[]` | catalog seeds | ✓ | ✓ | `spark` (16 pts) / `bars` (8 pts) series — auto-normalized |
| `accessoryColor` | `string` | spark `--cyan`, else `--mint` | ✓ | ✓ | accessory hue |
| `progress` | `number` | `0.72` | ✓ | ✓ | `ring` / `progress` fill 0–1 (clamped) |
| `ringLabel` | `string` | `` `${round(progress·100)}%` `` | ✓ | ✓ | ring center readout |
| `verdictColor` | `string` | — | ✓ | ✓ | glow-dot + number color (e.g. `var(--zone-mid)` / `colors.zoneMid`) |
| `pill` | `string` | — | ✓ | ✓ | chip — with `verdictColor` at the top-right (y 66), else bottom-right (y 104) |
| `pillColor` | `string` | `verdictColor` → accessory hue | ✓ | ✓ | chip tint |
| `color` | `string` | `--text` (hero shine → `--mint`) | ✓ | ✓ | number color override |
| `stats` | `[StatTileStat, StatTileStat]` | catalog pair | ✓ | ✓ | `duo-tile` halves: `{value, label, delta?, deltaUp?}` |
| `rows` | `StatTileRow[]` | catalog 3 | ✓ | ✓ | `stat-list` rows: `{label, value, color?, data?}` |
| `shine` | `boolean` | `false` | ✓ | ✓ | hero number glow (also mints it) + ring-accessory glow |
| `width` / `height` | `number` | `320` / `150` | ✓ | ✓ | rendered px — the viewBox scales to fit |
| `className` | `string` | — | ✓ | — | web only, merged onto `.lk-stattile` |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only, container style |
| _rest_ | `Omit<SVGProps<SVGSVGElement>, 'width' \| 'height' \| 'children' \| 'color'>` | — | ✓ | — | spreads to the root `<svg>` (SVG `color` attr is repurposed as the number override) |

## 3. Visual spec (tokens — never hardcode)

Geometry is the catalog's, in viewBox units (`W 320 · H 150 · pad l10 r12 t16 b14`); title at (18, 26) start-anchored.

| Element | Spec (both platforms) |
| --- | --- |
| Big number | `--font-display` 700, tracking −0.03em, `--text` — ST-01 **34** at (18, 76) (progress card **30** at (18, 70)), duo **26**, hero **52** centered at (160, 82), list values **16** |
| Delta | chevron `M x y l4 ∓6 l4 ±6`, stroke 1.8 round — up `--zone-high` / down `--zone-low`; mono 8.5 label at +12; x = number end + 14 (char-width heuristic: 0.62em digits / 0.32em punctuation) |
| Captions | `--font-mono` 8.5, tracking `.06em` (native `0.5`), `--text-dim` (labels) / `--text-faint` (titles, row labels) |
| Spark accessory | 16-pt monotone smooth line 1.8 round + end dot r2.4 in a 118×44 box at (176, 46) — default `--cyan` |
| Bars accessory | 8 bars in a 108×46 box at (186, 44), width 60% of slot, rx1.5, `--mint`, **opacity 0.5 + 0.5·v** |
| Ring accessory | r26 at (236, 70): track `white-10%` w5 + round-cap arc w5 `--mint`; center `ringLabel` 13px display 700 `--text` |
| Progress accessory | track 8px rx4 `white-8%` full-width (282) at y 100 + `--mint` fill × `progress` |
| Verdict dot | r6 at (24, 66), fill `verdictColor` — web `drop-shadow(0 0 6px c)`, native halo duplicate r10 @ 0.3; number shifts to x 40 and takes the color |
| Duo divider | hairline `white-10%` w1, x 160, y 38–112 |
| Stat-list rows | y = 44 + i·30: label (18), value (86), mini-spark 122×20 at (170, y−8) in the row color |
| Chips (catalog `tag()`) | rect h13 rx6.5 fill `rgba(8,10,18,0.78)` (`--bg-0` @ 78%) + tinted hairline @ 0.35; 8px mono |
| Shine | hero: web blurred (8px) mint duplicate @ 0.5 under the number; native fontSize 56 duplicate @ 0.28 (no blur) · ring accessory: wider arc w9 @ 0.3 (web blurred 3px) |

## 4. States

Pure render — no hover/press/focus/disabled states, no client hooks.

| State | Behavior |
| --- | --- |
| Default | bare `<StatTile variant="…"/>` reproduces the catalog card; ST-01 accessories default to the page's seeded series |
| Empty accessory data (`data: []`) | number + delta render, accessory skipped — no crash |
| `delta` omitted | no chevron (ST-01 default has no delta — pass the card's `'+6 VS YESTERDAY'` to match the page) |
| Out-of-range `progress` | clamped 0–1 |
| Raw-unit `data` | auto-normalized min→max into the box (already-0–1 series pass through) |
| Reduced motion | fully static — nothing animates on either platform |

## 5. Web ↔ native parity

**🟡 same API, platform-shaped implementation.** Identical geometry, type scale, colors, defaults and the same seeded default data (both port the catalog PRNG). The real differences:

- **Hero `shine`** — web layers a `blur(8px)` mint duplicate at 0.5 under the number; native draws a **slightly larger (56px) duplicate at 0.28** — no blur filters on RN. Same "glowing number" read, softer halo on web.
- **Verdict dot glow** — web `drop-shadow(0 0 6px c)`; native a wider faint duplicate circle (r10 @ 0.3).
- **Ring-accessory shine** — web blurred wider arc; native the same wider arc without blur.
- **Delta x heuristic** — both use the same char-width approximation (SVG can't measure text at render); identical positions on both platforms by construction.
- **Container** — web `svg[role=img]` + `className`/SVGProps rest; native `View accessibilityRole="image"` + `style`.

## 6. Composition & usage

Standalone chartlet — composes nothing from the kit; typically the **body of a `Card`/`MetricTile` grid cell**. Reach for it when the number is the story and the chart is garnish; when the chart is the story use `Sparkline`/`BarChart`/`Ring` directly. NOTE: `MetricTile` is the framed KPI **container** primitive — `StatTile` is the catalog-exact SVG chartlet; don't nest one inside the other's readout.

```tsx
// web — ST-01 with a goal ring
<StatTile accessory="ring" value="5.8H" label="DEEP WORK · GOAL 8H"
  progress={minutes / goalMinutes} title="FOCUS" />
```

```tsx
// native — ST-10: identical props
<StatTile variant="stat-list" rows={[
  { label: 'ENERGY', value: String(energy), color: colors.mint, data: energyWeek },
  { label: 'SLEEP', value: sleepHm, color: colors.violet, data: sleepWeek },
  { label: 'STRAIN', value: strain.toFixed(1), color: colors.zoneMid, data: strainWeek },
]} />
```

## 7. Accessibility

- **Web:** root `<svg role="img">` with a computed `aria-label` (e.g. `"ENERGY: 74, +6 VS YESTERDAY"`; stat-list joins all rows). Override via `aria-label` in rest.
- **Native:** root `View` with `accessibilityRole="image"` + the same computed label.
- Non-interactive — no focus/keyboard surface; fully static (reduced-motion safe).
- The delta encodes direction in **color + chevron shape** (not color alone). The verdict dot is color-only — pair it with the `pill`/`label` text (the catalog card does: `'RECOVERY DAY'`).

## 8. Usage rules — Do / Don't

**Do**
- Preformat `value`/`delta` yourself (`'9,4K'`, `'−4 · 7D'`, `'7:42'`) — the tile draws strings verbatim.
- Set `deltaUp` from the **semantic** direction (improvement), not the numeric sign, when lower is better.
- Pass ~16 points to `spark` and ~8 to `bars` — the catalog densities; more still renders but muddies.
- Use `verdictColor` with zone tokens only (`--zone-high/mid/low`) and echo the verdict in `pill`/`label` text.
- Reproduce catalog cards with the defaults (the seeds are baked in) when checking parity.

**Don't**
- Don't compose a dashboards' worth of tiles by hand-drawing numbers in SVG — this tile is the primitive.
- Don't use `hero-number` more than once per screen — it's the one big number.
- Don't feed `progress` percentages (72) — it's 0–1.
- Don't hardcode hex in `accessoryColor`/`verdictColor`/`rows[].color`.

## 9. Anti-patterns & lookalike ban

- **No hand-rolled stat tiles.** Any big-number + delta + micro-chart cell on a product surface is this component — never a local SVG/DOM lookalike.
- **New accessory → both platforms.** A new micro-chart kind (e.g. the page's trend-tag composite) is added to the `accessory` union here, web + native in the same unit of work — never a one-off in an app.
- **Tokens only** — zone/spectrum/text tokens throughout; the internal alphas (track `white-8/10%`, bar opacity ramp, chip fill) live inside the component.
- **Don't re-derive the geometry** (number baseline y 76, accessory boxes at (176, 46)/(186, 44)/r26@(236, 70), row pitch 30) in app code.
- **Parity gate:** any change ships only after the web story and the native story are compared side-by-side against `stat-tiles.html`.
