---
"@lockin90/ui": minor
"@lockin90/ui-native": minor
---

**Domain charts + native parity completions.** Three new energy/sleep-domain
chart primitives, in full web↔native parity, plus two native primitives brought
up to match their web twins.

- **`Hypnogram`** — a sleep-stage timeline. Four bands (Awake / REM / Light /
  Deep, top→bottom) hold rounded capsule bars whose widths are proportional to
  each segment's minutes, with thin vertical connectors so the eye follows the
  stage transitions like a stepped line. Optional left stage-label gutter +
  x-axis time row. Exports `SleepStage`, `HypnogramSegment`, `HypnogramProps`.
- **`PhaseWheel`** — a circular 24-hour circadian clock. A faint track ring with
  colored phase bands (sleep / focus / dip / wind-down), hour ticks (longer +
  brighter + labeled at the quarters), point markers on the ring, an optional
  "now" hand (pass `now={null}` to hide), and centered content. Exports
  `PhaseArc`, `PhaseMarker`, `PhaseWheelProps`.
- **`PkChart`** — a pharmacokinetics concentration-over-time curve. Builds the
  curve from raw `samples` or by summing each dose's normalized one-compartment
  **Bateman** absorption/elimination curve; renders a smooth area+line, a dashed
  threshold reference line with danger-zone tint, vertical dose markers, a peak
  callout and a y-axis. Exports `PkDose`, `PkThreshold`, `PkChartProps`.

Native parity completed (no API change):

- **`Tooltip`** (native) now renders the diamond arrow pointer on the edge facing
  the trigger — resolved-placement aware (the `top`→below fallback flips the
  arrow), mirroring the web `.lk-tip-bubble::after`.
- **`FocalPointPicker`** (native) now supports tap **and drag** (via
  `PanResponder`), matching the web pointer-drag twin (previously tap-only).

All three packages typecheck + build green; the new web CSS is folded into the
single `styles.css`; Storybook catalogs added on both platforms.
