# SDD — `Meter` (+ `MeterTone` type)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Meter.tsx` · `packages/ui-native/src/components/Meter.tsx` ·
> web CSS `packages/ui/src/styles/components/meter.css` (`.lk-meter*`).
> **Exports:** `Meter`, type `MeterTone`, type `MeterProps`.
> **Status:** Shipped. **Parity:** 🟡 same API & modes; the accent fill is a CSS `--grad-cta` vs an `expo-linear-gradient` on native, and native omits the continuous-fill glow shadow.
> **Stories:** `packages/ui/src/stories/Meter.stories.tsx` · `packages/ui-native/src/stories/Meter.stories.tsx`.

---

## 1. Overview

A **labelled horizontal fill meter for a scalar value within a range** — a semantic value-in-range readout. It offers an optional mono uppercase `label` + value readout row, a **continuous** track with a gradient/zone-tone fill and an optional target `threshold` tick, or a **segmented** mode (N discrete cells lit by the value fraction, e.g. password-strength / confidence meters).

It sits between the raw `BarFill` (a bare fraction fill) and the loading `ProgressBar` (indeterminate sweep): `Meter` adds the label, the range semantics, the tone, the target tick, and the segmented variant. `MeterTone` (`'high' | 'mid' | 'low' | 'accent'`) is the only secondary export.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `value` | `number` | — (required) | ✓ | ✓ | scalar in `[min, max]` |
| `min` | `number` | `0` | ✓ | ✓ | range floor |
| `max` | `number` | `100` | ✓ | ✓ | range ceiling |
| `label` | `string` | — | ✓ | ✓ | mono uppercase caption above the track |
| `showValue` | `boolean` | `false` | ✓ | ✓ | render the numeric value (+unit) on the header |
| `unit` | `string` | — | ✓ | ✓ | suffix on the value readout (`%`, `pts`) |
| `tone` | `MeterTone` | `'accent'` | ✓ | ✓ | fill color: `accent` gradient, or `high`/`mid`/`low` zone |
| `threshold` | `number` | — | ✓ | ✓ | target tick on the continuous track (ignored in segmented mode) |
| `segments` | `number` | — | ✓ | ✓ | >0 → segmented mode (N cells) instead of a continuous bar |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `HTMLAttributes<HTMLDivElement>` (web, `Omit<…,'children'>`) / `ViewProps` (native) | — | ✓ | ✓ | spreads to root |

- `frac = clamp((value − min) / span, 0, 1)`. Header renders only when `label != null || showValue`.
- Segmented: cell `i` lights when `frac >= (i+1)/segments − 1e-9` (and `frac > 0`).

## 3. Visual spec (tokens — never hardcode)

| Element | Web | Native |
| --- | --- | --- |
| Track | height 8px, `--r-pill`, bg `rgba(255,255,255,.06)`, `overflow:hidden` | height 8px (`TRACK_H`), radius 999, bg `rgba(255,255,255,.06)` |
| Fill | width `calc(--v · 100%)`, bg `--fill` (accent → `--grad-cta`), glow `box-shadow 0 0 14px -3px --glow` | width `frac%`; accent → `expo-linear-gradient(gradients.cta.stops)`, else solid zone color; **no glow shadow** |
| Threshold tick | 2px, `--text-dim`, ring `box-shadow 0 0 0 1px --bg-0`, inset `top/bottom:-2px` | 2px, `colors.textDim`, inset `top/bottom:-2px`, no ring shadow |
| Segments | `.lk-meter-segs { gap:5px }`, cell `flex:1; height:5px; --r-pill`; off bg `rgba(255,255,255,.08)` | `gap:5`, cell `flex:1; height:5; radius 999`; off bg `rgba(255,255,255,.08)` |
| Lit segment | bg `--glow` + `box-shadow 0 0 10px -2px --glow`; accent variant forces `--accent` | bg tone color + `shadow` (opacity .8, radius 6) |
| Label | `--font-mono` 10.5px 500 uppercase `0.16em` `--text-faint` | `fonts.mono` 10.5px, letterSpacing 1.68, `colors.textFaint` |
| Value | `--font-mono` 12px `--text-dim`; unit `--text-faint` | `fonts.mono` 12px `colors.textDim`; unit `colors.textFaint` |

