# SDD — `TagInput` (+ `CodeInput` cross-ref)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/TagInput.tsx` · `packages/ui-native/src/components/TagInput.tsx` ·
> web CSS `packages/ui/src/styles/components/taginput.css` (`.lk-taginput*`, `.lk-code*`).
> **Exports:** `TagInput`, `CodeInput`, type `TagInputProps`, type `CodeInputProps`.
> **Status:** Shipped. **Parity:** 🔵 capability gap — native `CodeInput` has no per-box clipboard-paste event. `invalid` now ships on both platforms (native `CodeInput` also keeps `error` as a legacy alias).
> **Stories:** `packages/ui/src/stories/TagInput.stories.tsx` · `packages/ui-native/src/stories/TagInput.stories.tsx`.

---

## 1. Overview

`TagInput` is the **CMS-style multi-value tag field**: a glass shell that wraps the current tags as small
removable mono pills, followed by a borderless input. Enter adds the typed value; Backspace on the empty input
removes the last tag; duplicates and blanks are rejected. It is the sanctioned multi-tag entry (post tags, labels).

`CodeInput` is a **secondary export in the same file**: a segmented N-digit verification-code entry — a row of
single-char mono boxes that auto-advance on type and step back on Backspace. It is the canonical OTP / 2FA / reset-code field.

## 2. API contract

### `TagInput`

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `tags` | `string[]` | `['sleep', 'recovery']` | ✓ | ✓ | **seeds internal state** (uncontrolled after mount) |
| `onChange` | `(tags: string[]) => void` | — | ✓ | ✓ | fires the full list on every change |
| `placeholder` | `string` | `'Add a tag…'` | ✓ | ✓ | |
| `invalid` | `boolean` | `false` | ✓ | ✓ | red border + glow (native: soft `shadow*` red glow standing in for the web 3px ring) |
| `className` / `style` | — | — | `className` + rest | `style` + rest | |
| _rest_ | `Omit<HTMLAttributes<HTMLDivElement>,'onChange'>` (web) / `ViewProps` (native) | — | ✓ | ✓ | spread onto the shell |

### `CodeInput`

| Prop | Type | Default | Web | Native | Notes |
| --- | --- | --- | --- | --- | --- |
| `length` | `number` | `6` | ✓ | ✓ | number of boxes |
| `value` | `string` | `''` | ✓ | ✓ | seeds internal state (sliced to `length`) |
| `onChange` | `(code: string) => void` | — | ✓ | ✓ | fires the joined code on every change |
| `invalid` | `boolean` | `false` | ✓ | ✓ | every box reads red |
| `error` | `boolean` | `false` | — | ✓ | **native-only legacy alias** of `invalid` (`isInvalid = invalid \|\| error`) — prefer `invalid` |
| `className` / `style` | — | — | `className` + rest | `style` + rest | |
| _rest_ | `Omit<HTMLAttributes<HTMLDivElement>,'onChange'>` (web) / `ViewProps` (native) | — | ✓ | ✓ | |

