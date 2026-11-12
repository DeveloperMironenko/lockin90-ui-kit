# SDD — `Select` (+ `SelectOption` type)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Select.tsx` · `packages/ui-native/src/components/Select.tsx` ·
> web CSS `packages/ui/src/styles/components/select.css` (`.lk-select*`).
> **Exports:** `Select`, type `SelectOption`, type `SelectProps`.
> **Status:** Shipped. **Parity:** 🟡 same prop API & field look; platform-shaped overlay — web portaled keyboard listbox vs native bottom-sheet Modal.
> **Stories:** `packages/ui/src/stories/Select.stories.tsx` · `packages/ui-native/src/stories/Select.stories.tsx`.

---

## 1. Overview

`Select` is the kit's **custom dropdown — NOT the browser `<select>`**. A glass field trigger shows the selected
label (or placeholder) + a chevron; activating it opens a list of styled options with a selected checkmark. It
mirrors the `Input` field look (glass shell, accent focus, invalid red). Each option is a `SelectOption`
(`value`, `label`, optional `disabled`). The two platforms render the **same field** but a platform-appropriate
**overlay**: web a portaled, collision-aware, keyboard-driven listbox; native a bottom-sheet `Modal`.

`SelectOption` is the exported option shape: `{ value: string; label: string; disabled?: boolean }`.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `options` | `SelectOption[]` | `DEFAULT_OPTIONS` (3 samples) | ✓ | ✓ | identical shape both sides |
| `value` | `string` | — | ✓ | ✓ | controlled selected value |
| `onChange` | `(value: string) => void` | — | ✓ | ✓ | **string-shaped** — fires the chosen `value` |
| `placeholder` | `string` | `''` | ✓ | ✓ | shown when nothing selected |
| `label` | `string` | — | ✓ | ✓ | mono-style uppercase caption above the field |
| `invalid` | `boolean` | `false` | ✓ | ✓ | red border (web also reddens the ring) |
| `disabled` | `boolean` | `false` | ✓ | ✓ | dims field, blocks open |
| `name` | `string` | — | ✓ | — | **web-only** — renders a hidden `<input>` so the value posts in a native form |
| `size` | `'md' \| 'sm'` | `'md'` | ✓ | ✓ | `'md'` = standard form field (unchanged); `'sm'` = the design settings `.pref-select` compact mono glass pill: `--glass-2` fill, `--border` hairline (not border-2), content-hugging, mono value (web 13px p8×14 · native 11px p6×9), 13px `--text-faint` chevron |
| `title` | `string` | — | — | ✓ | **native only** — caption of the option sheet; with it the sheet header shows a close button |
| `closeLabel` | `string` | `'Close'` | — | ✓ | **native only** — a11y label of the sheet's close button (pass a localized string); web's panel has no close button |
| `accessibilityLabel` | `string` | — | `aria-label` | ✓ | the field's name for screen readers when no visible `label` (e.g. the language picker); web takes it as `aria-label` (rest) |
| `leading` | `ReactNode` | — | ✓ | ✓ | optional leading icon inside the field before the value (design `.lang-wrap` globe on the Language select); web wraps it in `.lk-select-lead` |
| `id` | `string` | — | ✓ | — | **web-only** — on the trigger `<button>` |
| `className` / `style` | — | — | `className` + rest | — | **web-only** — native takes no `style`/rest |
| _rest_ | `Omit<HTMLAttributes<HTMLDivElement>,'onChange'>` (web) | — | ✓ | — | spread onto the root `<div>` (web only) |

- **Web:** rich combobox — `role="combobox"`, `aria-haspopup="listbox"`, `aria-expanded`,
  `aria-activedescendant`. Full keyboard: ↑/↓ (skip disabled), Home/End, type-ahead (700ms buffer), Enter/Space
  to choose, Esc to close, Tab closes. The panel is `createPortal`'d to `document.body` and positioned via
  `computeMenuPosition` (flips above / shifts to stay on-screen), re-pinned on scroll/resize; click-outside closes.
- **Native:** `SelectProps` is a **narrower interface** — only the 7 shared props (no `name`/`id`/`className`/rest).
  Pressing the field opens a transparent `Modal` (bottom sheet) of option rows with a checkmark; tap a row to choose.

## 3. Visual spec (tokens — never hardcode)

