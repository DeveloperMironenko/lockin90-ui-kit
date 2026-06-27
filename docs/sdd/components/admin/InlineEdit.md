# SDD — `InlineEdit` (a.k.a. EditableCell)

> **Package:** `@lockin90/ui/admin` — web-only operator-console primitive (admin app is web-only). **Import as** `import { InlineEdit } from '@lockin90/ui/admin'`.
> **Source:** `packages/ui/src/admin/InlineEdit.tsx` · web CSS `packages/ui/src/styles/components/inlineedit.css` (`.lk-iedit*`). NO native counterpart.
> **Exports:** `InlineEdit`, type `InlineEditProps`.
> **Status:** Shipped. **Parity:** 🖥️ web-only (admin) — no native surface by design.
> **Stories:** `packages/ui/src/stories/InlineEdit.stories.tsx`.

---

## 1. Overview

The load-bearing operator primitive for **in-place parameter editing** in admin tables. **Display
mode** shows the value (+ optional faint `suffix`) with a hover-revealed pencil; clicking enters
**edit mode** with a focused, prefilled mono input and confirm/cancel buttons. **Enter** or the ✓
commits the string via `onCommit` and returns to display; **Escape** or the ✕ cancels (restoring the
draft from `value`). Matches the `.editable` cell from `lockin90-design/admin/pipeline.html`
(parameters table).

## 2. API contract

**`InlineEditProps`**

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `value` | `string \| number` | — (required) | current committed value rendered in display mode |
| `type` | `'text' \| 'number'` | `'text'` | input mode while editing; `number` sets `inputMode="decimal"` |
| `suffix` | `string` | — | faint unit shown after the value (e.g. `'pts'`, `'ms'`) |
| `onCommit` | `(next: string) => void` | — (required) | fired on Enter / ✓ with the new **string** value |
| `align` | `'left' \| 'right'` | `'left'` | display + edit alignment within the cell |

- **State:** `editing` (boolean) and `draft` (init `String(value)`); a `useRef<HTMLInputElement>`.
- `begin()` resets `draft` to `String(value)` and enters edit mode; a `useEffect` then `focus()`s and
  `select()`s the input.
- `commit()` exits edit mode and calls `onCommit(draft)` — **always with a string** (even for
  `type="number"`; the consumer parses).
- `cancel()` restores `draft = String(value)` and exits without firing `onCommit`.
- **Keyboard:** Enter → `commit()` (preventDefault); Escape → `cancel()` (preventDefault).
- `align="right"` adds `.lk-iedit-right` (`justify-content: flex-end`); in edit mode it also makes the
  row `flex-direction: row-reverse` so the input stays edge-aligned.

## 3. Visual spec (tokens — never hardcode)

| Aspect | Value / token |
| --- | --- |
| Base | inline-flex `gap: 7px`, `--font-mono` 12px, `padding: 3px 8px`, radius `--r-sm`, `border: 1px solid transparent` |
| Transition | `border-color` / `background` 0.2s `--ease` |
| Display | `cursor: text`, `--text`; hover → `border-color: --border-2` + `--glass-2`; `:focus-visible` → `border-color: --accent` + `--glass-2` |
| Pencil | `Icon name="edit" size={11}`, `--text-faint`, `opacity: 0` → `1` on hover/focus |
| Suffix | `--text-faint`, `margin-left: 2px` |
| Editing wrap | `.lk-iedit-editing` → `border-color: --accent`, `--glass-2`, `padding: 2px 4px 2px 8px` |
| Input | mono 12px, `--text`, transparent bg, no border/outline, `width: 6ch` (min `4ch`); number spinners removed |
| Confirm/cancel btn | `22×22`, radius `--r-sm`, `1px --border-2`, `--glass-2`, `--text-dim` |
| Confirm hover | `--ok` (text + border) |
| Cancel hover | `--text` |
| Btn focus | `:focus-visible` → `border-color: --accent`, `--text` |

- Confirm uses `Icon name="check" size={13}`, cancel `Icon name="close" size={13}`.

## 4. States

| State | Web behavior |
| --- | --- |
| Display (rest) | mono value + faint suffix; transparent border; pencil hidden (`opacity: 0`) |
| Display hover | `--border-2` border + `--glass-2` fill; pencil fades in |
| Display focus | `:focus-visible` accent border + `--glass-2`; pencil shown (keyboard reachable) |
| Editing | accent-bordered wrap, focused+selected mono input, ✓/✕ buttons |
| Commit | Enter / ✓ → exit + `onCommit(draft)` |
| Cancel | Escape / ✕ → exit, draft restored from `value`, no commit |

There is no disabled/error/loading state built in — the host owns validation and persistence after
`onCommit`.

## 5. Platform & relationship to root kit

**Web-only by design.** In-place cell editing belongs to admin data tables, which have no native
surface — so there is no `@lockin90/ui-native` counterpart and no parity obligation. It relies on web
substrate: a real `<input>` with `focus()`/`select()`, `:focus-visible`, hover-revealed affordances,
and `width: 6ch`. It composes one **root** primitive, `Icon` (`edit` / `check` / `close` glyphs), and
wraps no root component. It is the table-cell editing specialization — not a replacement for the
form-level `Input`/`Field` primitives.

## 6. Composition & usage

- **Used by:** admin parameter tables (e.g. the pipeline parameters grid) — each editable cell is an
  `InlineEdit`.
- **Composes:** `Icon`.

```tsx
import { InlineEdit } from '@lockin90/ui/admin';

// numeric param with a unit, right-aligned in its column
<InlineEdit
  value={42}
  type="number"
  suffix="pts"
  align="right"
  onCommit={(next) => saveParam('score_weight', Number(next))}
/>

// free-text label
<InlineEdit value={row.name} onCommit={(next) => rename(row.id, next)} />
```

## 7. Accessibility

- **Display affordance** is a real `<button type="button">` (Enter/Space begin editing) with an
  `aria-label` of `Edit value` (+ ` (suffix)` when a suffix is set).
- **Edit input** carries `aria-label="Edit value"`; `type`/`inputMode` adapt for numeric entry.
- **Confirm/cancel** are real buttons with `aria-label`/`title` `Confirm` / `Cancel`.
- Focus is moved into the input on entering edit mode (and text selected) so keyboard users edit
  immediately; Escape returns control without committing.

## 8. Usage rules — Do / Don't

**Do**
- Treat `onCommit`'s argument as a **string** — parse to number yourself for `type="number"`.
- Use `suffix` for the unit so the editable number stays clean.
- Use `align="right"` for numeric columns to keep decimals aligned.
- Persist + validate in `onCommit`; surface errors at the table/row level.

**Don't**
- ✗ Don't expect a number out of `onCommit` — it always emits the raw string draft.
- ✗ Don't use it as a full form field — for forms use `Input`/`Field`.
- ✗ Don't hardcode the accent border, `--ok` confirm tint, or `--glass-2` fills — they come from tokens.
- ✗ Don't block Escape — cancel-without-commit is the expected escape hatch.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A hand-rolled click-to-edit cell will drift from the commit/cancel keyboard
  contract and the kit visuals — import `InlineEdit`.
- **New need → extend here.** If a cell needs validation hints or a select editor, add it to
  `InlineEdit` — never fork a per-table editor.
- **Tokens only.** Accent border, `--ok`/`--text` button tints, `--glass-2`, `--border-2`, and radii
  come from `@lockin90/tokens`; hardcoded equivalents are bugs.
- **Web-only.** Admin primitive — no native counterpart, no parity to hold.
