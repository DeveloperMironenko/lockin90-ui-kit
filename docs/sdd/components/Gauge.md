# SDD — `Gauge` (+ `GaugeZone` type)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Gauge.tsx` · `packages/ui-native/src/components/Gauge.tsx` ·
> web CSS `packages/ui/src/styles/components/gauge.css` (`.lk-gauge*`).
> **Exports:** `Gauge`, type `GaugeZone`, type `GaugeProps`.
> **Status:** Shipped. **Parity:** 🟡 same API & arc math; web adds glow `drop-shadow` filters (arc + end cap) that native has no cheap equivalent for; color is `var()` (web) vs hex (native).
> **Stories:** `packages/ui/src/stories/Gauge.stories.tsx` · `packages/ui-native/src/stories/Gauge.stories.tsx`.

---

## 1. Overview

A **partial-circle dial** — an SVG arc track (default **270° sweep**, open at bottom-center) showing a `value` on a `[min,max]` scale, with a progress arc + round end-cap dot to the current value, optional colored `zones` bands (low/mid/high), optional `ticks`, and a centered value/label readout. The "readiness / score out of 100" dial is the canonical use.

- `GaugeZone` (a band: `to` upper bound + `color`) is a secondary export. Bands stack low→high from `min`; each paints from the previous band's `to` up to its own. When `zones` are present the **progress arc is suppressed** (the bands already color the scale).

Distinct from `Ring` (full-circle single-color 0–100 progress) and `DonutChart` (proportional segments): `Gauge` adds an arbitrary sweep, a min/max scale, multi-zone bands, and ticks.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `value` | `number` | — (required) | ✓ | ✓ | clamped to `[min,max]` |
| `min` | `number` | `0` | ✓ | ✓ | scale floor |
| `max` | `number` | `100` | ✓ | ✓ | scale ceiling |
| `size` | `number` | `140` | ✓ | ✓ | square box size in px |
| `thickness` | `number` | `12` | ✓ | ✓ | arc stroke width in px |
| `sweep` | `number` | `270` | ✓ | ✓ | total sweep in deg, opening at bottom-center; clamped `[0,360]` |
| `zones` | `GaugeZone[]` | — | ✓ | ✓ | colored bands; when present the value arc is suppressed |
| `ticks` | `number` | `0` | ✓ | ✓ | evenly-spaced tick marks across the sweep (0 = off) |
| `label` | `string` | — | ✓ | ✓ | small caption under the value |
| `showValue` | `boolean` | `true` | ✓ | ✓ | numeric readout (rounded) |
| `children` | `ReactNode` | — | ✓ | ✓ | overrides the value+label center |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `CSSProperties` / `StyleProp<ViewStyle>` | — | ✓ | ✓ | wrapper style |
| _rest_ | `HTMLAttributes<HTMLDivElement>` | — | ✓ | — | web only |

**`GaugeZone`:** `to: number` (upper bound on the `[min,max]` scale), `color: string` (web `var()`/hex, native hex/rgb).

- **Geometry (identical both sides):** `cx=cy=size/2`, `r=(size−thickness)/2`. `startDeg = 90 + (360−sweep)/2`, `endDeg = startDeg + sweep`. `toAngle(v) = startDeg + ((v−min)/span)·sweep`. Shared `polar()` + `arcPath()` helpers build each arc (`large-arc` flag set when span > 180°). End cap is a circle of radius `thickness/2 + 1` at `valueAngle`. Ticks span `tickInner = r − thickness/2 − 2` → `tickOuter = r + thickness/2 + 2`.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web | Native |
| --- | --- | --- |
| Track arc | `.lk-gauge-track` `stroke var(--border)`, round caps | `stroke colors.border`, round caps |
| Zone band | `.lk-gauge-zone` `stroke = zone.color`, round caps | `stroke = zone.color`, round caps |
| Value arc | `.lk-gauge-arc` `stroke var(--accent)` + `drop-shadow(0 0 8px var(--accent))` | `stroke colors.accent` (no glow) |
| End cap | `.lk-gauge-cap` `fill var(--text)`, `stroke var(--accent)` 2px + `drop-shadow(0 0 6px var(--accent))` | `fill colors.text`, `stroke colors.accent` 2px (no glow) |
| Ticks | `.lk-gauge-tick` `stroke var(--text-faint)` 1.5px | `stroke colors.textFaint` 1.5px round |
| Value | `.lk-gauge-value` `34px var(--font-display)` 700 `ls −.03em` `var(--text)` | `fonts.display 34px` 700 `ls −1` lineHeight `34` `colors.text` |
| Label | `.lk-gauge-label` `10.5px var(--font-mono)` `ls .16em` uppercase `var(--text-faint)` | `fonts.mono 10.5px` `ls 1.6` uppercase `colors.textFaint` |
| Overflow | `.lk-gauge > svg { overflow: visible }` (glow/cap spill) | n/a (no glow to spill) |

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Value arc (no zones) | drawn only when `v > min` | same |
| Zoned | bands replace the value arc; cap still drawn | same |
| End cap | drawn only when `v > min` | same |
| Ticks off | `ticks=0` → none | same |
| Custom center | `children` replaces value+label | same |
| `showValue=false` | hides the numeric readout | same |

