# LockIn90 UI Kit — Primitive Component Inventory

_Generated 2026-06-21 from live source in `packages/ui` (web) + `packages/ui-native` (native)._

> **Status note:** the fully-rebuilt kit now lives on **`main`** (the earlier wipe was
> superseded). All three packages build, with Storybook catalogs on both sides.
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
>
> Kit total: **~109 cross-platform primitives** (identical web ↔ native APIs).

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
| **GradientText** | — | Spectrum-gradient text fill | `gradient: flux·cta·violet` | 🟡 web CSS clip; native 2-pass SVG measure |
| **Icon** | — | Inline-SVG glyph set | `name` (11: back, chevron, share, more, lock, play, info, timer, plus, check, star), `size` | ✅ identical 11-set |
| **Divider** | — | Hairline rule | web `gradient?` fade | 🔵 native has no gradient variant |
| **Pulse** | — | Breathing live-status dot | `tone: ok·warn·bad` | 🟡 CSS anim vs shadow |
| **Skeleton** | — | Shimmer placeholder | `width·height·radius` | 🟡 native fill (shimmer external) |
| **Avatar** | `initialsFor` | Image or initials tile | `name·initials·src·size`, `shape: circle·rounded` | 🟡 gradient = CSS string vs stop array |

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
| **Ring** | — | Circular progress, glow arc | `value·size·thickness·gradient·glow` | 🟡 SVG both; native glow via 2nd circle |
| **BarFill** | — | Thin gradient progress bar (0–1) | `value·height·visible` | 🟡 |
| **Sparkline** | — | Mini trend line + area + end dot | `data·fill·dot·strokeWidth` | 🟡 |
| **BarChart** | — | Vertical gradient bars, highlights | `bars·max·showValues` | 🟡 gradient string vs tuple |
| **LineChart** | — | Smooth/straight line, area, grid, axes, markers | `data·axis·smooth·yAxis·markers` | 🟡 web stretch-SVG vs fixed viewBox |
| **DonutChart** | — | Segmented donut, center total | `segments·thickness·gap` | 🟡 SVG dashoffset vs RN rotation |
| **Hypnogram** | `SleepStage`·`HypnogramSegment` | Sleep-stage timeline — capsule bars on Awake/REM/Light/Deep bands + connectors | `segments·height·axis·showStageLabels` | 🟡 web stretch-SVG vs measured viewBox |
| **PhaseWheel** | `PhaseArc`·`PhaseMarker` | Circular 24h circadian clock — phase arcs, hour ticks, now-hand | `arcs·markers·now·size·thickness·hourTicks` | 🟡 SVG dashoffset vs RN rotation |
| **PkChart** | `PkDose`·`PkThreshold` | Pharmacokinetics curve — Bateman model, threshold + danger tint, dose markers, peak | `doses·samples·halfLifeH·tMaxH·threshold·unit` | 🟡 web stretch-SVG vs measured viewBox |
| **Table** | — | Sticky-header data table, sortable, dense | `columns·rows·sortKey·sortDir·dense` | 🟡 `<table>` vs flex Views in ScrollView |

### 4. Navigation & Layout
| Component | Exports | Purpose | Key variants/props | Parity |
| --- | --- | --- | --- | --- |
| **TabBar** | `FAB` | Bottom nav (icon+label); floating action button | `items·active`; FAB circular/extended | 🟡 native accepts `IconName` strings |
| **Tabs** | — | Underline text tabs | `tabs·active` | ✅ |
| **SegmentedTabs** | — | iOS pill segmented control | `tabs·active`, `locked: number[]` upsell | ✅ locked behavior identical |
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
