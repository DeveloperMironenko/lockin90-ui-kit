# SDD — `NoteField`

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/NoteField.tsx` · `packages/ui-native/src/components/NoteField.tsx` ·
> web CSS `packages/ui/src/styles/components/note.css` (`.lk-note*`).
> **Exports:** `NoteField`, type `NoteFieldProps`.
> **Status:** Shipped. **Parity:** 🟡 same API & visuals; web `<textarea>` is user-resizable, native uses a fixed `minHeight` + focus border only.
> **Stories:** `packages/ui/src/stories/NoteField.stories.tsx` · `packages/ui-native/src/stories/NoteField.stories.tsx`.

---

## 1. Overview

`NoteField` is the kit's **multiline glass textarea** — a small mono uppercase label over a glass multi-row
input, defaulting to 3 rows and an `"Add a note…"` placeholder. It is the canonical free-text field for private
notes, journal entries, and long-form comments, distinct from the single-line `Input`. The label + control are
wrapped in one `<label>` (web) / `View` (native) so the caption is associated with the field.

## 2. API contract

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `label` | `string` | — | ✓ | ✓ | mono uppercase caption above the textarea |
| `rows` / `numberOfLines` | `number` | `3` | `rows` | `numberOfLines` | **platform-shaped** — web `rows`, native `numberOfLines`; both default 3 |
| `placeholder` | `string` | `'Add a note…'` | ✓ | ✓ | shared default copy |
| `className` / `style` | — | — | `className` | `style` | web → `<textarea>` class · native → `TextInput` style |
| **value/change** | — | — | `value` + `onChange(e)` | `value` + `onChangeText(t)` | **platform-shaped** — DOM event vs string callback |
| _rest_ | `TextareaHTMLAttributes` (web) / `TextInputProps` (native) | — | ✓ | ✓ | `maxLength`, `disabled`, `onFocus`/`onBlur`, etc. |

- **Web:** `NoteFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement>`. Plain function component; `rows`
  and `placeholder` are defaulted then spread. `className` lands on the `<textarea>`.
- **Native:** `NoteFieldProps extends TextInputProps`. Renders `<TextInput multiline textAlignVertical="top">`;
  focus is tracked in state to swap the border color; label is uppercased in JS (`label.toUpperCase()`).

## 3. Visual spec (tokens — never hardcode)

| Aspect | Web (`.lk-note`) | Native (`styles.note`) |
| --- | --- | --- |
| Background | `--glass-2` | `colors.glass2` |
| Border | `1px --border-2` | `1px colors.border2` |
| Radius | `--r-sm` (10) | `radii.sm` (10) |
| Padding | `11px 13px` | `11px 13px` |
| Text | `--font-ui`, `--text`, 13.5px, line-height 1.5 | `fonts.ui`, `colors.text`, 13.5px, lineHeight 20 |
| Height | `rows` (≈3 lines), `resize: vertical` | `minHeight: 80`, `numberOfLines` 3 |
| Label | `--font-mono`, `--text-faint`, 10px, uppercase, letter-spacing 0.12em, `margin-bottom 7px` | `fonts.mono`, `colors.textFaint`, 10px, letterSpacing 1.2, wrap `gap 7` |
| Placeholder | `--text-faint` | `colors.textFaint` |

- **Focus:** web `:focus` → `--accent` border **+** `box-shadow 0 0 0 3px rgba(124,92,255,.14)`; native → border
  flips to `colors.accent` (no ring).

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Default | `.lk-note` | `styles.note` border `--border-2` |
| Focus | `:focus` accent border + glow-ring | `focused` state → accent border |
| Disabled | pass HTML `disabled` | pass `editable={false}` via rest |
| Resize | `resize: vertical` (user-draggable) | fixed `minHeight: 80` (not resizable) |

> Note: `NoteField` has **no `invalid` prop** — for validated long-text fields, wrap it in `FormField` and surface the message via `error`.

## 5. Web ↔ native parity

**Verdict: 🟡 same API, platform-shaped impl.** Identical label, glass shell, padding, radius, type ramp, default
rows, and placeholder copy. Differences:

- **Resize** — web `<textarea>` is user-resizable (`resize: vertical`); native has a fixed `minHeight: 80` and
  isn't drag-resizable (no RN equivalent). Behavioral, not visual at rest.
- **Focus affordance** — web adds a `box-shadow` glow-ring; native flips the border to accent only.
- **Rows prop** — web `rows`, native `numberOfLines` (same default 3); value/change follow web↔RN substrate
  (`onChange` event vs `onChangeText` string).

No capability gap blocks use; the field is equivalent on both platforms.

## 6. Composition & usage

- **Wrap in `FormField`** when the note needs help text, an error, or a `required` marker (NoteField has no built-in error state).
- Pair with `CharCounter` for a max-length count (compose, don't bolt a counter into NoteField).
- Used for private notes, journal/log entries, and multi-line comment fields.

```tsx
// web
<NoteField label="Private notes" value={note} onChange={(e) => setNote(e.target.value)} rows={4} />

// native
<NoteField label="Private notes" value={note} onChangeText={setNote} numberOfLines={4} />
```

## 7. Accessibility

- **Web:** the textarea is inside a `<label>`, so the caption focuses the field on click. Pass `aria-label` only
  when there's no visible label. `maxLength` (via rest) is announced by AT.
- **Native:** `TextInput multiline` with the label as a sibling `Text`; pass `accessibilityLabel` for an
  unlabeled field. `textAlignVertical="top"` keeps the caret at the top-left as text grows.
- **Contrast:** text `--text` on `--glass-2` and the `--accent` focus border clear contrast on the void surfaces.

## 8. Usage rules — Do / Don't

**Do**
- Use `NoteField` for any multi-line free-text input; use `Input` for single-line.
- Wrap in `FormField` when you need a label↔control link, help, or error copy.
- Keep it controlled via `value` + `onChange`/`onChangeText`.

**Don't**
- ✗ Don't hand-roll a glass `<textarea>` — import `NoteField`.
- ✗ Don't pass `rows` on native or `numberOfLines` on web (wrong-platform prop).
- ✗ Don't expect an `invalid` prop here — surface validation through `FormField`'s `error`.
- ✗ Don't hardcode the glass fill, radius, or focus color — they're tokens.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A bespoke multiline glass box re-creating the shell + label + focus ring is a parity
  violation — use `NoteField`.
- **New need → both platforms.** A new affordance (auto-grow, counter slot) gets added to `NoteField` on web
  **and** native with the same prop name and tokens — never a one-off.
- **Tokens only.** Glass fill, border, radius, and focus color come from `@lockin90/tokens`; hardcoded values are bugs.
- **Parity gate.** Confirm the web phone-width note field and the native one match (same label, default rows, padding, focus treatment) before shipping.
