# SDD — `WatchComplication`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/WatchComplication.tsx` · `packages/ui-native/src/components/WatchComplication.tsx` ·
> no web CSS partner — all styling is inline SVG attributes (`.lk-watchcomp` on the root is a bare hook class, like `.lk-daywheel`).
> **Exports:** `WatchComplication`, types `WatchComplicationProps`, `WatchComplicationCorners`, `WatchComplicationVariant` — **not yet re-exported from either `src/index.ts`** (the charts-program export wave lands separately).
> **Status:** Built. **Parity:** 🟡 same API & geometry; every glow (`shine`) is a CSS `blur()` underlay on web vs a wider faint duplicate arc on native (RN SVG filters are patchy — the `Ring` rule).
> **Stories:** `packages/ui/src/stories/WatchComplication.stories.tsx` (`Charts/WatchComplication`) · `packages/ui-native/src/stories/WatchComplication.stories.tsx` (`Native/WatchComplication`).

---

## 1. Overview

The **catalog watch family** (`lockin90-design/charts/watch-charts.html`, WC-01…WC-07) — tiny canvases for `lockin90-watch`: rings, gauges, sparks at complication scale. Unlike the 320×150 chart families **the face IS the canvas**: circular/square variants render `size`×`size` px (a 112×112 viewBox — r54 face + 2-unit bezel), `inline-pill` renders `size` px wide (a 152×36 viewBox). The catalog draws every card at 2× complication scale = the default `size` 108; a real graphic-circular slot is ~`size` 54. Values are **0–100**; the card chrome (mono title, NOTES column) is catalog-only and never rendered. With no data props each variant renders its catalog card exactly. This is the watch-slot widget — for in-app score rings reach for `Ring`, for 270°/180° dial gauges `Gauge`, for trend lines `Sparkline`.

Catalog-ID mapping:

| Catalog ID | `variant` | Card props (see stories) |
| --- | --- | --- |
| WC-01 ring-score | `'ring-score'` (default) | `value 82` · `label 'ENERGY'` — the defaults ARE the card |
| WC-02 battery-gauge | `'battery-gauge'` | `value 64` · `label 'BATTERY'` — defaults |
| WC-04 micro-spark | `'micro-spark'` | `data` = catalog SP ×10 · `valueText '7:42'` · `label 'SLEEP'` — defaults |
| WC-05 corner-gauge | `'corner-gauge'` | `corners {value 60, label 'UV6', text '23°', dots 2, ring 69}` — defaults |
| WC-06 inline-pill | `'inline-pill'` | `value 92` · `label 'CREATINE'` · **`size 150`** (the catalog 2× pill width) |
| WC-07 rings-trio | `'rings-trio'` | `value 80` · `value2 60` · `value3 45` — defaults |

(WC-03 was retired from the catalog — the family keeps its IDs, nothing renumbers.)

## 2. API contract

Same prop API on both platforms; only the container props are platform-shaped.

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `variant` | `'ring-score' \| 'battery-gauge' \| 'micro-spark' \| 'corner-gauge' \| 'inline-pill' \| 'rings-trio'` | `'ring-score'` | ✓ | ✓ | WC-01/02/04/05/06/07 |
| `value` | `number` | per-variant: 82 / 64 / — / — / 92 / 80 | ✓ | ✓ | 0–100 (clamped): ring fill, battery fill, inline ring + bar, trio outer ring |
| `value2` | `number` | `60` | ✓ | ✓ | `rings-trio` middle ring, 0–100 |
| `value3` | `number` | `45` | ✓ | ✓ | `rings-trio` inner ring, 0–100 |
| `valueText` | `string` | computed | ✓ | ✓ | big readout override — WC-01 `round(value)`, WC-02 `'{value}%'`, WC-04 `'7:42'` (its catalog card); WC-06 replaces the whole `'{label} {value}%'` line |
| `label` | `string` | `'ENERGY'` / `'BATTERY'` / `'SLEEP'` / `'CREATINE'` | ✓ | ✓ | small caption (pill name on WC-06); `''` hides it |
| `data` | `number[]` | catalog SP ×10 | ✓ | ✓ | `micro-spark` 0–1 trend points, oldest → newest |
| `corners` | `WatchComplicationCorners` | catalog WC-05 | ✓ | ✓ | `corner-gauge` micro-widgets (see below) |
| `color` | `string` | mint (cyan WC-04; WC-02 = zone verdict) | ✓ | ✓ | the featured mark — ring arc / gauge fill + bolt / spark line / inline ring + bar / trio outer |
| `color2` | `string` | `'var(--cyan)'` / `colors.cyan` | ✓ | ✓ | trio middle ring |
| `color3` | `string` | `'var(--violet)'` / `colors.violet` | ✓ | ✓ | trio inner ring |
| `size` | `number` | `108` | ✓ | ✓ | rendered px — square variants `size`×`size`; `inline-pill`: `size` = pill WIDTH, height = `size·36/152` |
| `shine` | `boolean` | `false` | ✓ | ✓ | glow underlay behind the featured colored mark(s) |
| `className` | `string` | — | ✓ | — | web only, merged onto `.lk-watchcomp` |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only, container style |
| _rest_ | `Omit<SVGProps<SVGSVGElement>, 'width' \| 'height' \| 'children' \| 'color'>` | — | ✓ | — | spreads to the root `<svg>` |

