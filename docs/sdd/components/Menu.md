# SDD — `Menu`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/Menu.tsx` · `packages/ui-native/src/components/Menu.tsx` ·
> web CSS `packages/ui/src/styles/components/menu.css` (`.lk-menu*`) · positioning `packages/ui/src/components/tooltipPosition.ts` (`computeMenuPosition`).
> **Exports:** `Menu`, type `MenuItemData`, type `MenuProps`.
> **Status:** Shipped. **Parity:** 🟡 same API; web is **portaled + collision-aware** (flip/shift), native is an RN `Modal` with **measure-and-clamp**.
> **Stories:** `packages/ui/src/stories/Menu.stories.tsx` · `packages/ui-native/src/stories/Menu.stories.tsx`.

---

## 1. Overview

A **popover action menu** — a glass panel of item rows anchored to a trigger. The default trigger is a small `⋯` (more) icon button; rows fire `onClick` then close the menu. Item kinds:

- **action row** — leading optional `icon` + `label`.
- **danger row** (`danger: true`) — tinted `--zone-low` for destructive actions.
- **divider** (`divider: true`) — a 1px hairline separator (its `label` is ignored).

Reach for `Menu` for a short list of contextual actions on a row/card. For arbitrary rich content use `Popover`; for a single-action button with a dropdown use `SplitButton`.

## 2. API contract

### `MenuItemData`

| Field | Type | Notes |
| --- | --- | --- |
| `label` | `string` | visible row text (ignored when `divider`) |
| `icon` | `ReactNode` | optional leading glyph (e.g. `<Icon />`) |
| `onClick` | `() => void` | fired on click/press; the menu closes after |
| `danger` | `boolean` | render in the danger tone (`--zone-low`) |
| `divider` | `boolean` | render a 1px separator instead of an action |

### `Menu`

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `trigger` | `ReactNode` | `⋯` icon | ✓ | ✓ | clickable trigger |
| `items` | `MenuItemData[]` | Edit / Duplicate / — / Delete (danger) | ✓ | ✓ | rows to render |
| `align` | `'left' \| 'right'` | `'right'` | ✓ | ✓ | which trigger edge the panel aligns to |
| `className` | `string` | — | ✓ | — | web only (merged onto `.lk-menu`) |
| _rest_ | `HTMLAttributes<HTMLDivElement>` | — | ✓ | — | web only — spread onto the `.lk-menu` root |

- **Web:** the trigger is a real `<button aria-haspopup="menu" aria-expanded>`; the panel is **portaled to `<body>`** (`role="menu"`, rows `role="menuitem"`, dividers `role="separator"`). Position via `computeMenuPosition` (open below → **flip above** → **shift** on-screen), repinned on `scroll`(capture)/`resize`. Closes on outside `mousedown` (root + panel checked) or `Escape`.
- **Native:** the `⋯` trigger toggles a transparent RN `Modal` (`animationType="fade"`) with a full-screen backdrop `Pressable`; the trigger is `measureInWindow`'d and the panel is absolutely anchored (flips above near the bottom, clamps to `8px`). Rows are `Pressable` with `accessibilityRole="menuitem"`.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web | Native |
| --- | --- | --- |
| Trigger | `min-w 30` ×30, `--r-sm`, transparent; hover/active → `--glass-2` + `--border-2` | `min-w 30` ×30, `radii.sm`; `Icon more` 18 `colors.textDim` |
| Panel bg | `--bg-1` (fallback `--glass-2`) + `backdrop-filter: blur(18px) saturate(130%)` | `colors.bg1` |
| Panel border / radius | `1px --border` / `--r-sm` (10) | `1px colors.border` / `radii.sm` (10) |
| Panel shadow / min-w / pad | `0 14px 40px rgba(0,0,0,.5)` / `160px` / `5px` | `nativeShadows.elev2` / `160` / `5` |
| Row | `8px 10px`, `gap 10`, `--font-ui` 13.5px, `--text-dim`; hover → `--glass-2` + `--text` | `8px 10px`, `gap 10`, `fonts.ui` 13.5px, `colors.textDim`; pressed → `colors.glass2` |
| Row icon | `--text-faint` → `--text-dim` on hover | (slot, color per node) |
| Danger row | `--zone-low`; hover bg `color-mix(--zone-low 14%)` | label `colors.zoneLow` |
| Divider | 1px `--border`, `margin 5px 6px` | 1px `colors.border`, `margin 5/6` |

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Closed | trigger only; portal not mounted | trigger only; `Modal visible={false}` |
| Open | portaled `.lk-menu-panel.is-open` (fade + translateY 0) | `Modal` fade; anchored panel |
| Trigger active | `[aria-expanded='true']` → `--glass-2` + `--border-2` | press state |
| Row hover (web) | `:hover/:focus-visible` → `--glass-2` + `--text` | n/a (press → `glass2`) |
| Reposition | `scroll`(capture)/`resize` recompute | `onLayout` size change |
| Dismiss | outside `mousedown` / ESC; or after a row click | backdrop tap / Android back; or after a row press |

