# Component SDD — conventions & shared token vocabulary

This is the shared reference for every component SDD under `docs/sdd/components/`. SDDs cite these
tokens **by name**; don't restate the raw values in each file unless a value is component-specific.

## What these SDDs are
A per-component **spec + usage rules**, grounded in the real source. They pin down the contract
(props, tokens, states, parity) and the **rules that keep apps from hand-rolling lookalikes or
diverging web↔native**. One file per component; full 9-section format (see `TEMPLATE.md`, anchored by
`Button.md`). Admin (web-only) live under `admin/`, marketing (web-only) under `marketing/`.

## Design language — "Aurora Flux"
Deep-void glassmorphism + flowing energy-spectrum gradients + glow. Fonts: Space Grotesk (display),
Inter (UI), JetBrains Mono (data).

## Token vocabulary (cite by name — web `--var` / native `tokens.*`)

| Group | Web CSS var | Native (`@lockin90/tokens`) | Value |
| --- | --- | --- | --- |
| Surfaces | `--void` `--bg-0/1/2` | `colors.void` `colors.bg0/1/2` | `#05060B` `#080A12` `#0C0F1A` `#11151F` |
| Glass | `--glass` `--glass-2` | `colors.glass` `colors.glass2` | `rgba(255,255,255,.045)` / `.075` |
| Card / field fill | `--card` `--field` | `colors.card` `colors.field` | `rgba(22,24,32,.79)` (= `#13151D` on `--bg-0`) / `#25272E` (opaque) |
| Borders | `--border` `--border-2` `--border-control` | `colors.border` `colors.border2` `colors.borderControl` | `rgba(255,255,255,.09)` / `.16` / `.36` |
| Text | `--text` `--text-dim` `--text-faint` | `colors.text` `colors.textDim` `colors.textFaint` | `#EEF1F8` `#AAB2C6` `#868FA3` |
| Spectrum | `--lime --mint --cyan --indigo --violet --magenta` | `colors.lime` … | `#A8FF35 #34F5C5 #22D3EE #6E7BFF #A855F7 #FF3D81` |
| Accents | `--accent` `--accent-2` `--accent-3` | `colors.accent/accent2/accent3` | `#7C5CFF` `#22D3EE` `#34F5C5` |
| Zones | `--zone-high/mid/low` | `colors.zoneHigh/zoneMid/zoneLow` | `#34F5C5` `#FFB020` `#FF4D6D` |
| Status | `--ok --warn --bad --info` | `colors.ok/warn/bad/info` | `#34F5C5 #FFB020 #FF4D6D #6E7BFF` |
| Gradients | `--grad-flux/cta/mint/violet/warm` | `gradients.flux/cta/mint/violet/warm` | flux=5-stop 100° · cta=violet→cyan 135° · etc. |
| Radii | `--r-sm --r --r-lg --r-xl --r-pill` | `radii.sm/md/lg/xl/pill` | `10 / 16 / 22 / 28 / 999` |
| Glow / elev | `--glow-accent/cyan/mint` `--elev-1/2` | `nativeShadows.glowAccent/...` | see tokens.css |
| Motion | `--ease` `--ease-soft` `--dur` | n/a (native uses Animated/Reanimated) | cubic-beziers; .55s |
| Type | `--font-display/ui/mono` | `fonts.display/ui/mono` | Space Grotesk / Inter / JetBrains Mono |

## Parity legend (the §-header badge)
- ✅ **identical** — same API, same visuals, substrate is the only difference.
- 🟡 **same API, platform-shaped impl** — one or two props/visuals differ by necessity (e.g. web
  `children` ↔ native `title`; CSS gradient vs `expo-linear-gradient`), but app code reads 1:1.
- 🔵 **capability gap on native** — native genuinely can't do something web does (no `backdrop-filter`
  blur, no HTML drag-drop, no clipboard paste, OS picker vs custom). State exactly what + why.

## Web vs native substrate (the expected, allowed differences)
- **Web** emits `lk-*` classes (CSS in `packages/ui/src/styles/`), uses real DOM (`<button>`, `<select>`,
  `<table>`), portals + collision math for overlays, `backdrop-filter` blur, CSS animations.
- **Native** uses `StyleSheet` + `react-native-svg` + `expo-linear-gradient`, `Pressable`/`Modal`,
  `PanResponder` for drag, `theme.ts`. No hover; press feedback instead.
- **Native absolute fill:** spread `absoluteFill` from `src/internal/absoluteFill.ts`, never
  `StyleSheet.absoluteFillObject`: React Native 0.88 removed it, and spreading the missing value silently
  drops the positioning.

