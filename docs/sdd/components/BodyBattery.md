# SDD — `BodyBattery`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/BodyBattery.tsx` · `packages/ui-native/src/components/BodyBattery.tsx` ·
> web CSS `packages/ui/src/styles/components/bodybattery.css` (`.lk-bb*`).
> **Exports:** `BodyBattery`, types `BodyBatteryProps`, `BodyBatteryVariant`, `BatteryDrainEvent`.
> **Status:** Shipped. **Parity:** 🟡 same API & look; web blurs glow underlays + drop-shadows the bolt + animates the pulse (SMIL), native Gaussian-blurs duplicate underlays (`FeGaussianBlur`, real RN-SVG Fabric filters) + a static halo (no SMIL on native).
> **Stories:** `packages/ui/src/stories/BodyBattery.stories.tsx` (`Charts/BodyBattery`) · `packages/ui-native/src/stories/BodyBattery.stories.tsx` (`Native/BodyBattery`).

---

## 1. Overview

The **catalog body-battery family** (`lockin90-design/charts/body-battery-charts.html`, BB-01/02/05/06/07): charges while you sleep, drains through the day. Five variants in a fixed **320×150 viewBox**. The day curves stroke the % line with a **vertical zone gradient** (mint up high → amber → coral down low, `userSpaceOnUse` fixed to the plot), shade the sleep hours violet and carry the glowing **CHARGING bolt**; the glyph variant is the glanceable status widget with three SELECT states; the week variant lines up 7 mini vertical batteries.

Catalog-ID mapping (**BB-03/04 do not exist** — numbering gaps in the catalog):

| Catalog ID | Props | Card |
| --- | --- | --- |
| BB-01 `battery-day` | `variant="battery-day"` (default) + `levels` + `now` | zone-stroked % curve over 24h · violet sleep shading + CHARGING bolt · NOW pulse + % pill · day axis |
| BB-02 `battery-glyph` | `variant="battery-glyph"` + `level` + SELECT `state` | big battery glyph · level + empty-ETA / charging bolt + full-ETA / low warning + advice pill |
| BB-05 `drain-events` | `variant="drain-events"` + `events` | day curve + coral event pills at the dips |
| BB-06 `battery-week` | `variant="battery-week"` + `days` | 7 mini vertical batteries, end-level fill + % + day letters |
| BB-07 `battery-vs` | `variant="battery-vs"` + `compareLevels` | today zone curve + dashed white-30% yesterday + pills |

## 2. API contract

Same prop API on both platforms; only the container props are platform-shaped.

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `variant` | `'battery-day' \| 'battery-glyph' \| 'drain-events' \| 'battery-week' \| 'battery-vs'` | `'battery-day'` | ✓ | ✓ | the five catalog forms |
| `levels` | `number[]` | catalog seed-11 day (48 samples) | ✓ | ✓ | 0–1 battery samples, midnight → midnight (any length) — the day curves |
| `compareLevels` | `number[]` | — | ✓ | ✓ | yesterday's samples → dashed compare curve (BB-07) |
| `now` | `number` | — | ✓ | ✓ | fraction of the day → NOW pulse + `n% NOW` pill (BB-01) |
| `events` | `BatteryDrainEvent[]` | catalog trio | ✓ | ✓ | `{ at: fractionOfDay, label }` coral pills, staggered ±16px (BB-05) |
| `level` | `number` | `0.64` | ✓ | ✓ | glyph fill 0–1, also the big % (BB-02) |
| `state` | `'level' \| 'charging' \| 'low'` | `'level'` | ✓ | ✓ | the BB-02 SELECT STATE |
| `eta` | `string` | per state (`'−4%/H · EMPTY 21:20'` / `'+9%/H · FULL BY 6:40'`) | ✓ | ✓ | glyph rate/ETA caption |
| `advice` | `string` | `'LOW — SKIP THE 6PM SESSION'` | ✓ | ✓ | low-state pill |
| `glyphLabel` | `string` | `'BODY BATTERY'` | ✓ | ✓ | caption above the glyph |
| `days` | `number[]` | catalog week | ✓ | ✓ | 7 end-of-day levels (first seven drawn) — BB-06 |
| `dayLabels` | `string` | `'MTWTFSS'` | ✓ | ✓ | one letter per battery |
| `sleepUntilH` / `sleepFromH` | `number` | `7` / `23` | ✓ | ✓ | violet sleep shading bounds |
| `charging` | `boolean` | day curves `true` | ✓ | ✓ | CHARGING bolt + caption on the curves (the catalog always draws it) |
| `chargingLabel` | `string` | `'CHARGING'` | ✓ | ✓ | bolt caption |
| `todayLabel` / `compareLabel` | `string` | `'TODAY'` / `'YESTERDAY'` | ✓ | ✓ | BB-07 pills |
| `title` / `stat` / `statColor` | `string` / `string` / `string` | — / — / `--text` | ✓ | ✓ | top-left mono caption · top-right display stat |
| `grid` | `boolean` | `true` | ✓ | ✓ | 3 interior rows + baseline (day curves only) |
| `shine` | `boolean` | `false` | ✓ | ✓ | glow underlay along the curve / glyph fill |
| `ariaLabel` | `string` | `'Body battery chart'` | ✓ | ✓ | web `aria-label` / native `accessibilityLabel` |
| `className` / _rest_ | `string` / `Omit<HTMLAttributes<HTMLDivElement>,'title'\|'children'>` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |

