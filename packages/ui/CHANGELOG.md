# @lockin90/ui

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

- fbeeb1f: **Admin operator-console kit gate (`lockin90-admin/docs/rebuild/UI_KIT_REQUIREMENTS.md`).**
  New **`@lockin90/ui/admin`** subpath (web-only operator primitives) + 3 root utilities + 6
  enhancements. Tokens-driven, Storybook on each.

  New `@lockin90/ui/admin` subpath (restored: barrel + tsup entry + `./admin` export):

  - **App shell:** `SideNav` (+ `NavItem`/`NavGroup` — sticky rail, gradient active-indicator,
    count badges, mobile drawer + scrim).
  - **Data/display:** `MethodChip` (per-method color map), `SecretField` (masked reveal + copy),
    `RedactedField` (E2EE "unreadable" hatch), `InlineEdit` (click-to-edit cell), `PulseStrip`
    (live-ingest equalizer + idle).
  - **Charts/widgets:** `FunnelChart` (+`FunnelStep`), `ReferenceRangeBar` (thin `RangeBar`
    wrapper), `PushPreview` (push/in-app/email notification card).
  - **Settings/security:** `PermissionMatrix` (+`MatrixToggle` — role×capability grid),
    `RecoveryCodeGrid`.

  Root (`@lockin90/ui`): `ScrollProgress`, `AuroraBackground` (web twin), `QRCode`
  (dependency-free QR encoder — real scannable otpauth QR).

  Enhancements (additive, backward-compatible): `Table` per-row `rowTone` + expandable detail
  rows (`expandable`/`renderDetail`/`expandedKeys`) + sort indicator · `Card` `tone` +
  `variant: 'ghost'|'dashed'` · `Stat`/`MetricTile` `empty`+`hint` placeholder · `SegmentedTabs`
  per-item `count`+`tone` · `SearchInput` `kbdHint` · `Icon` `stripe` glyph (web + native).

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

- 328242d: Add `Avatar` `variant="aura"` (animated energy-spectrum orb for the AI coach) and a new `ShareCard` component (branded, shareable progress/score card composing BrandMark + Ring/GradientText + Stat). Both platforms, tokens-only, with per-component SDDs and a ShareCard Storybook story. Closes two genuine gaps from the mobile design audit (the others — LineChart band/markers, Meter target, RangeBar marker, NumberStepper — already existed).
- 79cdd13: Two cross-platform additions (web + native, identical prop APIs, tokens-only):

  - **`Button` gains `tone="danger"`** — a destructive tone that composes with `variant`. On the `default` variant it paints a solid `--bad` fill (the primary destructive action); on `ghost` it becomes a red-tinted transparent button (the account "danger zone" delete). Web emits `.lk-btn--tone-danger`; native mirrors with `colors.bad` + the paired `rgba(255,77,109,…)` tint. Existing variants are unchanged.
  - **`PricingTierCard` supports per-feature included/excluded** — `features` now accepts `Array<string | { label; included? }>` (new exported `PricingFeature` type). A plain string or `included !== false` renders the mint check ✓; `included: false` renders a muted cross ✗ (`close` glyph in `--text-faint`, label in `--text-dim`). Fully back-compatible with the existing `string[]` API.

  Both ship with updated SDDs (`Button.md`, `PricingTierCard.md`) and Storybook stories (danger Button example, excluded-feature PricingTierCard example).