| Field (trigger) | Web (`.lk-select-trigger`) | Native (`styles.field`) |
| --- | --- | --- |
| Background | `--glass-2` | `colors.glass2` |
| Border | `1px --border-2` | `1px colors.border2` |
| Radius | `--r-sm` (10) | `radii.sm` (10) |
| Padding | `9px 11px 9px 12px` | `9` vert · left `12` right `11` |
| Text | `--font-ui`, `--text`, 14px | `fonts.ui`, `colors.text`, 14px |
| Placeholder | `--text-faint` | `colors.textFaint` |
| Chevron | 16px, `--text-dim`; open → rotate 180° + `--accent-2` | 16px `colors.textDim` (no rotation) |
| Label | `--font-ui`, `--text-faint`, 10px, weight 500, uppercase, letter-spacing 0.12em | `fonts.ui`, `colors.textFaint`, 10px, letterSpacing 1.2 |
| Focus/open | `--accent` border + `box-shadow 0 0 0 3px rgba(124,92,255,.14)` | n/a (press opens sheet) |
| Invalid | `--zone-low` border (+ red ring on focus) | `colors.zoneLow` border |
| Disabled | `opacity .55`, `not-allowed` | `opacity .55` |

| Overlay | Web panel (`.lk-select-panel`) | Native sheet (`styles.sheet`) |
| --- | --- | --- |
| Container | `position: fixed`, `z 1000`, `bg --bg-1`, `1px --border`, `--r-sm`, max-h 280px, drop shadow | bottom sheet, `bg colors.bg1`, top radius `radii.md`, top `1px colors.border`; backdrop `rgba(0,0,0,.55)` |
| Option | `9px 11px`, `--font-ui` 14px, `--text-dim`; active → `--glass-2` + `--text`; **selected → `--accent-2`** | `14px 20px`, `fonts.ui` 15px, `colors.textDim`; pressed → `colors.glass2`; **selected → `colors.accent`** weight 600 |
| Checkmark | `--accent-2` (cyan) | `colors.accent` (violet) |
| Open anim | `lk-select-in` 0.13s (honors reduced-motion) | `Modal animationType="fade"` |

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Closed | trigger only | field only |
| Open | portaled listbox; active row highlighted | bottom-sheet Modal of rows |
| Focus | `:focus-visible` accent border + ring | n/a (touch opens directly) |
| Active option | `.is-active` (`--glass-2` bg) via arrows/hover | n/a (no roving highlight) |
| Selected option | `.is-selected` `--accent-2` + check | `rowLabelSel` `colors.accent` + check |
| Disabled option | `.is-disabled` opacity .4, skipped by keyboard | `disabled` row, `opacity .6` |
| Invalid / disabled field | red border / dimmed | red border / dimmed |

## 5. Web ↔ native parity

**Verdict: 🟡 same prop API & field, platform-shaped overlay.** The seven shared props (`options`, `value`,
`onChange`, `placeholder`, `label`, `invalid`, `disabled`) and the glass field look are identical. The overlay is
deliberately platform-shaped — a portaled keyboard listbox is wrong for touch, a bottom sheet is wrong for desktop:

- **Overlay** — web: portaled, collision-aware (`computeMenuPosition`) listbox with full keyboard + type-ahead;
  native: bottom-sheet `Modal`, tap to choose, **no keyboard nav / type-ahead / collision math** (mobile convention).
