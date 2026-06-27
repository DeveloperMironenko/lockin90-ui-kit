# SDD — `DateField` (+ `TreeItem` cross-ref)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/DateField.tsx` · `packages/ui-native/src/components/DateField.tsx` ·
> web CSS `packages/ui/src/styles/components/datetree.css` (`.lk-date-*` / `.lk-tree-*`).
> **Exports:** `DateField`, `TreeItem`, types `DateFieldProps`, `TreeItemProps`.
> **Status:** Shipped. **Parity:** 🟡 web uses the browser's OS date picker over a typed `<input type>`; native opens the OS picker via an optional `datetimepicker` peer (text-field fallback) and is `date`-only.
> **Stories:** `packages/ui/src/stories/DateField.stories.tsx` · native equivalent.

---

## 1. Overview

A **dark glassy date / time field** — a mono uppercase `label` above, a leading calendar glyph, and an accent focus ring over the kit's glass surface. The Aurora Flux date input for forms, schedulers, and CMS publish-date fields.

`TreeItem` (the secondary export, co-located in `DateField.tsx`) is an unrelated CMS primitive documented here because it shares the file: a **nested, expandable tree row** for nav/page trees — a rotating chevron, optional leading icon + faint drag handle, an accent-tinted `active` state, and indented children rendered when `expanded`.

`DateFieldProps` web `type` selects the native picker (`date` | `datetime-local` | `time`); the field forces a **dark** picker (`color-scheme: dark`) so the OS chrome matches the void surface.

## 2. API contract

### `DateField`
| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `value` | `string` | — | ✓ | ✓ | ISO string the control understands (e.g. `2026-06-21`) |
| `onChange` | `(value: string) => void` | — | ✓ | ✓ | fires with the raw value on change |
| `type` | `'date' \| 'datetime-local' \| 'time'` | `'date'` | ✓ | — | **web only** — which native picker to surface |
| `label` | `string` | — | ✓ | ✓ | mono uppercase label above the field |
| `placeholder` | `string` | — / `'YYYY-MM-DD'` | — | ✓ | **native only** — shown when empty |
| `className` | `string` | — | ✓ | — | web only — on the `<input>` |
| `style` | `StyleProp<ViewStyle>` | — | — | ✓ | native only — on the wrapper |
| _rest_ | `InputHTMLAttributes` (sans `onChange`/`value`/`type`) / `ViewProps` (sans `onChange`) | — | ✓ | ✓ | `min`/`max`/`disabled` (web), wrapper props (native) |

### `TreeItem`
| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `label` | `string` | `'Page'` | ✓ | ✓ | row label |
| `depth` | `number` | `0` | ✓ | ✓ | indents the row by `depth * 16 + 8` px |
| `expandable` | `boolean` | `false` | ✓ | ✓ | show a chevron + allow toggle |
| `expanded` | `boolean` | `false` | ✓ | ✓ | whether children are revealed |
| `onToggle` | `() => void` | — | ✓ | ✓ | fired on chevron/row toggle |
| `icon` | `ReactNode` | — | ✓ | ✓ | leading glyph |
| `active` | `boolean` | `false` | ✓ | ✓ | accent-tinted selected row |
| `dragHandle` | `boolean` | `false` | ✓ | ✓ | faint `⠿` drag grip on the left |
| `children` | `ReactNode` | — | ✓ | ✓ | nested `TreeItem`s, shown only when `expanded` |

- **DateField web:** a `<label>` wrapping the glyph + a real `<input type={type}>`; `onChange` forwards `e.target.value`. `value`/`type` are owned (Omitted from rest).
- **DateField native:** resolves `@react-native-community/datetimepicker` lazily via `require` in a `try/catch`. **If present:** a `Pressable` field opens the OS picker (`mode="date"`, iOS `spinner` + a "Done" button, Android dismiss-on-select); `onChange` receives a `YYYY-MM-DD` string. **If absent:** falls back to an editable `TextInput`. Tracks `focused`/`show` to drive the accent border.
- **TreeItem web:** `<div>` rows; the chevron is a `<button aria-expanded>`. **native:** `Pressable` rows (row press toggles when `expandable`); chevron is a nested `Pressable` (`hitSlop 6`).

## 3. Visual spec (tokens — never hardcode)

**DateField**

| Aspect | Web | Native |
| --- | --- | --- |
| Label | `--font-mono`, `10px`, `500`, uppercase, letter-spacing `0.12em`, `--text-faint` | `fonts.mono`, `10`, `'500'`, `.toUpperCase()`, letterSpacing `1.2`, `colors.textFaint` |
| Field | `9px 12px`, `--r-sm`, `1px --border-2`, `--glass-2` | `9 / 12`, `radii.sm`, `1 colors.border2`, `colors.glass2` |
| Lead glyph | `16×16` calendar, `--text-faint` | `16×16` calendar, `colors.textFaint` |
| Input text | `--font-ui`, `14px`, line 1.4, `--text`, `color-scheme: dark` | `fonts.ui`, `14`, line 20, `colors.text` |
| Focus | `:focus-within` → border `--accent` + `box-shadow 0 0 0 3px rgba(124,92,255,.14)` | border → `colors.accent` while focused/picker open |
| Gap (label↔field / glyph↔input) | `6px` / `9px` | `6` / `9` |

- **Web** hides the browser's own `::-webkit-calendar-picker-indicator` (absolute, opacity 0, full-field) so the whole field stays clickable while showing the custom leading glyph.
- **Native iOS "Done"** button: `fonts.ui` `14` `600` `colors.accent`. Placeholder text uses `colors.textFaint`.

**TreeItem**

