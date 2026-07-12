# LockIn90 UI Kit — Primitive Component Inventory

_Generated 2026-06-21 from live source in `packages/ui` (web) + `packages/ui-native` (native)._

> **Status note:** the fully-rebuilt kit now lives on **`main`** (the earlier wipe was
> superseded). All three packages build, with Storybook catalogs on both sides.
>
> **Recent additions (2026-07-11) — training primitives (+6, web + native):**
> - **SetTable** — the per-set workout table (the training design's core primitive): colored
>   `W/1/2/D/F` set labels (warmup amber · working cyan · drop violet · failure magenta), centered
>   mono `weight×reps`, coach/AI reference column (mint/violet), mint done-check, cyan current-row
>   tint, red `PR` badge floated right of the value, `+ Add set` row. Helper `setLabels` exported.
> - **PrBadge** — the solid RED personal-record flag (`#FF4757`, the deliberate off-spectrum signal
>   literal; 4px radius, white mono, red glow). Used by SetTable + PrCard, exported as its own atom.
> - **RestTimer** — between-sets countdown: mint arc draining on a faint track (116/r50 ring),
>   mono time centered, sublabel + ghost Skip + `trailing` HR slot; prop-driven (caller ticks).
>   Helpers `formatRestTime`/`restFraction` exported.
> - **TemplateCard** — workout-template row card: display-font name, dim meta, faint "last used",
>   mint `COACH` / violet `AI` source pill, tinted left edge bar, pressable.
> - **PrCard** — personal-record card: `new`/`atPeak` = red-tinted border + glow + red PrBadge tag;
>   `offPeak` = quiet amber text tag.
> - **SessionBanner** — active-session live banner: dark glass card, one-line header (truncating
>   title · no-wrap status · pulsing magenta live dot), ≤3 mono stats split by hairlines, kit-Button
>   actions.
>
> **Recent additions (2026-07-10):**
> - **NotificationRow → design cards:** new `tone` prop (`insight·coach·achieve·announce·sync·billing`)
>   renders the glyph in a 34px tinted category tile; unread = violet tint + `--grad-cta` left-edge
>   bar + cyan dot, read dims to 66% (web + native).
> - **TabBar `floating` = frosted capsule:** full-radius capsule, height 62, inner clipped blur layer
>   (FAB overhangs the top edge), round FAB, real backdrop blur via `OptionalBlurView`.
> - **Haptics (native):** new `internal/optionalHaptics` (expo-haptics OPTIONAL peer, gated on the
>   native module; silent no-op otherwise) — exports `hapticSelection·hapticLift·hapticDrop`. Wired
>   into Toggle, TabBar, Button, SegmentedTabs, ListRow, Select for tactile feedback.
> - **Select `searchable` (web):** SearchInput-in-panel filter with keyboard nav + combobox a11y
>   (matches the native twin).
>
> **Recent additions (2026-06-21):**
> - **Parity gaps closed (native):** Divider `gradient`, CodeInput paste, ProGate frost,
>   Dropzone/DateField OS pickers, Card `blur` (optional-peer + graceful fallback).
> - **+17 primitives** (waves 1–3): Spinner, ProgressBar, DotsLoader, Meter, DeltaPill,
>   AvatarStack, RangeBar, Gauge, StackedBar, Heatmap, Highlight, TagCloud, CodeBlock,
>   Countdown, VersionBadge, SplitButton, CharCounter.
> - **Custom `Select`** (web `<select>` → custom accessible listbox dropdown).
> - **+5 CMS primitives:** Sortable, RichTextEditor (dep-free), FocalPointPicker,
>   CodeField, ColorPicker. **Icon expanded 11 → 60 glyphs.** **Table** gained
>   row-selection (`selectable`/`selectedKeys`/`onSelectionChange`).
> - **+2 Studio primitives:** ChoiceChip (pressable multi-select filter pill,
>   `<button aria-pressed>`) + Eyebrow (mono uppercase overline label).
>
> **Recent additions (2026-06-22):**
> - **+3 domain charts:** **Hypnogram** (sleep-stage timeline — Awake/REM/Light/Deep
>   bands with capsule bars + stepped connectors), **PhaseWheel** (circular 24h
>   circadian clock — phase arcs, hour ticks, "now" hand, center clock), **PkChart**
>   (pharmacokinetics concentration curve — one-compartment Bateman absorption/
>   elimination model, dashed threshold + danger tint, dose markers, peak callout).
>   Full web↔native parity (identical math/defaults) + Storybook on both.
> - **Native parity completed:** **Tooltip** gained the diamond arrow pointer
>   (mirrors the web `::after`, resolved-placement aware); **FocalPointPicker**
>   gained tap-**and-drag** (PanResponder) to match the web pointer twin.
>
> **Recent additions (2026-06-23) — web+mobile rebuild gap closure (+18 primitives):**
> - **Messaging:** MessageBubble, MessageComposer, TypingIndicator.
> - **AI / insights:** InsightCard, PendingPatternCard, EffectAttributionLine, ForecastCallout.
> - **Sensitive actions:** ReauthDialog (Modal step-up: password + Google SSO).
> - **Achievements / billing:** AchievementBadge (tiered + progress ring), PricingTierCard, CreditCardVisual.
> - **Domain:** MuscleDiagram (SVG body map, paths byte-identical both platforms), DayTimelineBlocks (24h rail + now).
> - **Forms:** PasswordStrengthMeter, Combobox (search + results).
> - **Social:** EngagementBar, FollowButton, LeaderboardRow.
> - **Extended:** LineChart (`band` uncertainty ribbon + `dashedFromIndex` forecast tail),
>   Slider (`labels`), Icon (60 → 74: +5 mood faces, +7 provider logos, + `home`/`activity`
>   bottom-nav glyphs), TabBar (string `IconName` icons now resolve via the FULL set — not
>   a hardcoded 11; new `fabIndex` elevated center-FAB variant matching `home.html .tab.fab`).
> - **Composed in-app, not kit exports — see [REUSE_RECIPES.md](./REUSE_RECIPES.md):**
>   ConfidenceMeter→Meter · ConversationRow→ListRow · E2EEBadge→Chip+lock Icon ·
>   GlycemicCurve→PkChart/band-LineChart · and the page-specific layouts **SocialPost /
>   ProfileHeader / ShareCard** (prototyped, then kept app-level as Card/Avatar/Ring compositions).
>
> - **Mobile shell + auth follow-up (`KIT_MISSING_COMPONENTS.md`):** `Icon` → **87** glyphs
>   (+13: energy/sleep/insights/billing/globe/heart/flame/height/weight/arrow-right/shield +
>   multicolor `google`/`apple` brand logos); **`PasswordInput`** — password field with a
>   show/hide eye toggle (mirrors `Input`, both platforms).
> - **Mobile round 3 (`MOBILE_KIT_NEEDS_OUTSTANDING.md`):** `Icon` → **95** glyphs (+8 domain:
>   mail/caffeine/meal/mood/scale/ruler/card/data-source); **`Button` `leading`** icon slot
>   (both platforms — e.g. SSO brand buttons). `sleep`/`heart` already existed (kept).
> - **Consumer glyph audit (`KIT_GLYPHS_REMAINING.md`):** `Icon` → **110** glyphs (+15:
>   send/attach/emoji/mic/comment/bookmark/target/medal/drop/utensil/barcode-scan/pill/flask/
>   syringe/camera) — completes the consumer-screen icon set.
>
> - **Admin operator console (`lockin90-admin/.../UI_KIT_REQUIREMENTS.md`) — NEW `@lockin90/ui/admin`
>   subpath (web-only):** `SideNav` (+NavItem/NavGroup), `MethodChip`, `SecretField`, `RedactedField`,
>   `InlineEdit`, `PulseStrip`, `FunnelChart`, `ReferenceRangeBar` (thin `RangeBar` wrapper), `PushPreview`,
>   `PermissionMatrix` (+`MatrixToggle`), `RecoveryCodeGrid`. Root utilities: `ScrollProgress`,
>   `AuroraBackground` (web), `QRCode` (dependency-free encoder). **6 enhancements:** `Table`
>   (row tone + expandable detail + sort indicator), `Card` (tone + ghost/dashed), `Stat`/`MetricTile`
>   (`empty`+`hint`), `SegmentedTabs` (per-item count+tone), `SearchInput` (`kbdHint`), `Icon` (+`stripe`).
>
> **Recent additions (2026-06-27):**
> - **Stepper:** new `variant="glow"` (onboarding tracker — 40px nodes, hollow done,
>   pulsing current, mint connectors). Default `compact` behavior unchanged. Both
>   platforms; the current-node pulse animation is web-only by design (native
>   renders a static stronger glow).
> - **StateLabel** — numbered mono section header (`01 ─── SIGN IN ──── hairline`).
>   Used for auth screens. Both platforms.
> - **BackLink:** new `variant="pill"` (glass-chip mono affordance — used as the auth brand-panel "Back to site" chip).
>
> **Recent additions (2026-07-03) — charts catalog program (`docs/sdd/CHARTS-PLAN.md`):**
> - The full `lockin90-design/charts/` design catalog — **251 named variants across 35 families** —
>   now lives in the kit, web + native in lockstep. One component per family (never a lookalike);
>   catalog SELECTs (color / segments / state / …) are plain props and every chart takes a `shine`
>   glow modifier. Ask-by-ID contract: catalog ID → component + `variant` + props resolves via
>   [docs/sdd/CHART-MAP.md](./docs/sdd/CHART-MAP.md).
> - **9 primitives EXTENDED** with catalog `variant` unions + option props (defaults unchanged):
>   LineChart, BarChart, ProgressBar, Ring, Gauge, DonutChart, Heatmap, Hypnogram, PhaseWheel.
> - **+27 NEW chart components** (same API both platforms; web inline-SVG + `lk-*` CSS ↔ native
>   `react-native-svg`, glow = wider faint duplicate shape): AreaChart, BeeswarmChart,
>   BiomarkerRange, BodyBattery, BulletChart, CaffeineClock, ChartState, ComboChart, CompareChart,
>   CompositeChart, DayWheel, DistributionChart, EnvironmentChart, FunnelChart (cross-platform;
>   the web-only `@lockin90/ui/admin` FunnelChart is unchanged), MetaphorWidget, RadarChart,
>   RoseChart, SankeyChart, ScatterChart, SessionChart (+`DEFAULT_SESSION_ZONES`), StatTile,
>   SupplementChart, TimelineChart, UnitChart, VitalsStrip, WatchComplication, ZonePyramid.
>
> Kit total: **~152 primitives** (root cross-platform + the web-only `@lockin90/ui/admin` operator set).

## Architecture

A pnpm workspace with **3 publishable packages**, one design language: **"Aurora Flux"**.

| Package | What it is | Build |
| --- | --- | --- |
| `@lockin90/tokens` | Typed token objects + `tokens.css` (`:root` vars) + `cssVar()`/`gradientCss()` helpers + native shadow descriptors | tsup |
| `@lockin90/ui` | Web (React) primitives emitting `lk-*` classes — **no Tailwind/Next required**; ships `styles.css` | tsup (preserves `"use client"`) |
| `@lockin90/ui-native` | React Native (Expo) primitives — `react-native-svg` + `expo-linear-gradient`, StyleSheet, `theme.ts` | builder-bob |

**~63 exported component symbols per platform** across ~50 files. The web/native APIs are
intentionally 1:1 (same names, same props, same variants) — only the rendering substrate differs.

## Design language — "Aurora Flux" (`@lockin90/tokens`)

- **Surfaces:** deep-void glassmorphism — `void #05060B` → `bg0/bg1/bg2`, translucent `glass`/`border`.
- **Energy spectrum:** `lime #A8FF35 → mint #34F5C5 → cyan #22D3EE → indigo #6E7BFF → violet #A855F7 → magenta #FF3D81`.
- **Accents:** `accent #7C5CFF` (violet), `accent2 #22D3EE` (cyan), `accent3 #34F5C5` (mint).
- **Signal zones:** `zoneHigh` mint / `zoneMid` amber / `zoneLow` red; status ok/warn/bad/info.
- **Gradients:** `flux` (5-stop, 100°), `cta` (violet→cyan, 135°), `mint`, `violet`, `warm`.
- **Radii:** sm 10 / md 16 / lg 22 / xl 28 / pill 999. **Type:** Space Grotesk (display), Inter (UI), JetBrains Mono (data).
- **Glow shadows:** `glowAccent/glowCyan/glowMint` + `elev1/elev2`; mirrored as `nativeShadows` for RN.
- **Brand mark:** energy line `#78CEDF` + peak dot `#C6F84E` on a dark icon tile.

---

## Component catalog (by category)

Legend — Parity: ✅ same API · 🟡 same API, platform-shaped impl · 🔵 capability gap on native.

### 1. Foundations & Brand
| Component | Exports | Purpose | Key variants/props | Parity |
| --- | --- | --- | --- | --- |
| **BrandMark** | — | Signature energy-line + peak-dot logo | `variant: mark·lockup·icon·mono`, `size` | 🟡 SVG both; web `title`, native `style` |
| **GradientText** | — | Spectrum-gradient text fill | `gradient: flux·cta·violet·mint` | 🟡 web CSS clip; native 2-pass SVG measure |
| **Icon** | — | Inline-SVG glyph set | `name` (11: back, chevron, share, more, lock, play, info, timer, plus, check, star), `size` | ✅ identical 11-set |
| **Divider** | — | Hairline rule | web `gradient?` fade | 🔵 native has no gradient variant |
| **Pulse** | — | Breathing live-status dot | `tone: ok·warn·bad` | 🟡 CSS anim vs shadow |
| **Skeleton** | — | Shimmer placeholder | `width·height·radius` | 🟡 native fill (shimmer external) |
| **Avatar** | `initialsFor` | Image or initials tile | `name·initials·src·size`, `shape: circle·rounded` | 🟡 gradient = CSS string vs stop array |
| **StateLabel** | — | Numbered mono section header (`01 ─── SIGN IN ──── hairline`). Used for auth screens. | `num·label` | 🟡 web gradient hairline; native flat `border2` |

### 2. Buttons & Form Inputs
| Component | Exports | Purpose | Key variants/props | Parity |
| --- | --- | --- | --- | --- |
| **Button** | — | Pill button, animated CTA gradient | `variant: default·primary·ghost`, `size: sm·md` | 🟡 native `title`, web `children` |
| **Input** | — | Glass text field, label/unit/leading | `inputSize: sm·md`, `invalid` | ✅ |
| **FormField** | `SearchInput` | Label + help/error + required `*` wrapper; search field w/ clear | — | ✅ |
| **NoteField** | — | Multiline private-notes textarea | `rows`/`numberOfLines` | ✅ |
| **Checkbox** | `Radio`, `RadioGroup` | Tick/indeterminate box; radio + group | `checked·indeterminate·disabled` | 🟡 native Radio drops HTML `name` |
| **Toggle** | — | On/off switch, gradient knob | `size: sm·md`, `role=switch` | ✅ |
| **Slider** | — | Range slider, gradient fill + glow thumb | `min·max·value·fill·glow` | 🟡 web `<input range>` vs RN PanResponder |
| **Select** | — | Dropdown field | `options·value·invalid` | 🟡 web `<select>` vs native bottom-sheet Modal |
| **DateField** | `TreeItem` | Date/time field; nested tree row | `type: date·datetime-local·time`; TreeItem `depth·expandable·active` | 🟡 native picker is a text field |
| **TagInput** | `CodeInput` | Removable tag pills; N-digit OTP | `tags`; `length` (def 6) | 🔵 native CodeInput has no paste |
| **Stepper** | `NumberStepper` | Numbered progress rail; ± quantity control | `steps·current`; `min·max·step` | ✅ |

### 3. Data Display & Charts
| Component | Exports | Purpose | Key variants/props | Parity |
| --- | --- | --- | --- | --- |
| **Card** | — | Glass panel — base surface | `hover·lit·padLg·flat` | 🟡 native no hover/backdrop-blur |
| **Stat** | — | Label + big value + signed delta | `deltaDir: up·down` | ✅ |
| **MetricTile** | `ProgressDots` | KPI tile w/ delta pill; segment-dot progress | `deltaTone: up·down·flat`; `total·filled` | ✅ |
| **KeyValue** | `StatusDot`¹ | Definition-list rows | `align: spread·inline` | ✅ |
| **Chip** | — | Status pill, optional glow dot | `tone: default·high·mid·low·accent` | 🟡 native `label` required vs web children |
| **Badge** | (in Toast)² | Tiny count/dot pill | `tone: accent·high·mid·low·neutral`, `dot` | 🟡 |
| **StatusDot** | (in KeyValue)¹ | Tiny status dot + pulse | `tone: high·mid·low·accent·neutral`, `pulse` | 🟡 |
| **Ring** | — | Circular progress, glow arc | `value·size·thickness·gradient·glow`; NEW `variant: score·dual·triple·thin-halo·dashed-track·pulse·delta`, `zone`, `delta` | 🟡 SVG both; native glow via 2nd circle |
| **BarFill** | — | Thin gradient progress bar (0–1) | `value·height·visible`, `gradient: cta·mint·warm·flux·violet` | 🟡 |
| **Sparkline** | — | Mini trend line + area + end dot | `data·fill·dot·strokeWidth` | 🟡 |
| **BarChart** | `BarChartVariant`·`BarChartLegendItem` | Vertical gradient bars, highlights | `bars·max·showValues`; NEW `variant` (14: bars·spectrum·zone·lollipop·diverging-tide·stacked·grouped-pair·value-caps·fade-history·today-pulse·rank-rows·waterfall·goal-bars·sparkbar-micro), `legend` | 🟡 gradient string vs tuple |
| **LineChart** | `LineChartVariant`·`LineSeries`·`LineCurve`·`LinePattern`·`GradientStop`·`LineLabel` | Smooth/straight line, area, grid, axes, markers | `data·axis·smooth·yAxis·markers`; NEW `variant` (solid·gradient·veil·tide-split·glass-fill·curve-styles·dash-dot·stroke-weight·neon·aurora-halo·ghost-echo·bead-chain·comet-head·peak-flag + marker/compare/band/forecast forms), multi-`series`, `curve`, `pattern` | 🟡 web stretch-SVG vs fixed viewBox |
| **DonutChart** | — | Segmented donut, center total | `segments·thickness·gap`; NEW `variant: donut·duo-split·split-arcs·zone-share·hero-arc·callout-arcs·…`, `hero`, `callouts`, nested `innerSegments`, `shine` | 🟡 SVG dashoffset vs RN rotation |
| **Hypnogram** | `SleepStage`·`HypnogramSegment`·`HypnogramVariant`·`EfficiencyInterval`·`SleepNight` | Sleep-stage timeline — capsule bars on Awake/REM/Light/Deep bands + connectors | `segments·height·axis·showStageLabels`; NEW `variant: hypnogram·efficiency-bars·sleep-week·bedtime-drift·night-coach` | 🟡 web stretch-SVG vs measured viewBox |
| **PhaseWheel** | `PhaseArc`·`PhaseMarker`·`PhaseWheelVariant`·`CyclePhase` | Circular 24h circadian clock — phase arcs, hour ticks, now-hand | `arcs·markers·now·size·thickness·hourTicks`; NEW `variant: circadian·phase-wheel·coach-wheel·phase-strip`, cycle `phases` | 🟡 SVG dashoffset vs RN rotation |
| **PkChart** | `PkDose`·`PkThreshold` | Pharmacokinetics curve — Bateman model, threshold + danger tint, dose markers, peak | `doses·samples·halfLifeH·tMaxH·threshold·unit` | 🟡 web stretch-SVG vs measured viewBox |
| **ProgressBar** | `ProgressBarVariant` | Linear progress bar (extended) | NEW `variant: progress·zone-progress·step-cells·milestone-line·ghost-compare·overflow-badge·head-pill·countdown-drain` | 🟡 |
| **Gauge** | `GaugeZone` | Arc gauge (extended) | `value·min·max·zones·gradient`; NEW `sweep`, `ticks`+`tickPosition`, `cap`, `zone`, `shine`, `label`/`showValue` | 🟡 web SVG ↔ RN-svg |
| **Heatmap** | `HeatmapCell`·`lerpColor` | Value grid / calendar heatmap (extended) | `cells·columns·colorFrom/To`; NEW `variant: grid·strip`, `scale: zone·spectrum·diverge`, row/col labels, `dayLetters`, `dots`, `glass`, `focusRow`, `showValues`, today ring + `todayPulse`, `shine` | 🟡 web SVG ↔ RN-svg |
| **FunnelChart** | `FunnelStage`·`FunnelChartFill` | Stage-conversion funnel — bands or bars + drop labels | `variant: band-funnel·bar-funnel·zone-funnel·compare-funnel`, `fill: tokens·glass`, `shine` | 🟡 web SVG ↔ RN-svg |
| **BiomarkerRange** | `BiomarkerMarker`·`BiomarkerTrend` | Lab markers on reference ranges — rows / tiles / trend / history | `variant: panel-rows·single-marker·marker-trend·panel-grid·range-history` | 🟡 web SVG ↔ RN-svg |
| **AreaChart** | `AreaSeries`·`AreaMultiple` | Stacked / stream / percent area compositions | `variant: stack·percent-stack·stream-center·effect-stack·fade-stack·mini-multiples` | 🟡 web SVG ↔ RN-svg |
| **CompareChart** | `CompareMetric`·`RankSeries`·`LadderStep` | Before/after + rank comparisons | `variant: slope-panel·dumbbell-rows·bump-ranks·delta-arrows·mirror-bars·cohort-slopes·ladder-steps` | 🟡 web SVG ↔ RN-svg |
| **ScatterChart** | `ScatterPoint` | Correlation dots, bubbles, quadrants, density | `variant: mint-scatter·trend-fit·bubble-dose·quadrant-map·zone-dots·today-marker·density-cloud` | 🟡 web SVG ↔ RN-svg |
| **DistributionChart** | `DistributionBell`·`BoxRow`·`RidgeRow` | Histogram / bell / box / violin / ridgeline | `variant: histogram·bell-percentile·cohort-bells·box-rows·violin·ridgeline` | 🟡 web SVG ↔ RN-svg |
| **TimelineChart** | `TimelineEvent`·`TimelineSpan`·`TimelineLane`·`TimelineCluster`·`TimelineMilestone` | Event/duration timelines — lanes, gantt, 24h ticks, feed | `variant` (14: event-line…milestone-flags), `markerStyle: dots·pins·pills`, `feedLayout` | 🟡 web SVG ↔ RN-svg |
| **SessionChart** | `DEFAULT_SESSION_ZONES`·`SessionZone`·`SessionRound`·`SessionRecovery` | Workout / sauna / recovery / glucose session traces | `variant: hr-zones-session·hr-intervals·time-in-zones·hr-recovery·sauna-rounds·sauna-heat-ramp·night-recovery·glucose-response·response-overlay` | 🟡 web SVG ↔ RN-svg |
| **SankeyChart** | `SankeyNode`·`SankeyLink`·`SankeyFactor`·`SankeyChord` | Flow ribbons source → outcome | `variant` (9: duo-flow…chord-factors), `ribbonStyle: solid·spectrum·glass·gradient` | 🟡 web SVG ↔ RN-svg |
| **RadarChart** | `RadarSeries`·`RadarFill` | Spider / balance polygon + overlays | `variant: balance-radar·target-overlay·cohort-ghost·zone-vertices·weeks-trail·mini-triples`, `fill` | 🟡 web SVG ↔ RN-svg |
| **RoseChart** | `RosePetal` | Polar-area rose | `variant: balance-rose·week-rose·rose-compare` | 🟡 web SVG ↔ RN-svg |
| **DayWheel** | `DayWheelEvent` | Radial 24h day view | `variant: clock-events·radial-bars·zone-wheel·radial-heat` | 🟡 web SVG ↔ RN-svg |
| **UnitChart** | `UnitSegment`·`UnitPictogramRow`·`UnitHabitRow` | Waffle / pictogram / day-dot unit counts | `variant: waffle-90·waffle-share·pictogram-rows·day-dots·habit-grid` | 🟡 web SVG ↔ RN-svg |
| **BeeswarmChart** | `BeeswarmPoint`·`BeeswarmGroup`·`BeeswarmTick` | Dot swarms on an axis — history / scores / PR | `variant: history-swarm·score-swarm·pr-swarm·month-swarm` | 🟡 web SVG ↔ RN-svg |
| **ZonePyramid** | `PyramidZone` | HR-zone pyramid Z5→Z1 | `variant: zone-pyramid·target-pyramid·mirror-pyramid` | 🟡 web SVG ↔ RN-svg |
| **ComboChart** | `ComboMetric` | Dual-metric combos — bars+line, area+line, bars+plan | `variant: bars-line·area-line·bars-plan` | 🟡 web SVG ↔ RN-svg |
| **BulletChart** | `BulletRow` | Bullet rows — measure vs target vs ranges | `variant: bullets·single-bullet·over-bullets` | 🟡 web SVG ↔ RN-svg |
| **SupplementChart** | `SupplementRow`·`SupplementSeries`·`SupplementVessel` | Supplement level kinetics + liquid batteries | `variant` (9: saturation-story…battery-hero) | 🟡 web SVG ↔ RN-svg |
| **BodyBattery** | `BatteryDrainEvent` | Energy-reserve day curve / battery glyphs | `variant: battery-day·battery-glyph·drain-events·battery-week·battery-vs` | 🟡 web SVG ↔ RN-svg |
| **CaffeineClock** | `CaffeineDose` | Caffeine decay vs bedtime | `variant: decay-curve·stacked-doses·safe-window` | 🟡 web SVG ↔ RN-svg |
| **VitalsStrip** | — | ECG / HRV / respiration monitor strips | `variant: ecg-strip·hrv-rhythm·monitor·night-hr·anomaly-beat` | 🟡 web SVG ↔ RN-svg |
| **MetaphorWidget** | `MetaphorHabit`·`MetaphorMeal`·`MetaphorCamp` | Skeuomorphic widgets — thermometer, hourglass, garden, bottle, pacer… | `variant` (9: thermometer…breath-session) | 🟡 web SVG ↔ RN-svg |
| **StatTile** | `StatTileStat`·`StatTileRow`·`StatTileAccessory` | Big-number KPI tiles + chart accessories | `variant: stat-tile·hero-number·duo-tile·stat-list`, `accessory: none·spark·bars·ring·progress` | 🟡 web SVG ↔ RN-svg |
| **CompositeChart** | `CompositeTreemapItem`·`CompositeHorizonRow`·`CompositeGoalNode` | Treemap / horizon / calendar-micro / goal-tree | `variant: treemap·horizon-rows·calendar-micro·goal-tree` | 🟡 web SVG ↔ RN-svg |
| **ChartState** | — | Chart loading / empty / locked / error / partial-sync states | `variant: skeleton-chart·loading-ring·empty-cta·locked-forecast·error-retry·partial-sync` | 🟡 web SVG ↔ RN-svg |
| **WatchComplication** | `WatchComplicationCorners` | Watch-face complication tiles | `variant: ring-score·battery-gauge·micro-spark·corner-gauge·inline-pill·rings-trio` | 🟡 web SVG ↔ RN-svg |
| **EnvironmentChart** | — | Sun / UV / pollen / AQI environment views | `variant: sun-uv-arc·pollen-rows·aqi-day·outdoor-window` | 🟡 web SVG ↔ RN-svg |
| **Table** | — | Sticky-header data table, sortable, dense | `columns·rows·sortKey·sortDir·dense` | 🟡 `<table>` vs flex Views in ScrollView |
| **SetTable** | `setLabels`·`WorkoutSet`·`SetType`·`SetReferenceTone`·`SetTableColumn` | Per-set workout table — colored W/1/2/D/F labels, mono weight×reps, coach/AI reference, mint done-check, PR badge | `columns: set·value·reference·check`, `editable`, `onSetPress·onTogglePress·onAddSet`, `referenceHeader` | 🟡 `<table>` vs flex rows; grad-mint check = CSS vs expo-linear-gradient |
| **PrBadge** | — | Solid RED personal-record flag (#FF4757, 4px radius, red glow) | `label` (PR·NEW·AT PEAK…), `size: sm·md` | ✅ |
| **RestTimer** | `formatRestTime`·`restFraction` | Between-sets countdown — mint arc on faint track, mono time, Skip + trailing slot | `remainingSec·totalSec·label·sublabel·onSkip·paused` | 🟡 web dashoffset transition; native discrete redraw + Gaussian glow |
| **TemplateCard** | `TemplateSource` | Workout-template row card — name, meta, last-used, source pill, tint bar | `source: coach·ai·manual`, `tint`, `onPress`, `trailing` | ✅ |
| **PrCard** | `PrCardState` | Personal-record card — red border/glow + PrBadge tag when new/atPeak | `state: new·atPeak·offPeak`, `onPress` | ✅ |
| **SessionBanner** | `SessionBannerStat`·`SessionBannerAction` | Active-session live banner — one-line header, pulsing magenta dot, ≤3 stats, Button actions | `status·subtitle·stats·actions·live·leading` | 🟡 CSS pulse (reduced-motion gated) vs Animated loop; web backdrop blur |

### 4. Navigation & Layout
| Component | Exports | Purpose | Key variants/props | Parity |
| --- | --- | --- | --- | --- |
| **TabBar** | `FAB` | Bottom nav (icon+label); floating action button | `items·active·fabIndex`; `floating` = frosted capsule (blur + 62px, round FAB); native press haptic | 🟡 native accepts `IconName` strings + expo-blur/haptics optional peers |
| **Tabs** | — | Underline text tabs | `tabs·active` | ✅ |
| **SegmentedTabs** | — | iOS pill segmented control | `tabs·active` (items: `count·tone·icon`), `locked: number[]` upsell, `appearance: raised·tint` | ✅ locked behavior identical |
| **Pagination** | `Breadcrumb` | Numbered pager w/ ellipsis; crumb trail | `page·pageCount`; `items·onNavigate` | 🟡 web `<a href>` vs Pressable |
| **BackLink** | — | Chevron-left back affordance | `label·href·onClick/onPress` | 🟡 consumer owns nav (no router.back built in) |
| **Toolbar** | `Dropzone` | Icon-button group; file-drop area | `items`; `label·hint·onFiles` | 🔵 native Dropzone is tap-only (no drag-drop) |
| **ListRow** | — | Tappable list item, leading/trailing | `title·subtitle·active·danger·divider` | 🟡 web CSS sibling divider vs `divider` prop |
| **Timeline** | — | Vertical milestone roadmap | items `status: done·now·next`, `statusLabel` | 🟡 |
| **Accordion** | — | Collapsible disclosure list | `items·multiple·defaultOpen` | ✅ |

### 5. Overlays & Feedback
| Component | Exports | Purpose | Key variants/props | Parity |
| --- | --- | --- | --- | --- |
| **Modal** | — | Centered glass dialog over scrim | `size: sm·md·lg`, ESC/scrim close | 🟡 native scrim no blur |
| **Sheet** | — | Side drawer / bottom sheet | `side: bottom·right·left` | 🟡 |
| **Popover** | `CopyButton` | Click floating panel + arrow; copy-to-clipboard | `align: left·right·center`; `value` | 🟡 web portaled flip+shift; native clamp in Modal |
| **Menu** | — | Action menu w/ dividers, danger items | `align: left·right`, items `danger·divider` | 🟡 web collision-aware portal vs native Modal |
| **Tooltip** | — | Hover/focus (web) / press (native) tip, diamond arrow on both | `placement: top·bottom·left·right` | 🟡 web hover+portal flip vs native press |
| **Toast** | `Badge`² | Floating notification card | `tone: default·success·warn·danger` | ✅ |
| **Alert** | — | Tinted inline callout banner | `tone: info·success·warn·danger`, dismiss | ✅ |
| **EmptyState** | — | Zero-state card: icon+title+body+action | `compact` | ✅ |
| **ProGate** | `LockedRow` | Premium-lock overlay; gated list row | `title·subtitle`; `label` | 🔵 native dims (opacity) instead of blur |
| **VideoThumbnail** | — | Media tile, play glyph, duration badge | `src·duration·width·aspect` | 🟡 expo-linear-gradient placeholder |

¹ `StatusDot` lives in `KeyValue.tsx` on web, its own `StatusDot.tsx` on native.
² `Badge` lives in `Toast.tsx` on web, its own `Badge.tsx` on native. Same exported symbol/API either way.

---

## Parity verdict

The kit holds the "web phone-width ≡ native" rule well: **identical export names, prop names, and
variant unions on both sides**, so app code reads the same. Differences are confined to the
rendering substrate (CSS classes/SVG/DOM on web ↔ StyleSheet/`react-native-svg`/`expo-linear-gradient`
on native) and a few **genuine platform-capability gaps**, all by necessity:

- **Dropzone** — web has real drag-and-drop + `FileList`; native is tap-only (`onPress` → expo picker).
- **CodeInput** — native lacks clipboard paste of the full code (web supports paste + arrow keys).
- **Divider** — `gradient` fade variant is web-only.
- **ProGate** — web blurs gated content (`backdrop-filter`); native dims it (no RN backdrop blur).
- **Overlays (Popover/Menu/Tooltip)** — web is portaled + collision-aware (flip + shift via
  `computeMenuPosition`/`tooltipPosition`); native uses a `Modal` with measure-and-clamp positioning.
- **Card** — no hover lift / backdrop blur on native.
- **Select / DateField** — web uses the OS-native `<select>` / date picker; native renders a
  bottom-sheet Modal / text field.

Web-only utility exports: `cn`, `initMotion`, `useReveal`. Native ships `theme.ts` instead.
Both packages have full Storybook catalogs covering every primitive.
