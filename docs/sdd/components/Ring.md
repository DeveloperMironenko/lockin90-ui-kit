# SDD — `Ring`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Ring.tsx` · `packages/ui-native/src/components/Ring.tsx` ·
> web CSS `packages/ui/src/styles/components/ring.css` (`.lk-ring*`).
> **Exports:** `Ring`, type `RingProps`.
> **Status:** Shipped (extended with the catalog score-ring family, DN-01…DN-09). **Parity:** 🟡 same API & look; glow is a CSS `drop-shadow` on web vs a Gaussian-blurred duplicate arc on native (real RN-SVG Fabric filters — see CONVENTIONS.md), web animates the arc sweep + pulse wave (native pulse is a static dot + halo).
> **Stories:** `packages/ui/src/stories/Ring.stories.tsx` · `packages/ui-native/src/stories/Ring.stories.tsx` (catalog stories named `DN01ScoreRing` … `DN09DeltaRing`).

---

## 1. Overview

A **generic circular-progress primitive**: an SVG track circle + a colored progress arc (rotated −90° so it starts at 12 o'clock, round linecap, soft color glow) with absolutely-centered readout content. Solid by default; pass a `[from, to]` `gradient` tuple for a two-stop arc, or an **N-stop color array** (`≥2`, e.g. `gradients.flux.stops`) for the full spectrum arc. When `children` is omitted it renders the rounded `value` as a big display number.

`Ring` owns the whole catalog **score-ring family** (donut-charts DN-01…DN-09) via `variant` + `zone`/`delta`:

| Catalog ID | Ask | Props |
| --- | --- | --- |
| DN-01 `score-ring` | default | `value` + `color` **or** `gradient` (SELECT arc) |
| DN-03 `zone-ring` | zone verdict | `zone` (colors arc + center number) |
| DN-04 `dual-ring` | 2 concentric | `variant="dual"` + `value2` (+ `color2`, default violet) |
| DN-05 `triple-ring` | 3 concentric | `variant="triple"` + `value2`/`value3` (+ `color2` cyan / `color3` violet) |
| DN-06 `thin-halo` | quiet 4px | `variant="thin-halo"` (thickness defaults to 4) |
| DN-07 `dashed-track` | dotted track | `variant="dashed-track"` (track `2 5` dashes, butt caps) |
| DN-08 `pulse-ring` | live dot | `variant="pulse"` (dot rides the arc end; web wave animates) |
| DN-09 `delta-ring` | score + trend | `delta="+6 VS YESTERDAY"` (+ `deltaColor`, default mint) |

Higher-level rings (`Gauge`, `PhaseWheel`) are radial siblings; reach for `Ring` whenever you need "X% as a circle" with custom center content.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `value` | `number` | `72` | ✓ | ✓ | main arc fill 0–100, clamped |
| `value2` | `number` | — | ✓ | ✓ | 2nd ring (`dual` inner / `triple` middle), 0–100 clamped |
| `value3` | `number` | — | ✓ | ✓ | 3rd ring (`triple` innermost), 0–100 clamped |
| `size` | `number` | `108` | ✓ | ✓ | outer diameter (square viewBox) |
| `thickness` | `number` | `7` (`4` for `thin-halo`) | ✓ | ✓ | stroke width of every track + arc |
| `color` | `string` | web `'var(--mint)'` · native `colors.mint` | ✓ | ✓ | main arc color; ignored when `gradient` array or `zone` |
| `color2` | `string` | violet (`dual`) / cyan (`triple`) | ✓ | ✓ | 2nd ring color |
| `color3` | `string` | violet | ✓ | ✓ | 3rd ring color (`triple`) |
| `trackColor` | `string` | web `'var(--border)'` · native `colors.border` | ✓ | ✓ | unfilled track color (all rings) |
| `gradient` | `string \| string[]` | — | ✓ | ✓ | array (≥2) → N evenly-spaced `linearGradient` stops on the **main arc only**; single string → treated like `color` |
| `glow` | `boolean` | `true` | ✓ | ✓ | soft color glow per arc |
| `zone` | `boolean` | `false` | ✓ | ✓ | DN-03: arc + default center number take the value's zone verdict (≥62 high · ≥38 mid · low) |
| `variant` | `'score' \| 'dual' \| 'triple' \| 'thin-halo' \| 'dashed-track' \| 'pulse' \| 'delta'` | `'score'` | ✓ | ✓ | catalog variant (table above); `'delta'` is a semantic alias of `'score'` — the chip renders whenever `delta` is set |
| `delta` | `string` | — | ✓ | ✓ | DN-09 chip text under the center stat |
| `deltaColor` | `string` | mint | ✓ | ✓ | chip tint (native: **hex** — alpha suffixes are appended) |
| `children` | `ReactNode` | — | ✓ | ✓ | centered content; omit → `Math.round(value)` (`triple` → nothing) |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only (web takes `style` via rest) |
| _rest_ | `HTMLAttributes<HTMLDivElement>` | — | ✓ | — | web spreads to the root `<div>` |

- **Ring stack:** the main ring is at `r = (size − thickness)/2` (native `− glowPad`); `dual`/`triple` add inner rings stepping in by `thickness + 4` each (the catalog r52/r38 · r52/r39/r26 spacing). Every ring draws its own track + arc.
- **Gradient resolution (both):** `Array.isArray(gradient) && !zone` → N-stop `linearGradient` (`0,0 → 1,1`), stop `i` at offset `i/(n−1)`; string → solid; `zone` overrides everything.
- **Zone thresholds:** `value ≥ 62 → --zone-high/zoneHigh`, `≥ 38 → mid`, else `low` (catalog `zoneOf` × 100).
- **Pulse tint:** the arc color; gradient arcs pulse **mint** (catalog behavior).

## 3. Visual spec (tokens — never hardcode)

| Element | Web | Native |
| --- | --- | --- |
| Track circle | `stroke=trackColor`, width `thickness`; `dashed-track` → `stroke-dasharray "2 5"` | same; dashes `[2, 5]` + `strokeLinecap="butt"` |
| Arc | round linecap, `dasharray=c`, `dashoffset=c·(1−v/100)` per ring | same; explicit `rotation={-90}` per circle |
| Rotation | whole `<svg>` `transform: rotate(-90deg)` | per-`<Circle>` `rotation={-90}`; pulse dot pre-rotated (−90° in the angle math) |
| Glow | `drop-shadow(0 0 8px var(--lk-ring-glow))` per arc | Gaussian-blurred duplicate arc per ring (`FeGaussianBlur` stdDev 6, `strokeWidth+2` @ 0.55) |
| Pulse dot (DN-08) | `.lk-ring-pulse-dot` r3.6 + `drop-shadow(0 0 5px …)`; `.lk-ring-pulse-wave` scales 1→3 / fades over 1.8s (CSS keyframes, `transform-box: fill-box`) | static dot r3.6 + static halo ring r7 at 40% |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` hides the wave | n/a (already static) |
| Delta chip (DN-09) | `.lk-ring-delta`: 9px `--font-mono`, `color-mix(var(--bg-0) 78%)` bg, 1px `color-mix(deltaColor 35%)` hairline, `--r-pill` | `${colors.bg0}C7` bg, `${deltaColor}59` border, `radii.pill` |
| Center number | `--font-display` 700 32px `--text` (`.lk-ring-num`); `zone` → inline zone color | `fonts.display` 700 32px `colors.text`; `zone` → zone color |

- **Radius:** web `r = (size − thickness)/2`; native subtracts `glowPad = glow ? 8 : 0` so the blurred halo never clips (documented drift).

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Progress | arc fills to `value`%; web tweens dashoffset 1.1s | no tween |
| 0 / 100 / clamp | dashoffset full/0; out-of-range clamps (all three values) | same |
| Zone | arc + default number recolored by verdict | same |
| Dual / triple | inner rings fill `value2`/`value3` (missing → 0 = track only) | same |
| Pulse | dot at arc end + animated wave (reduced-motion safe) | static dot + halo |
| Delta | chip under the center stat | same |
| Glow off | no shadow / no duplicate arcs (native also `glowPad=0`) | — |

Static, read-only — no hover/focus/disabled.

## 5. Web ↔ native parity

**Verdict: 🟡 same API, platform-shaped glow + motion.** Identical props, arc math, ring stacking, gradient handling, zone thresholds, −90° start, chip styling and 32px center. Substrate differences:

- **Glow:** web CSS `drop-shadow` per arc; native a **real Gaussian-blurred duplicate arc** (`<Filter><FeGaussianBlur stdDeviation={6}>`, Fabric-native in react-native-svg 15) — visually equivalent halo.
- **Glow padding:** native shrinks `r` by 8px when `glow` — marginally smaller ring, accepted.
- **Pulse:** web animates the expanding wave (CSS, reduced-motion safe); native draws a static dot + faint halo — no animation precedent in native kit charts.
- **Animation:** web tweens the arc sweep; native renders final state.
- **Color literals:** web accepts `var()`; native needs hex (the delta chip appends hex alpha suffixes — pass hex `deltaColor`).

No capability gap blocks use.

## 6. Composition & usage

- **Used by / echoed in:** energy and goal gauges, substance rings, achievement rings; `Gauge`/`PhaseWheel` are richer radial siblings.
- **Composes:** any centered `children` (a number + a `--font-mono` caption, an icon, a `DeltaPill`).

```tsx
// web — DN-04 dual ring (sleep + HRV share one widget)
<Ring variant="dual" value={78} value2={55} size={128} thickness={10} />

// web — DN-09 delta ring
<Ring value={71} delta="+6 VS YESTERDAY" />

// native — DN-03 zone ring (36 → coral arc + number)
<Ring value={36} zone size={116} thickness={11} />

// web/native — full flux spectrum arc (N-stop)
import { gradients } from '@lockin90/tokens';
<Ring value={88} gradient={[...gradients.flux.stops]} size={132} />
```

## 7. Accessibility

- **Web:** the inner `<svg>` is `aria-hidden`; the **center content carries the meaning** — render a real number/label (or pass `aria-label` via `...rest`) so the value is announced. The delta chip is real text and is read.
- **Native:** SVG is decorative; supply an `accessibilityLabel` on a wrapping View when the value matters (name all values for `dual`/`triple`).
- **Contrast:** center number uses `--text` (or the zone color — all three zone tokens pass on the void surface); keep custom center content at `--text`/`--text-dim`.

## 8. Usage rules — Do / Don't

**Do**
- Resolve catalog asks mechanically: DN-ID → the variant/prop row in §1.
- Use `zone` when color = verdict; `gradient` for spectrum arcs; `color` for a single tone.
- Give `dual`/`triple` explicit `value2`/`value3`; scale `thickness` with `size`.

**Don't**
- ✗ Don't pass `value*` outside 0–100 expecting overflow — they clamp.
- ✗ Don't hardcode arc/track/chip colors — tokens only (`var(--mint)` / `colors.mint`).
- ✗ Don't expect the pulse wave or sweep tween on native — static by design.
- ✗ Don't hand-roll a circular-progress or multi-ring SVG — extend `Ring` on both platforms.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A bespoke SVG progress circle (or a hand-stacked pair of them for a dual ring) re-derives this primitive — import `Ring`.
- **New need → both platforms.** A new cap style, 4th ring, or animation option ships to web **and** native with the same prop name + tokens.
- **Tokens only.** `color*` / `trackColor` / `gradient` / `deltaColor` must be token values.
- **Parity gate.** Before shipping, confirm the web phone-width ring ≡ native ring (same value(s), size, variant, gradient, center, chip) — accepting the documented glow/animation substrate differences.
