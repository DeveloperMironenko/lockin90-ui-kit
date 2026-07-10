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
| Borders | `--border` `--border-2` | `colors.border` `colors.border2` | `rgba(255,255,255,.09)` / `.16` |
| Text | `--text` `--text-dim` `--text-faint` | `colors.text` `colors.textDim` `colors.textFaint` | `#EEF1F8` `#AAB2C6` `#828B9F` |
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