No hover/focus/disabled — presentational.

## 5. Web ↔ native parity

**Verdict: 🟡 same API & geometry, web-only glow.** The arc/tick/cap math is identical (shared `polar`/`arcPath`, same `startDeg/endDeg/toAngle`, same zone-band reduce, same cap radius). Same defaults (`size 140`, `thickness 12`, `sweep 270`, `min 0`, `max 100`). Differences:

- **Glow (web only):** the value arc and end cap carry `drop-shadow` filters (`var(--accent)`) and the SVG is `overflow: visible`. Native has no `drop-shadow` analogue for SVG strokes — the arc/cap render without glow. Visually very close; documented gap, does not block use.
- **Color literal:** web zone/accent colors may be CSS `var()`; native needs resolved hex/rgb. App code reads 1:1.
- **Substrate:** web `<svg>`/`<path>`/`<line>`/`<circle>` + CSS classes; native `react-native-svg` `Path`/`Line`/`Circle` with inline strokes.

No capability gap — fully usable on both.

## 6. Composition & usage

- **Used for:** readiness/recovery/score dials, any single metric on a `[min,max]` scale, with or without semantic zone bands.
- **Composes from:** nothing — leaf primitive. Pass a `GradientText`/`Stat` as `children` for a styled center; build a zone legend from `KeyValue`/`Chip`.

```tsx
// web — zoned readiness dial
<Gauge
  value={78}
  zones={[
    { to: 40, color: 'var(--zone-low)' },
    { to: 70, color: 'var(--zone-mid)' },
    { to: 100, color: 'var(--zone-high)' },
  ]}
  label="READINESS"
/>

// native — simple accent arc with ticks
<Gauge value={78} ticks={5} label="READINESS" />
```

## 7. Accessibility

- **Web:** the root `<div>` has `role="img"` + `aria-label="Gauge: {round(v)} of {max}."`; the inner `<svg>` is `aria-hidden`. Provide a richer label via `...rest` if zones carry meaning.
- **Native:** no built-in accessibility label — wrap in a `View` with `accessibilityRole="image"` + `accessibilityLabel` if the value must be announced.
- Value text uses `var(--text)`/`colors.text` for contrast; zone colors should come from the `--zone-*` tokens to stay legible.

## 8. Usage rules — Do / Don't

**Do**
- Set an explicit `min`/`max` when the scale isn't 0–100.
- Use `zones` for semantic low/mid/high bands (from `--zone-low/mid/high`); they suppress the accent arc by design.
- Use `--zone-*` / `colors.zone*` tokens for band colors.
- Pass `children` for a custom center; otherwise rely on `value` + `label`.

**Don't**
- ✗ Don't hand-roll an arc dial — use `Gauge`.
- ✗ Don't pass a CSS `var()` zone color on native — pass the hex.
- ✗ Don't use `Gauge` for a full-circle 0–100 progress — use `Ring`; for proportional segments use `DonutChart`.
- ✗ Don't hardcode the accent/track/zone colors — source them from tokens.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom `arcPath` dial duplicates this primitive — import `Gauge`.
- **New need → add to BOTH platforms.** Need a needle, gradient arc, or native glow parity? Add the prop/visual to web and native with the same name + tokens — never a one-off.
- **Tokens only.** Arc/zone/cap/value colors must come from `@lockin90/tokens`; hardcoded values break on renames.
- **Parity gate.** Before shipping, confirm the web phone-width and native dials show the same sweep, value, zones, and ticks — only the web glow + color-literal form may differ.
