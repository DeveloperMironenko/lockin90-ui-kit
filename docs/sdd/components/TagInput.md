# SDD — `TagInput` (+ `CodeInput` cross-ref)

> **Package:** `@lockin90/ui` (web) · `@lockin90/ui-native` (native) — root cross-platform primitive.
> **Source:** `packages/ui/src/components/TagInput.tsx` · `packages/ui-native/src/components/TagInput.tsx` ·
> web CSS `packages/ui/src/styles/components/taginput.css` (`.lk-taginput*`, `.lk-code*`).
> **Exports:** `TagInput`, `CodeInput`, type `TagInputProps`, type `CodeInputProps`.
> **Status:** Shipped. **Parity:** 🔵 capability gap — native `CodeInput` has no per-box clipboard-paste event. `invalid` now ships on both platforms (native `CodeInput` also keeps `error` as a legacy alias). `CodeInput` takes `digitLabel` (translated per-box labels) and is a labelled group (2026-11-01).
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
| `length` | `number` | `6` | ✓ | ✓ | number of boxes; a change re-draws them, each digit in its place (pass the matching `value` with it) |
| `value` | `string` | `''` | ✓ | ✓ | seeds the boxes (digits only, sliced to `length`); a later different `value` (e.g. `''` after a wrong code) replaces them, the app echoing `onChange` back doesn't |
| `onChange` | `(code: string) => void` | — | ✓ | ✓ | fires the joined code on every change |
| `invalid` | `boolean` | `false` | ✓ | ✓ | every box reads red |
| `digitLabel` | `(position: number, length: number) => string` | `` (p, l) => `Digit ${p} of ${l}` `` | ✓ | ✓ | each box's a11y label (`position` from 1); apps pass a translated one. A function, not a string like `PasswordInput`'s labels: the label has two numbers, and the app's i18n fills them in |
| `error` | `boolean` | `false` | — | ✓ | **native-only legacy alias** of `invalid` (`isInvalid = invalid \|\| error`) — prefer `invalid` |
| `className` / `style` | — | — | `className` + rest | `style` + rest | |
| _rest_ | `Omit<HTMLAttributes<HTMLDivElement>,'onChange'>` (web) / `ViewProps` (native) | — | ✓ | ✓ | |