## 3. Visual spec (tokens — never hardcode)

Geometry is the catalog's, in viewBox units: `W 320 · H 150 · pad l10 r12 t16 b14 · plot 298×120`.

| Element | Spec (both platforms) |
| --- | --- |
| Zone stroke | `linearGradient` `userSpaceOnUse` from `y=P.t` to `y=H−P.b`: `0% --zone-high · 55% --zone-mid · 100% --zone-low`; curve 2.5px round cap, monotone-smooth (catalog `smoothPath` port); `shine` = 7.5px `opacity 0.45` duplicate (blurred — web 5px, native `FeGaussianBlur stdDeviation 2.5`) |
| Sleep shading | `--violet` `opacity 0.08` rects: midnight→`sleepUntilH` and `sleepFromH`→midnight |
| CHARGING bolt | catalog bolt path at `(P.l+plotW·0.06, P.t+14)` scale 1.6, `--lime`; web glow `drop-shadow(0 0 4px)` (`.lk-bb-bolt`), native = 3px stroke duplicate `opacity 0.35`; `--lime` caption at +12/+26 |
| NOW pulse (BB-01) | glowing r3.6 dot + expanding ring in `--zone-high` at the sample nearest `now·(n−1)` + `n% NOW` pill above (−15) |
| Compare curve (BB-07) | dashed `4 4` 1.6px `--text` at `strokeOpacity 0.3` (the catalog white-30%), drawn under today |
| Drain pills (BB-05) | `--zone-low` pills at the event sample, y `+16 + (i%2)·16` stagger |
| Glyph (BB-02) | body 130×46 at (42,52) rx `h·0.22`, `--glass` fill + `--text` stroke `strokeOpacity 0.25` 1.5px; terminal 4×`h·0.4` rx2 `--text` op 0.25; fill inset 3px rx `h·0.16` zone color `opacity 0.9` min-width 4; charging bolt in `--bg-0` at scale `h/16`; big % 30px display-700 `−0.02em` at (206,84) in the zone color; ETA mono dim at (206,100); `BODY BATTERY` faint above; low-state pill at (107,118) |
| Glyph zones | ≥0.55 `--zone-high` · ≥0.25 `--zone-mid` · else `--zone-low` (the catalog batteryIcon thresholds — NOT the 0.62/0.38 chart zones) |
| Week (BB-06) | 7 bodies 22×74 rx6 `--glass` + `--text` stroke op 0.22 1.2px, cap 8×4 rx1.5; fill 17px wide rx4 zone color `opacity 0.9`, height `68·v`; % label in the zone color at `H−12`; day letter faint at `H−2` |
| Day axis | `12A · 7A · NOON · 6P · 11P` at 0 / 7⁄24 / ½ / ¾ / 23⁄24 (first tick start-anchored) |
| Grid | 3 interior rows `--border` `strokeOpacity 0.55` + solid `--border` baseline (day curves only) |
| Pills/labels | catalog `tag()` + 8.5px mono labels — same spec as AreaChart; stat 12px `--font-display` 700 |
| Sizing | web `.lk-bb-svg` `width 100%; height auto; overflow visible`; native root `width '100%', aspectRatio 320/150` |

## 4. States

Pure render — no hover/press/focus/disabled; hooks: `useId` (+ web `useMotionOK`).

