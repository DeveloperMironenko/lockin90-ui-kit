# SDD — `Gauge` (+ `GaugeZone` type)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Gauge.tsx` · `packages/ui-native/src/components/Gauge.tsx` ·
> web CSS `packages/ui/src/styles/components/gauge.css` (`.lk-gauge*`).
> **Exports:** `Gauge`, type `GaugeZone`, type `GaugeProps`.
> **Status:** Shipped (extended with the catalog gauges DN-13/DN-14: `gradient`, `zone`, `shine`, `tickPosition`, `cap`). **Parity:** 🟡 same API & arc math; web glow/shine use `drop-shadow`/`blur` filters vs native's wider faint duplicate arc; `tickPosition="out"` shrinks the native radius by 8px (RN SVG clips at the viewBox).
> **Stories:** `packages/ui/src/stories/Gauge.stories.tsx` · `packages/ui-native/src/stories/Gauge.stories.tsx` (catalog stories `DN13Gauge270`, `DN14HalfGauge`, `ZoneVerdict`).

---

## 1. Overview

A **partial-circle dial** — an SVG arc track (default **270° sweep**, open at bottom-center) showing a `value` on a `[min,max]` scale, with a progress arc + round end-cap dot, optional colored `zones` bands, optional `ticks`, and a centered value/label readout.

`Gauge` owns the catalog **gauge variants** (donut-charts DN-13/DN-14):

| Catalog ID | Ask | Props |
| --- | --- | --- |
| DN-13 `gauge-270` | strain/load meter | `sweep={270}` (default) + `gradient={[low, mid, high]}` (red→amber→green) + `ticks={5}` + `tickPosition="out"` + `cap={false}` |
| DN-14 `half-gauge` | compact card meter | `sweep={180}` + `color` + `cap={false}` (stat sits under the dome) |

- `GaugeZone` (a band: `to` upper bound + `color`) is a secondary export. Bands stack low→high from `min`; when `zones` are present the **progress arc is suppressed** (the bands already color the scale).
- New paint modes on the value arc: `color` (solid), `gradient` (N-stop along the sweep), `zone` (verdict color for arc + readout).

Distinct from `Ring` (full-circle 0–100 progress) and `DonutChart` (proportional segments): `Gauge` adds an arbitrary sweep, a min/max scale, bands and ticks.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `value` | `number` | — (required) | ✓ | ✓ | clamped to `[min,max]` |
| `min` / `max` | `number` | `0` / `100` | ✓ | ✓ | scale |
| `size` | `number` | `140` | ✓ | ✓ | square box size in px |
| `thickness` | `number` | `12` | ✓ | ✓ | arc stroke width |
| `sweep` | `number` | `270` | ✓ | ✓ | total sweep in deg, opening at bottom-center; clamped `[0,360]` |
| `zones` | `GaugeZone[]` | — | ✓ | ✓ | colored bands; suppress the value arc |
| `color` | `string` | web CSS default `var(--accent)` · native `colors.accent` | ✓ | ✓ | value-arc color; ignored when `gradient` array / `zone` |
| `gradient` | `string \| string[]` | — | ✓ | ✓ | N-stop `linearGradient` **along the sweep (left→right)**; DN-13 = `['--zone-low','--zone-mid','--zone-high']`; single string → solid |
| `zone` | `boolean` | `false` | ✓ | ✓ | arc + readout colored by the value's zone verdict on `[min,max]` (≥62% high · ≥38% mid · low) |
| `shine` | `boolean` | `false` | ✓ | ✓ | glow underlay under the value arc (catalog shine) |
| `ticks` | `number` | `0` | ✓ | ✓ | evenly-spaced marks across the sweep |
| `tickPosition` | `'span' \| 'out'` | `'span'` | ✓ | ✓ | `span` straddles the arc (legacy); `out` = just outside it (DN-13). Native `out` shrinks `r` by 8px |
| `cap` | `boolean` | `true` | ✓ | ✓ | the end-cap dot at the current value |
| `label` | `string` | — | ✓ | ✓ | mono caption under the value |
| `showValue` | `boolean` | `true` | ✓ | ✓ | rounded numeric readout |
| `children` | `ReactNode` | — | ✓ | ✓ | overrides the value+label center |
| `className` / `style` / _rest_ | | — | web / both / web | | substrate |

**`GaugeZone`:** `to: number`, `color: string` (web `var()`/hex, native hex/rgb).