### Native glow/shadow substrate (current rule)
Native SVG glows/shines are **real Gaussian blurs**: a duplicate of the crisp shape drawn behind it with
`<Filter><FeGaussianBlur>` (react-native-svg 15, Fabric-native), the filter region padded so thin strokes
don't clip — most charts use `filterUnits="userSpaceOnUse"` absolute rects (e.g. `x=-24 … width=VB_W+48`),
a few use generous `%` regions. This **replaces** the old "wider faint unblurred duplicate — never SVG
filters on native" rule; any SDD still citing it is stale. View elevation/glow **surfaces** use
`nativeShadows.*` from `@lockin90/tokens` — RN New-Architecture CSS `boxShadow` strings, verbatim the web
`shadows` values. Small colored **dot/marker glows** in some components still use legacy inline
`shadowColor/shadowOpacity/shadowRadius`; the per-component SDD states which applies.

## Hard rules every SDD restates (tailored)
1. **Tokens only** — no hardcoded color/space/radius/shadow, even if it "looks the same".
2. **No lookalikes** — import the kit primitive; never re-create it locally.
3. **New need → add to BOTH platforms** — same prop name, same tokens; never a one-off.
4. **Parity gate** — web phone-width render ≡ native render before a screen ships.
5. **Accessible by default** — the "Accessibility" rule below: contrast, targets, names from props,
   announcements, reduced motion, text scaling.

## Accessibility (owner rule, 2026-11-10 — WCAG 2.2 AA, Apple HIG, Material)

A hard rule: every component SDD restates it in its §7 (one line citing this section) and says there how the
primitive meets each point. A primitive that can't meet one is fixed here, in the kit, never in an app.

- **Contrast:** text 4.5:1 (3:1 from 24px, or 18.7px bold); a control's edge, its icons and a focus ring 3:1,
  measured on the surface the element sits on (a card is `--glass` over `--bg-0` ≈ `#13151D`; a field's fill is
  `--glass-2` over the card ≈ `#25272E`). Never colour alone: an error has an icon and a text.
- **Targets:** native at least 44×44 pt; web at least 24×24 px (44 at phone width). A control drawn smaller
  keeps its look and gets the size from its hit area (native `hitSlop` / `minHeight`, web a `::before`).
- **Names via props:** every control is named by a prop the app fills in its language (`label`,
  `dismissLabel`, `clearLabel`…), never by built-in English. An English default that still exists is a
  fallback for older apps only; apps always pass the translated text.
- **Errors and changes are announced:** web `role="alert"` (errors) / `role="status"` (results), a field's
  error and help tied by `aria-describedby`; native `accessibilityLiveRegion="polite"` plus
  `AccessibilityInfo.announceForAccessibility` when an error appears, a field's label as its
  `accessibilityLabel` and its error / help as its `accessibilityHint`.
- **Reduced motion:** web `prefers-reduced-motion` (the global rule in `base.css`); native every
  `Animated.loop` and large movement stops when the kit's `useReducedMotion()` is true.
- **Increase Contrast:** native `useHighContrast()` / `useContrastColors()` (exported; Android high text
  contrast, iOS darker system colours — not Bold Text, a weight setting; one shared store, as
  `useReducedMotion`, where a change event beats a late first read) step faint → dim, dim → full text,
  `--border-2` → the control edge, the control edge → `--border-control-strong` (`.5`). The mapping is
  `highContrastColors` in tokens; web applies the same values under `@media (prefers-contrast: more)` in
  tokens.css (a test keeps them equal). Used by FormField, Input, PasswordInput, SearchInput,
  Select, ListRow, Eyebrow, Divider and Alert.
- **Loading indicators slow, never stop, under Reduce Motion** (Spinner 2.5s, DotsLoader ×3): they still
  say busy. Other loops stop at a defined still frame.
- **Text scaling is never disabled:** no `allowFontScaling={false}` or `maxFontSizeMultiplier`; inputs are
  16px / 16pt (no iOS zoom on web), with the box height kept by their padding and line height.
- **Over the aurora:** a card's fill is `--card` (79% opaque: the old glass colour on the page, but the
  aurora behind can't lift its text below 4.5:1); a field's fill is the opaque `--field`.