- **Tone → fill / glow (web):** `accent → --grad-cta / --accent`, `high → --zone-high`, `mid → --zone-mid`, `low → --zone-low`. Native mirrors with `colors.zone*`; accent fill uses `gradients.cta`.
- **Per-instance vars (web):** `--v` (0..1), `--fill`, `--glow`, `--t` (tick fraction). Fill transitions width 1.1s `--ease`.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Continuous fill | bar to `frac`%; web animates width 1.1s | same; no animation |
| Accent tone | `--grad-cta` gradient fill | `expo-linear-gradient` cta stops |
| Zone tone | solid `--zone-*` | solid `colors.zone*` |
| Threshold | tick on the track at the target fraction | same (no ring shadow) |
| Segmented | N cells; lit up to `frac` | same; lit cells glow |
| Clamp | value outside range clamps `frac` to `[0,1]` | same |
| No header | omitted when no `label` and `showValue=false` | same |

`role="meter"` (web) is the semantic state surface; no hover/focus/disabled.

## 5. Web ↔ native parity

**Verdict: 🟡 same API, platform-shaped fill.** Identical props, fraction math, tone mapping, threshold logic, and the segmented lighting rule (same `(i+1)/segments − 1e-9` threshold). Differences are substrate-only:

- **Accent gradient:** web is the CSS `--grad-cta` background; native is an `expo-linear-gradient` over `gradients.cta.stops` (`start {0,0} → end {1,0}`). Same gradient, different engine.
- **Continuous-fill glow:** web's fill has a `box-shadow` glow; native's continuous fill has **no** shadow (only lit **segments** glow on native). Minor cosmetic.
- **Threshold tick:** web adds a `--bg-0` ring shadow around the tick; native draws a plain 2px tick. Cosmetic.
- **Animation:** web tweens the fill width; native sizes instantly.
- **className ↔ style:** universal substrate; callers read 1:1.

No capability gap blocks use.

## 6. Composition & usage

- **Used for:** completeness/adequacy meters, confidence/strength meters (segmented), value-toward-target readouts.
- **Composes from:** none (self-contained). Note: the dedicated `PasswordStrengthMeter` is a separate component — `Meter segments=…` is the generic segmented primitive it echoes.

```tsx
// web — adequacy meter with a target tick
<Meter label="Protein" value={88} unit="g" showValue tone="high" threshold={90} />

// native — segmented confidence meter
<Meter label="Confidence" value={3} max={5} segments={5} tone="accent" />
```

## 7. Accessibility

- **Web:** root is `role="meter"` with `aria-valuemin` / `aria-valuemax` / `aria-valuenow` (= `value`) and `aria-label={label}` — the value and range are announced.
- **Native:** no ARIA meter role is wired; pass an `accessibilityLabel` (and the value in text via `showValue`) through `...rest` when the value matters.
- **Color independence:** tone reinforces, but always pair with `label`/`showValue` so the reading isn't color-only.
- **Hit target:** decorative; not interactive.

## 8. Usage rules — Do / Don't

**Do**
- Use `tone="accent"` for the default energy look; `high`/`mid`/`low` for zone semantics.
- Use `segments` for discrete strength/confidence; `threshold` for a target marker on a continuous bar.
- Include `label` + `showValue` + `unit` for a legible readout.

**Don't**
- ✗ Don't use `Meter` for indeterminate loading — that's `ProgressBar`.
- ✗ Don't combine `threshold` with `segments` (the tick is continuous-mode only — it's ignored).
- ✗ Don't hardcode the fill/zone/glow colors — they come from tokens.
- ✗ Don't hand-roll a labelled value bar — extend `Meter` on both platforms.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A bespoke labelled fill bar (or a custom segmented strength meter) re-implementing the tone fill + tick is a parity violation — import `Meter`.
- **New need → both platforms.** A new tone, a second threshold, or a different segment count default ships to web **and** native with the same prop name + tokens.
- **Tokens only.** Fill/zone/glow come from `--grad-cta` / `--zone-*` / `colors.*`; raw hex drifts on a token rename.
- **Parity gate.** Before shipping, confirm the web phone-width meter ≡ native meter (same value, tone, threshold, segments) — accepting the documented fill-glow and animation substrate differences.
