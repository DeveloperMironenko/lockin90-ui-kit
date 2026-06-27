# SDD — `FormField` (+ `SearchInput` cross-ref)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/FormField.tsx` · `packages/ui-native/src/components/FormField.tsx` ·
> web CSS `packages/ui/src/styles/components/field.css` (`.lk-field*`, `.lk-search*`).
> **Exports:** `FormField`, `SearchInput`, type `FormFieldProps`, type `SearchInputProps`.
> **Status:** Shipped. **Parity:** 🟡 same API & layout; two web-only affordances (label `htmlFor`, error info-icon, search `kbdHint`).
> **Stories:** `packages/ui/src/stories/FormField.stories.tsx` · `packages/ui-native/src/stories/FormField.stories.tsx`.

---

## 1. Overview

`FormField` is the **labeled form-control wrapper** of the kit: a mono uppercase label, the control as
`children`, then either a faint help line **or** a red error row (error replaces help when present). It is
control-agnostic — wrap an `Input`, `Select`, `NoteField`, `TagInput`, anything — so every field in the app
shares one label/help/error house style instead of each control re-implementing it.

`SearchInput` is a **secondary export living in the same file**: a glass pill with a leading magnifier, a
transparent text input, and a trailing `×` clear button that appears only when there's a value. It is the one
sanctioned search box (lists, tables, command surfaces).

## 2. API contract

### `FormField`

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `label` | `string` | — | ✓ | ✓ | mono uppercase caption above the control |
| `help` | `ReactNode` | — | ✓ | ✓ | faint helper line; **hidden when `error` is set** |
| `error` | `ReactNode` | — | ✓ | ✓ | red error row; replaces `help` |
| `required` | `boolean` | `false` | ✓ | ✓ | appends an accent `*` after the label |
| `htmlFor` | `string` | — | ✓ | — | **web-only** — ties `<label htmlFor>` to the control `id` |
| `children` | `ReactNode` | — | ✓ | ✓ | the wrapped control |
| `className` / `style` | — | — | `className` | `style` | web class · native `ViewStyle` |
| _rest_ | `HTMLAttributes<HTMLDivElement>` (web, `children` omitted) / `ViewProps` (native) | — | ✓ | ✓ | spread onto the wrapper |

### `SearchInput`

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `value` | `string` | — | ✓ | ✓ | controlled query |
| `onChange` | `(value: string) => void` | — | ✓ | ✓ | **string-shaped** (not a DOM event) — fires per keystroke + on clear |
| `placeholder` | `string` | `'Search…'` | ✓ | ✓ | |
| `onClear` | `() => void` | — | ✓ | ✓ | runs in addition to `onChange('')` |
| `kbdHint` | `string` | — | ✓ | — | **web-only** — faint mono `⌘K`-style chip |
| _rest_ | `InputHTMLAttributes` minus `onChange` (web) / `TextInputProps` minus `onChange`,`value` (native) | — | ✓ | ✓ | |

- **Web:** plain function components (no `forwardRef`). `FormField` renders a `<div class="lk-field">`; `SearchInput`
  uses `<input type="search">` with the WebKit cancel/decoration suppressed.
- **Native:** `FormField` is a `View`; the label is uppercased in JS (`label.toUpperCase()`) since RN has no
  `text-transform`. `SearchInput` tracks `focused` state to drive the accent border.

## 3. Visual spec (tokens — never hardcode)

| Part | Token(s) | Value |
| --- | --- | --- |
| Wrapper gap | — | `6px` (`gap: 6`) |
| Label | `--font-mono` / `fonts.mono`, `--text-faint` / `colors.textFaint` | 10px, weight 500, uppercase, letter-spacing 0.12em (native `1.2`) |
| Required `*` | `--accent` / `colors.accent` | 11px |
| Help | `--font-ui` / `fonts.ui`, `--text-faint` / `colors.textFaint` | 11.5px, line-height 1.45 (native `17`) |
| Error | `--font-ui` / `fonts.ui`, `--zone-low` / `colors.zoneLow` | 11.5px; web prefixes `Icon name="info"` 12px (also `--zone-low`) |
| Search shell | `--glass-2` / `colors.glass2`, `1px --border-2` / `colors.border2`, `--r-pill` / `radii.pill` | padding `8px 12px` |
| Search focus | `--accent` / `colors.accent` | web adds `box-shadow 0 0 0 3px rgba(124,92,255,.14)`; native = accent border only |
| Search input | `--font-ui` / `fonts.ui`, `--text` / `colors.text` | 14px; placeholder `--text-faint` |
| Search clear | `--text-dim` / `colors.textDim` | 20×20, `--r-pill`; web hover → `--text` on `--bg-1` |
| `kbdHint` chip | `--font-mono`, `--glass-2`, `1px --border-2`, `--r-sm` | web-only, 11px |

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Help shown | `.lk-field-help` | `styles.helpText` |
| Error shown | `.lk-field-error` `role="alert"` + info icon | `styles.errorText` (no icon) |
| Required | `.lk-field-req` `*` | `styles.req` `*` |
| Search empty | no clear button | no clear button |
| Search has value | trailing `.lk-search-clear` × | trailing clear `Pressable` |
| Search focus | `:focus-within` accent + ring | `focused` state → accent border |