**`WatchComplicationCorners`** — `{ value?, label?, color?, text?, dots?, ring? }`: TL featured half-arc fill 0–100 (60) + tiny value `'UV6'` + gauge color (`--zone-mid`); TR quiet mono readout `'23°'`; BL filled dots of 3 (2); BR mini ring fill 0–100 (69). TR/BL/BR are the catalog's "quiet placeholder fits" — mint dots + violet ring are fixed.

## 3. Visual spec (tokens — never hardcode)

Square viewBox `0 0 112 112`, center **C (56, 56)**, face r 54; pill viewBox `0 0 152 36`. `sweep(v) = min(359.9, v·3.6)`, arcs start at 12 o'clock, clockwise (the catalog `arcPath`).

| Element | Spec (both platforms) |
| --- | --- |
| Face | circle r 54 (WC-05: rect 108×108 rx 28 at (2,2); WC-06: rect 150×34 rx 17 at (1,1)) — fill `--text` @ 3.5% (WC-06 @ 5%), stroke `--text` @ 12% w1 (web `color-mix`, native `${colors.text}09/0D/1F`) |
| Tracks | full faint circles/arcs under the fill — ring/gauge/bar `--text` @ 8% (`14`), trio @ 7% (`12`), corner TL @ 10% (`1A`) |
| WC-01 ring | r 38, w 7, round caps, `color` (default `--mint`); big value 21px at (56, 59); `label` 8.5 mono `--text-faint` at (56, 73) |
| WC-02 gauge | 270° track −135°→135° (opens down) r 38 w 7; fill −135°→−135+2.7·v, round cap; bolt glyph path `M56 40l-4.5 9h3.5l-1 8 5.5-10h-3.8z` in the fill color; `'{v}%'` 15px at (56, 72); label at (56, 86). Default color = **zone verdict** (`≥62 --zone-high / ≥38 --zone-mid / else --zone-low`, the `Ring` thresholds) |
| WC-04 spark | n points spread x 29→83 (C±27), y `70 − v·26`; Fritsch–Carlson monotone path (the catalog `smoothPath`), `color` (default `--cyan`) w 1.8 round; end dot r 2.4; big value 17px at (56, 38); label at (56, 84) |
| WC-05 corners | TL: half-arc −90°→90° r 16 w 4.5 at (26,26), fill −90→−90+1.8·v, `corners.color` (default `--zone-mid`); tiny value mono 8.5 `--text` at (26,29); dashed slot ring r 23 `--mint` w1 dash `3 3` @ 0.7 · TR: mono `--text-dim` at (86,29) · BL: 3 dots r 2.2 at (18+8k, 88), filled `--mint` / pending `--text` @ 15% (`26`) · BR: arc r 9 w 3 `--violet` at (86,86) |
| WC-06 pill | mini ring r 8 w 3 at (21,18), sweep = value; mono 8.5 `--text` line at (37,15) start-anchored; bar track 88×3.5 rx 1.75 at (37,23) + fill `88·v/100` in `color` (default `--mint`) |
| WC-07 trio | r 40/30/20, w 6, round caps — `color`/`color2`/`color3` default `--mint`/`--cyan`/`--violet` (move/train/sleep) |
| Type | big readout `--font-display` / `fonts.display` weight 700; captions `--font-mono` / `fonts.mono` 8.5 viewBox px, tracking `.06em` (native `0.5`) |
| Shine | duplicate of the featured mark(s), stroke +5 (gauge +5=12, spark 6.8, corner 9.5, pill 8, trio 11) — web opacity 0.4–0.45 + `blur(4–5px)`; native the same duplicates @ 0.2 **without blur** |
| Sizing | renders at `size` px (viewBox scales) — default 108 = catalog 2×; 1× slot ≈ 54 (pill 75) |