- **Geometry (identical both sides):** `cx=cy=size/2`, `r=(size−thickness)/2` (native `− 8` when `tickPosition="out"`). `startDeg = 90 + (360−sweep)/2`, `toAngle(v) = startDeg + ((v−min)/span)·sweep`. Cap = circle `thickness/2 + 1` at `valueAngle`.
- **Ticks:** `span` → `r ± (thickness/2 + 2)`; `out` → `r + thickness/2 + 2.5 … + 7.5` (catalog's outside ticks).
- **Paint resolution:** `zone` verdict > `gradient` array (`url(#…)`, `useId`-keyed) > `color` > accent. Cap tints to the arc (gradient → its **last** stop); glow tints to the solid (gradient → its middle stop).

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web | Native |
| --- | --- | --- |
| Track arc | `.lk-gauge-track` `var(--border)`, round caps | `colors.border` |
| Zone band | `.lk-gauge-zone` `stroke = zone.color` | same |
| Value arc | `.lk-gauge-arc` CSS `var(--accent)` default; custom paint via inline `stroke`; glow `drop-shadow(0 0 8px var(--lk-gauge-glow))` | inline stroke; no drop-shadow |
| Shine | wider (+5) blurred (`blur(6px)`) duplicate at 50% under the arc | wider (+8) duplicate at 35%, no blur |
| Gradient | `<linearGradient x1=0 y1=0 x2=1 y2=0>` — horizontal across the dial | same via `react-native-svg` `Defs` |
| End cap | `.lk-gauge-cap` `fill var(--text)`; stroke + `drop-shadow` tinted to the arc (inline) | `fill colors.text`, stroke tinted, no glow |
| Ticks | `.lk-gauge-tick` `var(--text-faint)` 1.5px | `colors.textFaint` 1.5px round |
| Value / label | `34px var(--font-display)` 700 / `10.5px var(--font-mono)` uppercase `--text-faint`; `zone` → value takes the verdict color | mirrored via `fonts.*`/`colors.*` |
| Overflow | `.lk-gauge > svg { overflow: visible }` (glow/cap/outside ticks spill) | clips → the `out` radius pad |

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Value arc (no zones) | drawn only when `v > min`; solid / gradient / zone paint | same |
| Zoned bands | replace the value arc (+ shine); cap still drawn | same |
| `zone` verdict | arc + readout recolored | same |
| Shine | blurred underlay when `v > min` and no bands | duplicate underlay |
| `cap={false}` | no end dot (DN-13/14 catalog look) | same |
| Ticks `out` | outside the arc | same, radius shrunk 8px |
| Custom center / `showValue=false` | as before | same |

No hover/focus/disabled — presentational.

## 5. Web ↔ native parity

**Verdict: 🟡 same API & geometry, platform-shaped glow.** The arc/tick/cap math is identical; same defaults; same paint-resolution order. Differences:

- **Glow/shine:** web `drop-shadow` + `blur()` filters; native wider faint duplicate arc (kit-wide RN rule — no SVG filters).
- **Outside ticks:** web lets them spill (`overflow: visible`); native shrinks `r` by 8px so they fit the viewBox — the dial is marginally smaller with `tickPosition="out"`.
- **Color literal:** web `var()`; native hex/rgb. App code reads 1:1.

No capability gap — fully usable on both.

## 6. Composition & usage

- **Used for:** readiness/strain/score dials, any single metric on a `[min,max]` scale, with or without semantic bands.
- **Composes from:** nothing — leaf primitive. Pass `GradientText`/`Stat` as `children`; build a zone legend from `KeyValue`/`Chip`.

```tsx
// web — DN-13 gauge-270 (red→amber→green strain meter)
<Gauge
  value={62}
  gradient={['var(--zone-low)', 'var(--zone-mid)', 'var(--zone-high)']}
  ticks={5}
  tickPosition="out"
  cap={false}
  label="STRAIN"
/>

// native — DN-14 half-gauge
<Gauge value={44} sweep={180} color={colors.cyan} cap={false} label="HYDRATION" />

// web — zoned readiness dial (bands, unchanged legacy use)
<Gauge value={78} zones={[{ to: 40, color: 'var(--zone-low)' }, { to: 70, color: 'var(--zone-mid)' }, { to: 100, color: 'var(--zone-high)' }]} label="READINESS" />
```

## 7. Accessibility

- **Web:** root `role="img"` + `aria-label="Gauge: {round(v)} of {max}."`; `<svg>` is `aria-hidden`. Enrich via `...rest` when zones/gradients carry meaning.
- **Native:** wrap in a `View` with `accessibilityRole="image"` + `accessibilityLabel` when the value must be announced.
- `zone` readout colors are the `--zone-*` tokens — all pass contrast on the void surface.

## 8. Usage rules — Do / Don't

**Do**
- Resolve DN-13/DN-14 with the §1 prop rows.
- Use `gradient` for a value-arc ramp, `zones` for stepped semantic **bands** — they're different visuals (ramped arc vs banded scale).
- Use `--zone-*` / `colors.zone*` tokens for gradients and bands; set `min`/`max` when the scale isn't 0–100.

**Don't**
- ✗ Don't combine `zone` with `gradient` — the verdict wins by design.
- ✗ Don't hand-roll an arc dial — use `Gauge`.
- ✗ Don't pass CSS `var()` colors on native — pass hex.
- ✗ Don't use `Gauge` for full-circle progress (`Ring`) or proportional segments (`DonutChart`).

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom `arcPath` dial duplicates this primitive — import `Gauge`.
- **New need → add to BOTH platforms.** A needle, minor ticks, or native glow parity ships to web and native with the same prop name + tokens — never a one-off.
- **Tokens only.** Arc/zone/cap/tick/value colors come from `@lockin90/tokens`.
- **Parity gate.** Before shipping, confirm web phone-width ≡ native: same sweep, value, paint mode, ticks and cap — only the web glow/blur + the native `out`-tick radius pad may differ.
