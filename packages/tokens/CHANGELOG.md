# @lockin90/tokens

## 1.1.0

### Minor Changes

- a881fa2: Layout rules: a 4px spacing scale (`--space-0`…`--space-24`, `spacing`) and breakpoints (`--bp-phone` 540, `--bp-tablet` 980, `breakpoints`); the Tailwind preset maps both.

## 1.0.0

### Major Changes

- 43e2a35: **Aurora Flux — clean rebuild from `mockups/design/1`.** The kit was stripped to
  its build env and rebuilt as one curated core component set grounded in the
  canonical design preview. This is a breaking API + styling change.

  - **`@lockin90/tokens`** — re-derived to mirror `design/1/shared/tokens.css`
    exactly. CSS-var names now match the design (`--bg-0/1/2`, `--text`,
    `--text-dim`, `--text-faint`, `--accent`, `--accent-2/3`, spectrum
    `--lime…--magenta`, `--grad-*`, `--glow-*`, `--r-*`, `--ease`). The structured
    TS API (`colors`, `gradients`, `gradientStops`, `shadows`, `fonts`, `radius`,
    `spacing`, `energyColor`/`energyLabel`/`zoneGradient`) is retained for RN.
    _Breaking:_ legacy color keys (`bgBase`, `textPrimary`, `--bg-base`,
    `--ease-smooth`, …) were renamed/removed.

  - **`@lockin90/ui`** — all ~85 previous components (incl. the app-specific
    admin/marketing one-offs) were removed and replaced by **~40 curated
    components** derived from the five design surfaces: foundation
    (`AuroraBackground`, `GradientText`, `Card`, `Button`, `Chip`, `Badge`,
    `StatusBadge`, `Pulse`, `Divider`, `Skeleton`, `Avatar`, `SectionLabel`,
    `Marquee`, `Eyebrow`), a React **motion layer** (`Reveal`, `CountUp`,
    `useInView`/`useCountUp`/`useTilt`/`useMagnetic`/`useReducedMotion`), form
    controls, data/viz (`Stat`, `KpiCard`, `BarFill`, `ProgressBar`, `MixBar`,
    `SparkLine`, `EnergyRing`, `EnergyCurve`, `Table`), navigation, feedback
    (`Modal`/`ConfirmModal`, `Toast`, `Banner`, `EmptyState`), and patterns
    (`InsightCard`, `PlanItem`, `EventRow`, `ContributionRow`, `CalendarStrip`,
    `FeatureCard`, `StepCard`, `PricingCard`, `Accordion`, `PhoneFrame`,
    `WearableCard`). _Breaking:_ the `ea-*` classes, the `@lockin90/ui/admin` and
    `@lockin90/ui/marketing` subpath exports, and the `next`/`next-intl` peer deps
    are gone. Components now emit `lk-*` classes from a rewritten `styles.css` and
    require **no Tailwind** — import `@lockin90/tokens/tokens.css` +
    `@lockin90/ui/styles.css` and go.

  - **`@lockin90/ui-native`** — rebuilt as a clean Aurora Flux primitive set
    (Card, Button, Chip, Badge, StatusBadge, Pulse, Divider, Skeleton, Avatar,
    StatBlock, BarFill, ProgressBar, Input, FormRow, Toggle, Banner, EmptyState,
    SectionCard, Typography, MiniEnergyRing, BrandMark) from `@lockin90/tokens`.

  Consuming apps must migrate to the new component set + the
  `tokens.css` + `styles.css` import model (no Tailwind step).

### Minor Changes

- 30d758b: **Aurora Flux redesign.** Replace the retired shipped brand (single red `#FF1F1F`,
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

- b00c53b: Initial extraction of the P90 cross-platform design system into publishable packages.
- cca32e9: Restore two things the clean-slate rebuild dropped that `lockin90-marketing` depends
  on:

  - **`@lockin90/tokens/tailwind-preset`** — the opt-in, token-driven Tailwind preset
    (colors / fonts / radii / gradients / shadows), rebuilt from the current tokens and
    re-wired as a second tsup entry + `./tailwind-preset` package export.
  - **Main-kit props the app still uses** (additive, backward-compatible, web + native):
    `GradientText` gains an `as` prop; `Card` gains `pad` (`'none' | 'sm' | 'md' | 'lg'`);
    `Chip`/`ChipTone` gains a `'neutral'` tone.

  Together with the `@lockin90/ui/marketing` subpath restore, `lockin90-marketing` now
  typechecks with zero errors.