- **State:** both are **internally stateful** — `tags`/`value` seed `useState` and the component manages edits,
  emitting through `onChange`. `TagInput` isn't controlled (a new `tags` won't reset it). `CodeInput` keeps one entry
  per box and follows a **changed** `value` (to clear after a wrong code, the app stores `onChange`'s code as
  `value` and sets `''`; a `value` that never changes can't clear it) and a changed `length` (digits kept).
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
| Row | `flex`, full width, `space-between`, `gap 10px` (`6px` at the `phone` breakpoint, ≤ 540px) | row, `gap 10` |
| Box | fluid: `flex: 1 1 0`, `width 0`, `min-width 28px`, `max-width 60px` (none at ≤ 540px), `aspect-ratio 1 / 1.18`; `--font-mono` 700 22px (20px at ≤ 540px), `--glass-2`, `1px --border-2`, `--r-sm` | `44×52`, `fonts.mono` 700 22px, `colors.glass2`, `colors.border2`, `radii.sm` |
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
| Code typing | digits only, auto-advance, the box's digit always selected so typing replaces it, Backspace steps back and leaves a gap, ←/→ move | the same, without ←/→ (`selectTextOnFocus` + controlled `selection`) |
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
<CodeInput length={8} value={code} onChange={setCode} invalid={wrongCode}
  aria-labelledby="reset-code-label" digitLabel={(p, l) => t('digit', { position: p, length: l })} />

// native — identical, prefer `invalid` over the legacy `error`
<TagInput tags={tags} onChange={setTags} invalid={hasDupe} />
<CodeInput length={8} value={code} onChange={setCode} invalid={wrongCode}
  accessibilityLabel={t('resetCode')} digitLabel={(p, l) => t('digit', { position: p, length: l })} />
```

## 7. Accessibility

- **Web:** each tag's × is a `<button>` with `aria-label="Remove <tag>"`; the input uses the placeholder as its
  `aria-label`. `CodeInput`'s row is `role="group"`, so the `aria-label` / `aria-labelledby` an app passes (rest props) names it
  ("Reset code"); each box carries `aria-label={digitLabel(N, length)}`, `inputMode="numeric"`, and
  `autoComplete="one-time-code"` on box 0; every box gets `aria-invalid` when `invalid` (a role-less wrapper's
  `aria-invalid` isn't announced).
- **Native:** the × is a `Pressable` with `accessibilityRole="button"` + `accessibilityLabel`; the tag input and
  each code box carry `accessibilityLabel` (`CodeInput`: `digitLabel(N, length)`; box 0, which also takes a pasted or
  autofilled whole code, keeps `digitLabel(1, length)`). The row takes the app's `accessibilityLabel` (rest props).
  `CodeInput` boxes use `keyboardType="number-pad"`, `textContentType="oneTimeCode"`
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
- ✗ Don't re-feed `tags` expecting a reset — it only seeds `TagInput`'s state. (`CodeInput` follows a changed `value`.)
- ✗ Don't hardcode the pill/box colors — they're tokens.

## 9. Anti-patterns & lookalike ban

- **No lookalikes.** A hand-rolled tag-pill field or segmented code row is a parity violation — import `TagInput`/`CodeInput`.
- **Close the remaining divergence the right way.** The tag-pill **text** color divergence (web `--mint` vs
  native `accent2`) must be aligned on **both** sides to one token, not patched on one.
- **New need → both platforms.** Max-tag limits, validators, masked code formats — add to the component on web
  **and** native with the same prop names and tokens, never a one-off.
- **Tokens only.** Pill, box, focus, and invalid colors come from `@lockin90/tokens`; hardcoded hexes drift.
- **Parity gate.** Confirm the web phone-width tag/code field and the native one match (same pills/boxes, add/remove behavior, filled/focus/invalid states) before shipping — and note the paste gap until closed.

## Update — 2026-11-01 (minor)
- **`CodeInput` `digitLabel`.** Each box's label was a built-in English `Digit N`, so a screen reader read English
  on every translated code screen. Now `digitLabel(position, length)` on web (`aria-label`) and native
  (`accessibilityLabel`); the default becomes `Digit N of L`, still English, for stories only: apps pass a
  translated one.
- **The row is a labelled group (web `role="group"`), `aria-invalid` on every box.** The row had no role, so an
  app's `aria-labelledby` named nothing and the screen reader never said what the code was for, and its
  `aria-invalid` wasn't announced.
- **Web fixes (first real screens):** the code is kept one entry per box, so clearing a middle box leaves a gap
  instead of shifting the later digits; box 0 takes a whole autofilled code (`maxLength = length`, as native) and
  spreads it; paste and typing keep digits only ("Code: 1234-5678" → `12345678`); a box's text is selected on
  focus, so typing replaces its digit; a new `value` replaces the boxes.
- **Native:** `digitLabel` (`accessibilityLabel`), one entry per box, digits only, `selectTextOnFocus`, a new
  `value` replaces the boxes. Not the web's group and per-box invalid state: RN has no group role or invalid
  state for a `TextInput` that VoiceOver / TalkBack announce, so the app's error text under the field (`FormField`)
  says the code was wrong, and the app's `accessibilityLabel` on the row names it where the platform reads it.
- **Both:** each box's digit stays selected, so typing always replaces it (web: selected on focus, on click and
  after writing; native: `selectTextOnFocus` plus a controlled `selection`), with no guessing which character was
  new. A changed `length` re-draws the boxes with each digit in its place; when `value` changes at the same time
  it wins, so an app that changes `length` passes the matching `value` (web: follow-up PR).
- **Known, not in this change:** `TagInput`'s `Remove <tag>` label and its `Add a tag…` placeholder default are
  built-in English too; they get the same treatment when an app first uses `TagInput`.

## Update — 2026-11-02 (minor)
- **Web `CodeInput` boxes are fluid** (as `web/auth.html` draws them; sizes in §3), so an 8-digit code fits the sign-in card and a phone; the row now spans its parent. The font stays the kit's mono (the design draws display).