- 2929196: **Charts catalog program — the full `lockin90-design/charts/` design catalog (251 variants /
  35 families) lands in the kit, web + native in lockstep.** Ask-by-ID map: catalog ID →
  component + `variant` + SELECT-option props lives in `docs/sdd/CHART-MAP.md`
  (plan: `docs/sdd/CHARTS-PLAN.md`).

  **Extends 9 existing chart primitives** with catalog `variant` unions + option props
  (all previous defaults unchanged):

  - `LineChart` — `variant` (solid/gradient/veil/tide-split/glass-fill/curve-styles/dash-dot/
    stroke-weight/neon/aurora-halo/ghost-echo/bead-chain/comet-head/peak-flag + marker/compare/
    band/forecast forms), multi-`series`, `curve`, `pattern`, gradient stops, labels.
  - `BarChart` — `variant` (spectrum/zone/lollipop/diverging-tide/stacked/grouped-pair/value-caps/
    fade-history/today-pulse/rank-rows/waterfall/goal-bars/sparkbar-micro), legend.
  - `ProgressBar` — `variant` (zone-progress/step-cells/milestone-line/ghost-compare/
    overflow-badge/head-pill/countdown-drain).
  - `Ring` — `variant` (score/dual/triple/thin-halo/dashed-track/pulse/delta), `zone`, `delta`.
  - `Gauge` — `sweep`, `ticks`, `cap`, `shine`, `zone`, `label`/`showValue`.
  - `DonutChart` — `variant` (duo-split/split-arcs/zone-share/hero-arc/callout-arcs/…),
    `hero`, `callouts`, nested `innerSegments`, `shine`.
  - `Heatmap` — `variant` grid/strip, `scale` (zone/spectrum/diverge), row/col labels,
    day letters, dots, glass, focus row, today ring/pulse, `showValues`.
  - `Hypnogram` — `variant` (hypnogram/efficiency-bars/sleep-week/bedtime-drift/night-coach).
  - `PhaseWheel` — `variant` (circadian/phase-wheel/coach-wheel/phase-strip), cycle `phases`.

  **Adds 27 new chart components** (same names/props/variants on both platforms; web = inline
  SVG + `lk-*` classes, native = `react-native-svg`, glow via wide faint duplicate shapes):

  `AreaChart`, `BeeswarmChart`, `BiomarkerRange` (promoted cross-platform from the admin
  `ReferenceRangeBar` family), `BodyBattery`, `BulletChart`, `CaffeineClock`, `ChartState`
  (skeleton/loading/empty/locked/error/partial-sync chart states), `ComboChart`, `CompareChart`,
  `CompositeChart`, `DayWheel`, `DistributionChart`, `EnvironmentChart`, `FunnelChart` (promoted
  cross-platform; the legacy web-only `@lockin90/ui/admin` FunnelChart is unchanged),
  `MetaphorWidget`, `RadarChart`, `RoseChart`, `SankeyChart`, `ScatterChart`, `SessionChart`
  (+ `DEFAULT_SESSION_ZONES`), `StatTile`, `SupplementChart`, `TimelineChart`, `UnitChart`,
  `VitalsStrip`, `WatchComplication`, `ZonePyramid`.

  Every chart is tokens-driven, takes real data via props, supports the catalog SELECT options
  as props and the `shine` glow modifier, and ships a Storybook story per platform reproducing
  its catalog card.

- 61e4abe: **Consumer-screen glyph audit (`KIT_GLYPHS_REMAINING.md`): +15 Icon glyphs.** Both
  platforms, identical names, Storybook grids updated. Icon set 95 → 110.

  `send`, `attach`, `emoji`, `mic` (chat composer) · `comment`, `bookmark` (feed) ·
  `target` (goals) · `medal` (achievements, covers trophy) · `drop`, `utensil`,
  `barcode-scan` (nutrition) · `pill` (substances) · `flask`, `syringe` (labs) ·
  `camera` (vision). All stroke glyphs in the kit style (`currentColor`, viewBox 24).
  `mail` already shipped in `10df287`. Completes the consumer-screen icon set — the
  Section-B candidates (`plug`/`connect`→`link`/`data-source`, `rocket`→`sparkle`,
  `chart-line`→`insights`, `trophy`→`medal`, `clock-check`→compose) reuse existing glyphs.

- 0628034: **Domain charts + native parity completions.** Three new energy/sleep-domain
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

- b00c53b: Initial extraction of the P90 cross-platform design system into publishable packages.
- 0902f57: **Web-rebuild punch-list (`KIT_MISSING_COMPONENTS.md`): +13 Icon glyphs + `PasswordInput`.**
  Both platforms, same API/visuals, Storybook on both.

  - **Icon** — 74 → 87 glyphs: `energy`, `sleep`, `insights`, `billing`, `globe`, `heart`,
    `flame`, `height`, `weight`, `arrow-right`, `shield` (stroke glyphs in the kit style) +
    multicolor **`google`** and fill **`apple`** brand logos (these two render their own
    fills rather than `currentColor`). `IconName` identical on web + native.
  - **`PasswordInput`** — a password field with a built-in show/hide eye toggle, mirroring
    `Input` (`label`/`leading`/`invalid`/`inputSize`); owns `type`/`secureTextEntry`
    internally, swapping the existing `eye`/`eyeOff` glyph. Pairs with `PasswordStrengthMeter`.

