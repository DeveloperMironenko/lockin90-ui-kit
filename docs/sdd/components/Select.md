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

- **Web:** trigger is `role="combobox"` with `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls`,
  `aria-activedescendant`, and `aria-invalid` when invalid. The panel is `role="listbox"`; options are
  `role="option"` with `aria-selected` / `aria-disabled`. Full keyboard: arrows skip disabled, Home/End,
  type-ahead, Enter/Space choose, Esc/Tab close.
- **Native:** trigger is `accessibilityRole="button"` with `accessibilityState={{ disabled, expanded }}`; each
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
