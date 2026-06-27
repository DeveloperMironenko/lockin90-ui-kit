# SDD — `RangeBar` (+ `RangeBarMarkerTone` type)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/RangeBar.tsx` · `packages/ui-native/src/components/RangeBar.tsx` ·
> web CSS `packages/ui/src/styles/components/rangebar.css` (`.lk-rangebar*`).
> **Exports:** `RangeBar`, type `RangeBarMarkerTone`, type `RangeBarProps`.
> **Status:** Shipped. **Parity:** 🟡 same API & visual model; web paints the 3 zones as one CSS gradient, native as 3 stacked Views (a couple of zone-tint opacities differ by a hair).
> **Stories:** `packages/ui/src/stories/RangeBar.stories.tsx` · `packages/ui-native/src/stories/RangeBar.stories.tsx`.

---

## 1. Overview

A **reference-range bar for biomarkers / labs**: a horizontal track split into three colored zones — `[min, low]` low (red/amber-tinted), `[low, high]` optimal (vivid green band), `[high, max]` high (red-tinted) — with a glowing marker dot at the current `value`. It answers "is this reading in the healthy range?" at a glance (fasting glucose, testosterone, HRV…). The marker **auto-colors by the zone it lands in** (`value < low` → warn, `> high` → bad, else ok) unless `markerTone` forces a color.

`RangeBarMarkerTone` (`'auto' | 'ok' | 'warn' | 'bad'`) is the only secondary export. Distinct from `Meter` (a single fill toward a target) and `StackedBar` (proportion segments) — `RangeBar` is specifically a value-vs-healthy-band readout.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `value` | `number` | — (required) | ✓ | ✓ | current reading, in `[min, max]` |
| `min` | `number` | `0` | ✓ | ✓ | range floor |
| `max` | `number` | `100` | ✓ | ✓ | range ceiling |
| `low` | `number` | — (required) | ✓ | ✓ | lower optimal boundary |
| `high` | `number` | — (required) | ✓ | ✓ | upper optimal boundary |
| `label` | `string` | — | ✓ | ✓ | mono uppercase caption above the track |
| `unit` | `string` | — | ✓ | ✓ | suffix on the value readout |
| `showValue` | `boolean` | `false` | ✓ | ✓ | render the numeric value (+unit) on the header row |
| `markerTone` | `RangeBarMarkerTone` | `'auto'` | ✓ | ✓ | `'auto'` derives from the zone; else force ok/warn/bad |
| `className` | `string` | — | ✓ | — | web only |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only |
| _rest_ | `HTMLAttributes<HTMLDivElement>` (web, `Omit<…,'children'>`) / `ViewProps` (native) | — | ✓ | ✓ | spreads to the root |

- Header row renders only when `label != null || showValue`.
- Web sets `role="img"` + a composed `aria-label` (value, unit, optimal range). Native spreads `...rest` onto the root `View`.

## 3. Visual spec (tokens — never hardcode)

| Element | Web | Native |
| --- | --- | --- |
| Track | height 10px, `--r-pill`, 1px `--border`, 7px vertical margin (glow room) | height 10px (`TRACK_H`), radius 999, 1px `colors.border` |
| Zone fills | one CSS `linear-gradient`: red `rgba(255,77,109,.35)` to `--low`, green `rgba(52,245,197,.15)` to `--high`, red to 100% | 3 Views: low `rgba(255,77,109,.30)`, optimal `rgba(52,245,197,.28)`, high `rgba(255,77,109,.30)` |
| Optimal band | `linear-gradient(--zone-high → --ok)`, opacity 0.72, green glow `0 0 10px rgba(52,245,197,.4)` | solid `rgba(52,245,197,.45)`, radius 999 |
| Marker | 14px dot, `--marker` color, 2.5px `--bg-0` border, ring+glow `0 0 0 2px / 0 0 14px var(--marker)` | 14px (`MARKER`), tone color, 2.5px `colors.bg0` border, shadow (opacity .9, radius 6) |
| Label | `--font-mono` 10.5px, 500, uppercase, `0.16em`, `--text-faint` | `fonts.mono` 10.5px, letterSpacing 1.68, `colors.textFaint` |
| Value | `--font-mono` 12px, `--text-dim`; echoes `--zone-mid`/`--zone-low` when warn/bad | `fonts.mono` 12px; `valueColor` = zoneMid/zoneLow/textDim by tone |