- 19736bb: Close four parity gaps surfaced by the mobile auth/onboarding rebuild (all additive, back-compat, both platforms):
  - `Button` gains a `trailing` slot (symmetric with `leading`) — trailing-arrow CTAs.
  - `SegmentedTabs` gains a control-level `tone` ('accent' | 'mint') colouring the selected segment.
  - `Ring` `gradient` now accepts an N-stop `string[]` (full flux spectrum), not just a 2-stop `[from,to]`.
  - `Stepper` gains `complete` — renders the current/final node as done (the onboarding "calibrated" state).
- 79cdd13: **Web kit wave 1 (`@lockin90/ui`).** New primitives + a Divider variant + two CSS-class collision fixes + two admin renames (back-compat aliased), all tokens-driven (`lk-*` classes + `@lockin90/tokens`), no new dependencies.

  - **`ProGate` (new, web)** — premium-lock overlay: gated `children` blurred (`filter: blur(6px)`) + dimmed (`opacity 0.35`) behind a centered glass lock card (padlock + `title` + `subtitle`). Web twin of the native `ProGate`, same `ProGateProps`; closes the prior web coverage gap. `.lk-pro*` CSS.
  - **`SsoButton` (new, web)** — brand-icon SSO sign-in button (`provider: 'google' | 'apple'`): full-color Google "G" / monochrome Apple mark + label, glass pill, `disabled` state, renders a real `<button>`. Web twin of the native `SsoButton`. `.lk-sso*` CSS.
  - **`NotificationRow` (new)** — a notification list item: optional unread accent dot + optional typed leading `Icon` + `title` + right-aligned relative `time` + optional `body`; `onClick` makes it a `<button>`. Shared cross-platform contract with the native `NotificationRow` (`onClick` ↔ `onPress`).
  - **`Divider` `label` variant** — optional `label?: string` renders `hairline · centered label · hairline` (the "or continue with" pattern). Existing `gradient` / default behavior unchanged. `.lk-hr-labeled`/`.lk-hr-line`/`.lk-hr-label` CSS.
  - **CSS collision fix — `lk-dots`:** `ProgressDots` (in `MetricTile.tsx`) no longer emits `.lk-dots` (which collided with `DotsLoader`); its container is now `.lk-pdots` (dots stay `.lk-pdot*`). `DotsLoader` keeps the canonical `.lk-dots`.
  - **CSS collision fix — `lk-metric`:** admin `MetricRow` no longer emits `.lk-metric*` (which collided with the root `MetricTile`); it now emits `.lk-mrow*`. `MetricTile` keeps `.lk-metric*`.
  - **Admin rename — `FunnelChart` → `OperatorFunnel`:** the admin operator funnel (`@lockin90/ui/admin`) is renamed to avoid clashing with the root chart `FunnelChart`. Deprecated `FunnelChart` / `FunnelChartProps` aliases kept for back-compat.
  - **Admin rename — `Sparkline` → `TrendCard`:** the admin titled stat+area-chart card (`@lockin90/ui/admin`) is renamed (it's a card, not a bare sparkline) to avoid clashing with the root cross-platform `Sparkline`. Deprecated `Sparkline` / `SparklineProps` aliases kept for back-compat.

- 79cdd13: Wave 2 — consolidate the web tone-pill, stat-tile, proportion-bar, and card families onto single sources of truth. Every existing export name + its `*Props`/`*Tone` types keep working (admin/marketing apps import them); the duplicates are now thin wrappers of the canonical primitive, with no visual regressions. New canonical props (a native twin should mirror these for parity):

  - **`Chip` gains `size?: 'sm' | 'md'`** (default `'md'`; new `ChipSize` type). `size="sm"` is the compact count/status badge — tighter box, 10px tabular mono, a FILLED-gradient `accent`, and a bare glowing `dot`. `Badge` (`Toast.tsx`), admin `StatusChip`, and marketing `Pill` are now thin wrappers of `Chip` (the retired `.lk-badge*` / `.lk-schip*` / `.lk-pill` CSS was deleted). `StatusChip`'s `neutral` maps to `Chip`'s `default` (its true equivalent). Base `.lk-chip` gained `white-space: nowrap`.
  - **`Stat` gains `tone?: 'default' | 'gradient' | 'mint'`, `valueColor?`, `size?: 'sm' | 'md' | 'lg' | 'hero'`, `sub?`** (new `StatTone`/`StatSize` types; default `md` unchanged). `sm`/`lg` mirror admin `Statistic` (20/28px); `hero` is the marketing `Stat` (oversized value, label below, animated spectrum gradient). The `gradient` tone renders static flux on sm/md/lg and the animated full-spectrum on `hero`. Admin `Statistic` + marketing `Stat` are now thin wrappers of `Stat` (retired `.lk-statistic*` / `.lk-mkt-stat*` CSS deleted).
  - **`MetricTile` gains `spark?: number[]`** (+ `sparkColor?`) — a bottom fill bar (single value in `[0,1]`, or a series filled to `last/max`). Admin `StatCard` is now a thin wrapper of `MetricTile` via `spark` (KPI-cell chrome re-scoped onto `.lk-metric.lk-statcard`; delta line + value tone preserved).
  - **`Card` gains a polymorphic `as?: ElementType`** (default `div`). Marketing `Card` is now a thin wrapper of the root `Card` (`as` lives on root; `.lk-mk-card` padding kept).
  - **Fixed a `.lk-spark*` CSS collision:** admin `TrendCard` shared `.lk-spark` / `.lk-spark-line` / `.lk-spark-area` with the root `Sparkline`, polluting both. TrendCard's classes are renamed `.lk-trend*` (CSS file `sparkline.css` → `trendcard.css`); its component API is unchanged.

- 10df287: **Mobile rebuild round 3 (`MOBILE_KIT_NEEDS_OUTSTANDING.md`): +8 Icon glyphs + `Button` leading slot.**
  Both platforms, same API/visuals, Storybook on both.

  - **Icon** — 87 → 95 glyphs: `mail`, `caffeine`, `meal`, `mood`, `scale`, `ruler`, `card`,
    `data-source` (exact stroke paths from the mobile mockups). `IconName` identical on web +
    native. (`mail` also covers the frontend auth email-field follow-up.) The doc's `sleep` /
    `heart` already shipped in `0902f57` and are kept as-is.
  - **`Button`** — new optional `leading?: ReactNode` slot (icon before the label, auto-spaced
    by the existing `.lk-btn` gap / native row), so SSO brand buttons (`<Button leading={<Icon
name="google"/>}>`) need no app-level composition. Additive — existing usages unchanged.

- d456791: **Mobile shell + bottom-nav kit updates** (from `MOBILE_KIT_UPDATES_SHELL_NAV.md`).
  Makes the mobile bottom nav fully kit-native (drops the app's inline-SVG + FAB-overlay
  workarounds). Both platforms, same API/visuals, Storybook on both.

  - **Icon** — +2 glyphs `home` (Today tab) and `activity` (Insights bar-chart), exact paths
    from the mockup, matching the existing stroke style. 72 → 74 glyphs; `IconName` identical
    on web + native.
  - **TabBar** — the icon resolver now maps **any** string `icon` through the FULL `IconName`
    set (previously gated on a hardcoded 11 names, so modern names like `calendar`/`home`/
    `activity` fell through to raw text). Web `TabBarItem.icon` widened `ReactNode` →
    `ReactNode | IconName` to match native (the `ReactNode` slot still works); web default
    items aligned to string icons.
  - **TabBar** — new optional `fabIndex` + `onFabPress`: renders that slot as an elevated
    energy-gradient (`grad-cta`) rounded-square FAB overhanging the bar top with the label
    beneath, matching `home.html .tabbar .tab.fab`. Omit `fabIndex` for the flat bar
    (unchanged).

  Added a `MobileNav` Storybook story on both platforms (Today · Calendar · ⊕Log · Coach ·
  Insights, `fabIndex={2}`). tokens/ui/ui-native typecheck + build green.

- 86c9e88: **Web + mobile rebuild — kit gap closure (+21 primitives, 2 extensions, +12 icons).**
  Adds every genuine kit gap from `MOBILE_PRIMITIVES_BUILD_PROMPT.md` and the web
  `UI_KIT_REQUIREMENTS.md`, each shipped on BOTH `@lockin90/ui` (web) and
  `@lockin90/ui-native` (native) with the same export name, prop API and visuals
  (tokens-driven), cataloged in Storybook on both sides.

  New primitives:

  - **Messaging** — `MessageBubble`, `MessageComposer`, `TypingIndicator`.
  - **AI / insights** — `InsightCard`, `PendingPatternCard`, `EffectAttributionLine`, `ForecastCallout`.
  - **Sensitive actions** — `ReauthDialog` (Modal step-up: password + Google SSO).
  - **Achievements / billing** — `AchievementBadge` (tiered medal + progress ring),
    `PricingTierCard` (featured ribbon), `CreditCardVisual` (gradient card art).
  - **Domain** — `MuscleDiagram` (SVG body map), `DayTimelineBlocks` (24h rail + now marker).
  - **Forms** — `PasswordStrengthMeter`, `Combobox` (search + results).
  - **Social** — `EngagementBar`, `FollowButton`, `LeaderboardRow`.

  Extended (additive, backward-compatible):

  - `LineChart` — `band` (uncertainty ribbon on a shared expanded y-scale) + `dashedFromIndex`
    (dashed forecast tail). No-prop output is byte-identical to before.
  - `Slider` — `labels[]` row under the rail (mood/focus scales).
  - `Icon` — 60 → 72 glyphs (+5 mood faces, +7 provider logos: oura/whoop/garmin/polar/
    apple-health/dexcom/strava); `IconName` identical on both platforms.

  Some requested items are NOT kit exports — composed in-app instead (see
  `REUSE_RECIPES.md`): ConfidenceMeter→Meter, ConversationRow→ListRow, E2EEBadge→Chip,
  GlycemicCurve→PkChart/band-LineChart, plus the page-specific layouts SocialPost /
  ProfileHeader / ShareCard (Card/Avatar/Ring compositions).

- fc607b7: Restore the `@lockin90/ui/marketing` subpath. Ports the marketing presentational
  primitives — Container, Section/SectionHeader, Typography (Heading/Body/Lead/Eyebrow/
  Mono), Pill, Reveal, IconBadge, Field (Input/Textarea), Icon (+IconName, with `star`/
  `topic` added), Stat, Accordion, Card — from the archived kit onto the rebuilt Aurora
  tokens/classes, and re-wires the subpath: a second tsup entry (`src/marketing/index.ts`
  → `dist/marketing/index.{mjs,cjs,d.ts}`), the `./marketing` package export, and the
  marketing CSS folded into the single `dist/styles.css` (no extra app CSS import).
  Unblocks `lockin90-marketing`, which imports `@lockin90/ui/marketing` on every page.
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

- eacd99c: Add the 6 training primitives (web + native, identical prop APIs): `SetTable` — the per-set workout table (colored W/1/2/D/F set labels, centered mono weight×reps, coach/AI reference column, mint done-check, cyan current-row tint, red PR badge, + Add set row; helper `setLabels`); `PrBadge` — the solid red personal-record flag (#FF4757, 4px radius, red glow); `RestTimer` — the between-sets countdown ring (mint arc on faint track, mono time, Skip transport, trailing HR slot; helpers `formatRestTime`/`restFraction`); `TemplateCard` — workout-template row card (source pill mint Coach / violet AI, tint edge bar); `PrCard` — personal-record card (red border/glow + PrBadge tag for new/atPeak, amber text for offPeak); `SessionBanner` — active-session live banner (one-line header, pulsing magenta live dot, ≤3 mono stats, kit-Button actions). All tokens-driven, with SDDs, Storybook stories, and render tests on both platforms.
- bde4f15: Add `ZoneBar` — an HR training-zone bar (time-in-zone across the 5 heart-rate zones Z1–Z5 with a current-zone marker), both platforms, tokens-only (cool→hot spectrum ramp), with an SDD and Storybook story. Grounded in the watch-v2 `zonebar`/`zgauge` pattern; closes the #3 gap from the watch-v2 design comparison so the training screens stop hand-rolling zone bars.

### Patch Changes

- Updated dependencies [43e2a35]
- Updated dependencies [30d758b]
- Updated dependencies [b00c53b]
- Updated dependencies [cca32e9]
  - @lockin90/tokens@1.0.0