- **State:** both are **internally stateful** — `tags`/`value` seed `useState` and the component manages edits,
  emitting through `onChange`. They are not fully controlled (re-feeding a new `tags`/`value` prop won't reset state).
- **Native TagInput** rejects blanks/dupes and commits the same way; Enter is replaced by `onSubmitEditing`.

## 3. Visual spec (tokens — never hardcode)

| TagInput | Web (`.lk-taginput*`) | Native (`styles`) |
| --- | --- | --- |
| Shell | flex-wrap, `gap 7px`, `padding 8px`, `--r-sm`, `1px --border-2`, `--glass-2` | same metrics, `radii.sm`, `colors.border2`, `colors.glass2` |
| Pill | `3px 6px 3px 9px`, `--r-pill`, border `rgba(34,211,238,.3)`, bg `rgba(34,211,238,.1)` | same, `radii.pill` |
| Pill text | `--font-mono`, 10.5px, **`--mint`** (`#34F5C5`) | `fonts.mono`, 10.5px, **`colors.accent2`** (`#22D3EE`) |
| Remove × | 10×10, `currentColor`, opacity .7 → 1 | 10×10, `colors.accent2` |
| Input | `--font-ui`, `--text`, 12px, `min-width 90px` | `fonts.ui`, `colors.text`, 12px, `minWidth 90` |
| Invalid | `--bad` border + `box-shadow rgba(255,77,109,.16)` | `colors.zoneLow` border + soft red glow (`shadowOpacity .16`, radius 3) |

| CodeInput | Web (`.lk-code*`) | Native (`styles`) |
| --- | --- | --- |
| Row | `flex`, `gap 10px` | row, `gap 10` |
| Box | `44×52`, `--font-mono` 700 22px, `--glass-2`, `1px --border-2`, `--r-sm` | `44×52`, `fonts.mono` 700 22px, `colors.glass2`, `colors.border2`, `radii.sm` |
| Focus box | `--accent` border + `bg rgba(124,92,255,.06)` + ring | border `colors.accent`, `bg rgba(124,92,255,.06)` |
| Filled box | border `rgba(34,211,238,.45)`, `bg rgba(34,211,238,.05)` | same |
| Invalid | `--bad` border, `bg rgba(255,77,109,.06)` | `colors.zoneLow` border, same bg; precedence focused > invalid > filled |

## 4. States

| State | Web | Native |
| --- | --- | --- |
| Tag add | Enter on input | `onSubmitEditing` (return key) |
| Tag remove | × button or Backspace on empty input | × Pressable or Backspace on empty |
| Tag duplicate/blank | rejected, draft cleared | rejected, draft cleared |
| TagInput invalid | `.lk-taginput--invalid` red | `taginputInvalid` red border + glow |
| Code typing | auto-advance, Backspace steps back, ←/→ move | auto-advance, Backspace steps back |
| Code box focus | accent border + glow ring | accent border (`focused` index) |
| Code filled | cyan-tint box | cyan-tint box |
| Code invalid | every box red | every box red (`invalid` or legacy `error`) |

## 5. Web ↔ native parity

**Verdict: 🔵 capability gap on native (clipboard paste).** The shells, pills, boxes, add/remove logic,
auto-advance/backspace behavior, and the `invalid` error state match. Differences:

- **`CodeInput` clipboard paste** — web wires an `onPaste` handler on **every** box (reads `clipboardData`, spreads
  across the remaining boxes from that index) **plus** ←/→ arrow navigation. RN `TextInput` has **no per-box
  clipboard-paste event and no hardware arrows**, so native instead makes **box 0** accept the full code
  (`maxLength = length`) and spreads a multi-char `onChangeText` (covers paste / iOS SMS autofill landing in box 0).
  Net: native can't paste into a middle box, and only box-0 autofill/paste fills the row.
- **`invalid` prop — now on both platforms.** Same name, same `--bad`/`colors.zoneLow` border; native `TagInput`
  substitutes a soft red `shadow*` glow for the web 3px ring. Native `CodeInput` additionally keeps `error` as a
  **legacy alias** (`invalid || error`) — web declares only `invalid`.
- **Tag commit key** — web Enter ↔ native `onSubmitEditing` (return). Same intent, platform-shaped.
- **Tag pill text color** — ⚠ web `--mint` (`#34F5C5`) vs native `colors.accent2` (`#22D3EE`). A token divergence (see §9).

The paste gap doesn't block the happy path (type the code, or autofill into box 0), but it's a genuine native
limitation.

## 6. Composition & usage

- **`TagInput`** — CMS post editor (tags/labels), filter builders. Wrap in `FormField` for a label/help.
- **`CodeInput`** — OTP / 2FA / password-reset code entry. Pair with a resend `Button` and a countdown.
- Both are leaf primitives (inline SVG × glyph / native `Svg`); they compose nothing else from the kit.

```tsx
// web
<TagInput tags={tags} onChange={setTags} invalid={hasDupe} />
<CodeInput length={6} value={code} onChange={setCode} invalid={wrongCode} />

// native — identical, prefer `invalid` over the legacy `error`
<TagInput tags={tags} onChange={setTags} invalid={hasDupe} />
<CodeInput length={6} value={code} onChange={setCode} invalid={wrongCode} />
```

## 7. Accessibility

- **Web:** each tag's × is a `<button>` with `aria-label="Remove <tag>"`; the input uses the placeholder as its
  `aria-label`. `CodeInput` boxes carry `aria-label="Digit N"`, `inputMode="numeric"`, and `autoComplete="one-time-code"`
  on box 0; `aria-invalid` is set when `invalid`.
- **Native:** the × is a `Pressable` with `accessibilityRole="button"` + `accessibilityLabel`; the tag input and
  each code box carry `accessibilityLabel`. `CodeInput` boxes use `keyboardType="number-pad"`, `textContentType="oneTimeCode"`
  on box 0, and `selectionColor={colors.accent}`.
- **Hit target:** code boxes are 44×52 (comfortable); the × glyph has `hitSlop={6}` (TagInput) for an easy tap.

## 8. Usage rules — Do / Don't

**Do**
- Use `TagInput` for multi-value tag entry; read the full list from `onChange`.
- Use `CodeInput` for any fixed-length verification code; set `length` to the code length.
- Set `value`/`tags` once to seed; treat `onChange` as the source of truth thereafter.
- Use `invalid` to flag a duplicate tag / wrong code — both platforms.

**Don't**
- ✗ Don't use the native `error` prop in new code — it's the legacy alias; `invalid` is the cross-platform name.
- ✗ Don't rely on mid-box paste on native — only box-0 autofill/paste fills the code.
- ✗ Don't re-feed `value`/`tags` expecting a reset — they only seed initial state.
- ✗ Don't hardcode the pill/box colors — they're tokens.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A hand-rolled tag-pill field or segmented code row is a parity violation — import `TagInput`/`CodeInput`.
- **Close the remaining divergence the right way.** The tag-pill **text** color divergence (web `--mint` vs
  native `accent2`) must be aligned on **both** sides to one token, not patched on one.
- **New need → both platforms.** Max-tag limits, validators, masked code formats — add to the component on web
  **and** native with the same prop names and tokens, never a one-off.
- **Tokens only.** Pill, box, focus, and invalid colors come from `@lockin90/tokens`; hardcoded hexes drift.
- **Parity gate.** Confirm the web phone-width tag/code field and the native one match (same pills/boxes, add/remove behavior, filled/focus/invalid states) before shipping — and note the paste gap until closed.