- **Marker tone → color:** `ok → --zone-high` (`colors.zoneHigh`), `warn → --zone-mid`, `bad → --zone-low` — identical mapping both sides.
- **Per-instance vars (web):** `--low` / `--high` (zone boundary %), `--pos` (marker %), `--marker` (color). Native computes the equivalent widths/lefts inline.

## 4. States

| State | Web | Native |
| --- | --- | --- |
| In range (`low ≤ value ≤ high`) | marker `ok` green | same |
| Below range (`value < low`) | marker `warn` amber; value text amber | same |
| Above range (`value > high`) | marker `bad` red; value text red | same |
| Forced tone | `markerTone` overrides the auto color | same |
| Clamped | `value`/`low`/`high` outside `[min,max]` clamp to `[0,1]` fractions | same |
| No header | omitted when no `label` and `showValue=false` | same |

Static, read-only — no hover/focus/disabled states.

## 5. Web ↔ native parity

**Verdict: 🟡 same API, platform-shaped zone paint.** Identical props, zone boundaries, auto-tone logic, marker geometry (14px, bg-0 border, glow), and marker-color mapping. Differences are substrate + a hair of tint:

- **Zones:** web paints all three as one CSS `linear-gradient` keyed off `--low`/`--high`; native stacks three `View`s sized by the same fractions. Visually equivalent.
- **Tint opacities drift slightly:** web side-zone red `0.35` vs native `0.30`; web optimal-track green `0.15` vs native `0.28`; web band `0.72` (gradient) vs native `0.45` (solid). Close but not pixel-identical — flagged for the parity gate.
- **className ↔ style:** the universal substrate difference; callers read 1:1.

No capability gap; fully usable and visually equivalent on both.

## 6. Composition & usage

- **Used in:** labs / biomarker panels, "your reading vs healthy range" cards.
- **Composes from:** none (self-contained track + marker).

```tsx
// web — fasting glucose, auto-toned by zone
<RangeBar label="Fasting glucose" value={104} min={60} max={180}
  low={70} high={99} unit=" mg/dL" showValue />

// native — same contract
<RangeBar label="Fasting glucose" value={104} min={60} max={180}
  low={70} high={99} unit=" mg/dL" showValue />
```

## 7. Accessibility

- **Web:** root is `role="img"` with an `aria-label` composed from `label`, `value`, `unit`, and the optimal `low–high` range — screen readers get the full context without seeing color.
- **Native:** pass an `accessibilityLabel` via `...rest` for the same context (the auto a11y label is web-only).
- **Color independence:** status is conveyed by marker position **and** value-text color — but always include `showValue`/`unit` so the reading isn't color-only.
- **Hit target:** decorative; not interactive, so no touch-target concern.

## 8. Usage rules — Do / Don't

**Do**
- Supply real `min`/`max`/`low`/`high` for the biomarker; defaults (0–100) are placeholders.
- Use `showValue` + `unit` so the exact reading is legible, not just the dot.
- Let `markerTone='auto'` color by zone; only force a tone for special semantics.

**Don't**
- ✗ Don't use `RangeBar` for progress toward a goal — that's `Meter`/`ProgressBar`.
- ✗ Don't hardcode the zone or marker colors — they resolve from zone/status tokens.
- ✗ Don't omit `unit` on clinical values — a bare number is ambiguous.
- ✗ Don't hand-roll a three-zone lab bar — extend `RangeBar` on both platforms.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom "value-in-band" bar re-creating the three zones + glowing marker is a parity violation — import `RangeBar`.
- **New need → both platforms.** A new zone scheme, a second marker, or a `markerTone` value ships to web **and** native with the same prop name + tokens.
- **Tokens only.** Zone/marker colors come from `--zone-*` / `colors.zone*`; the slight web↔native tint drift is a known gap to close, not a license to hardcode new values.
- **Parity gate.** Before shipping, diff the web phone-width render vs native — same zones, same marker position/tone, same header — and reconcile the tint opacities if they read differently.
