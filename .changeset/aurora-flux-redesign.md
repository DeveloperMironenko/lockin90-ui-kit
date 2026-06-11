---
"@lockin90/tokens": minor
"@lockin90/ui": minor
"@lockin90/ui-native": minor
---

**Aurora Flux redesign.** Replace the retired shipped brand (single red `#FF1F1F`,
Barlow Condensed, flat / no shadows, sharp 4–6px radii) with the **Aurora Flux**
visual language: deep-void glassmorphism, a flowing energy-spectrum gradient
(lime → mint → cyan → indigo → violet → magenta), glow + soft elevation, rounded
10–28px radii, and **Space Grotesk** display type.

- **`@lockin90/tokens`** — palette, fonts (Space Grotesk / Inter / JetBrains Mono),
  radii, easing all re-valued. New tokens: spectrum colors (`lime…magenta`),
  `accent2`/`accent3`, glass surfaces, `gradients` + `gradientStops` (web CSS +
  RN/SVG stops), `shadows` (glow/elevation). Existing key & `--css-var` names are
  preserved (so consumers keep resolving); only their values changed, plus the new
  `--grad-*`, `--glow-*`, `--glass*`, `--r*`, spectrum vars are emitted.
- **`@lockin90/ui`** — `styles.css` `ea-*` classes re-themed to glass/gradient/glow
  (names unchanged). All hardcoded red/green/amber routed to tokens. `EnergyRing`
  and `EnergyCurve` now render the spectrum gradient (EnergyRing gains `gradient`,
  `label`, `showZone` props). `BrandMark` is the new gradient-check + "LockIn90"
  lockup. **16 new components**: `GradientText`, `Chip`, `Pulse`, `BarFill`,
  `AuroraBackground`, `Marquee`, `PhoneFrame`, `KpiCard`, `InsightCard`,
  `AttributionCard`, `ScoreBreakdown`, `Timeline`/`TimelineItem`, `CoachPlanItem`,
  `CalendarStrip`, `SyncBadge`.
- **`@lockin90/ui-native`** — re-themed automatically via tokens; `Alert` error/success
  colors routed to the new palette.

Consuming apps adopt the new look on their next build. **Action required:** load the
Space Grotesk font and expose `--font-space-grotesk` (web, via next/font) /
`@expo-google-fonts/space-grotesk` (native) — see `MIGRATION-AURORA.md`.