- **No word splits:** lines wrap between words only. A text that can hold a long word (any translation in
  a narrow box, any title at a large text size) is a native `FitText` (or measured by the shared
  `internal/wordFit.tsx` measurer, as SegmentedTabs and Select), which shrinks it until its widest word
  fits; web primitives use `useWordFit`. Never `numberOfLines` + `adjustsFontSizeToFit` on wrapping text.
  **The shrink never goes below the default text size or 11pt** (`fitFloor`: at a larger OS text size only
  that enlargement is taken back, `1 / fontScale`; at the default size nothing shrinks). The one exception
  (owner, 2026-11-11): SegmentedTabs `fill` choice rows and a MetricTile word value (`textValue`, FitText
  `belowDefault`) at the default text size may shrink below their design size, to 11pt / 11px drawn (`fitFloor(…, true)` / `fitFloorPercent(…, true)`), before they wrap
  into balanced rows of pills (never a column list). A word still too
  wide at that floor is the layout's to fix (a column fewer: MetricTile `onMinWidth`; segments on rows;
  the text above its icon); the word breaks only as the last resort. Lines break where iOS and Android
  break them (spaces, after a hyphen or a slash, between CJK characters); an email or web address never
  shrinks its paragraph (`breakableAddress` lets it break after "@" and ".").
- **No meaningful text under 11px** (chips, badges, eyebrows, labels, counts).
- **Narrow breakpoint:** `--bp-narrow` / `breakpoints.narrow` = 360 (max-width), alongside phone (540) and tablet (980); a large-padded Card tightens to 16 there.
- **44 at phone width (web) = 44 on native:** at ≤ 540px every Button (not `text`), SsoButton, Input,
  Select (both sizes), SearchInput, SegmentedTabs segment and the Modal close is at least 44px tall; native
  draws the same controls 44pt, so web and native stay equal. CodeInput boxes are 44 tall, 8 apart.
- **Focus (web):** everything focusable shows a `:focus-visible` ring at 3:1 — a 2px solid `--accent-2` ring
  (10.1:1 on the card), never `outline: none` without a replacement. **Fields have exactly one indicator,
  their own edge** (owner, 2026-11-11: the ring around the violet edge read as two outlines): Input,
  PasswordInput, SearchInput, Select trigger (and while open), DateField, CodeInput boxes, TagInput,
  NoteField, RichTextEditor, CodeField and the message composer turn their edge `--accent` and 2px (the 1px
  border plus a 1px inset shadow, so nothing moves), on mouse and keyboard focus alike; no outer ring, no
  glow. Invalid: the same in `--zone-low`. The edge goes from `--border-control` (3.3:1) to a 2px `--accent`
  (3.4:1 on the field, 4.2:1 on the card), WCAG 2.4.7 / 2.4.11. Buttons, links, chips and other controls
  keep the `--accent-2` ring. Native fields already draw only their edge.

### Measured ratios (2026-11-10)

| Pair | Ratio |
| --- | --- |
| `--border-control` (`.36` white) on the card `#13151D` | 3.34:1 (on `--bg-0` 3.26:1, on the field fill 3.23:1) |
| `--border-2` (`.16`) on the card — cards keep it | 1.62:1 (a container's edge, not a control's) |
| `--text-faint` `#868FA3` on the field fill `#25272E` | 4.62:1 (on the card 5.61:1, on `--bg-0` 6.09:1); was `#828B9F` 4.38:1 |
| `--text-dim` on the field fill | 7.06:1 |
| `--accent-2` focus ring on the card | 10.08:1 (the old `--accent` 45% ring was 1.79:1) |
| a focused field's 2px `--accent` edge | 3.43:1 on the field fill, 4.21:1 on the card, 4.40:1 on `--bg-1` |
| `--text-faint` / `--text-dim` on `--card` over the brightest aurora pixel | ≥ 4.90 / 7.49 (vivid: 4.56 / 6.97); the old glass card measured 3.22 / 3.71 |
| `--text-faint` (placeholder) on `--field` | 4.60:1, whatever is behind (was 2.77 over the aurora) |

The aurora peaks are modelled from the measured worst case (luminance .081 behind the old glass card): each
blob colour screened over `--bg-0` at the intensity that reproduces it (cyan .343, violet .547, magenta
.497), and 1.44× that for `vivid`. `tokens.test.ts` checks them.

## One shape, one line (owner rule, 2026-11-02 — "the border has to be the same")

Every bordered box in the kit has one of two corner radii and the same neutral line, on web and native.