## 5. Web ↔ native parity

**Verdict: 🟡 same API, two web-only affordances.** The field layout (label → control → help/error), the
error-over-help precedence, the `required` `*`, and the search pill are identical. Differences:

- **`htmlFor`** is web-only — native `FormField` has no DOM `for`/`id` linkage (RN labels associate by proximity).
- **Error icon** — web renders an `Icon name="info"` before the message; native error is text-only. Cosmetic, same color/copy.
- **`kbdHint`** — web `SearchInput` can show a `⌘K` chip; native omits it (no hardware shortcut on touch).
- **Label casing** — web uppercases via CSS `text-transform`; native via `label.toUpperCase()`. Same render.

None block use; app code reads 1:1 (same `label`/`help`/`error`/`required`, same `value`/`onChange` string contract).

## 6. Composition & usage

- **Wraps** any control — most often `Input`, `Select`, `NoteField`, `TagInput`, `PasswordInput`.
- **`SearchInput`** composes nothing else; it's a leaf used by tables, lists, and command palettes.
- Pair `htmlFor` (web) with the control's `id` for click-to-focus + screen-reader association.

```tsx
// web
<FormField label="Email" htmlFor="email" error={emailError} required>
  <Input id="email" type="email" value={email} onChange={onEmail} invalid={!!emailError} />
</FormField>
<SearchInput value={q} onChange={setQ} kbdHint="⌘K" />

// native
<FormField label="Email" error={emailError} required>
  <Input value={email} onChangeText={setEmail} invalid={!!emailError} />
</FormField>
<SearchInput value={q} onChange={setQ} />
```

## 7. Accessibility

- **Web:** real `<label>`; set `htmlFor` to the control `id` so clicking the label focuses it. The error row is
  `role="alert"` (announced on appearance). `SearchInput` uses `type="search"`; the clear button has `aria-label="Clear search"`.
- **Native:** label is a plain `Text` (associate by layout proximity). The search clear `Pressable` carries
  `accessibilityRole="button"` + `accessibilityLabel="Clear search"`.
- **Contrast:** error uses `--zone-low` (red) which meets contrast on the void surfaces; help uses `--text-faint` — fine for non-essential hints, never for required instructions.

## 8. Usage rules — Do / Don't

**Do**
- Use `FormField` for **every** labeled control — don't hand-roll a `<label>` + helper `<p>`.
- Put validation copy in `error` (it auto-suppresses `help`).
- Wire `htmlFor` ↔ control `id` on web.
- Use `SearchInput` for search; keep it controlled via `value`/`onChange`.

**Don't**
- ✗ Don't show both `help` and `error` — `error` wins by design; don't fight it.
- ✗ Don't pass `htmlFor`/`kbdHint` on native (wrong-platform props).
- ✗ Don't restyle the label/error typography inline — they come from tokens.
- ✗ Don't use `SearchInput`'s `onChange` expecting a DOM event — it's a `string`.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A bespoke "label + input + red text" stack is a parity violation — wrap the control in `FormField`.
- **New need → both platforms.** If a field needs a new sub-element (e.g. a counter slot), add it to `FormField`
  on web **and** native with the same prop name and tokens — never a one-off wrapper in app code.
- **Tokens only.** Label/help/error colors, the search pill, and the focus ring are all token-driven; hardcoding
  any of them will silently drift on the next Aurora-Flux rename.
- **Parity gate.** Before shipping a form, confirm the web phone-width render and the native render show the same
  label, the same help-or-error, and the same search affordance.
