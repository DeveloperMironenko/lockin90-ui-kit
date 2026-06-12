---
"@lockin90/tokens": major
"@lockin90/ui": major
"@lockin90/ui-native": major
---

**Aurora Flux — clean rebuild from `mockups/design/1`.** The kit was stripped to
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