- **`name` / hidden input** — web-only (native forms don't post a hidden field); `id`/`className`/rest are web-only too.
- **Selected color** — ⚠ web selected option + check use `--accent-2` (cyan `#22D3EE`); native use `colors.accent`
  (violet `#7C5CFF`). This is a **real token divergence** — see §9; align before the next polish pass.
- **Chevron** — web rotates 180° + tints `--accent-2` when open; native chevron is static.

The overlay differences are expected substrate, not capability gaps that block use — both let the user pick an option.

## 6. Composition & usage

- **Composes:** inline chevron + check SVGs; (web) `computeMenuPosition` from `tooltipPosition`, `createPortal`.
- **Wrap in `FormField`** for help/error and (web) `htmlFor`↔`id` linkage; pass validation to `invalid`.
- Use for short, known option lists. For free-typed filtering use `Combobox`; for 2–4 mutually-exclusive options prefer `Segmented`/`ChoiceChip`.

```tsx
// web
<Select
  label="Timezone"
  value={tz}
  onChange={setTz}
  options={[{ value: 'utc', label: 'UTC' }, { value: 'pst', label: 'Pacific' }]}
  name="timezone"
/>

// native
<Select
  label="Timezone"
  value={tz}
  onChange={setTz}
  options={[{ value: 'utc', label: 'UTC' }, { value: 'pst', label: 'Pacific' }]}
/>
```

## 7. Accessibility

- **Kit rule:** CONVENTIONS "Accessibility" (2026-11-10) applies: contrast 4.5:1 text / 3:1 UI, 44pt native / 24px web targets, names from props, errors and changes announced, reduced motion, text scaling never disabled.
- **Web:** the combobox always has a name: `aria-label` goes on the trigger (and the search input), never
  only on the wrapper; a visible `label` names it via `aria-labelledby`.
- **Web:** trigger is `role="combobox"` with `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls`,
  `aria-activedescendant`, and `aria-invalid` when invalid. The panel is `role="listbox"`; options are
  `role="option"` with `aria-selected` / `aria-disabled`. Full keyboard: arrows skip disabled, Home/End,
  type-ahead, Enter/Space choose, Esc/Tab close.
- **Native:** trigger is `accessibilityRole="button"` with `accessibilityState={{ disabled, expanded }}`, named by
  `accessibilityLabel` (else `label`) and valued by the selected option (`accessibilityValue`); the sheet's close
  button is named by `closeLabel`. Each
  option row is a `button` with `accessibilityState={{ selected, disabled }}`. Selection is touch-driven.
- **Contrast:** option `--text-dim` on `--bg-1` and the selected accent both clear contrast on the void surfaces.

## 8. Usage rules — Do / Don't

**Do**
- Use `Select` for choosing one value from a known list; keep it controlled (`value` + `onChange`).
- Provide stable `SelectOption.value`s; use `disabled` for unavailable options.
- Set `name` (web) when the select must post inside a native `<form>`.
- Wrap in `FormField` for label↔control + error.

**Don't**
- ✗ Don't reach for the browser `<select>` — this is the sanctioned dropdown.
- ✗ Don't pass `name`/`id`/`className` on native (web-only props).
- ✗ Don't hardcode the field/option colors — they're tokens.
- ✗ Don't use `Select` for free-text search — use `Combobox`.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A bespoke dropdown (custom trigger + floating list) is a parity violation — it won't match
  the field look, the keyboard model, or the native sheet. Import `Select`.
- **Selected-color divergence is a known bug.** Web selected = `--accent-2` (cyan); native selected = `accent`
  (violet). Fixing it must change **both** platforms to the same token — don't "fix" one side and widen the gap.
- **New need → both platforms.** Option groups, icons, multi-select — add to `Select` on web **and** native with
  the same prop name and tokens, never a one-off.
- **Tokens only.** Field, panel, option, and selected colors come from `@lockin90/tokens`; hardcoded hexes drift.
- **Parity gate.** Confirm the web phone-width select and the native select show the same field, the same
  options, and the same selected indicator before shipping.

## Update — 2026-07-10
- **Haptics:** the primary interaction (segment change / row press / panel open) fires `hapticSelection()` (native `optionalHaptics`; no-op without expo-haptics).

## Update — 2026-11-02
- **Native `closeLabel`:** the sheet's close button was hard-coded "Close" in English. It takes `closeLabel`
  (default `'Close'` for stories; apps pass it translated).
- **Native `accessibilityLabel`:** the trigger announced only the value ("English"). It now takes
  `accessibilityLabel` (falls back to `label`) and reports the selected option as `accessibilityValue`, as the web
  trigger's `aria-label` does since 1.0.2.
- `title` (native sheet caption) was shipped but undocumented; now in §2.

## Update — 2026-11-02 (native sizes match web)
- **Native label caption** matches FormField's (11px / 500 mono, `text-dim`, line height 17).

## Update — 2026-11-02 (native field = web field)
- **Native `md` field:** the value takes the row (`flex: 1`) and sits left after the leading icon, as on web;
  the three parts were spread with `space-between`, which put the value in the middle. The field has the web's
  height (`minHeight` 39.6, as `Input`). `sm` (the language chip) keeps hugging its content and its height.

## Update — 2026-11-10 (accessibility, 1.35)

- **Edge:** the trigger (`md` and `sm`) uses `--border-control` / `colors.borderControl` (3.3:1 on the card);
  `sm` no longer has its own fainter `--border` hairline or hover line.
- **Native targets:** `sm` (27 tall) `hitSlop` 9 above / below and 4 at the sides, `md` (39.6) 3 above / below:
  44pt, same look.
- **Native `accessibilityHint`** prop: read after the name (a `FormField` passes its error or help).

## Update — 2026-11-10 (running-app audit, 1.35)

- **Fill** `--field`; **focus ring** (web) 2px `--accent-2`; **44 tall** at phone width (web, both sizes) and on native (the sm hitSlop is gone, the box is 44). **`aria-required`** from a `FormField` now lands on the `combobox` button, not the wrapper (axe aria-allowed-attr). Label 11px.

## Update — 2026-11-10 (simulator check, 1.35)

- **Increase Contrast** (native `useContrastColors`; web `prefers-contrast: more`): faint / dim text and the edge step up.

## Update — 2026-11-11 (review fixes, 1.35)

- **The value wraps** (web and native): no one-line clamp or ellipsis on the trigger's value or the options (web `overflow-wrap: break-word`: at words, and a single word longer than the line breaks inside it rather than being cut); the trigger grows taller ("UTC…", "Engl…" were cut at the largest text size).

## Update — 2026-11-11 (a word never splits, 1.35)

- **Native:** the value's words are measured on one unconstrained line (an invisible, unreadable absolute
  `View`, `testID="lk-select-measure"`), and the select is at least its widest word + 1pt + the chrome wide
  (`md` 12 + 11 padding, 2 edge, 8 gap, 16 chevron; `sm` 9 + 8, 2, 5, 13; plus a `leading` icon and its gap),
  never wider than the screen less 2 × 16. (2026-11-11 review: a time zone breaks after its "/", so the
  widest piece of "America/Argentina/Buenos_Aires · GMT-3" is "Buenos_Aires" and the select fits the
  design's 178pt picker; a parent `maxWidth` narrower than one piece is still overflowed, so an app sets its
  `maxWidth` for the default text size only.) The value still wraps between words, so the field grows taller ("Europ/e/Kyiv",
  "Engli/sh" at AX sizes are gone). The words are measured on `onLayout` and again from refs in a layout
  effect (a tree mounted while hidden gets no `onLayout` on iOS Fabric, as SegmentedTabs).