## 5. Web ↔ native parity

**Verdict: 🟡 same API, platform-shaped positioning.** Identical `MenuItemData`/`MenuProps` shape, identical default items, identical row tokens (ui 13.5px, glass-2 highlight, zone-low danger, hairline divider), identical close-after-click behavior. Differences are substrate:

- **Positioning engine:** web `computeMenuPosition` (flip + shift) with a `<body>` portal; native `measureInWindow` + manual flip-above/clamp. Same result, different code path.
- **Panel frost:** web `backdrop-filter: blur(18px) saturate(130%)`; native opaque `bg-1` (no `backdrop-filter`).
- **Hover:** web rows lift on hover; native has press feedback only.
- **Substrate:** web is real DOM with `role="menu"/menuitem"/separator"` + `className`/rest; native is an RN `Modal` with `Pressable` rows and no DOM props.

No capability gap blocks use — the menu is fully usable and visually equivalent.

## 6. Composition & usage

- **Composes from:** `Icon` (default `⋯` trigger, optional row icons).
- **Used by:** row/card overflow actions (edit/duplicate/delete), table row menus, card kebab menus.

```tsx
// web
<Menu
  align="right"
  items={[
    { label: 'Edit', icon: <Icon name="edit" />, onClick: edit },
    { label: 'Duplicate', onClick: dup },
    { divider: true, label: '' },
    { label: 'Delete', danger: true, onClick: remove },
  ]}
/>

// native — same items shape
<Menu items={items} align="right" />
```

## 7. Accessibility

- **Web:** trigger `<button aria-haspopup="menu" aria-expanded>`; panel `role="menu"`, action rows `role="menuitem"`, dividers `role="separator"`. ESC + outside-click dismiss; a row click closes and fires `onClick`.
- **Native:** trigger + backdrop are `Pressable` (`accessibilityRole="button"`); rows are `accessibilityRole="menuitem"`. Android back dismisses.
- **Hit target:** trigger ≥30px; rows `8px 10px` padding (comfortable touch). Labels `numberOfLines={1}` on native (truncate, no wrap).

## 8. Usage rules — Do / Don't

**Do**
- Keep menus short (a handful of contextual actions).
- Mark destructive actions with `danger` and group them after a `divider`.
- Use `align="right"` for trailing kebab menus, `left` for leading ones.
- Provide `onClick` per item — the menu closes for you afterward.

**Don't**
- ✗ Don't hand-roll a dropdown list + outside-click — use `Menu`.
- ✗ Don't put long forms/arbitrary content in a `Menu` — use `Popover` or `Sheet`.
- ✗ Don't hardcode the panel bg/blur, row highlight, danger tint, or divider — tokens.
- ✗ Don't pass `className`/rest on native (web-only).

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom action dropdown re-implements positioning + dismissal and will drift from `computeMenuPosition` / clip inside overflow ancestors. Import `Menu`.
- **New need → both platforms.** A new item kind (e.g. a checkbox row), submenu, or `align` value must be added to `MenuItemData`/`MenuProps` on web **and** native with the same names/tokens.
- **Tokens only.** Trigger, panel, row highlight, danger tone, divider all come from `@lockin90/tokens`.
- **Parity gate.** Before shipping, confirm the web phone-width menu and native menu match (same items, order, danger styling, alignment).