| State | Behavior |
| --- | --- |
| Default | BB-01 with the catalog day shape (48 samples) |
| `state` SELECT (BB-02) | `level` = % + empty-ETA · `charging` = dark bolt in the fill + full-ETA · `low` = coral fill + advice pill |
| No `now` | day curve without the pulse/pill |
| Empty `levels: []` | frame + shading + axis only — no crash |
| Short `compareLevels` (<2) | compare curve skipped |
| Levels clamp | glyph `level` clamps 0–1; glyph fill has a 4px minimum |
| Reduced motion (web) | SMIL pulse replaced by the static halo ring |

## 5. Web ↔ native parity

**🟡 same API, platform-shaped implementation.** Identical geometry, gradient stops, zone thresholds and label layout. Real differences:

- **Glow substrate** — web blurs the 7.5px curve underlay / glyph-fill duplicate (`.lk-bb-shine`, the catalog `blur(5)`) and drop-shadows the bolt + pulse dot; native Gaussian-blurs the same curve underlay + glyph-shine rect (`FeGaussianBlur stdDeviation 2.5`; see CONVENTIONS.md), while the bolt (3px stroke copy) and pulse dot (r6.6 op-0.35 disc) stay plain wider faint duplicates.
- **Pulse** — web SMIL expanding ring (reduced-motion safe); native static halo ring (the Ring precedent).
- **Label styling channel** — web CSS classes vs native `Svg.Text` font props; tag pill fill `color-mix` vs `#RRGGBBAA`.
- **Container** — web `div[role=img]` + `className`/rest; native `View accessibilityRole="image"` + `style`.

## 6. Composition & usage

Standalone chart — typically the today-screen energy hero (`battery-day`), a home-card status widget (`battery-glyph`), or the weekly recap (`battery-week`). Drain attribution (BB-05) pairs with the events feed.

```tsx
// web — BB-01 from real half-hour samples
<BodyBattery levels={samples} now={fractionOfDayNow} title="BODY BATTERY · TODAY" />
```

```tsx
// native — identical props (BB-02 low state)
<BodyBattery variant="battery-glyph" level={0.17} state="low"
  advice="LOW — SKIP THE 6PM SESSION" title="RIGHT NOW" />
```

## 7. Accessibility

- **Web:** root `<div role="img" aria-label={ariaLabel}>`; the `<svg>` is `aria-hidden`. Pass a data-bearing `ariaLabel` ("Body battery 62%, draining 4% per hour, empty by 21:20").
- **Native:** root `View` with `accessibilityRole="image"` + `accessibilityLabel={ariaLabel}`.
- Non-interactive; the SMIL pulse honors `prefers-reduced-motion`.
- Color is not the only channel: the glyph prints the %, the low state adds a text pill, drain events are labeled pills — zone hues never carry meaning alone.

## 8. Usage rules — Do / Don't

**Do**
- Feed real 0–1 samples midnight→midnight (any count ≥2) — the x-axis assumes a full day.
- Use `state` for the glyph SELECT and pass real ETA copy from the backend when available.
- Keep `days` at 7 for the week variant (extras are dropped).
- Reproduce catalog cards with the page seeds in stories (see `bbDay` in the stories) when checking parity.

**Don't**
- Don't pass percentages 0–100 — levels are 0–1 fractions everywhere in this family.
- Don't re-map the glyph zone thresholds (0.55/0.25) to the chart zones (0.62/0.38) — the catalog intentionally differs.
- Don't fake the compare curve by restyling `levels` — `compareLevels` exists for that.
- Don't hardcode hex, and don't restyle `.lk-bb-*` per app.

## 9. Anti-patterns & lookalike ban

- **No hand-rolled batteries.** Any battery glyph, battery-week row or zone-gradient day curve on a product surface is this component — never a local SVG lookalike.
- **New variant → both platforms.** A new battery form is added here, web + native in the same unit of work, same prop names.
- **Tokens only** — zone/violet/lime/glass/text tokens throughout; the catalog's raw whites map to `--text`/`--glass` + opacity, `#07080D` bolt-on-fill maps to `--bg-0`.
- **Don't fork the gradient** — the 0/55/100 zone-gradient stops and the monotone smoothing are the catalog spec; apps never re-implement them.
- **Parity gate:** changes ship only after the web and native stories are compared side-by-side against `body-battery-charts.html`.