## 4. States

Pure render — no hover/press/focus/disabled states, no client hooks, no animation (nothing pulses in this family).

| State | Behavior |
| --- | --- |
| Default | bare `<WatchComplication variant="…"/>` reproduces the catalog card (WC-06 at its catalog scale needs `size 150`) |
| `value` ≤ 0 / ≥ 100 | clamped; sweep caps at 359.9° so a full ring never degenerates into an empty arc |
| Empty `data` (WC-04) | face + readout render — no line, no dot, no crash (1-point data draws the dot only) |
| `label=''` / `valueText` | caption hidden / readout replaced — layout is fixed, nothing reflows |

## 5. Web ↔ native parity

**🟡 same API, platform-shaped implementation.** Identical geometry, defaults, zone thresholds and draw order (both port the same catalog `draw()`). The real differences:

- **Shine substrate** — web blurs the wider duplicate (`blur(4–5px)`, opacity 0.4–0.45); native draws the same duplicate arc @ 0.2 with **no filter** (RN SVG `<Filter>` is unreliable on device — the `Ring` glow rule).
- **Container** — web `svg[role=img]` root + `className`/SVGProps rest; native `View accessibilityRole="image"` wrapping `Svg` + `style`.
- **Label styling channel** — web inline `style={{ fontFamily, letterSpacing }}` on `<text>`; native `fontFamily/letterSpacing` props on `Svg.Text` (`0.5` ≈ `.06em`).

Nothing blocks use; app code reads 1:1.

## 6. Composition & usage

Standalone widget — composes nothing from the kit. Home for `lockin90-watch` complication previews, watch-pairing screens, and anywhere the app shows "what's on your wrist" (settings → watch, marketing). Not a dashboard chart.

```tsx
// web — WC-01 at real slot scale
<WatchComplication value={energy} label="ENERGY" size={54} />
```

```tsx
// native — WC-07: identical props
<WatchComplication variant="rings-trio" value={move} value2={train} value3={sleep} />
```

## 7. Accessibility

- **Web:** root `<svg role="img">` with a computed per-variant `aria-label` (e.g. `"ENERGY 82 — ring at 82%"`, `"activity rings — move 80%, train 60%, sleep 45%"`). Override via `aria-label` in rest.
- **Native:** root `View` with `accessibilityRole="image"` + the same computed label.
- Non-interactive — no focus/keyboard surface. At 1× slot scale (54px) the in-face text is decorative — the accessible label carries the value; don't rely on reading the 8.5-unit captions.
- WC-02's zone color is the only severity channel — the % readout carries the value regardless.

## 8. Usage rules — Do / Don't

**Do**
- Pass 0–100 values (they're clamped); normalize spark `data` to 0–1 before passing.
- Use `size 54` (pill 75) for real-slot previews and the 108 default for catalog-scale display.
- Let WC-02 zone-color itself; override `color` only for non-battery gauges.
- Override colors with **tokens only** (`var(--cyan)` / `colors.cyan`).

**Don't**
- Don't use this in-app as a score ring / dial / sparkline — that's `Ring` / `Gauge` / `Sparkline`; this is the watch-slot widget.
- Don't rebuild the bolt/corner/pill anatomy in app code to "tweak one corner" — extend `corners` here, both platforms.
- Don't hardcode hex in `color*`/`corners.color`, and don't re-derive the zone thresholds (62/38) in app code.
- Don't stretch it — the component is square (pill excepted) by contract; wrap it, don't distort it.

## 9. Anti-patterns & lookalike ban

- **No hand-rolled complications.** Any complication-scale ring/gauge/spark preview on a product surface is this component — never a local SVG lookalike.
- **New variant → both platforms.** A new slot form (e.g. the catalog's retired streak dots, if re-promoted) is added here, web + native in the same unit of work, same prop names — never a one-off in an app.
- **Tokens only** — the face/track white alphas (3.5/5/7/8/10/12/15%) live **inside** the component as text-token mixes, never in app code.
- **Don't re-derive the geometry** (face r 54, ring r 38, gauge −135°→135°, corner offsets, pill 150×34) in app code — the component is the single source of the catalog spec.
- **Parity gate:** any change ships only after the web story and the native story are compared side-by-side against `watch-charts.html`.