| Kind | Radius | Which primitives |
| --- | --- | --- |
| **Control**: something you press, type into or pick (a box holding text or icons) | `--r-sm` / `radii.sm` (**10**) | Button (every variant, primary included), IconButton, SsoButton, SplitButton, FollowButton, BackLink, Input, PasswordInput, Select (`md` and `sm`), Combobox field, DateField, NoteField, CodeField cells, SearchInput (in `FormField`), TagInput (field and tags), Chip, ChoiceChip, Badge (native), DeltaPill, StateLabel, VersionBadge, TagCloud tags, SegmentedTabs (track and active segment), Pagination, Stepper buttons, Toolbar buttons |
| **Container**: a surface that holds controls or content | `--r` / `radii.md` (**16**) | Card and every card surface (InsightCard, PrCard, TemplateCard, PricingTierCard, PendingPatternCard, MetricTile, StatTile, LeaderboardRow, Countdown, ShareCard, SessionBanner, AchievementBadge, MessageBubble), Alert, Toast, ForecastCallout, EmptyState, Modal, Sheet (top corners), Popover, Menu, Tooltip, Combobox / Select panels, CodeBlock, QRCode frame, VideoThumbnail |
| **Shape, not a box** (unchanged) | as today | circles (Avatar, AvatarStack, StatusDot (native), Checkbox tick, Pulse), Toggle track and knob, Slider track and thumb, ProgressBar / Meter / PasswordStrengthMeter / ZoneBar / RangeBar / BarFill tracks and fills, chart marks, Ring, Gauge, the Sheet grab handle |

- **The line:** every bordered control and container has `1px solid var(--border-2)` /
  `borderWidth: 1, borderColor: colors.border2` (`rgba(255,255,255,.16)`). Fields already use it; cards,
  chips and the small select move up from `--border` (`.09`), which was too faint to see a field's
  edge. `--border` stays for dividers and table rules (lines inside a surface, not around it).
- **A field's edge is stronger (2026-11-10, "Accessibility"):** the boxes you type into or pick from (Input,
  PasswordInput, SearchInput, Select trigger, TagInput, CodeInput boxes) use `--border-control` /
  `colors.borderControl` (`.36`, 3.3:1 on the card); buttons, chips and cards keep `--border-2`.
- **States and tones still recolour the line:** focus (`--accent`), invalid (`--zone-low`), a chip or alert
  tone, a selected ChoiceChip. They change the colour of the same 1px line, never its width or radius.
- **No borderless control next to a bordered one:** a Button whose variant had no outline (primary's
  gradient) keeps its fill; its radius is still 10.
- A primitive's own SDD cites this rule instead of restating a radius; a new primitive picks its kind from the
  table. A radius literal (`999`, `6`, `20`…) on a control or container is a bug.
- **Order:** this rule (docs) → web PR (`@lockin90/ui`) → native PR (`@lockin90/ui-native`), each with
  before/after screenshots of every changed primitive → one release → `lockin90-design` updated to the
  same shapes (the mockups are what apps are compared with) → the apps bump the kit.

## One primitive per role (owner rule, 2026-07-09 — "they have to be the same")
The SAME interaction role always renders through the SAME kit primitive, everywhere —
including INSIDE other kit components. Concretely:
- **Search is always `SearchInput`** — never a bare `TextInput`/`<input>` styled to look
  like one (that's how Select's panel drifted: different size, missing magnifier). In
  menus/sheets/panels use `shape="sm"` so it matches the surrounding fields; standalone
  search keeps the default pill. A search field that appears on OPEN is `autoFocus`.
- Same for every other role: toggles are `Toggle`, segmented choices are `SegmentedTabs`,
  option pickers are `Select`/the option-sheet pattern, badges are `Badge`, chips are
  `Chip`, back is `BackLink`/ScreenHeader-back. If a composite kit component needs one of
  these inside it, it IMPORTS the primitive — it does not re-draw it.
- Searchable option lists keep a FIXED panel height while filtering (the sheet must not
  resize per keystroke), and long catalogs (>8 options) get search + scroll by default.
- If two surfaces show the same role looking different, that is a bug in whichever one
  bypassed the primitive — fix it AT THE PRIMITIVE'S CALLSITE, never by re-styling a copy.
- **State patterns are roles too**: error = kit `Alert` (message, then a ≥10px gap, then a
  ghost Retry `Button` — never button glued to text) · loading = kit `Skeleton` rows shaped
  like the real content · empty = kit `EmptyState` with design copy. Same pattern on every
  screen; new screens copy an existing screen's state block, not invent one.
- **Locale rules ride along**: dates/numbers format with the APP language (`i18n.language`),
  never the device default; every server-sourced enum/id shown to users goes through
  `t('<ns>.<id>', { defaultValue })` with catalog keys for the known ids.

## Optional-haptics seam (2026-07-10)

`internal/optionalHaptics.ts` (native) mirrors `optionalBlur`: `expo-haptics` is an OPTIONAL peer, gated on the native module being registered. Exports `hapticSelection` (tick — toggles/tabs/buttons/segments/rows/pickers), `hapticLift`/`hapticDrop` (drag). Every helper is a silent no-op when the app has not installed expo-haptics (and in web/Storybook). Use these for tactile feedback instead of importing `expo-haptics` directly — it keeps binaries without the module crash-free.