| Aspect | Web | Native |
| --- | --- | --- |
| Row | `8px 10px 8px 8px`, `--r-sm`, `1px transparent` border | `paddingTop/Bottom 8`, `paddingRight 10`, `radii.sm`, transparent border |
| Indent | `padding-left: depth*16 + 8` | `paddingLeft: depth*16 + 8` |
| Hover (web) | row bg → `--glass` | n/a |
| Active | `rgba(124,92,255,.12)` bg + `rgba(124,92,255,.4)` border (web adds inset ring) | same tints |
| Chevron | `18×18`, `--text-faint`, rotates `90°` when open (`.lk-tree-open`) | `18×18`, rotate `90deg` `View` |
| Label | `--font-ui`, `13.5px`, `600`, ellipsis | `fonts.ui`, `13.5`, `'600'`, `numberOfLines={1}` |
| Children rail | `margin-left 17px`, `padding-left 12px`, `1px dashed --border-2` | `marginLeft 17`, `paddingLeft 12`, `1 dashed colors.border2` |
| Grip | `⠿` `13px` `--text-faint`, `cursor: grab` | `⠿` `13` `colors.textFaint` |

## 4. States

**DateField**

| State | Web | Native |
| --- | --- | --- |
| Idle | glass field + faint glyph | glass field + faint glyph |
| Focused / picker open | `:focus-within` accent border + 3px ring | border → `accent` |
| Filled | input shows the value | value text (placeholder when empty) |
| Disabled | pass `disabled` to the `<input>` | n/a (compose) |

**TreeItem:** idle / hover (web bg `--glass`) / `active` (violet tint) / expanded (chevron rotated, children rail shown).

## 5. Web ↔ native parity

**Verdict: 🟡 same field shell & label, platform-shaped picker.** Both render the same glass field, mono uppercase label, leading calendar glyph, and accent focus ring; `TreeItem` is visually identical (same indent math, chevron rotation, active tint, dashed children rail). The genuine differences are in *how the date is entered*:

- **Picker substrate:** web uses the **browser's built-in OS picker** over a real `<input type>` (`color-scheme: dark` to theme it); native opens the **platform date picker via the optional `@react-native-community/datetimepicker` peer**, and **gracefully falls back to a typed `TextInput`** when that peer isn't installed. The native fallback means a date can always be entered even with zero extra deps.
- **`type` (web only):** web supports `date` / `datetime-local` / `time`; native `DateField` is **`date`-only** (`mode="date"`). If a native screen needs time/datetime, that capability must be **added to native first** (e.g. a `mode` prop) — don't fork.
- **`placeholder` (native only):** native exposes a `placeholder` for the empty/fallback state; web relies on the input's own rendering.

These are substrate/OS-picker differences, not blockers — a date field works on both. The `type`-coverage gap is the one to watch when a native screen needs non-`date` input.

## 6. Composition & usage

- **Composes:** `react-native-svg` glyphs (native); optional `@react-native-community/datetimepicker` (native).
- **Used by:** form date fields (publish date, DOB, scheduling), CMS editors. `TreeItem` is used by the CMS nav/page-tree sidebar (nested, drag-reorderable rows).

```tsx
// web
<DateField label="Publish date" value={date} onChange={setDate} />
<DateField type="time" label="Reminder" value={time} onChange={setTime} />

// native (date-only)
<DateField label="Publish date" value={date} onChange={setDate} />

// TreeItem (both platforms)
<TreeItem label="Blog" expandable expanded={open} onToggle={toggle} active>
  <TreeItem label="Post A" depth={1} />
  <TreeItem label="Post B" depth={1} dragHandle />
</TreeItem>
```

## 7. Accessibility

- **DateField web:** a real `<input>` inside a `<label>` — focusable, keyboard-editable, OS-picker accessible. The custom glyph is `aria-hidden`.
- **DateField native:** the picker `Pressable` has `accessibilityRole="button"` + `accessibilityLabel={label ?? placeholder}`; the fallback `TextInput` is natively accessible. The "Done" button is a labeled `Pressable`.
- **TreeItem:** web chevron `<button aria-expanded>` with `aria-label` "Expand/Collapse"; native chevron `Pressable` with `accessibilityRole="button"` + `accessibilityState={{ expanded }}` (+ `hitSlop 6` for the small target).
- **Contrast:** the `--text` input and faint glyph sit on `--glass-2` over the void — legible; the accent focus ring marks the active field.

## 8. Usage rules — Do / Don't

**Do**
- Use `label` to name the field (mono overline) instead of an external label.
- Pass/read ISO strings (`YYYY-MM-DD` for `date`); the native picker emits that format.
- Install `@react-native-community/datetimepicker` to get the OS picker on native (else it falls back to text).
- For `TreeItem`, drive `expanded`/`active` from state and render nested items as `children` with increasing `depth`.

**Don't**
- ✗ Don't rely on `type="time"`/`datetime-local"` on native — it's `date`-only today.
- ✗ Don't hand-roll a date input (styled `<input type=date>` or a text field + calendar) — import `DateField`.
- ✗ Don't hardcode the glass fill, focus ring, or the `depth*16` indent — tokens / the kit math only.
- ✗ Don't nest non-`TreeItem` content as `TreeItem` `children` expecting the rail/indent.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A custom dark date input or a hand-built tree row re-creating the chevron/active tint is a parity violation — import `DateField`/`TreeItem`.
- **New need → add to BOTH platforms.** Native time/datetime support, or a `disabled` `DateField`, is a prop added on web *and* native (same name, same tokens) — never a one-off.
- **Tokens only.** Field surface, focus ring, active tint, and the dashed children rail come from `@lockin90/tokens`; never inline.
- **Parity gate.** Before shipping, confirm the web phone-width and native date field read identically (label, glyph, focus ring) and that the native screen doesn't depend on a web-only `type`; verify `TreeItem` indent/active/expand match.