- **Web:** the wrapper, trigger and value have `min-width: min-content` (was 0), so the trigger is never
  narrower than the value's widest word; `overflow-wrap: break-word` stays only as the last resort.

## Update — 2026-11-11 (shared measurer, 1.35)

- The word measurer is the kit's shared `WordMeasurer` (`internal/wordFit.tsx`, as SegmentedTabs and
  FitText), and the words come from `breakableWords` (CJK characters are separate words; a line breaks after
  a slash, as iOS and Android do: "Europe/" "Kyiv").
- **Leading icon:** its width is measured on `onLayout` and from its ref in the layout effect (a tree
  mounted hidden gets no `onLayout` on iOS Fabric).

## Update — 2026-11-11 (sm in a wider box)

- Native `sm` value grows (`flexGrow: 1`) after its icon: in a box wider than its content (Settings' three
  controls one width, owner 2026-11-11) the value sits left and the chevron at the end, as web (it sat in
  the middle: `space-between` with a hugging value).


## Update — 2026-11-11 (one focus indicator, web)

- A focused field shows only its own edge: `--accent`, 2px (1px border + 1px inset shadow), on mouse and
  keyboard focus; no outer `--accent-2` ring, no glow (owner: "2 outlines"). Invalid: the same in `--zone-low`.
  Supersedes the ring / glow above; see CONVENTIONS "Focus (web)". Native was already edge-only.

## Update — 2026-11-11 (owner: one radius for every control, CONVENTIONS "Corner radii")

- The web dropdown panel is a container, `--r` (16, was 10), its options a control's 10 (was 6); the native list sheet's top corners are `radii.lg` (22, was 24).

- **Final (owner, same day): every corner 10.** Read every 16 / 22 above as 10 (`radii.md` / `radii.lg` and `--r` / `--r-lg` are 10).

## Update — 2026-11-11 (owner: the audit batch, V4 / V9 / V11 / V17 / V20 / U4 / U5 / U12)

Supersedes §3's sizes where they differ.

- **Two control sizes (CONVENTIONS "Control sizes"):** `md` 44 tall at every width, the value 16 (`control`;
  was 14); `sm` 36 tall with a 44 target (web `::before`, native `hitSlop` 4), the value Inter 14
  (`controlSm`; was mono 11 native / mono 13 web), chevron 14, padding 6 / 12 / 6 / 10. Both on the field fill
  with the control edge. The header's language Select and the "Scan" ChoiceChip are both `sm`: the same height.
- **Leading icon (V17):** a field's icon, 16 and `--text-faint` (web CSS; native gives an element without its
  own `size` / `color` those).
- **Label (V20):** the one label style — mono 11 / 500, .14em, uppercase, `--text-dim` (web was Inter, faint).
- **Native opens the kit `Sheet` (V9):** its panel, handle, display-17 title and × (`closeLabel`, with a
  `title`); a searchable list is `height="tall"` with the `SearchInput` as the Sheet's `subheader`; the
  Sheet's own scroll, keyboard and safe-area handling (Android keyboard padding, U20). The old own sheet
  (top corners 24, a mono title, a header rule, a 28pt ×) is gone. Option rows are 44 tall at least, the
  selected one `--accent-2` (as web; was the accent).
- **Web options (U12):** 44 tall at phone width; option text 15 (`rowTitle`) on both platforms.
- **New `clearLabel` (U4)** for the search field's ×, and **`noMatchesLabel` (U5)**: shown when a search finds
  nothing and announced (web: a `role="status"` region present from the open, its text set then; native: a
  live region on Android, `announceForAccessibility` on iOS). English defaults 'Clear search' / 'No matches'.
- **Search (U5):** an option matches on its label or its value, case-insensitive, underscores as spaces and
  each "/" part on its own (`selectMatch.ts`, the same on both): "New York" finds `America/New_York`.
